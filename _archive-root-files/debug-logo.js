const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3001/claude-dashboard');
  await page.waitForTimeout(2000);
  
  // Find all logo elements
  const logos = await page.locator('img[src="/kre8styler-logo.svg"], svg, [src*="kre8styler"]').all();
  console.log(`Found ${logos.length} logo elements`);
  
  for (let i = 0; i < logos.length; i++) {
    const box = await logos[i].boundingBox();
    const tagName = await logos[i].evaluate(el => el.tagName);
    console.log(`Logo ${i + 1} (${tagName}):`, box);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'debug-logo.png', fullPage: true });
  
  await browser.close();
})();