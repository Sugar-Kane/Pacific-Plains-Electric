
create schema if not exists ppe_private;
revoke all on schema ppe_private from public, anon, authenticated;
create table public.website_settings (
 id boolean primary key default true check(id),
 scheduling_enabled boolean not null default false check(scheduling_enabled=false),
 business jsonb not null default '{"diagnosticPrice":180,"diagnosticFeeAppliedToWork":false,"timezone":"America/Los_Angeles"}',
 scheduling jsonb not null default '{"workingDays":[],"durationMinutes":60,"travelBufferMinutes":30,"minimumNoticeHours":24,"maxAdvanceDays":30,"sameDay":false}',
 ai jsonb not null default '{"liveEnabled":false}',
 updated_at timestamptz not null default now()
);
comment on column public.website_settings.scheduling_enabled is 'Fail-closed until the reviewed Volteira scheduling adapter is installed. Database constraint prevents premature enablement.';
insert into public.website_settings(id) values(true);
create table public.website_content(
 id uuid primary key default gen_random_uuid(), kind text not null check(kind in ('article','project','faq','review')),
 slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), title text not null check(length(title) between 1 and 160),
 excerpt text not null default '',body text not null default '',category text not null default '',
 published boolean not null default false,seo_title text,seo_description text,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table public.website_request_outbox(
 id uuid primary key, payload jsonb not null, status text not null default 'received' check(status in ('received','reviewed','exported','synced')),
 volteira_id text, created_at timestamptz not null default now()
);
comment on table public.website_request_outbox is 'Temporary website intake outbox, not an operational CRM. Volteira will own the request after confirmed transfer.';
create table public.website_audit(
 id bigint generated always as identity primary key,actor uuid,action text not null,entity text not null,entity_id text,created_at timestamptz not null default now()
);
create table ppe_private.request_receipts(
 id uuid primary key,fingerprint text not null,contact_hash text not null,created_at timestamptz not null default now()
);
create index on ppe_private.request_receipts(contact_hash,created_at);
create table ppe_private.webhook_events(
 id text primary key,event_type text not null,received_at timestamptz not null default now(),processed_at timestamptz
);
alter table public.website_settings enable row level security;
alter table public.website_content enable row level security;
alter table public.website_request_outbox enable row level security;
alter table public.website_audit enable row level security;
alter table ppe_private.request_receipts enable row level security;
alter table ppe_private.webhook_events enable row level security;
revoke all on public.website_settings,public.website_content,public.website_request_outbox,public.website_audit from anon,authenticated;
grant select,update on public.website_settings to authenticated;
grant select on public.website_content to anon;
grant select,insert,update,delete on public.website_content to authenticated;
grant select,update,delete on public.website_request_outbox to authenticated;
grant select on public.website_audit to authenticated;
create policy published_content on public.website_content for select to anon,authenticated using(published);
create policy owner_content on public.website_content for all to authenticated using((auth.jwt()->'app_metadata'->>'ppe_role') in ('OWNER','ADMIN')) with check((auth.jwt()->'app_metadata'->>'ppe_role') in ('OWNER','ADMIN'));
create policy owner_settings_read on public.website_settings for select to authenticated using((auth.jwt()->'app_metadata'->>'ppe_role') in ('OWNER','ADMIN'));
create policy owner_settings_update on public.website_settings for update to authenticated using((auth.jwt()->'app_metadata'->>'ppe_role') in ('OWNER','ADMIN')) with check((auth.jwt()->'app_metadata'->>'ppe_role') in ('OWNER','ADMIN'));
create policy owner_outbox_read on public.website_request_outbox for select to authenticated using((auth.jwt()->'app_metadata'->>'ppe_role') in ('OWNER','ADMIN'));
create policy owner_outbox_update on public.website_request_outbox for update to authenticated using((auth.jwt()->'app_metadata'->>'ppe_role') in ('OWNER','ADMIN')) with check((auth.jwt()->'app_metadata'->>'ppe_role') in ('OWNER','ADMIN'));
create policy owner_outbox_delete on public.website_request_outbox for delete to authenticated using((auth.jwt()->'app_metadata'->>'ppe_role')='OWNER');
create policy owner_audit_read on public.website_audit for select to authenticated using((auth.jwt()->'app_metadata'->>'ppe_role') in ('OWNER','ADMIN'));
create function ppe_private.audit_change() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or coalesce(auth.jwt()->'app_metadata'->>'ppe_role','') not in ('OWNER','ADMIN') then
  raise exception 'Unauthorized website change';
 end if;
 insert into public.website_audit(actor,action,entity,entity_id) values(auth.uid(),TG_OP,TG_TABLE_NAME,coalesce(to_jsonb(NEW)->>'id',to_jsonb(OLD)->>'id'));
 if TG_OP='DELETE' then return OLD; else return NEW; end if;
