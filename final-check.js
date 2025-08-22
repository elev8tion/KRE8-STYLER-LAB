const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3001/claude-dashboard');
  await page.waitForTimeout(2000);
  
  // Find our specific logo img tag
  const logo = await page.locator('img[src="/kre8styler-logo.svg"][alt="KRE8Styler"]').first();
  if (await logo.count() > 0) {
    const box = await logo.boundingBox();
    console.log('Our logo position:', box);
    
    // Check if it matches what you wanted
    const isCorrectPosition = box.x === 896 && box.y === 0;
    const isCorrectSize = box.width === 119 && box.height === 119;
    
    console.log('Position correct:', isCorrectPosition);
    console.log('Size correct:', isCorrectSize);
    console.log('Overall correct:', isCorrectPosition && isCorrectSize);
  } else {
    console.log('Our logo not found');
  }
  
  await page.screenshot({ path: 'final-logo-check.png', fullPage: true });
  
  await browser.close();
})();