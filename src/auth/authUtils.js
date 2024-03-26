"use strict";
const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADERS = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = await JWT.sign(payload, process.env.JWT_TOKEN_SECRET, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`error verify:: ${err}`);
      } else {
        console.log(`decode verify:: ${decode}`);
      }
    });

    return { accessToken, refreshToken };
  } catch (err) {
    return err;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*  
    1 - Check userid missing ?
    2 - Get accessToken 
    3 - verify token
    4 - check user in dbs
    5 - check keyStore with userid
    6 - ok -> return next
  */

  //1
  const userId = req.headers[HEADERS.CLIENT_ID]?.toString();

  if (!userId) throw new AuthFailureError("Invalid Request");
  //2
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not Found keyStore");
  console.log('userId ',keyStore)

  //3
  const accessToken = req.headers[HEADERS.AUTHORIZATION]?.toString();
  if (!accessToken) throw new AuthFailureError("Invalid Request");
  try {
    const decodeUser = JWT.verify(accessToken, process.env.JWT_TOKEN_SECRET);
    if (!decodeUser || userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid Request");
    req.keyStore = keyStore;
    next();
  } catch (err) {
    throw err;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
