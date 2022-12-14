const express = require('express');
const router = express.Router();
const path = require('path');
const { getAllPartSalesData, editPartSalesDataAdmin, getSearchedPartSaleData, getSinglePartSalesData, getPartSalesReportNumber ,createNewPartSales } = require(path.join(__dirname, '../apisController/partSalesDataController'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));

// get all sales data -- get
router.get('/api/v1/sales-data/parts/all/:limit', async (req, res, next) => {
    if (await authorizedRoles("partSalesData", req, res, next, ["view"])) { getAllPartSalesData(req, res) }
    else { res.send({ success: false, }); }
})

// get all sales data -- get
router.get('/api/v1/sales-data/parts/get-single-data/:id', async (req, res, next) => {
    if (await authorizedRoles("partSalesData", req, res, next, ["view"])) { getSinglePartSalesData(req, res) }
    else { res.send({ success: false, }); }

})
// get searched sales data -- get
router.get('/api/v1/sales-data/parts/search/:query', async (req, res, next) => {
    if (await authorizedRoles("partSalesData", req, res, next, ["view"])) { getSearchedPartSaleData(req, res) }
    else { res.send({ success: false, }); }
})

// edit single sales data -- post
router.post('/api/v1/sales-data/parts/edit/:id', async (req, res, next) => {
    if (await authorizedRoles("all", req, res, next, ["view", "edit", "create", "delete"])) {
        editPartSalesDataAdmin(req, res)
    }
    else { res.send({ success: false, }); }
})

// get report num -- get
router.get('/api/v1/sales-data/parts/get-report-number', async (req, res, next) => {
    if (await authorizedRoles("partSalesData", req, res, next, ["create"])) { getPartSalesReportNumber(req, res) }
    else { res.send({ success: false, }); }
})

// create new parts sales report -- post
router.get('/api/v1/sales-data/parts/create-new', async (req, res, next) => {
    if (await authorizedRoles("partSalesData", req, res, next, ["create"])) { createNewPartSales(req, res) }
    else { res.send({ success: false, }) }
})
module.exports = router