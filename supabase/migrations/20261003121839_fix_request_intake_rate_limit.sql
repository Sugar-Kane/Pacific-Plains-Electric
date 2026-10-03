create or replace function ppe_private.submit_request(p_key uuid,p_payload jsonb) returns uuid language plpgsql security definer set search_path='' as $$
declare
 v_fingerprint text; v_contact_hash text; prior text; request_count integer;
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
 v_fingerprint:=encode(sha256(convert_to((p_payload-'idempotencyKey')::text,'UTF8')),'hex');
 v_contact_hash:=encode(sha256(convert_to(lower(p_payload->>'email'),'UTF8')),'hex');
 perform pg_advisory_xact_lock(hashtextextended(p_key::text,0));
 select r.fingerprint into prior from ppe_private.request_receipts r where r.id=p_key;
 if prior is not null then
  if prior<>v_fingerprint then raise exception 'Request key already used'; end if;
  return p_key;
 end if;
 perform pg_advisory_xact_lock(hashtextextended(v_contact_hash,0));
 select count(*) into request_count from ppe_private.request_receipts where request_receipts.contact_hash=v_contact_hash and created_at>now()-interval '1 hour';
 if request_count>=3 then raise exception 'Contact request limit exceeded'; end if;
 insert into ppe_private.request_receipts(id,fingerprint,contact_hash) values(p_key,v_fingerprint,v_contact_hash);
 insert into public.website_request_outbox(id,payload) values(p_key,p_payload);
 return p_key;
end;$$;
