'use strict'

const _ = require('lodash')
const { Types } = require("mongoose")

const getInforData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds)
}

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === null) {
      delete obj[key]
    }
  });
  return obj;
}

const updateNestedObjectParser = (obj, prefix = "") => {
  const result = {};
  Object.keys(obj).forEach(key => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (obj[key] === null || obj[key] === undefined) {
      console.log(`ingore key`, key);
    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      Object.assign(result, updateNestedObjectParse(obj[key], newKey));
    } else {
      result[newKey] = obj[key];
    }
  });

  return result;
};


const convertToObjectId = id => new Types.ObjectId(id)

module.exports = {
  getInforData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectId
}