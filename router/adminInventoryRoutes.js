const express = require('express');
const router = express.Router();
const path = require('path');
const { } = require(path.join(__dirname, '../controller/adminComplaintsController'));
const { authorizedRoles, isAuthenticatedWarehouse } = require(path.join(__dirname, "../middlewares/auth"));
const Admin = require(path.join(__dirname, "../models/adminSchema"));

// homepage of inventory 
router.get('/vitco-impex/control/inventory/home', async (req, res, next) => {
    if (await authorizedRoles("inventory", req, res, next, ["view"])) {
        const { adminToken } = req.cookies;
        const admin = await Admin.findById(adminToken.uID)
        res.render('admin/inventory/home', { "admin": admin, "webHost": req.headers.host, "protocol": req.headers.host })
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})
// homepage of inventory 
router.get('/vitco-impex/control/inventory/warehouse/:warehouseID', async (req, res, next) => {
    const verified = await isAuthenticatedWarehouse(req, req.params.warehouseID)
    if (verified.success) {
        res.render('admin/inventory/warehouse', { "admin": verified.admin, "webHost": req.headers.host, "protocol": req.headers.host, 'warehouses': verified.wareHouse,warehouseID:req.params.warehouseID })
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})

module.exports = router