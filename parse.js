const cheerio = require("cheerio");

const Book = require("./BookSchema");

const parse = async (page, id) => {
  const sourceURL = page.url();
  const bodyHandle = await page.$("body");
  const html = await page.evaluate(body => body.innerHTML, bodyHandle);

  //const frame = page.frames().find(frame => frame.name() === "iframe");
  //const content = await frame.content();

  //Intialize cherrio and bookobj
  const $ = cheerio.load(html);
  let bookObj = { id, sourceURL };

  bookObj.name = $("#productTitle").text();

  bookObj.listPrice = $(
    "#sims-fbt-form > div.sims-fbt-rows > fieldset > ul > li:nth-child(1) > span > span > div > label > span > div > span.a-color-price > span"
  )
    .text()
    .trim();

  //Go through product details, find weight and dimensions
  let productDetails = $(
    "li",
    "#productDetailsTable > tbody > tr > td > div > ul"
  ).filter((i, el) => {
    return (
      $(el)
        .text()
        .includes("Product Dimensions") ||
      $(el)
        .text()
        .includes("Shipping Weight")
    );
  });

  //Remove label and extra spacing
  bookObj.productDimensions = $(productDetails[0])
    .text()
    .split(":")[1]
    .trim();

  //Remove label, extra shipping info, and extra spacing
  bookObj.weight = $(productDetails[1])
    .text()
    .split(":")[1]
    .split("(")[0]
    .trim();
  //let frame = await $("#bookDesc_iframe").contents();
  //console.log(frame);
  //Get each img from product img container and save src in arr
  let imgContainer = $("img", "#imgThumbs");
  let imgURLs = [];
  for (let i = 0; i < imgContainer.length; i++) {
    imgURLs.push(imgContainer[i].attribs.src);
  }
  bookObj["imgURLs"] = imgURLs;

  let nbook = new Book(bookObj);
  await bodyHandle.dispose();
};
module.exports = parse;
