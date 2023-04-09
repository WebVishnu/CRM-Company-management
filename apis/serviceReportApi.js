const express = require('express');
const router = express.Router();
const path = require('path');
const { updateServiceReport, getAllServiceReportMachines, searchServiceReport, updateCheckStatus, deleteServiceReport, getServiceReportNumber, shareReportOnWhatsapp, addNewServiceReport } = require(path.join(__dirname, '../apisController/serviceReportControllerApi'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));


// get all service report machines -- get
router.get('/api/v1/service-report/all/:from/:to', async (req, res, next) => {
    if (await authorizedRoles("serviceReport", req, res, next, ["view"])) { getAllServiceReportMachines(req, res, next) }
    else { res.send({ success: false }); }
})

// search for service report machines -- get
router.post('/api/v1/service-report/search/:query', async (req, res, next) => {
    if (await authorizedRoles("serviceReport", req, res, next, ["view"])) { searchServiceReport(req, res, next) }
    else { res.send({ success: false }); }
})
// get report number -- get
router.get('/api/v1/service-report/get-report-number', async (req, res, next) => {
    await getServiceReportNumber(req, res)
})

// add new service report -- admin -- post
router.post('/api/v1/service-report/add-new', async (req, res, next) => {
    if (await authorizedRoles("serviceReport", req, res, next, ["create"])) {
        addNewServiceReport(req, res, next)
    }
    else { res.send({ success: false }); }

})

// get report number -- get
// router.get('/api/v1/service-report/share-report', async (req, res, next) => {
//     shareReportOnWhatsapp()
// })
// update service report -- admin -- post
router.post('/api/v1/service-report/update/:task/:id', async (req, res, next) => {
    if (await authorizedRoles("serviceReport", req, res, next, ["edit"])) {
        updateServiceReport(req, res, next)
    }
    else { res.send({ success: false }); }

})
// update Check Status
router.post('/api/v1/service-report/checked/:task', async (req, res, next) => {
    if (await authorizedRoles("serviceReport", req, res, next, ["view"])) {
        updateCheckStatus(req, res, next)
    }
    else { res.send({ success: false }); }

})

// delete service report -- admin -- get
// router.post('/api/v1/service-report/delete/:Sid', async (req, res, next) => { deleteServiceReport(req, res, next) })

module.exports = router