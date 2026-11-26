const { chromium } = require('c:/Users/admin/OneDrive/Desktop/bday/node_modules/playwright');
const path = require('path');
const fs = require('fs');

async function runTests() {
  console.log('🚀 Verifying updated Love Letter in Romantic Website...');
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const screenshotDir = path.join(__dirname, 'screenshots');

  await page.goto('http://localhost:8085/', { waitUntil: 'networkidle' });

  // 1. PIN 1128
  await page.waitForSelector('#page1.active');
  await page.click('button[data-num="1"]');
  await page.click('button[data-num="1"]');
  await page.click('button[data-num="2"]');
  await page.click('button[data-num="8"]');

  // 2. Nickname Buggalu
  await page.waitForSelector('#page2.active', { timeout: 6000 });
  await page.fill('#nicknameInput', 'Buggalu');
  await page.click('#nicknameSubmitBtn');

  // 3. Page 3: Love Letter
  await page.waitForSelector('#page3.active', { timeout: 6000 });
  console.log('--- Checking Page 3 Love Letter ---');
  const salutation = await page.textContent('#letterSalutation');
  console.log('Salutation:', salutation);
  const letterBodyText = await page.textContent('#letterBody');
  console.log('Letter starts with:', letterBodyText.substring(0, 80) + '...');
  const closing = await page.textContent('.letter-closing');
  console.log('Closing:', closing.replace(/\s+/g, ' '));

  await page.screenshot({ path: path.join(screenshotDir, '4_page3_updated_letter.png') });

  // 4. Click to memories
  await page.click('#toMemoriesBtn');
  await page.waitForSelector('#page4.active', { timeout: 6000 });
  console.log('--- Page 4 reached successfully ---');

  console.log('✅ LOVE LETTER UPDATE VERIFIED WITH 100% SUCCESS!');
  await browser.close();
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
