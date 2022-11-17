const express = require('express');
const router = express.Router();
const path = require('path');
const { deleteAdmin, getAdminDetails } = require(path.join(__dirname, '../apisController/controlAdmins'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));
const Admin = require(path.join(__dirname, "../models/adminSchema"));

// get all admin
router.get('/api/v1/vitco-impex/admins/all', async (req, res,next) => {
    if (await authorizedRoles("all", req, res, next, ["view","edit","create","delete"])) {
        const admins = await Admin.find()
        res.send({success: true,admins})
     }
    else { res.send({success: false});}
})


// delete admin
router.post('/api/v1/vitco-india/control-admins/delete', async (req, res,next) => {
    if (await authorizedRoles("all", req, res, next, ["view","edit","create","delete"])) {deleteAdmin(req, res) }
    else { res.send({success: false});}
})

// view admins
router.get('/api/v1/vitco-india/control-admins/view/:id', async (req, res,next) => {
    if (await authorizedRoles("all", req, res, next, ["view","edit","create","delete"])) {getAdminDetails(req, res) }
    else { res.send({success: false});}
    
})

module.exports = router