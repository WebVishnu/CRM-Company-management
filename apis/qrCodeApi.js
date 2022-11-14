const express = require('express');
const router = express.Router();
const path = require('path');
const { createNewLayout , createNewQrCode ,updateQrCode } = require(path.join(__dirname, '../apisController/qrCodeApiController'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));
const qrCodeLayout = require(path.join(__dirname, "../models/qrCode/qrCodeLayouts"));
const qrCode = require(path.join(__dirname, "../models/qrCode/qrCodeSchema"));

// create new qr code layout
router.post('/api/v1/qr-code/layout/create-new', async (req, res, next) => {
    if (await authorizedRoles("qrCodeLayout", req, res, next, ["create"])) { createNewLayout(req, res) }
    else { res.send({ success: false, }); }
})

// get all layouts
router.post('/api/v1/qr-code/layout/all', async (req, res, next) => {
    if (await authorizedRoles("qrCodeLayout", req, res, next, ["view"])) { 
        res.send({
            success: true,
            layouts: await qrCodeLayout.find()
        })
     }
    else { res.send({ success: false, }); }
})

// get all qr codes
router.get('/api/v1/qr-code/codes/all', async (req, res, next) => {
    if (await authorizedRoles("qrCode", req, res, next, ["view"])) { 
        res.send({
            success: true,
            qrCodes: await qrCode.find()
        })
     }
    else { res.send({ success: false, }); }
})

// create new code
router.post('/api/v1/qr-code/create-new', async (req, res, next) => {
    if (await authorizedRoles("qrCode", req, res, next, ["create"])) { createNewQrCode(req, res) }
    else { res.send({ success: false, }); }
})


// update qr code
router.post('/api/v1/qr-code/update/:id', async (req, res, next) => {
    if (await authorizedRoles("qrCode", req, res, next, ["edit"])) { updateQrCode(req, res) }
    else { res.send({ success: false, }); }
})

module.exports = router