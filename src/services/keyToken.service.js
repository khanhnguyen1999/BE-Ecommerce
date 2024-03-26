"use strict";

const keytokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");
class keyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    // try {
    //   const publicKeyString = publicKey.toString();
    //   const tokens = await keytokenModel.create({
    //     user: userId,
    //     publicKey: publicKeyString
    //   })

    //   return tokens ? tokens.publicKey : null
    // } catch(err){
    //   return err
    // }
    try {
      // const tokens = await keyTokenService.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // })
      // return tokens ? tokens.publicKey : null
      const filter = {
        user: userId,
      };
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (err) {
      return err;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel.find({ user: new Types.ObjectId(userId) }).lean();
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne({"_id": new Types.ObjectId(id)}).lean();
  };

  static findByRefreshTokeUsed = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken });
  };

  static deleteKeyById = async (userId) => {
    return await keytokenModel.deleteOne({ user: userId });
  };
}

module.exports = keyTokenService;
