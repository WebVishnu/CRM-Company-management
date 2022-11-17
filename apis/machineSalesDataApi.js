const express = require('express');
const router = express.Router();
const path = require('path');
const { editSalesDataAdmin } = require('../apisController/salesDataController');
const { getAllSalesData, getSingleSalesData, getSearchedSaleData, addBulkSalesDataAdmin,getSaleReportNumber } = require(path.join(__dirname, '../apisController/salesDataController'));
const multer = require('multer')
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/adminUploads/salesData')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

// get all sales data -- get
router.get('/api/v1/sales-data/all/:limit', async (req, res, next) => {
  if (await authorizedRoles("machineSalesData", req, res, next, ["view"])) { getAllSalesData(req, res) }
  else { res.send({ success: false, }); }
})
// get all sales data -- get
router.get('/api/v1/sales-data/get-single-data/:id', async (req, res, next) => {
  if (await authorizedRoles("machineSalesData", req, res, next, ["view"])) { getSingleSalesData(req, res) }
  else { res.send({ success: false, }); }

})
// get searched sales data -- get
router.get('/api/v1/sales-data/search/:query', async (req, res, next) => {
  if (await authorizedRoles("machineSalesData", req, res, next, ["view"])) { getSearchedSaleData(req, res) }
  else { res.send({ success: false, }); }
})
// edit single sales data -- post
router.post('/api/v1/sales-data/edit/:id', async (req, res, next) => {
  if (await authorizedRoles("all", req, res, next, ["view", "edit", "create", "delete"])) { editSalesDataAdmin(req, res) }
  else { res.send({ success: false, }); }
})
// edit single sales data -- post
router.post('/api/v1/sales-data/add-bulk-data/add', upload.single("file"), async (req, res, next) => {
  if (await authorizedRoles("machineSalesData", req, res, next, ["create"])) { addBulkSalesDataAdmin(req, res) }
  else { res.send({ success: false, }); }
})
// update sales report -- get 
router.get('/api/v1/sales-data/get-report-number', async (req, res, next) => {
  if (await authorizedRoles("machineSalesData", req, res, next, ["create"])) { getSaleReportNumber(req, res) }
  else { res.send({ success: false, }); }
})
// router.post('/api/v1/sales-data/add-to-db',(req,res,next)=>{console.log(req.body);res.send({data:req.body})})


module.exports = router