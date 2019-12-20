const puppeteer = require("puppeteer");

const parser = require("./parser");
// Launch Puppeteer and go to Amazons home page
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
    //Go through first page of new releases and parse each book listing
    for (let i = 0; i <= 50; i++) {
      //5th is the only child thats not a book listing
      if (i === 4) i++;
      //Click book
      await page.waitFor(2000);
      await page.click(
        `#zg-ordered-list > li:nth-child(${i + 1}) > span > div > span > a`
      );
      //parse book listing
      await page.waitFor(2000);
      await parser(page, i);
      page.goBack();
    }
  } catch (err) {
    console.log(err);
  }
});
