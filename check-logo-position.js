const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Go to the Claude dashboard page
  await page.goto('http://localhost:3001/claude-dashboard');
  await page.waitForTimeout(2000);
  
  // Take screenshot to see current positioning
  await page.screenshot({ path: 'current-logo-position.png', fullPage: true });
  
  // Get logo element position
  const logo = await page.locator('img[src="/kre8styler-logo.svg"], svg').first();
  if (await logo.count() > 0) {
    const box = await logo.boundingBox();
    console.log('Logo position:', box);
  } else {
    console.log('Logo not found');
  }
  
  // Get chat panel position 
  const chatPanel = await page.locator('.w-96').last();
  if (await chatPanel.count() > 0) {
    const box = await chatPanel.boundingBox();
    console.log('Chat panel position:', box);
  }
  
  await browser.close();
})();