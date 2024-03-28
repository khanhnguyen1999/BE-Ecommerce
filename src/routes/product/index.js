'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const ProductController = require('../../controllers/product.controller');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

router.get('/search?:search', asyncHandler(ProductController.getListSearchProduct))
router.get('/all', asyncHandler(ProductController.getAllProducts))
router.get('/:product_id', asyncHandler(ProductController.getProduct))

router.use(authenticationV2)

router.post('/create', asyncHandler(ProductController.createProduct))
router.patch('/update/:product_id', asyncHandler(ProductController.updateProduct))
// PUT
router.put('/public?:id', asyncHandler(ProductController.publicProductByShop))
router.put('/unpublic?:id', asyncHandler(ProductController.unpublicProductByShop))

// QUERY

router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop))
router.get('/publish/all', asyncHandler(ProductController.getAllPublishForShop))

module.exports = router