"use strict";

const mongoose = require("mongoose");
const { db: {username, password} } = require('../configs/config.mongodb')
const { countConnect } = require('../helpers/check.connect')

const connectString =
  `mongodb+srv://${username}:${password}@cluster0.ktedpzh.mongodb.net/?retryWrites=true&w=majority/`;

  class Database {
  constructor() {
    this.connect();
  }
  // connect
  connect(type = "mongodb") {
    mongoose
      .connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((_) => {
        countConnect();
        console.log("Connected Mongodb success")
      })
      .catch((err) => console.log("Error connect!"));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
