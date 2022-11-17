const express = require('express');
const router = express.Router();
const path = require('path');
const { } = require(path.join(__dirname, '../controller/adminComplaintsController'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));
const Admin = require(path.join(__dirname, "../models/adminSchema"));
const warehouse = require(path.join(__dirname, "../models/inventory/warehouseSchema.js"));

// homepage of inventory 
router.get('/vitco-india/control/inventory/home', async (req, res, next) => {
    if (await authorizedRoles("inventory", req, res, next, ["view"])) {
        const { adminToken } = req.cookies;
        const admin = await Admin.findById(adminToken.uID)
        res.render('admin/inventory/home', { "admin": admin, "webHost": req.headers.host, "protocol": req.headers.host , 'warehouses':await warehouse.find() })
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})
// homepage of inventory 
router.get('/vitco-india/control/inventory/warehouse/:warehouse', async (req, res, next) => {
    if (await authorizedRoles("inventory", req, res, next, ["view"])) {
        const { adminToken } = req.cookies;
        const admin = await Admin.findById(adminToken.uID)
        res.render('admin/inventory/home', { "admin": admin, "webHost": req.headers.host, "protocol": req.headers.host , 'warehouses':await warehouse.find() })
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})

module.exports = router