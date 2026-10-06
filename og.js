// 生成 og.jpg：1200x630 首屏截图（等入场动画播完）
const { chromium } = require('/opt/zcode-runtime-3/agent/node_modules/playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: '/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',
  });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto('file:///tmp/recon/homepage/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1800); // 等错落入场动画全部播完
  await page.screenshot({ path: '/tmp/recon/homepage/assets/og.jpg', type: 'jpeg', quality: 88 });
  await browser.close();
  console.log('og.jpg done');
})().catch(e => { console.error('FAIL ' + e.message); process.exit(1); });
