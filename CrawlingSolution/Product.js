module.exports = class Product {
  constructor(product) {
    if (Product.validate(product)) {
      for (let key in product) {
        this[key] = product[key];
      }
    } else {
      console.log("Incomplete record:");
      console.log(product);
    }
  }

  static validate(product) {
    if (
      (!product.id && product.id !== 0) ||
      !product.name ||
      !product.listPrice ||
      !product.productDimensions ||
      !product.imgURLs ||
      !product.weight ||
      !product.sourceURL ||
      !product.description
    ) {
      return false;
    } else {
      return true;
    }
  }
  stringify() {
    return JSON.stringify(this);
  }
};
