var request = require("request");
var cheerio = require("cheerio");

let pageToVisit = "https://www.amazon.com/";
request(pageToVisit, function(error, response, body) {
  console.log("Visiting page " + pageToVisit);

  if (error) {
    console.log("Error: " + error);
  }
  // Check status code (200 is HTTP OK)
  console.log("Status code: " + response.statusCode);
  if (response.statusCode === 200) {
    let newPageToVisit =
      "https://www.amazon.com/dp/0553380168/ref=s9_acsd_al_bw_c2_x_1_t?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-4&pf_rd_r=KNEHF1JFA17GSGZ5WMYT&pf_rd_t=101&pf_rd_p=fc70d3c2-a39b-4dc5-8432-ecb429c303dc&pf_rd_i=8192263011";
    request(newPageToVisit, function(error, response, body) {
      console.log("Visiting page " + newPageToVisit);

      if (error) {
        console.log("Error: " + error);
      }
      // Check status code (200 is HTTP OK)
      console.log("Status code: " + response.statusCode);
      if (response.statusCode === 200) {
        // Parse the document body
        let $ = cheerio.load(body);
        const title = $("#productTitle");
        console.log("Page title:  " + title.text());
      }
    });
  }
});
