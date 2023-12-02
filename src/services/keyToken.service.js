"use strict";

const keytokenModel = require("../models/keytoken.model");

class keyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
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
      return tokens ? tokens.publicKey : null
    } catch (err) {
      return err;
    }
  };
}

module.exports = keyTokenService;
