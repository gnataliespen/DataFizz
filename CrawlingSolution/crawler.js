const puppeteer = require("puppeteer");
const fs = require("fs");
const { diff } = require("json-diff");

const Book = require("./Book");
const Page = require("./Page");

// Launch Puppeteer and go to Amazons home page
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  // New Browser Tab and Amazon Web Page Navigation
  const page = await browser.newPage();

  await page.goto("https://www.amazon.com/", {
    waitUntil: "domcontentloaded"
  });

  await Promise.all([
    page.click("#nav-hamburger-menu"),
    page.waitForSelector("#hmenu-canvas", { visible: true })
  ]);
  await page.waitFor(500);
  await Promise.all([
    page.click(
      "#hmenu-content > ul.hmenu.hmenu-visible > li:nth-child(12) > a"
    ),
    page.waitForSelector("#hmenu-content > ul:nth-child(9)", {
      visible: true
    })
  ]);
  await Promise.all([
    page.click(
      "#hmenu-content > ul.hmenu.hmenu-visible.hmenu-translateX > li:nth-child(3) > a"
    ),
    page.waitForNavigation()
  ]);
  await Promise.all([
    page.click("#nav-subnav > a:nth-child(3)"),
    page.waitForNavigation()
  ]);

  // Open menu
  //await page.click("#nav-hamburger-menu");
  // Click Books & Audible

  //await page.click("#hmenu-content > ul.hmenu.hmenu-visible > li:nth-child(12) > a");
  // Click Books

  //await page.click(
  //  "#hmenu-content > ul.hmenu.hmenu-visible.hmenu-translateX > li:nth-child(3) > a"
  //);
  //Click New Releases
  //await page.waitFor(2000);
  //await page.click("#nav-subnav > a:nth-child(3)");

  let booksParsed = [];

  //Go through first page of new releases and parse each book listing
  for (let i = 0; i <= 10; i++) {
    //5th is the only child thats not a book listing
    if (i === 4) i++;
    let target = `#zg-ordered-list > li:nth-child(${i +
      1}) > span > div > span > a`;
    page.waitFor(500);
    await Promise.all([page.click(target), page.waitForNavigation()]);

    //Click book
    //await page.waitFor(2000);
    //await page.click(
    // `#zg-ordered-list > li:nth-child(${i + 1}) > span > div > span > a`
    //);
    //await page.waitFor(2000);

    //Get page info
    const bodyHandle = await page.$("body");
    const html = await page.evaluate(body => body.innerHTML, bodyHandle);

    //Create page instance
    try {
      let newPage = new Page(page, i, html);
      let data = await newPage.getPageData();
      //Create book instance
      let book = new Book(data);

      booksParsed.push(book.stringify());
    } catch {
      console.log("PARSING ERROR");
    }

    await Promise.all([page.goBack(), page.waitForNavigation()]);
  }
  await fs.writeFile(
    `./books${0}.json`,
    JSON.stringify(booksParsed, null, 4),
    err => console.log(err)
  );
  await browser.close();
})();
