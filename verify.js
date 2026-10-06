const { chromium } = require('/opt/zcode-runtime-3/agent/node_modules/playwright-core');
(async () => {
  const browser = await chromium.launch({ executablePath: '/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox'] });
  for (const [name, vw, vh] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width: vw, height: vh } });
    await page.goto('file:///tmp/recon/homepage/index.html', { waitUntil: 'load', timeout: 30000 });
    // 逐屏滚动触发懒加载与浮现
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior='auto'; for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.7) { scrollTo(0, y); await new Promise(r => setTimeout(r, 160)); }
      scrollTo(0, 0); await new Promise(r => setTimeout(r, 300));
      await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
    });
    await page.waitForTimeout(700);
    const ov = await page.evaluate(() => {
      const d = document.documentElement;
      let worst = null;
      if (d.scrollWidth > d.clientWidth) {
        for (const el of document.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.right > d.clientWidth + 1 || r.left < -1) { if (!worst || r.width > worst.w) worst = { w: r.width, tag: el.tagName + '.' + el.className }; }
        }
      }
      return { sw: d.scrollWidth, cw: d.clientWidth, worst };
    });
    console.log(name, 'overflow:', JSON.stringify(ov));
    await page.screenshot({ path: `v3-${name}.png`, fullPage: true });
    await page.close();
  }
  await browser.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
