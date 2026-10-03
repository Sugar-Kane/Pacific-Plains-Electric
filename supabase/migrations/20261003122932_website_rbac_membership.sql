
create table public.website_members(
 email text primary key check(email=lower(email) and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'),
 role text not null check(role in ('OWNER','ADMIN','TECHNICIAN')),
 added_by uuid,created_at timestamptz not null default now()
);
insert into public.website_members(email,role) values
 ('adamkane13.ak@gmail.com','OWNER'),('nick@pacificplainselectric.com','OWNER'),('nicholas.kane92@gmail.com','OWNER');
alter table public.website_members enable row level security;
revoke all on public.website_members from anon,authenticated;
grant select,insert,update,delete on public.website_members to authenticated;
create function ppe_private.current_website_role() returns text language sql stable security definer set search_path='' as $$
 select m.role from public.website_members m join auth.users u on lower(u.email)=m.email
 where u.id=(select auth.uid()) and u.email_confirmed_at is not null and coalesce(u.is_anonymous,false)=false limit 1;
$$;
revoke all on function ppe_private.current_website_role() from public,anon;
grant execute on function ppe_private.current_website_role() to authenticated;
create function public.current_website_role() returns text language sql stable security invoker set search_path='' as $$ select ppe_private.current_website_role(); $$;
revoke all on function public.current_website_role() from public,anon;
grant execute on function public.current_website_role() to authenticated;
create policy members_read on public.website_members for select to authenticated using((select ppe_private.current_website_role()) in ('OWNER','ADMIN'));
create policy members_add on public.website_members for insert to authenticated with check((select ppe_private.current_website_role())='OWNER' or ((select ppe_private.current_website_role())='ADMIN' and role in ('ADMIN','TECHNICIAN')));
create policy members_update on public.website_members for update to authenticated using((select ppe_private.current_website_role())='OWNER' or ((select ppe_private.current_website_role())='ADMIN' and role in ('ADMIN','TECHNICIAN'))) with check((select ppe_private.current_website_role())='OWNER' or ((select ppe_private.current_website_role())='ADMIN' and role in ('ADMIN','TECHNICIAN')));
create policy members_delete on public.website_members for delete to authenticated using((select ppe_private.current_website_role())='OWNER' or ((select ppe_private.current_website_role())='ADMIN' and role in ('ADMIN','TECHNICIAN')));
drop policy owner_content on public.website_content;
create policy owner_content on public.website_content for all to authenticated using((select ppe_private.current_website_role()) in ('OWNER','ADMIN')) with check((select ppe_private.current_website_role()) in ('OWNER','ADMIN'));
drop policy owner_settings_read on public.website_settings;
drop policy owner_settings_update on public.website_settings;
create policy owner_settings_read on public.website_settings for select to authenticated using((select ppe_private.current_website_role()) in ('OWNER','ADMIN'));
create policy owner_settings_update on public.website_settings for update to authenticated using((select ppe_private.current_website_role()) in ('OWNER','ADMIN')) with check((select ppe_private.current_website_role()) in ('OWNER','ADMIN'));
drop policy owner_outbox_read on public.website_request_outbox;
drop policy owner_outbox_update on public.website_request_outbox;
drop policy owner_outbox_delete on public.website_request_outbox;
create policy owner_outbox_read on public.website_request_outbox for select to authenticated using((select ppe_private.current_website_role()) in ('OWNER','ADMIN'));
create policy owner_outbox_update on public.website_request_outbox for update to authenticated using((select ppe_private.current_website_role()) in ('OWNER','ADMIN')) with check((select ppe_private.current_website_role()) in ('OWNER','ADMIN'));
create policy owner_outbox_delete on public.website_request_outbox for delete to authenticated using((select ppe_private.current_website_role())='OWNER');
drop policy owner_audit_read on public.website_audit;
create policy owner_audit_read on public.website_audit for select to authenticated using((select ppe_private.current_website_role()) in ('OWNER','ADMIN'));
create or replace function ppe_private.audit_change() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or coalesce(ppe_private.current_website_role(),'') not in ('OWNER','ADMIN') then raise exception 'Unauthorized website change'; end if;
 insert into public.website_audit(actor,action,entity,entity_id) values(auth.uid(),TG_OP,TG_TABLE_NAME,coalesce(to_jsonb(NEW)->>'id',to_jsonb(OLD)->>'id',to_jsonb(NEW)->>'email',to_jsonb(OLD)->>'email'));
 if TG_OP='DELETE' then return OLD; else return NEW; end if;
end;$$;
create function ppe_private.guard_membership() returns trigger language plpgsql security definer set search_path='' as $$
begin
 perform pg_advisory_xact_lock(hashtextextended('ppe-owner-membership',0));
 if TG_OP='UPDATE' and NEW.email<>OLD.email then raise exception 'Remove and add access to change an email'; end if;
 if OLD.role='OWNER' and (TG_OP='DELETE' or NEW.role<>'OWNER') then
  if (select count(*) from public.website_members where role='OWNER')<=1 then raise exception 'At least one owner must remain'; end if;
 end if;
 if OLD.email=(select lower(email) from auth.users where id=auth.uid()) then raise exception 'Ask another owner to change your own access'; end if;
 if TG_OP='DELETE' then return OLD; else return NEW; end if;
end;$$;
revoke all on function ppe_private.guard_membership() from public,anon,authenticated;
create trigger guard_member_changes before update or delete on public.website_members for each row execute function ppe_private.guard_membership();
create trigger member_audit after insert or update or delete on public.website_members for each row execute function ppe_private.audit_change();
