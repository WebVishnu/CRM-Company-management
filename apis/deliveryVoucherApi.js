const express = require('express');
const router = express.Router();
const path = require('path');
const { createNewDO } = require(path.join(__dirname, '../apisController/deliveryVoucherApiController'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));


// create new delivery voucher
router.post('/api/v1/vitco-impex/voucher/delivery-order/new', async (req, res,next) => {
    if (await authorizedRoles("deliveryVoucher", req, res, next, ["create"])) {createNewDO(req, res) }
    else { res.send({success: false});}
})


module.exports = router