'use strict';

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
const { findAllDiscountCodeUnselect, checkDiscountExists } = require("../models/repositories/discount.repo");
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
    const foundDiscount = await checkDiscountExists({
      model: discount, filter: {
        discount_code: code,
        discount_shopId: convertToObjectId(shopId)
      }
    })

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

  static async getAllDiscountCodesWithProduct({ code, shopId, userId, limit, page }) {
    // create index for discount_code
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectId(shopId)
    }).lean()

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount not exists')
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount
    let products;
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
      console.log('check ', foundDiscount, products)
    }
    return products;
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

  /**
   * 
   Apply discount Code
   products = [
    {
      productId,
      shopId,
      quantity,
      name,
      price
    },
    {
      productId,
      shopId,
      quantity,
      name,
      price
    }
   ]
   */
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount, filter: {
        discount_code: code,
        discount_shopId: convertToObjectId(shopId)
      }
    })
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount exits')
    }
    const {
      discount_is_active,
      discount_max_uses,
      discount_end_date,
      discount_start_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_type,
      discount_value
    } = foundDiscount
    if (!discount_is_active) throw new NotFoundError('Discount expired!')
    if (!discount_max_uses) throw new NotFoundError('Discount are out!')
    if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
      throw new NotFoundError('Discount code has expried!')
    }
    // check xem có set giá trị tối thiểu hay không?
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      // get total của giỏ hàng này
      totalOrder = products.reduce((acc, product) => acc + (product.quantity * product.price))
      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(`Discount requires a minium order value of ${discount_min_order_value}!`)
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUserDiscount = discount_users_used.find(user => user.userId === userId)
      if (userUserDiscount) {
        // ...
      }
    }

    // check xem discount này là fixed_amount
    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }

  static async deleteDiscount({ shopId, codeId }) {
    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectId(shopId)
    })
    return deleted
  }

  /**
   Cancel Discount Code()
   */
  static async cancelDiscount({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount, filter: {
        discount_code: code,
        discount_shopId: convertToObjectId(shopId)
      }
    })
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount not exists')
    }

    const result = await discount.findIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      }
    })
    return result
  }

}


module.exports = DiscountService;
