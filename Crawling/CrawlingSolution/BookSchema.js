const fs = require("fs");

module.exports = class Book {
  constructor(book) {
    if (Book.validate(book)) {
      for (let key in book) {
        this[key] = book[key];
      }
      console.log("success");
    } else {
      console.log("Incomplete record");
      console.log(book);
    }
  }

  static validate(book) {
    if (
      (!book.id && book.id !== 0) ||
      !book.name ||
      !book.listPrice ||
      !book.productDimensions ||
      !book.imgURLs ||
      !book.weight ||
      !book.sourceURL ||
      !book.description
    ) {
      return false;
    } else {
      return true;
    }
  }
};
