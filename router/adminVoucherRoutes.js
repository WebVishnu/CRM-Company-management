const express = require('express');
const router = express.Router();
const path = require('path');
const {viewVouchers} = require(path.join(__dirname, '../controller/adminVoucherController'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));

//print service report  -- ADMIN -- POST
router.get('/vitco-impex/vouchers/view', async (req, res, next) => {
    if (await authorizedRoles("vouchers", req, res, next, ["view"])) {
        viewVouchers(req, res)
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})


module.exports = router