"use strict";
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const shopModel = require("../models/shop.model");
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { RoleShop } = require("../constant");
const { getInforData } = require("../utils");

const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

class AccessService {
  static login = async ({ email, password, refreshToken = null }) => {
    // 1
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered!");

    // 2
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication error");

    // 3 create privatekey, public key
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      {
        userId: foundShop._id,
      },
      publicKey,
      privateKey
    );

    await keyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      shop: getInforData({
        fileds: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check email exists
      const holderShop = await shopModel.findOne({ email }).lean();

      if (holderShop) {
        throw new BadRequestError("Error: Shop already registered!");
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });
      if (newShop) {
        // created private key and public key
        // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   },
        //   privateKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   }
        // })

        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        const keyStore = await keyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: "xxxx",
            message: "keyStore Error!",
          };
        }
        // const publicKeyObject = crypto.createPublicKey(publicKeyString)
        // created token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );
        console.log(`Created token success:: ${tokens}`);

        return {
          code: 201,
          metadata: {
            shop: getInforData({
              fileds: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }
      return {
        code: 201,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
