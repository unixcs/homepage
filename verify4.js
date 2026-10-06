const { chromium } = require('/opt/zcode-runtime-3/agent/node_modules/playwright-core');
const fs = require('fs');
(async () => {
  const out = [];
  const css = fs.readFileSync('styles.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  let d = 0, min = 0;
  for (const ch of css) { if (ch === '{') d++; if (ch === '}') { d--; if (d < min) min = d; } }
  out.push('css-brace-depth=' + d + ' negative=' + min);
  const browser = await chromium.launch({ executablePath: '/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox'] });
  for (const [name, vw, vh] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width: vw, height: vh } });
    await page.goto('file:///tmp/recon/homepage/index.html', { waitUntil: 'load', timeout: 30000 });
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = 'auto';
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.7) { scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); }
      scrollTo(0, 0); await new Promise(r => setTimeout(r, 400));
      await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
    });
    await page.waitForTimeout(700);
    const ov = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    const contact = await page.evaluate(() => {
      const s = document.querySelector('#contact');
      const qr = document.querySelector('.qr img');
      const links = [...document.querySelectorAll('.contact-links a')].map(a => a.getAttribute('href'));
      return { qrLoaded: qr && qr.naturalWidth > 0, qrSrc: qr && qr.getAttribute('src'), links, secH: s.offsetHeight };
    });
    out.push(name + ' overflow=' + JSON.stringify(ov) + ' contact=' + JSON.stringify(contact));
    await page.screenshot({ path: 'v4-' + name + '.png', fullPage: true });
    const sec = await page.$('#contact');
    await sec.screenshot({ path: 'v4-contact-' + name + '.png' });
    await page.close();
  }
  await browser.close();
  out.push('done');
  fs.writeFileSync('/tmp/recon/homepage/v4-report.txt', out.join('\n'));
})().catch(e => { require('fs').writeFileSync('/tmp/recon/homepage/v4-report.txt', 'ERROR ' + e.message); });
