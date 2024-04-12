'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const DiscountController = require('../../controllers/discount.controller');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

router.get('/amount', asyncHandler(DiscountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodesWithProduct))

router.use(authenticationV2)

router.post('/create', asyncHandler(DiscountController.createDiscountCode))
router.get('', asyncHandler(DiscountController.getAllDiscountCodeByShop))

module.exports = router 