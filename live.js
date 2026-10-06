const { chromium } = require('/opt/zcode-runtime-3/agent/node_modules/playwright-core');
(async () => {
  const browser = await chromium.launch({ executablePath: '/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://fengx.eu.org/', { waitUntil: 'domcontentloaded', timeout: 40000 });
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.7) { scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); }
    scrollTo(0, 0); await new Promise(r => setTimeout(r, 400));
    await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
  });
  await page.waitForTimeout(800);
  console.log('v3-mark:', await page.evaluate(() => !!document.querySelector('link[href*="v=3"]')));
  await page.screenshot({ path: 'live-v3.png', fullPage: true });
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
