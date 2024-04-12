"use strict";
const DiscountService = require("../services/discount.service")
const {
  CreatedResponse,
  SuccessResponse,
} = require("../core/success.response");

class DiscountController {
  createDiscountCode = async (req,res,next)=>{
    new SuccessResponse({
      message: 'Successful Code Generations',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getAllDiscountCodesWithProduct = async (req,res,next)=>{
    new SuccessResponse({
      message: 'Successful Get All Discount Codes With Product',
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
      })
    }).send(res)
  }

  getAllDiscountCodeByShop = async (req,res,next)=>{
    new SuccessResponse({
      message: 'Successful Get All Discount Codes By Shop',
      metadata: await DiscountService.getAllDiscountCodeByShop({
        ...req.query,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getDiscountAmount = async (req,res,next)=>{
    new SuccessResponse({
      message: 'Successful Get Discount Amount',
      metadata: await DiscountService.getDiscountAmount({
        ...req.query,
      })
    }).send(res)
  }

  deleteDiscount = async (req,res,next)=>{
    new SuccessResponse({
      message: 'Successful Delete Discount',
      metadata: await DiscountService.deleteDiscount({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res)
  }

  cancelDiscount = async (req,res,next)=>{
    new SuccessResponse({
      message: 'Successful Cancel Discount',
      metadata: await DiscountService.cancelDiscount({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res)
  }

}

module.exports = new DiscountController()