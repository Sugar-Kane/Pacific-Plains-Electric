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
    const ev = scenes.nth(2);
    await ev.scrollIntoViewIfNeeded();
    const pulse = ev.locator(".sa-ev-current").last();
    const before = await pulse.evaluate((node) => getComputedStyle(node).strokeDashoffset);
    await expect.poll(() => pulse.evaluate((node) => getComputedStyle(node).strokeDashoffset)).not.toBe(before);
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
    await expect(page.locator(".service-motion-reduced")).toBeVisible();
    await page.locator(".service-card-animated").nth(2).click();
    await expect(page).toHaveURL(/request-service\?service=ev-charger-installation/);
    await expect(page.locator("#service")).toHaveValue("ev-charger-installation");
  });
}
