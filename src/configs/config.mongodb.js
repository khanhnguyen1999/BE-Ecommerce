'use strict'

// lv0
const dev = {
  app: {
    port: process.env.DEV_APP_PORT
  },
  db: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
  }
}

const prod = {
  app: {
    port: process.env.PRO_APP_PORT
  },
  db: {
    username: process.env.PRO_DB_USERNAME,
    password: process.env.PRO_DB_PASSWORD
  }
}

const config = {
  dev, prod
}

const env = process.env.NODE_ENV || 'dev'
module.exports = config[env]