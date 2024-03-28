"use strict";
// const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.xxx");
const {
  CreatedResponse,
  SuccessResponse,
} = require("../core/success.response");
class ProductController {
  createProduct = async (req, res, next) => {
    // new SuccessResponse({
    //   message: "Create new product success!",
    //   metadata: await ProductService.createProduct(req.body.product_type, req.body, {
    //     ...req.body,
    //     product_shop: req.user.userId
    //   }),
    // }).send(res);
    new SuccessResponse({
      message: "Create new product success!",
      metadata: await ProductServiceV2.createProduct(req.body.product_type, req.body, {
        ...req.body,
        product_shop: req.user.userId
      }),
    }).send(res);
  };

  // Update product
  updateProduct = async (req, res, next) => {
    new SuccessResponse({ 
      message: "Update product success!",
      metadata: await ProductServiceV2.updateProduct(req.body.product_type, req.params.product_id, {
        ...req.body,
        product_shop: req.user.userId
      }),
    }).send(res);
  }

  // PUT
  publicProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Draft success!",
      metadata: await ProductServiceV2.publishProductByShop({ product_shop: req.user.userId, product_id: req.query.id }),
    }).send(res);
  }

  unpublicProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Draft success!",
      metadata: await ProductServiceV2.unpublishProductByShop({ product_shop: req.user.userId, product_id: req.query.id }),
    }).send(res);
  }

  // QUERY
  getAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list products success!",
      metadata: await ProductServiceV2.findAllProducts(req.query),
    }).send(res);
  }

  getProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get detail product success!",
      metadata: await ProductServiceV2.findProduct({
        product_id: req.params.product_id
      }),
    }).send(res);
  }

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list search success!",
      metadata: await ProductServiceV2.searchProducts({ search: req.query.search }),
    }).send(res);
  }

  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Draft success!",
      metadata: await ProductServiceV2.findAllDraftForShop({ product_shop: req.user.userId }),
    }).send(res);
  }

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Publish success!",
      metadata: await ProductServiceV2.findAllPublishForShop({ product_shop: req.user.userId }),
    }).send(res);
  }

  // END QUERY
}

module.exports = new ProductController();
