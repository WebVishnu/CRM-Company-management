const express = require('express');
const router = express.Router();
const path = require('path');
const {viewVouchers} = require(path.join(__dirname, '../controller/adminVoucherController'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));
const Admin = require(path.join(__dirname, "../models/adminSchema"));


//select vouchers  -- ADMIN 
router.get('/vitco-impex/vouchers/choose-voucher', async (req, res, next) => {
    if (await authorizedRoles("vouchers", req, res, next, ["view"])) {
        const { adminToken } = req.cookies;
        const admin = await Admin.findById(adminToken.uID)
        res.render('admin/vouchers/selectVouchers', { "admin": admin, "webHost": req.headers.host, "protocol": req.headers.host})
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})


// delivery order -- create new
router.get('/vitco-impex/vouchers/delivery-order/new', async (req, res, next) => {
    if (await authorizedRoles("deliveryOrder", req, res, next, ["create"])) {
        const { adminToken } = req.cookies;
        const admin = await Admin.findById(adminToken.uID)
        res.render('admin/vouchers/delivery-order/create-new', { "admin": admin, "webHost": req.headers.host, "protocol": req.headers.host})
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})






//view vouchers  -- ADMIN -- POST
router.get('/vitco-impex/vouchers/view', async (req, res, next) => {
    if (await authorizedRoles("vouchers", req, res, next, ["view"])) {
        viewVouchers(req, res)
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})


module.exports = router