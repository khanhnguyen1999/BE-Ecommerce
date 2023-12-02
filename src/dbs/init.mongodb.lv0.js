"use strict";

const mongoose = require("mongoose");

const connectString = "mongodb+srv://npkhanh1405:khanhnguyen@cluster0.ktedpzh.mongodb.net/";
mongoose
  .connect(connectString)
  .then((_) => console.log("Connected Mongodb success"))
  .catch((err) => console.log("Error connect!"));

module.exports = mongoose