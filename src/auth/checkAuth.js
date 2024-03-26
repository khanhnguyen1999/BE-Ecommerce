"use strict";

const { findById } = require("../services/apiKey.service");
const apikeyModel = require("../models/apiKey.model")
const crypto = require("crypto")

const HEADERS = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const newKey = await apikeyModel.create({ key: crypto.randomBytes(64).toString('hex'), permission: ['0000'] })
    console.log('newKey ', newKey)
    const key = req.headers[HEADERS.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    // check objectKey
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (err) { }
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission denined",
      });
    }

    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "Permission denined",
      });
    }
    return next();
  };
};

module.exports = {
  apiKey,
  checkPermission,
};
