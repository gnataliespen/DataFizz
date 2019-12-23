const cheerio = require("cheerio");

/*Page class manages page, and stores parsed page data. 
Each method returns information from the page, by first checking 
if the data has already been collected, if it hasnt the method 
will retrieve and parse the data before saving it to the class and then returning it.*/
class Page {
  constructor(page, id, html) {
    this.page = page;
    this.id = id;

    //Intialize cherrio and data object
    this.$ = cheerio.load(html);
    this.data = {
      id,
      sourceURL: page.url()
    };
  }

  getProductName = () => {
    if (!this.data.name) {
      this.data.name = this.$("#productTitle").text();
    }
    return this.data.name;
  };

  getListPrice = () => {
    if (!this.data.listPrice) {
      this.data.listPrice = this.$(
        "#sims-fbt-form > div.sims-fbt-rows > fieldset > ul > li:nth-child(1) > span > span > div > label > span > div > span.a-color-price > span"
      )
        .text()
        .trim();
    }
    return this.data.listPrice;
  };

  getProductDetails = async () => {
    /*Go through product details filter until its just weight and dimensions, then return the array.
      95% of the time these seem to be at index 6 and 7 but everynow and then theyre not, so this could 
      be more preformant for a slightly higher error rate. I chose the loop b/c the product details array is normally small (<10 eles).*/
    if (!this.data.weight || !this.data.productDimensions) {
      let productDetailsArr = await this.$(
        "li",
        "#productDetailsTable > tbody > tr > td > div > ul"
      ).filter((i, el) => {
        return (
          this.$(el)
            .text()
            .includes("Product Dimensions") ||
          this.$(el)
            .text()
            .includes("Shipping Weight")
        );
      });

      //Create arr of detail ele text
      let textArr = [];
      for (let i = 0; i < productDetailsArr.length; i++) {
        let ele = this.$(productDetailsArr[i]).text();
        textArr.push(ele);
      }
      //Parse it and add to data obj
      let parsedDetails = await this.parseProductDetails(textArr);
      this.data = { ...this.data, ...parsedDetails };
    }
    return [this.data.productDimensions, this.data.weight];
  };
  detailsArrToObj = productDetailsArr => {
    if (productDetailsArr.length === 2)
      return {
        productDimensions: productDetailsArr[0],
        weight: productDetailsArr[1]
      };
    //If length < 2 check which value we have, if the arr is empty both properties are set to falsey values
    return productDetailsArr[0].includes("x")
      ? { productDimensions: productDetailsArr[0], weight: null }
      : { productDimensions: null, weight: productDetailsArr[0] };
  };

  parseProductDetails = async productDetailsArr => {
    let unparsedDetails = this.detailsArrToObj(productDetailsArr);
    let parsedDetails = { productDimensions: null, weight: null };

    //If either are falsey mark them as not listed, otherwise clean up the text and save it
    parsedDetails.productDimensions = unparsedDetails.productDimensions
      ? unparsedDetails.productDimensions.split(":")[1].trim()
      : "Not listed";

    parsedDetails.weight = unparsedDetails.weight
      ? unparsedDetails.weight
          .split(":")[1]
          .split("(")[0]
          .trim()
      : "Not listed";
    return parsedDetails;
  };
  getImgUrls = () => {
    if (!this.data.imgURLs) {
      //Get each img from product img container and save src in arr
      let imgContainer = this.$("img", "#imgThumbs");
      let imgURLs = [];
      for (let i = 0; i < imgContainer.length; i++) {
        imgURLs.push(imgContainer[i].attribs.src);
      }
      this.data.imgURLs = imgURLs;
    }
    return this.data.imgURLs;
  };
  getDescription = async () => {
    if (!this.data.description) {
      //Find book description iframe and get innerText
      let frame = await this.page
        .frames()
        .find(frame => frame.name() === "bookDesc_iframe");
      const divHandle = await frame.$("div");
      this.data.description = await frame.evaluate(
        div => div.innerText,
        divHandle
      );
      divHandle.dispose();
    }
    return this.data.description;
  };
  getPageData = async () => {
    this.getProductName();
    this.getListPrice();
    await this.getDescription();
    await this.getImgUrls();
    await this.getProductDetails();
    return this.data;
  };
}

module.exports = Page;
