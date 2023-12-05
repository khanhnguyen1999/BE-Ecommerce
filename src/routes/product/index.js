'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const ProductController = require('../../controllers/product.controller');
const { authentication } = require('../../auth/authUtils');
const router = express.Router(); 

router.use(authentication)

router.post('/create', asyncHandler(ProductController.createProduct))

module.exports = router