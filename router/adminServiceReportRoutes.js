const express = require('express');
const router = express.Router();
const path = require('path');
const { adminAllServiceReport, addNewServiceReport, PostServiceReport, printServiceReport } = require(path.join(__dirname, '../controller/serviceReportController'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));


// all service reports -- ADMIN
router.get('/vitco-india/control/service-reports/all', async (req, res, next) => {
    if (await authorizedRoles("serviceReport", req, res, next, ["view"])) {
        await adminAllServiceReport(req, res)
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})

//add new service report  -- ADMIN
router.get('/vitco-india/control/service-reports/new-form', async (req, res, next) => {
    if (await authorizedRoles("serviceReport", req, res, next, ["create"])) {
        await addNewServiceReport(req, res)
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})

//add new service report  -- ADMIN -- POST
router.post('/vitco-india/control/service-reports/new-form', async (req, res, next) => {
    if (await authorizedRoles("serviceReport", req, res, next, ["create"])) {
        await PostServiceReport(req, res)
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})



//print service report  -- ADMIN -- POST
router.get('/vitco-india/control/service-reports/print/:id', async (req, res, next) => {
    if (await authorizedRoles("serviceReport", req, res, next, ["view"])) {
        printServiceReport(req, res)
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})
//add new service report  -- ADMIN -- POST
// router.get('/vitco-india/control/service-reports/download/:Report_id', async(req, res, next) => { downloadServiceReport(req, res) })



module.exports = router