end;$$;
revoke all on function ppe_private.audit_change() from public,anon,authenticated;
create trigger content_audit after insert or update or delete on public.website_content for each row execute function ppe_private.audit_change();
create trigger settings_audit after update on public.website_settings for each row execute function ppe_private.audit_change();
create trigger outbox_audit after update or delete on public.website_request_outbox for each row execute function ppe_private.audit_change();
-- This is intentionally a public intake endpoint, with no anonymous reads.
-- The privileged implementation is kept in the non-exposed private schema.
create function ppe_private.submit_request(p_key uuid,p_payload jsonb) returns uuid language plpgsql security definer set search_path='' as $$
declare
 fingerprint text; contact_hash text; prior text; request_count integer;
begin
 if p_key is null or p_payload is null or jsonb_typeof(p_payload) <> 'object' or octet_length(p_payload::text)>14000 then raise exception 'Invalid request'; end if;
 if coalesce(p_payload->>'transactionalConsent','')<>'true'
 or char_length(coalesce(p_payload->>'firstName','')) not between 1 and 80
 or char_length(coalesce(p_payload->>'lastName','')) not between 1 and 80
 or char_length(coalesce(p_payload->>'phone','')) not between 10 and 25
 or coalesce(p_payload->>'phone','') !~ '^[+0-9 ()-]+$'
 or coalesce(p_payload->>'email','') !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
 or length(coalesce(p_payload->>'email',''))>254
 or length(coalesce(p_payload->>'address','')) not between 5 and 200
 or length(coalesce(p_payload->>'city','')) not between 2 and 80
 or coalesce(p_payload->>'postalCode','') !~ '^[0-9]{5}(-[0-9]{4})?$'
 or length(coalesce(p_payload->>'description','')) not between 10 and 2000
 or length(coalesce(p_payload->>'preferredTimes',''))>300
 or coalesce(p_payload->>'contactMethod','') not in ('phone','email')
 or coalesce(p_payload->>'service','') not in ('electrical-repair','troubleshooting','panel-upgrades','ev-charger-installation','lighting','new-construction','commercial-electrical','generators','service-plans')
 or coalesce(p_payload->>'website','')<>''
 or jsonb_typeof(p_payload->'smsConsent') is distinct from 'boolean'
 then raise exception 'Invalid request'; end if;
 if (p_payload->>'smsConsent')::boolean and length(coalesce(p_payload->>'smsDisclosure',''))<40 then raise exception 'Invalid consent'; end if;
 fingerprint:=encode(sha256(convert_to((p_payload-'idempotencyKey')::text,'UTF8')),'hex');
 contact_hash:=encode(sha256(convert_to(lower(p_payload->>'email'),'UTF8')),'hex');
 perform pg_advisory_xact_lock(hashtextextended(p_key::text,0));
 select r.fingerprint into prior from ppe_private.request_receipts r where r.id=p_key;
 if prior is not null then
  if prior<>fingerprint then raise exception 'Request key already used'; end if;
  return p_key;
 end if;
 perform pg_advisory_xact_lock(hashtextextended(contact_hash,0));
 select count(*) into request_count from ppe_private.request_receipts where request_receipts.contact_hash=submit_request.contact_hash and created_at>now()-interval '1 hour';
 if request_count>=3 then raise exception 'Contact request limit exceeded'; end if;
 insert into ppe_private.request_receipts(id,fingerprint,contact_hash) values(p_key,fingerprint,contact_hash);
 insert into public.website_request_outbox(id,payload) values(p_key,p_payload);
 return p_key;
end;$$;
revoke all on function ppe_private.submit_request(uuid,jsonb) from public;
grant usage on schema ppe_private to anon,authenticated;
grant execute on function ppe_private.submit_request(uuid,jsonb) to anon,authenticated;
create function public.submit_website_request(p_key uuid,p_payload jsonb) returns uuid language sql security invoker set search_path='' as $$ select ppe_private.submit_request(p_key,p_payload); $$;
revoke all on function public.submit_website_request(uuid,jsonb) from public;
grant execute on function public.submit_website_request(uuid,jsonb) to anon,authenticated;
