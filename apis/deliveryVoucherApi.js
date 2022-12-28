const express = require('express');
const router = express.Router();
const path = require('path');
const { createNewDO , filterDO ,dispatchDO } = require(path.join(__dirname, '../apisController/deliveryVoucherApiController'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));


// create new delivery voucher
router.post('/api/v1/vitco-impex/voucher/delivery-order/new', async (req, res, next) => {
    if (await authorizedRoles("deliveryOrderVoucher", req, res, next, ["create"])) { createNewDO(req, res) }
    else { res.send({ success: false }); }
})

// filter delivery vouchers
router.get('/api/v1/vitco-impex/filter/delivery-order/:filter/:from/:to', async (req, res, next) => {
    if (await authorizedRoles("deliveryOrderVoucher", req, res, next, ["view"])) { filterDO(req, res) }
    else { res.send({ success: false }); }
})

// create new delivery voucher
router.post('/api/v1/vitco-impex/voucher/delivery-order/dispatch', async (req, res, next) => {
    if (await authorizedRoles("deliveryOrderVoucher", req, res, next, ["edit"])) { dispatchDO(req, res) }
    else { res.send({ success: false }); }
})
module.exports = router