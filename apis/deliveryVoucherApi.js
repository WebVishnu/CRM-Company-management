const express = require('express');
const router = express.Router();
const path = require('path');
const { createNewDO , filterDO ,dispatchDO,addAfterPayments ,Edit_DO,getDetails} = require(path.join(__dirname, '../apisController/deliveryVoucherApiController'));
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

// add after payemnts
router.post('/api/v1/voucher/delivery-order/add/after-payments', async (req, res, next) => {
    if (await authorizedRoles("deliveryOrderVoucher", req, res, next, ["edit"])) { addAfterPayments(req, res) }
    else { res.send({ success: false }); }
})

// edit delivery voucher
router.post('/api/v1/voucher/delivery-order/edit', async (req, res, next) => {
    if (await authorizedRoles("deliveryOrderVoucher", req, res, next, ["edit"])) { Edit_DO(req, res) }
    else { res.send({ success: false }); }
})

// get details
router.get('/api/v1/voucher/delivery-order/find/:key/:value', async (req, res, next) => {
    if (await authorizedRoles("deliveryOrderVoucher", req, res, next, ["view"])) { getDetails(req, res) }
    else { res.send({ success: false }); }
})

module.exports = router