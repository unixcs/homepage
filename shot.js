// 通用截图脚本：file:// 打开、instant 逐屏滚、全页截图（桌面+手机）
// 用法: node shot.js <html路径> <输出前缀>
const { chromium } = require('/opt/zcode-runtime-3/agent/node_modules/playwright-core');

(async () => {
  const target = process.argv[2] || '/tmp/recon/homepage/index.html';
  const prefix = process.argv[3] || '/tmp/recon/homepage/shots/base';
  const browser = await chromium.launch({
    executablePath: '/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',
  });
  const log = [];
  for (const [name, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport: vp });
    await page.goto('file://' + target, { waitUntil: 'load' });
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
    // 逐屏滚到底触发 IO，再等一拍
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y <= h; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${prefix}-${name}.png`, fullPage: true });
    const m = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
      h: document.body.scrollHeight,
    }));
    log.push(`${name}: overflow=${m.sw - m.cw}px height=${m.h}`);
    await page.close();
  }
  await browser.close();
  console.log(log.join('\n'));
})().catch(e => { console.error('FAIL ' + e.message); process.exit(1); });
