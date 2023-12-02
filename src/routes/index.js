'use strict'

const express = require('express');
const { apiKey, checkPermission } = require('../auth/checkAuth');
const router = express.Router();

// check apiKey
router.use(apiKey)
// check permision
router.use(checkPermission('0000'))

router.use('/v1/api',require('./access'))

module.exports = router