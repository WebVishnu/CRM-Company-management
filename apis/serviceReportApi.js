const express = require('express');
const router = express.Router();
const path = require('path');
const { updateServiceReport, getAllServiceReportMachines, searchServiceReport, deleteServiceReport, getServiceReportNumber,shareReportOnWhatsapp } = require(path.join(__dirname, '../apisController/serviceReportControllerApi'));
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

// get report number -- get
// router.get('/api/v1/service-report/share-report', async (req, res, next) => {
//     shareReportOnWhatsapp()
// })
// update service report -- admin -- post
router.post('/api/v1/service-report/update/:task/:id', async (req, res, next) => {
    if (await authorizedRoles("serviceReport", req, res, next, ["edit"])) { 
        updateServiceReport(req, res, next) }
    else { res.send({ success: false }); }

})

// delete service report -- admin -- get
// router.post('/api/v1/service-report/delete/:Sid', async (req, res, next) => { deleteServiceReport(req, res, next) })

module.exports = router