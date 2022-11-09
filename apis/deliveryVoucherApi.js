const express = require('express');
const router = express.Router();
const path = require('path');
const { createNewDO } = require(path.join(__dirname, '../apisController/deliveryVoucherApiController'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));
const DOVoucher = require(path.join(__dirname, "../models/vouchers/deliveryOrderSchema"));
const Admin = require(path.join(__dirname, "../models/adminSchema"));


// create new delivery voucher
router.post('/api/v1/vitco-impex/voucher/delivery-order/new', async (req, res, next) => {
    if (await authorizedRoles("deliveryVoucher", req, res, next, ["create"])) { createNewDO(req, res) }
    else { res.send({ success: false }); }
})

// filter delivery vouchers
router.get('/api/v1/vitco-impex/filter/delivery-order/:filter', async (req, res, next) => {
    if (await authorizedRoles("deliveryVoucher", req, res, next, ["view"])) {
        try {
            const { adminToken } = req.cookies;
            const admin = await Admin.findById(adminToken.uID)
            if (req.params.filter == "all") {
                res.send({
                    success: true,
                    vouchers: await DOVoucher.find().catch((e)=>{throw e})
                })
            } else if (req.params.filter == "admin") {
                res.send({
                    success: true,
                    vouchers: await DOVoucher.find({ 'createdBy.adminID': admin._id }).catch((e)=>{throw e})
                })
            }
        } catch (e) {
            console.log(e)
            res.send({ success: false });
        }
    }
    else { res.send({ success: false }); }
})
module.exports = router