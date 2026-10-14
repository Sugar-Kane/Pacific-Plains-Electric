import test from "node:test";
import assert from "node:assert/strict";
import { preferredLanguage } from "../lib/i18n/shared";
import { requestSchema } from "../lib/security/validation";
test("language selection respects preference weights and excludes unsupported languages",()=>{
  assert.equal(preferredLanguage("es-MX,es;q=0.9,en;q=0.8"),"es");
  assert.equal(preferredLanguage("en-US,en;q=0.9,es;q=0.5"),"en");
  assert.equal(preferredLanguage("es;q=0,en;q=0.8"),"en");
  assert.equal(preferredLanguage(null),"en");
  assert.equal(preferredLanguage("fr,es;q=0.8,en;q=0.5"),"es");
});
test("Spanish text preference never bypasses SMS consent",()=>{
 const input={idempotencyKey:crypto.randomUUID(),firstName:"Prueba",lastName:"Cliente",phone:"8055550100",city:"Nipomo",service:"other",preferredTimes:"",contactMethod:"text",transactionalConsent:true,smsConsent:false,website:"",preferredLanguage:"es"};
 assert.equal(requestSchema.safeParse(input).success,false);
 const valid=requestSchema.safeParse({...input,smsConsent:true}); assert.equal(valid.success,true);
 if(valid.success) assert.equal(valid.data.preferredLanguage,"es");
 assert.equal(requestSchema.safeParse({...input,smsConsent:true,preferredLanguage:"unknown"}).success,false);
});
