import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { translatedPaths } from "../../lib/i18n/shared";
import { services } from "../../config/content";
import { publishedAreas } from "../../config/areas";

test("Spanish browser preference and explicit language choice", async ({ browser }) => {
  const context = await browser.newContext({ locale: "es-MX" });
  const page = await context.newPage();
  await page.goto("/request-service?service=ev-charger-installation");
  await expect(page).toHaveURL(/\/es\/request-service\?service=ev-charger-installation/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator("#service")).toHaveValue("ev-charger-installation");
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("#service")).toHaveValue("ev-charger-installation");
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("link", { name: "Español", exact: true }).click();
  await page.goto("/");
  await expect(page).toHaveURL(/\/es$/);
  await context.close();
});

test("Spanish routes render with correct language, canonicals and no overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  for (const path of [...translatedPaths, ...services.map(s=>"/services/"+s.slug), ...publishedAreas.map(a=>"/service-areas/"+a.slug)]) {
    const url = path === "/" ? "/es" : "/es" + path;
    expect((await page.goto(url))?.status(), url).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.pacificplainselectric.com" + url);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth + 1),url).toBe(true);
  }
});
for (const theme of ["light", "dark"]) test(`Spanish WCAG checks in ${theme}`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(t=>localStorage.setItem("ppe-theme",t),theme);
  for (const path of ["/es", "/es/request-service", "/es/services", "/es/faq", "/es/accessibility", "/accessibility"]) {
    await page.goto(path);
    const result = await new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
    expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),path).toEqual([]);
  }
});

test("Spanish request consent, failure, identical retry and focused confirmation", async ({ page }) => {
  await page.goto("/es/request-service?service=ev-charger-installation");
  await page.getByLabel("Nombre *", { exact: true }).fill("Prueba");
  await page.getByLabel("Apellido *", {exact:true}).fill("Cliente");
  await page.getByLabel("Número de teléfono *", { exact: true }).fill("8055550100");
  await page.getByLabel("Ciudad o código postal *", { exact: true }).fill("93117");
  await expect(page.locator("#coverage-note")).toContainText("área de servicio");
  await expect(page.getByLabel("Forma de contacto preferida")).toHaveValue("text");
  await page.locator('input[type="checkbox"]').first().check();
  const payloads: Record<string, unknown>[] = [];
  await page.route("**/api/service-requests", async route => {
    payloads.push(route.request().postDataJSON());
    await route.fulfill(payloads.length===1 ? {status:503,json:{error:"English server error"}} : {status:201,json:{status:"received",reference:"7498110c-65d8-4cb5-9153-a9f071f3d70a"}});
  });
  await page.getByRole("button", {name:"Enviar mi solicitud"}).click();
  expect(payloads).toHaveLength(0);
  await page.locator('input[type="checkbox"]').nth(1).check();
  await page.getByRole("button", {name:"Enviar mi solicitud"}).click();
  await expect(page.locator("main").getByRole("alert")).toBeFocused();
  await expect(page.locator("main").getByRole("alert")).toContainText("No pudimos confirmar");
  await expect(page.locator("#firstName")).toHaveValue("Prueba");
  await page.getByRole("button", {name:"Reintentar mi solicitud"}).click();
  await expect(page.getByRole("heading", {name:"Hemos recibido su solicitud"})).toBeFocused();
  expect(payloads[0]).toEqual(payloads[1]);
  expect(payloads[0]).toMatchObject({preferredLanguage:"es",smsConsent:true,service:"ev-charger-installation"});
});

test("Spanish keyboard navigation, skip link, reduced motion, and text reflow", async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/es");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", {name:"Saltar al contenido"})).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  const menu=page.getByRole("button",{name:"Abrir menú"});
  await menu.focus(); await page.keyboard.press("Enter");
  await page.getByRole("navigation",{name:"Navegación principal"}).getByRole("link",{name:"Servicios",exact:true}).focus();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await page.addStyleTag({content:"html { font-size: 200% !important; }"});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1)).toBe(true);
});

test("mobile request transition keeps Text visible in touch hover and keyboard focus", async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  for (const theme of ["light","dark"]) {
    await page.goto("/");
    await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
    await page.locator(".mobile-action-bar .mobile-request").click();
    const text=page.locator('.mobile-action-bar a[href="sms:+18056267761"]');
    await expect(text).toHaveText("Text");
    await text.hover();
    const hovered=await text.evaluate(e=>({color:getComputedStyle(e).color,background:getComputedStyle(e).backgroundColor}));
    expect(hovered.background).not.toBe("rgba(0, 0, 0, 0)");
    expect(hovered.color).not.toBe(hovered.background);
    await text.focus();
    const result=await new AxeBuilder({page}).include(".mobile-action-bar").withTags(["wcag2aa"]).analyze();
    expect(result.violations).toEqual([]);
    await expect(page.locator("#contactMethod")).toHaveValue("text");
    await page.locator("#contactMethod").selectOption("phone");
    await expect(page.locator('input[type="checkbox"]').nth(1)).not.toHaveAttribute("required","");
  }
});
