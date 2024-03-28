'use strict'

const { product, clothes, electronics, furnitures } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response')
const {
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unpublishProductByShop,
  searchProducts,
  findAllProducts,
  findProduct,
  updateProductById
} = require('../models/repositories/product.repo')
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");
const { insertInventory } = require('../models/repositories/inventory.repo');

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

  static async updateProduct(type, product_id, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`);
    return new productClass(payload).updateProduct(product_id)
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

  static async searchProducts({ search }) {
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

  static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublic: true } }) {
    return await findAllProducts({ limit, sort, page, filter, select: ['product_name', 'product_price', 'product_thumb'] })
  }

  static async findProduct({ product_id, unSelect = ['__v'] }) {
    return await findProduct({ product_id, unSelect })
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
    const newProduct = await product.create({ ...this, _id: product._id })
    if (newProduct) {
      // add product stock in inventory collection
      await insertInventory({ productId: newProduct._id, stock: this.product_quantity, shopId: this.product_shop })
    }
    return newProduct
  }

  async updateProduct({ product_id, body }) {
    return await updateProductById({ product_id, body, model: product })
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

  async updateProduct(productId) {
    const updateNest = updateNestedObjectParser(this);
    const objectParams = removeUndefinedObject(updateNest);
    if (objectParams.product_attributes) {
      updateProductById({ productId, body: updateNestedObjectParser(objectParams.product_attributes), model: clothing });
    }
    const updateProduct = await super.updateProduct({ product_id: productId, body: updateNestedObjectParser(objectParams), model: clothing })
    return updateProduct;
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