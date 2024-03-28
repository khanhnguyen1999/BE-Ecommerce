'use strict';

const { product, electronics, clothes, furnitures } = require("../../models/product.model")
const { getSelectData, unGetSelectData } = require("../../utils")
const { Types } = require("mongoose")

const searchProducts = async ({ search }) => {
  const regexSearch = new RegExp(search)
  const result = await product.find({
    isPublic: true,
    $text: { $search: regexSearch },
  }, {
    score: { $meta: 'textScore' }
  }).sort({ score: { $meta: 'textScore' } }).lean()
  return result
}
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
  if (!foundShop) return null
  foundShop.isDraft = false
  foundShop.isPublic = true
  const { modifiedCount } = await product.updateOne({ "_id": new Types.ObjectId(product_id), "product_shop": new Types.ObjectId(product_shop) }, foundShop)
  return modifiedCount
}


const unpublishProductByShop = async ({ product_id, product_shop }) => {
  const foundShop = await product.findOne({ "_id": new Types.ObjectId(product_id), "product_shop": new Types.ObjectId(product_shop) })
  if (!foundShop) return null
  foundShop.isDraft = true
  foundShop.isPublic = false
  const { modifiedCount } = await product.updateOne({ "_id": new Types.ObjectId(product_id), "product_shop": new Types.ObjectId(product_shop) }, foundShop)
  return modifiedCount
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const products = await product.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean().exec()
  return products
}

const findProduct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(unGetSelectData(unSelect))
}

const updateProductById = async ({ product_id, body, model, isNew = true }) => {
  return await model.findByIdAndUpdate(product_id, body, { new: isNew })
}


module.exports = {
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unpublishProductByShop,
  searchProducts,
  findAllProducts,
  findProduct,
  updateProductById
}