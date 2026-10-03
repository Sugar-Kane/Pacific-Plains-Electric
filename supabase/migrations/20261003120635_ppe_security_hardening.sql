revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
-- Explicit deny policies document that these private support tables have no client reads or writes.
create policy deny_client_access on ppe_private.request_receipts for all to anon,authenticated using(false) with check(false);
create policy deny_client_access on ppe_private.webhook_events for all to anon,authenticated using(false) with check(false);
