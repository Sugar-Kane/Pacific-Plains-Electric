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
for (const width of [320, 375, 390, 430, 768, 1024, 1440])
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
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Services", exact: true })
    .click();
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
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Services", exact: true })
    .click();
  await page
    .getByText("Explore all electrical services", { exact: true })
    .click();
  const serviceLinks = await page
    .locator('.service-card a[href^="/request-service"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
  expect(serviceLinks).toHaveLength(listedServices.length);
  for (const [i, href] of serviceLinks.entries()) {
    await page.goto("/services");
    await page
      .getByText("Explore all electrical services", { exact: true })
      .click();
    await page
      .locator('.service-card a[href^="/request-service"]')
      .nth(i)
      .click();
    await expect(page.locator("#service")).toHaveValue(
      new URL(href, "http://localhost").searchParams.get("service")!,
    );
  }
  await page.goto("/contact");
  await expect(page.locator('main a[href="tel:+18056267761"]')).toBeVisible();
  await expect(
    page.locator('main a[href="mailto:nick@pacificplainselectric.com"]'),
  ).toBeVisible();
  await expect(page.locator('a[href="tel:+12096269313"]')).toHaveCount(0);
});
async function fillInquiry(
  page: import("@playwright/test").Page,
  location = "93401",
) {
  await page.locator("#contactMethod").selectOption("phone");
  await page.locator("#firstName").fill("Test");
  await page.locator("#lastName").fill("Customer");
  await page.locator("#phone").fill("8055550100");
  await page.locator("#location").fill(location);
  await page.locator("input[type=checkbox]").first().check();
}
for (const service of [
  "electrical-repair",
  "ev-charger-installation",
  "other",
]) {
  test(`home to acknowledged ${service} inquiry`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page
      .locator(`.service-choices a[href$="service=${service}"]`)
      .click();
    await expect(page.locator("#service")).toHaveValue(service);
    await fillInquiry(page);
    await page
      .locator("#description")
      .fill("Two kitchen outlets stopped working.");
    let submitted: Record<string, unknown> = {};
    await page.route("**/api/service-requests", async (route) => {
      submitted = route.request().postDataJSON();
      await route.fulfill({
        status: 201,
        json: {
          status: "received",
          reference: "7498110c-65d8-4cb5-9153-a9f071f3d70a",
        },
      });
    });
    await page.getByRole("button", { name: "Send My Request" }).click();
    await expect(
      page.getByRole("heading", { name: "Your request has been received" }),
    ).toBeFocused();
    expect(submitted.service).toBe(service);
    expect(submitted.smsConsent).toBe(false);
    expect(submitted.email).toBe("");
    expect(submitted.address).toBe("");
    expect(submitted.transactionalConsent).toBe(true);
  });
}
test("failure preserves input; retry uses the identical request", async ({
  page,
}) => {
  await page.goto("/request-service");
  await fillInquiry(page);
  const payloads: unknown[] = [];
  await page.route("**/api/service-requests", async (route) => {
    payloads.push(route.request().postDataJSON());
    await route.fulfill(
      payloads.length === 1
        ? {
            status: 503,
            json: { error: "Please retry or call (805) 626-7761." },
          }
        : {
            status: 201,
            json: {
              status: "received",
              reference: "7498110c-65d8-4cb5-9153-a9f071f3d70a",
            },
          },
    );
  });
  await page.getByRole("button", { name: "Send My Request" }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "(805) 626-7761",
  );
  await expect(page.locator("#firstName")).toHaveValue("Test");
  await expect(page.locator("#lastName")).toHaveValue("Customer");
  await page.getByRole("button", { name: "Retry My Request" }).click();
  await expect(
    page.getByRole("heading", { name: "Your request has been received" }),
  ).toBeVisible();
  expect(payloads[0]).toEqual(payloads[1]);
});
test("malformed success never produces a false acknowledgment", async ({
  page,
}) => {
  await page.goto("/request-service");
  await fillInquiry(page);
  await page.route("**/api/service-requests", (route) =>
    route.fulfill({ status: 200, json: {} }),
  );
  await page.getByRole("button", { name: "Send My Request" }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "couldn’t confirm",
  );
  await expect(
    page.getByRole("heading", { name: "Your request has been received" }),
  ).toHaveCount(0);
});
test("county ZIP checks, border ZIP and unknown ZIP never block inquiry", async ({
  page,
}) => {
  await page.goto("/request-service");
  for (const zip of ["93401", "93458", "93117", "93199", "93483"]) {
    await page.locator("#location").fill(zip);
    await expect(page.locator("#coverage-note")).toContainText("coverage area");
  }
  await page.locator("#location").fill("93252");
  await expect(page.locator("#coverage-note")).toContainText(
    "part of our service area",
  );
  await page.locator("#location").fill("10001");
  await expect(page.locator("#coverage-note")).toContainText(
    "still send a request",
  );
  await expect(
    page.getByRole("button", { name: "Send My Request" }),
  ).toBeEnabled();
});
test("diagnostic policy, example, mobile actions and guide are preserved", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  await expect(page.locator(".credit-example")).toContainText("$320");
  await expect(page.locator(".credit-example")).toContainText("$500 total");
  await expect(
    page.locator(".mobile-action-bar").getByRole("link", { name: "Call", exact: true }),
  ).toHaveAttribute("href", "tel:+18056267761");
  await expect(page.locator(".mobile-action-bar").getByRole("link", { name: "Text", exact: true })).toHaveAttribute("href", "sms:+18056267761");
  await page
    .locator(".mobile-action-bar")
    .getByRole("link", { name: "Request Service" })
    .click();
  await expect(page).toHaveURL(/request-service/);
  for (const path of [
    "/",
    "/services",
    "/services/troubleshooting",
    "/faq",
    "/terms",
    "/request-service",
    "/service-areas/nipomo",
  ]) {
    await page.goto(path);
    await expect(page.locator("main")).toContainText(
      "qualifying approved follow-up repairs related to the original diagnostic visit",
    );
    await expect(page.locator("main")).not.toContainText(
      "not automatically credited",
    );
  }
  await page.goto("/blog");
  await expect(page.locator("#power-story-title")).toBeVisible();
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
  expect(await llms.text()).toContain(
    "electrical contractor serving San Luis Obispo and Santa Barbara counties",
  );
  const robot = await request.get("/robots.txt");
  expect(await robot.text()).toContain("/appointment/");
  const home = await request.get("/");
  expect(home.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
});

test("mobile contact layout and footer disclosures stay compact", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  const buttons = page.locator(".primary-actions").first().locator("a");
  const call = await buttons.nth(1).boundingBox();
  const text = await buttons.nth(2).boundingBox();
  expect(call!.y).toBe(text!.y);
  const areas = page.locator(".footer-mobile-links").filter({ hasText: "Service areas" });
  await expect(areas.locator("a").first()).not.toBeVisible();
  await areas.locator("summary").click();
  await expect(areas.locator("a").first()).toBeVisible();
  await page.goto("/request-service");
  await expect(page.locator(".request-aside")).not.toBeVisible();
  await expect(page.locator(".mobile-action-bar a")).toHaveCount(2);
  await expect(page.getByRole("button", {name: "Send My Request"})).toBeVisible();
});
