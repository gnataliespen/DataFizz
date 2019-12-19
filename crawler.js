const puppeteer = require("puppeteer");

const parse = require("./parse");
// Launch Puppeteer Library and Navigate Amazon Website
puppeteer.launch({ headless: false }).then(async browser => {
  // New Browser Tab and Amazon Web Page Navigation
  try {
    const page = await browser.newPage();
    await page.goto("https://www.amazon.com/");
    await page.waitFor(2000);

    // Open menu
    await page.click("#nav-hamburger-menu");
    // Click Books & Audible
    await page.waitFor(2000);
    await page.click(
      "#hmenu-content > ul.hmenu.hmenu-visible > li:nth-child(12) > a"
    );
    // Click Books
    await page.waitFor(2000);
    await page.click(
      "#hmenu-content > ul.hmenu.hmenu-visible.hmenu-translateX > li:nth-child(3) > a"
    );
    //Click New Releases
    await page.waitFor(2000);
    await page.click("#nav-subnav > a:nth-child(3)");
    //50
    for (let i = 0; i <= 5; i++) {
      //5th is the only child thats not a book listing
      if (i === 4) i++;
      //Click book
      await page.waitFor(2000);
      await page.click(
        `#zg-ordered-list > li:nth-child(${i + 1}) > span > div > span > a`
      );
      let url = page.url();
      //Parse book
      await page.waitFor(2000);
      const bodyHandle = await page.$("body");
      const html = await page.evaluate(body => body.innerHTML, bodyHandle);
      await parse(html, url);
      await bodyHandle.dispose();
      page.goBack();
    }
  } catch (err) {
    console.log(err);
  }
});
