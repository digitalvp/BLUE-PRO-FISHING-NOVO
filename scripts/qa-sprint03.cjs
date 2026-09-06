/* QA local do sprint. Executar: node scripts/qa-sprint03.cjs --cycle 1 --routes /linkbio/ --viewports 320,390,768,1440 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../.vp/qa-runtime/node_modules/playwright-core');

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, i, values) => {
  if (value.startsWith('--')) pairs.push([value.slice(2), values[i + 1]?.startsWith('--') ? 'true' : values[i + 1] || 'true']);
  return pairs;
}, []));
const base = args.base || 'http://127.0.0.1:4180';
const routes = (args.routes || '/,/pesca-camping-acessorios-palmas-to/,/embarcacoes-nautica-palmas-to/,/camping-pesca-palmas-to/,/linkbio/,/e-commerce-teste/').split(',');
const widths = (args.viewports || '320,375,390,430,768,900,1024,1100,1366,1440,1920').split(',').map(Number);
if (widths.some(width => !Number.isInteger(width) || width < 280 || width > 3840)) throw new Error('Viewports inválidos.');
const cycle = String(args.cycle || '1').replace(/[^a-z0-9_-]/gi, '');
const outDir = path.resolve('.vp/qa/sprint03', `cycle-${cycle}`);
fs.mkdirSync(outDir, { recursive: true });
const executablePath = [process.env.QA_CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(file => file && fs.existsSync(file));
if (!executablePath) throw new Error('Chrome/Edge local não encontrado. Configure QA_CHROME_PATH.');

function routeSlug(route) { return route.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9_-]/gi, '-') || 'home'; }

async function inspect(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const visible = el => {
      const style = getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.getClientRects().length > 0;
    };
    const horizontalOverflow = Math.max(root.scrollWidth, document.body.scrollWidth) - innerWidth;
    const offenders = horizontalOverflow > 2 ? [...document.querySelectorAll('body *')].filter(el => {
      if (!visible(el)) return false;
      const box = el.getBoundingClientRect();
      if (box.width < 1 || (box.right <= innerWidth + 2 && box.left >= -2)) return false;
      for (let parent = el.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
        if (/hidden|clip|auto|scroll/.test(getComputedStyle(parent).overflowX)) return false;
      }
      return true;
    }).slice(0, 20).map(el => ({ tag: el.tagName, id: el.id, class: el.getAttribute('class'), text: el.textContent.trim().slice(0, 70), left: Math.round(el.getBoundingClientRect().left), right: Math.round(el.getBoundingClientRect().right) })) : [];
    const imageRecords = [...document.images].map(img => ({ src: img.currentSrc || img.src, alt: img.getAttribute('alt'), complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, visible: visible(img) }));
    return {
      title: document.title,
      viewport: { width: innerWidth, height: innerHeight },
      documentWidth: root.scrollWidth,
      horizontalOverflow,
      overflowElements: offenders,
      imageCount: imageRecords.length,
      brokenImages: imageRecords.filter(img => img.complete && !img.naturalWidth),
      pendingImages: imageRecords.filter(img => !img.complete),
      missingAlt: imageRecords.filter(img => img.alt === null),
      headingCount: document.querySelectorAll('h1').length,
      emptyLinks: [...document.querySelectorAll('a[href]')].filter(a => ['#', ''].includes(a.getAttribute('href'))).map(a => a.textContent.trim()),
      unsafeBlank: [...document.querySelectorAll('a[target="_blank"]')].filter(a => !a.rel.includes('noopener')).map(a => a.href),
      publicDemoLinks: location.pathname.includes('e-commerce-teste') ? [] : [...document.querySelectorAll('a[href]')].filter(a => a.href.includes('/e-commerce-teste')).map(a => a.href),
      platformDependencies: [...document.querySelectorAll('a[href],script[src],link[href],img[src],meta[content]')].map(el => el.getAttribute('href') || el.getAttribute('src') || el.getAttribute('content')).filter(value => /vercel\.app|github\.com/i.test(value)),
      fixedHeader: document.querySelector('.header') ? getComputedStyle(document.querySelector('.header')).position : null,
      faq: { count: document.querySelectorAll('.faq-item').length, open: document.querySelectorAll('.faq-item[open]').length },
      bioLinks: [...document.querySelectorAll('.bio-links > *')].map(el => ({ text: el.querySelector('span')?.childNodes[0]?.textContent?.trim(), href: el.getAttribute('href'), disabled: el.disabled || false, height: Math.round(el.getBoundingClientRect().height) })),
      calendar: document.querySelector('[data-fishing-calendar]') ? { months: document.querySelectorAll('[data-month]').length, selected: document.querySelector('[data-month][aria-selected="true"]')?.getAttribute('data-month'), currentMonth: new Date().getMonth() } : null
    };
  });
}

async function basicInteraction(page, route) {
  const results = [];
  const menu = page.locator('#menu-toggle');
  if (await menu.count() && await menu.isVisible()) {
    await menu.click();
    const opened = await menu.getAttribute('aria-expanded') === 'true';
    await page.keyboard.press('Escape');
    const closed = await menu.getAttribute('aria-expanded') === 'false';
    results.push({ test: 'menu abre e fecha por Escape', pass: opened && closed });
  }
  if (route === '/' && await page.locator('.faq-item').count()) {
    const first = page.locator('.faq-item').first();
    await first.locator('summary').click();
    const opened = await first.getAttribute('open') !== null;
    await first.locator('summary').click();
    results.push({ test: 'FAQ abre e fecha', pass: opened && await first.getAttribute('open') === null });
  }
  if (route.includes('camping-pesca-palmas-to') && await page.locator('[data-month]').count()) {
    const january = page.locator('[data-month="0"]');
    await january.click();
    const clicked = await january.getAttribute('aria-selected') === 'true';
    await january.press('ArrowRight');
    const keyboard = await page.locator('[data-month="1"]').getAttribute('aria-selected') === 'true';
    await page.locator(`[data-month="${new Date().getMonth()}"]`).click();
    results.push({ test: 'Calendário clique e ArrowRight', pass: clicked && keyboard });
  }
  return results;
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });
  const summary = { date: new Date().toISOString(), base, cycle, executablePath, results: [] };
  try {
    for (const route of routes) {
      for (const width of widths) {
        const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 960 }, locale: 'pt-BR' });
        const page = await context.newPage();
        const errors = [], consoleErrors = [], networkFailures = [], localHttpErrors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
        page.on('requestfailed', request => networkFailures.push({ url: request.url(), error: request.failure()?.errorText }));
        page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) localHttpErrors.push({ url: response.url(), status: response.status() }); });
        const item = { route, width, cycle, errors, consoleErrors, networkFailures, localHttpErrors, status: 'FAIL' };
        const name = `${routeSlug(route)}-${width}`;
        try {
          const response = await page.goto(new URL(route, base).href, { waitUntil: 'domcontentloaded', timeout: 45000 });
          item.httpStatus = response?.status();
          await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 5000))]));
          await page.waitForTimeout(600);
          const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
          for (let y = 0; y < scrollHeight; y += 750) {
            await page.evaluate(value => window.scrollTo(0, value), y);
            await page.waitForTimeout(45);
          }
          await page.waitForTimeout(450);
          await page.evaluate(() => window.scrollTo(0, 0));
          item.dom = await inspect(page);
          item.interactions = await basicInteraction(page, route);
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(250);
          if (args.screenshots !== 'false') {
            const screenshot = path.join(outDir, `${name}.png`);
            await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled', timeout: 30000 });
            item.screenshot = path.relative(process.cwd(), screenshot);
          }
          const failed = item.httpStatus !== 200 || errors.length || localHttpErrors.length || item.dom.horizontalOverflow > 2 || item.dom.brokenImages.length || item.dom.headingCount !== 1 || item.dom.emptyLinks.length || item.dom.publicDemoLinks.length || item.interactions.some(test => !test.pass);
          item.status = failed ? 'FAIL' : 'PASS';
        } catch (error) { item.exception = error.message; }
        fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(item, null, 2));
        summary.results.push(item);
        console.log(JSON.stringify({ route, width, cycle, status: item.status, overflow: item.dom?.horizontalOverflow, images: item.dom?.brokenImages.length, errors: errors.length, exception: item.exception }));
        await context.close();
      }
    }
  } finally {
    await browser.close();
    const scopeName = routes.map(routeSlug).join('_').slice(0, 180);
    const summaryFile = path.join(outDir, `summary-${scopeName}.json`);
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log(`Evidence: ${summaryFile}`);
    if (summary.results.some(result => result.status !== 'PASS')) process.exitCode = 1;
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
