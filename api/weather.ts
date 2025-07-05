import puppeteer from 'puppeteer';

async function fetchVisibility() {
  const url = 'https://weather.com/en-GB/weather/today/l/Swansea+Wales?canonicalCityId=ff9032ec7115ea0efe22f1bf42b1c36a38bdb9ecfcc98d805d74c7714fdd6ecf';

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // The visibility element has data-testid="VisibilityValue"
  const visibility = await page.$eval('span[data-testid="VisibilityValue"]', el => el.textContent);

  await browser.close();
  return visibility; // e.g. "4.18 km"
}

fetchVisibility().then(console.log).catch(console.error);
