const express = require('express');
const router = express.Router();
const path = require('path');
const { adminAllComplaints } = require(path.join(__dirname, '../controller/adminComplaintsController'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));

// all complaints -- ADMIN
router.get('/vitco-india/control/complaints', async(req, res, next) => {
    if (await authorizedRoles("complaints", req, res, next, ["view"])) {
        adminAllComplaints(req, res)
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})


module.exports = router