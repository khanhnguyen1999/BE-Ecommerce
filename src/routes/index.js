'use strict'

const express = require('express');
const { apiKey, checkPermission } = require('../auth/checkAuth');
const router = express.Router();

// check apiKey
router.use(apiKey)
// check permision
router.use(checkPermission('0000'))

router.use('/v1/api',require('./access'))
router.use('/v1/api/product',require('./product'))
router.use('/v1/api/discount',require('./discount'))

module.exports = router