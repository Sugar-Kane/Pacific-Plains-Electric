import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { services, listedServices, articles } from "../../config/content";
import { publishedAreas } from "../../config/areas";
const routes = [
  "/",
  "/services",
  ...services.map((s) => "/services/" + s.slug),
  "/service-areas",
  ...publishedAreas.map((a) => "/service-areas/" + a.slug),
  "/about",
  "/contact",
  "/faq",
  "/projects",
  "/blog",
  ...articles.map((a) => "/blog/" + a.slug),
  "/request-service",
  "/privacy",
  "/terms",
];
for (const width of [375, 390, 430, 768, 1024, 1440])
  test(`layout fits ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
      "/services",
      "/request-service",
      "/contact",
      "/admin",
    ]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
      ).toBe(true);
      await expect(page.locator("main")).toBeVisible();
    }
    if (width === 390) {
      await page.goto("/");
      await page.screenshot({
        path: "../../work/mobile-home.png",
        fullPage: true,
      });
    }
  });
test("public routes, links, metadata and images", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const links = new Set<string>();
  for (const path of routes) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1"), path).toHaveCount(1);
    await expect(page.locator("link[rel=canonical]"), path).toHaveAttribute(
      "href",
      `https://www.pacificplainselectric.com${path === "/" ? "" : path}`,
    );
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((a) => a.map((x) => x.getAttribute("href")!)))
      links.add(href.split("?")[0]);
    const broken = await page.locator("img").evaluateAll((imgs) =>
      imgs
        .map((x) => x as HTMLImageElement)
        .filter(
          (x) => x.loading !== "lazy" && (!x.complete || x.naturalWidth === 0),
        )
        .map((x) => x.src),
    );
    expect(broken).toEqual([]);
  }
  for (const href of links) {
    const r = await request.get(href);
    expect(r.status(), href).toBeLessThan(400);
  }
  expect(errors).toEqual([]);
});
for (const theme of ["light", "dark"])
  test(`accessible ${theme} homepage and form`, async ({ page }) => {
    await page.addInitScript(
      (t) => localStorage.setItem("ppe-theme", t),
      theme,
    );
    for (const path of ["/", "/request-service", "/admin"]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
    }
  });
test("theme persists and mobile navigation works", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const initial = await page.locator("html").getAttribute("data-theme");
  await page
    .getByRole("button", { name: "Toggle light and dark theme" })
    .click();
  await page.reload();
  expect(await page.locator("html").getAttribute("data-theme")).not.toBe(
    initial,
  );
  await page.locator("header").getByRole("link", { name: "Services", exact: true }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "About", exact: true })
    .focus();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
});
test("service links carry the selected service into the request", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator("header").getByRole("link", { name: "Services", exact: true }).click();
  const serviceLinks = await page.locator('.service-card a[href^="/request-service"]')
    .evaluateAll(links => links.map(link => link.getAttribute("href")!));
  expect(serviceLinks).toHaveLength(listedServices.length);
  for (const [i, href] of serviceLinks.entries()) {
    await page.goto("/services");
    await page.locator('.service-card a[href^="/request-service"]').nth(i).click();
    await expect(page.locator("#service")).toHaveValue(new URL(href, "http://localhost").searchParams.get("service")!);
  }
  await page.goto("/contact");
  await expect(page.locator('main a[href="tel:+18056267761"]')).toBeVisible();
  await expect(
    page.locator('main a[href="mailto:nick@pacificplainselectric.com"]'),
  ).toBeVisible();
  await expect(page.locator('a[href="tel:+12096269313"]')).toHaveCount(0);
});
test("request review and submitted state use server response", async ({
  page,
}) => {
  await page.goto("/request-service");
  await expect(page.locator("main")).toContainText("$180");
  for (const [id, val] of Object.entries({
    firstName: "Test",
    lastName: "Customer",
    phone: "8055550100",
    email: "test@example.invalid",
    address: "100 Test Street",
    city: "San Luis Obispo",
    postalCode: "93401",
    description: "Synthetic browser form verification only.",
  }))
    await page.locator("#" + id).fill(val);
  await page.locator("input[type=checkbox]").first().check();
  await page.getByRole("button", { name: "Review Request" }).click();
  await expect(
    page.getByRole("heading", { name: "Check the details." }),
  ).toBeVisible();
  let submitted: Record<string, unknown> = {};
  await page.route("**/api/service-requests", async (route) => {
    submitted = route.request().postDataJSON();
    await route.fulfill({
      status: 201,
      json: { reference: "7498110c-65d8-4cb5-9153-a9f071f3d70a" },
    });
  });
  await page.getByRole("button", { name: "Send Service Request" }).click();
  await expect(
    page.getByRole("heading", { name: "Your request is saved." }),
  ).toBeVisible();
  await expect(page.locator("main")).toContainText(
    "not a confirmed appointment",
  );
  expect(submitted.smsConsent).toBe(false);
  expect(submitted.transactionalConsent).toBe(true);
  expect(submitted.idempotencyKey).toBeTruthy();
});
test("failure state retains request and shows call fallback", async ({
  page,
}) => {
  await page.goto("/request-service");
  for (const [id, val] of Object.entries({
    firstName: "Test",
    lastName: "Customer",
    phone: "8055550100",
    email: "test@example.invalid",
    address: "100 Test Street",
    city: "San Luis Obispo",
    postalCode: "93401",
    description: "Synthetic browser form verification only.",
  }))
    await page.locator("#" + id).fill(val);
  await page.locator("input[type=checkbox]").first().check();
  await page.getByRole("button", { name: "Review Request" }).click();
  await page.route("**/api/service-requests", (r) =>
    r.fulfill({
      status: 503,
      json: {
        error: "Online requests are unavailable. Please call (805) 626-7761.",
      },
    }),
  );
  await page.getByRole("button", { name: "Send Service Request" }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "(805) 626-7761",
  );
  await expect(
    page.getByRole("heading", { name: "Check the details." }),
  ).toBeVisible();
});
test("private routes and unsafe submissions fail closed", async ({
  request,
  page,
}) => {
  for (const path of [
    "/admin/dashboard",
    "/admin/settings/scheduling",
    "/admin/service-requests",
  ]) {
    await page.goto(path);
    await expect(
      page.getByRole("heading", { name: "Welcome back." }),
    ).toBeVisible();
  }
  const response = await request.post("/api/service-requests", { data: {} });
  expect(response.status()).toBe(403);
  const invalid = await request.post("/api/service-requests", {
    headers: { origin: "http://127.0.0.1:3000" },
    data: {},
  });
  expect(invalid.status()).toBe(400);
  const privatePage = await request.get("/appointment/guess");
  expect(privatePage.headers()["x-robots-tag"]).toContain("noindex");
  const map = await request.get("/sitemap.xml");
  const mapText = await map.text();
  expect(mapText).not.toContain("/admin");
  expect(mapText).toContain("/service-areas/nipomo");
  const llms = await request.get("/llms.txt");
  expect(llms.status()).toBe(200);
  expect(await llms.text()).toContain("electrical contractor serving San Luis Obispo County");
  const robot = await request.get("/robots.txt");
  expect(await robot.text()).toContain("/appointment/");
  const home = await request.get("/");
  expect(home.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
});
