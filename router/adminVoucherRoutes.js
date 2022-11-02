const express = require('express');
const router = express.Router();
const path = require('path');
// const { viewVouchers } = require(path.join(__dirname, '../controller/adminVoucherController'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));
const Admin = require(path.join(__dirname, "../models/adminSchema"));
const DOVoucher = require(path.join(__dirname, "../models/vouchers/deliveryOrderSchema"));

//select vouchers  -- ADMIN 
router.get('/vitco-impex/vouchers/choose-voucher', async (req, res, next) => {
    if (await authorizedRoles("vouchers", req, res, next, ["view"])) {
        const { adminToken } = req.cookies;
        const admin = await Admin.findById(adminToken.uID)
        res.render('admin/vouchers/selectVouchers', { "admin": admin, "webHost": req.headers.host, "protocol": req.headers.host })
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})


// delivery order -- create new
router.get('/vitco-impex/vouchers/delivery-order/new', async (req, res, next) => {
    if (await authorizedRoles("deliveryOrder", req, res, next, ["create"])) {
        const { adminToken } = req.cookies;
        const admin = await Admin.findById(adminToken.uID)
        const allVouchers = await DOVoucher.find()
        res.render('admin/vouchers/delivery-order/create-new', { "voucherNum": pad(allVouchers.length + 1 ,3), "admin": admin, "webHost": req.headers.host, "protocol": req.headers.host })
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})

// delivery order -- view all
router.get('/vitco-impex/vouchers/delivery-order/view-all', async (req, res, next) => {
    if (await authorizedRoles("deliveryOrder", req, res, next, ["view"])) {
        const { adminToken } = req.cookies;
        const admin = await Admin.findById(adminToken.uID)
        const allDOvouchers = await DOVoucher.find()
        console.log(allDOvouchers)
        res.render('admin/vouchers/delivery-order/view-all', {"vouchers":allDOvouchers, "admin": admin, "webHost": req.headers.host, "protocol": req.headers.host })
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})




//view vouchers  -- ADMIN -- POST
// router.get('/vitco-impex/vouchers/view', async (req, res, next) => {
//     if (await authorizedRoles("vouchers", req, res, next, ["view"])) {
//         viewVouchers(req, res)
//     } else {
//         res.redirect('/vitco-india/control/admin/not-allowed')
//     }
// })


module.exports = router




function pad(n, length) {
    var len = length - ('' + n).length;
    return (len > 0 ? new Array(++len).join('0') : '') + n
}