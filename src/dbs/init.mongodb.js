"use strict";

const mongoose = require("mongoose");
const { db: { host, name, port } } = require('../configs/config.mongodb')
const { countConnect } = require('../helpers/check.connect')

const connect = `mongodb://${host}:${port}/?directConnection=true&serverSelectionTimeoutMS=2000&appName=${name}`
class Database {
  constructor() {
    this.connect();
  }
  // connect
  connect(type = "mongodb") {
    mongoose
      .connect(connect, {
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
