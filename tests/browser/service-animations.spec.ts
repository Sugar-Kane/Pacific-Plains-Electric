import { test, expect } from "@playwright/test";

for (const language of ["en", "es"]) {
  test(`${language} service animations autoplay, pause and respect reduced motion`, async ({ page }) => {
    await page.goto(language === "es" ? "/es" : "/");
    const scenes = page.locator(".service-animation");
    await expect(scenes).toHaveCount(6);
    for (const scene of await scenes.all()) {
      await scene.scrollIntoViewIfNeeded();
      await expect.poll(() => scene.evaluate((node) => node.getAnimations({ subtree: true }).filter((a) => a.playState === "running").length)).toBeGreaterThan(0);
    }
    // Photographic layers are loaded and the motion visibly changes them.
    expect(await scenes.locator("img").evaluateAll((imgs) => imgs.every((img) => img.getAttribute("alt") === "" && img.getAttribute("src")?.startsWith("/images/services/")))).toBe(true);
    const ev = scenes.nth(2);
    await ev.scrollIntoViewIfNeeded();
    const status = ev.locator(".sa-ev-status");
    const before = await status.evaluate((node) => getComputedStyle(node).opacity);
    await expect.poll(() => status.evaluate((node) => getComputedStyle(node).opacity)).not.toBe(before);
    // The meter steps through readings and settles on 120.1 (frame 5).
    const meter = scenes.nth(5);
    await meter.scrollIntoViewIfNeeded();
    const reading = () => meter.locator(".sa-meter-frame").evaluateAll((frames) => frames.findIndex((f) => getComputedStyle(f).opacity === "1"));
    await expect.poll(reading, { timeout: 8000 }).toBe(5);
    await expect.poll(reading, { timeout: 8000 }).not.toBe(5);
    await page.locator(".service-motion-toggle").click();
    await expect(page.locator(".service-motion-toggle")).toHaveAttribute("aria-pressed", "true");
    expect(await scenes.evaluateAll((nodes) => nodes.every((node) => node.getAnimations({ subtree: true }).every((a) => a.playState === "paused")))).toBe(true);
    await page.locator(".service-motion-toggle").click();
    await scenes.first().scrollIntoViewIfNeeded();
    await expect.poll(() => scenes.first().evaluate((node) => node.getAnimations({ subtree: true }).some((a) => a.playState === "running"))).toBe(true);
    const ids = await scenes.locator("[id]").evaluateAll((nodes) => nodes.map((node) => node.id));
    expect(new Set(ids).size).toBe(ids.length);
    await page.emulateMedia({ reducedMotion: "reduce" });
    expect(await scenes.evaluateAll((nodes) => nodes.flatMap((node) => node.getAnimations({ subtree: true })).length)).toBe(0);
    // Reduced motion keeps a useful still: tester in place and lit, door open, reading settled.
    expect(await scenes.nth(0).locator(".sa-repair-led").evaluate((n) => getComputedStyle(n).opacity)).toBe("1");
    expect(await scenes.nth(1).locator(".sa-door").evaluate((n) => getComputedStyle(n).transform)).not.toBe("none");
    expect(await meter.locator(".sa-mf5").evaluate((n) => getComputedStyle(n).opacity)).toBe("1");
    await expect(page.locator(".service-motion-reduced")).toBeVisible();
    await page.locator(".service-card-animated").nth(2).click();
    await expect(page).toHaveURL(/request-service\?service=ev-charger-installation/);
    await expect(page.locator("#service")).toHaveValue("ev-charger-installation");
  });
}
