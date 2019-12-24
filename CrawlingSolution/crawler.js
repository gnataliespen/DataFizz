const puppeteer = require("puppeteer");
const fs = require("fs");

const Book = require("./Book");
const Page = require("./Page");

// Launch Puppeteer and go to Amazons home page
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  // Launch new browser and go to Amazon
  const page = await browser.newPage();

  await page.goto("https://www.amazon.com/", {
    waitUntil: "networkidle2"
  });

  await Promise.all([
    page.click("#nav-hamburger-menu"),
    page.waitForSelector("#hmenu-canvas", { visible: true })
  ]);
  //Puppeteer occassionally runs into issues and breaking up the navigation actions with small pauses helps minimize them
  await page.waitFor(250);

  await Promise.all([
    page.click(
      "#hmenu-content > ul.hmenu.hmenu-visible > li:nth-child(12) > a"
    ),
    page.waitForSelector("#hmenu-content > ul:nth-child(9)", {
      visible: true
    })
  ]);
  await page.waitFor(250);

  await Promise.all([
    page.click(
      "#hmenu-content > ul.hmenu.hmenu-visible.hmenu-translateX > li:nth-child(3) > a"
    ),
    page.waitForNavigation({ waitUntil: "domcontentloaded" })
  ]);
  await page.waitFor(250);

  await Promise.all([
    page.click("#nav-subnav > a:nth-child(3)"),
    page.waitForNavigation({ waitUntil: "domcontentloaded" })
  ]);

  let booksParsed = [];

  //Go through first page of new releases and parse each book listing (works up to 50 times)
  for (let i = 0; i <= 50; i++) {
    await page.waitFor(500);
    //5th is the only child thats not a book listing
    if (i === 4) i++;

    try {
      await Promise.all([
        page.click(
          `#zg-ordered-list > li:nth-child(${i + 1}) > span > div > span > a`
        ),
        page.waitForNavigation({ waitUntil: "domcontentloaded" })
      ]);

      //Get page info
      const bodyHandle = await page.$("body");
      const html = await page.evaluate(body => body.innerHTML, bodyHandle);
      //Create page instance
      let newPage = new Page(page, i, html);
      let data = await newPage.getPageData();
      //Create book instance
      let book = new Book(data);

      booksParsed.push(book.stringify());
    } catch (err) {
      console.log(err);
    }
    await Promise.all([page.goBack(), page.waitForNavigation()]);
  }
  await fs.writeFile(
    "./books.json",
    JSON.stringify(booksParsed, null, 4),
    err => console.log(err)
  );
  await browser.close();
  console.log("Crawl completed");
})();
