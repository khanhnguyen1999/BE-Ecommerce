'use strict';

const { product, electronics, clothes, furnitures } = require("../../models/product.model")
const { Types } = require("mongoose")


const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const queryProduct = async ({ query, limit, skip }) => {
  return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const publishProductByShop = async ({ product_id, product_shop }) => {
  const foundShop = await product.findOne({ "_id": new Types.ObjectId(product_id), "product_shop": new Types.ObjectId(product_shop) })
  console.log('foundShop ', foundShop)
  if (!foundShop) return null
  foundShop.isDraft = false
  foundShop.isPublic = true
  const { modifiedCount } = await product.update(foundShop)
  return modifiedCount
}


module.exports = {
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop
}