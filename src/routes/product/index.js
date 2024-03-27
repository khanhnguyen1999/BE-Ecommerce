'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const ProductController = require('../../controllers/product.controller');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router(); 

router.use(authenticationV2)

router.post('/create', asyncHandler(ProductController.createProduct))

// PUT
router.put('/public?:id', asyncHandler(ProductController.publicProductByShop))

// QUERY
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop))
router.get('/publish/all', asyncHandler(ProductController.getAllPublishForShop))

module.exports = router