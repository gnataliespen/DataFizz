const cheerio = require("cheerio");

const parse = (body, url) => {
  console.log(url);
  const $ = cheerio.load(body);
  let name = $("#productTitle").text();
  console.log(name);
  let id = 1;
  let listPrice = $(
    "#sims-fbt-form > div.sims-fbt-rows > fieldset > ul > li:nth-child(1) > span > span > div > label > span > div > span.a-color-price > span"
  )
    .text()
    .trim();
  console.log(listPrice);
  let product_details = $(
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
  let product_dimension = $(product_details[0])
    .text()
    .split(":")[1]
    .trim();

  console.log(product_dimension);
  let weight = $(product_details[1])
    .text()
    .split(":")[1]
    .split("(")[0]
    .trim();

  console.log(weight);

  let imgContainer = $("img", "#imgThumbs");
  let imgURLS = [];
  for (let i = 0; i < imgContainer.length; i++) {
    imgURLS.push(imgContainer[i].attribs.src);
  }
  console.log(imgURLS);
};
module.exports = parse;
