'use strict';

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
const { findAllDiscountCodeUnselect } = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertToObjectId } = require("../utils")
/**
  Discount Services
  1- Generator Discount code [Shop, Admin] 
  2- Get discount amount [User]
  3- Get all discount code  [Shop, User]
  4- Verify discount code [User]
  5- Delete discount code [Shop, Admin]
  6- Cancel discount code [user]
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code, start_date, end_date, is_active, shopId, min_order_value, product_ids, applies_to,
      name, description, type, value, max_value, max_uses, uses_count, max_uses_per_user, users_used
    } = payload
    // kiem tra
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError('Discount code has expried!')
    }
    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Start date must be before end date')
    }
    // create index for discount code
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectId(shopId)
    }).lean()

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount exits')
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value,
      discount_max_value: max_value,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids
    })
    return newDiscount
  }

  static async updateDiscount() {

  }

  static async getAllDiscountCodesWithProduct(code, shopId, userId, limit, page) {
    // create index for discount_code
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectId(shopId)
    }).lean()

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount not exists')
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount()
    let products
    if (discount_applies_to === 'all') {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectId(shopId),
          isPublic: true
        },
        limit,
        page,
        sort: 'ctime',
        select: ['product_name']
      })
    }
    if (discount_applies_to === 'specific') {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublic: true
        },
        limit,
        page,
        sort: 'ctime',
        select: ['product_name']
      })
    }
    return producs;
  }

  static async getAllDiscountCodeByShop({
    limit, page, shopId
  }) {
    const discounts = await findAllDiscountCodeUnselect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectId(shopId),
        discount_is_active: true
      },
      unSelect: ['__v'],
      model: discount
    })
    return discounts
  }
}