import chromium from 'chrome-aws-lambda'; // Puppeteer for serverless (Vercel)

export default async function handler(req, res) {
  const url = 'https://weather.com/en-GB/weather/today/l/Swansea+Wales?canonicalCityId=ff9032ec7115ea0efe22f1bf42b1c36a38bdb9ecfcc98d805d74c7714fdd6ecf';

  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Wait for visibility element selector to appear (adjust if needed)
    await page.waitForSelector('[data-testid="VisibilityValue"]');

    // Extract visibility text
    const visibility = await page.$eval('[data-testid="VisibilityValue"]', el => el.textContent.trim());

    res.status(200).json({ visibility });
  } catch (error) {
    console.error('Scrape error:', error);
    res.status(500).json({ error: 'Failed to scrape visibility' });
  } finally {
    if (browser) await browser.close();
  }
}
