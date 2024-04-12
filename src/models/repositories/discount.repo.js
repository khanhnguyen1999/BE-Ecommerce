'use strict';

const { unGetSelectData, getSelectData } = require("../../utils")

const findAllDiscountCodeUnselect = async ({ limit = 50, sort = 'ctime', page = 1, filter, unSelect, model }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const documents = await model.find(filter).sort(sortBy).skip(skip).limit(limit).select(unGetSelectData(unSelect)).lean().exec()
  return documents
}

const findAllDiscountCodeSelect = async ({ limit = 50, sort = 'ctime', page = 1, filter, select, model }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const documents = await model.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean().exec()
  return documents
}

const checkDiscountExists = async ({model, filter}) => {
  return await model.findOne(filter).lean()
}


module.exports = {
  findAllDiscountCodeSelect,
  findAllDiscountCodeUnselect,
  checkDiscountExists
}