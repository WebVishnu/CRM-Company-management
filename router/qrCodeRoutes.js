const express = require('express');
const router = express.Router();
const path = require('path');
// const {} = require(path.join(__dirname, '../controller/serviceReportController'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));
const Admin = require(path.join(__dirname, "../models/adminSchema"));
const qrCodeLayout = require(path.join(__dirname, "../models/qrCode/qrCodeLayouts"));
const qrCode = require(path.join(__dirname, "../models/qrCode/qrCodeSchema"));


// view qr code layouts -- ADMIN
router.get('/vitco-impex/control/qr-code/view-all', async (req, res, next) => {
    if (await authorizedRoles("generateQrCode", req, res, next, ["view"])) {
        const { adminToken } = req.cookies;
        res.render('admin/qrCode/view-all', {
            "admin": await Admin.findById(adminToken.uID),
            "layouts":await qrCodeLayout.find(),
            "webHost": req.headers.host,
            "protocol": req.headers.host
        })
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})


// view qr code -- ADMIN
router.get('/vitco-impex/qr-code/get-info/:id', async (req, res, next) => {
    if (await authorizedRoles("qrCode", req, res, next, ["edit"])) {
        const { adminToken } = req.cookies;
        res.render('admin/qrCode/details', {
            "admin": await Admin.findById(adminToken.uID),
            "details":await qrCode.findOne({_id:req.params.id})
        })
    } else {
        res.render('user/qrCode/details', {
            "details":await qrCode.findOne({_id:req.params.id})
        })
    }
})

module.exports = router