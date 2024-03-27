'use strict'

const { product, clothes, electronics, furnitures } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response')
const { findAllDraftForShop, findAllPublishForShop, publishProductByShop, unpublishProductByShop, searchProducts } = require('../models/repositories/product.repo')
// define factory class to create product 
class ProductFactory {
  /*
    type: 'Clothing'
    payload
   */
  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`);
    return new productClass(payload).createProduct()
  }

  static productRegistry = {} // key - class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
  }

  // put
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id })
  }

  static async unpublishProductByShop({ product_shop, product_id }) {
    return await unpublishProductByShop({ product_shop, product_id })
  }

  // query 

  static async searchProducts({search}){
    return await searchProducts({ search })
  }

  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true }
    return await findAllDraftForShop({ query, limit, skip })
  }
  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: false, isPublic: true }
    return await findAllPublishForShop({ query, limit, skip })
  }

}


// define basic product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }
  // create product
  async createProduct() {
    return await product.create({ ...this, _id: product._id })
  }
}

// define sub-class for diferent product types clothing

class Clothing extends Product {
  async createProduct() {
    const newClothing = clothes.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError('Create new clothing error');

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError('Create new product error');

    return newProduct;
  }
}

// define sub-class for diferent product types electronics

class Electronic extends Product {
  async createProduct() {
    const newElectronic = electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newElectronic) throw new BadRequestError('Create new electronic error');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('Create new product error');

    return newProduct;
  }
}


class Furniture extends Product {
  async createProduct() {
    const newFurniture = furnitures.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newFurniture) throw new BadRequestError('Create new furniture error');

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError('Create new product error');

    return newProduct;
  }
}

// register product types
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Furniture', Furniture)
module.exports = ProductFactory