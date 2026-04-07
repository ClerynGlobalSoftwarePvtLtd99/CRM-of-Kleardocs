const puppeteer = require('puppeteer');

(async () => {
  console.log('Testing Puppeteer connection...');
  try {
    const browser = await puppeteer.launch({
      headless: 'new', // new headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('Browser launched successfully.');
    await browser.close();
    console.log('Browser closed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Puppeteer launch error:', error);
    process.exit(1);
  }
})();
