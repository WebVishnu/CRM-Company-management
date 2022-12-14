const express = require('express');
const router = express.Router();
const path = require('path');
const { showAllSalesData, addNewSalesReportPage, showAllPartsSalesData, addNewPartSalesData, printPartSaleReport } = require(path.join(__dirname, '../controller/adminSalesController'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/adminUploads/salesData')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

// all machine sales report -- ADMIN -- machine
router.get('/vitco-impex/control/sales-report/machine/all', async (req, res, next) => {
  if (await authorizedRoles("machineSalesData", req, res, next, ["view"])) {
    showAllSalesData(req, res)
  }
  else {
    res.redirect('/vitco-india/control/admin/not-allowed')
  }
})


// add new sales report -- ADMIN -- machine
router.get('/vitco-impex/control/sales-report/machine/add-new', async (req, res, next) => {
  if (await authorizedRoles("machineSalesData", req, res, next, ["create"])) {
    addNewSalesReportPage(req, res)
  } else {
    res.redirect('/vitco-india/control/admin/not-allowed')
  }
})



// all parts sales report -- ADMIN -- parts
router.get('/vitco-impex/control/sales-report/parts/all', async (req, res, next) => {
  if (await authorizedRoles("partSalesData", req, res, next, ["view"])) {
    showAllPartsSalesData(req, res)
  }
  else {
    res.redirect('/vitco-india/control/admin/not-allowed')
  }
})

// add new parts sales report -- ADMIN -- parts
router.get('/vitco-impex/control/sales-report/parts/add-new', async (req, res, next) => {
  if (await authorizedRoles("partSalesData", req, res, next, ["create"])) {
    addNewPartSalesData(req, res)
  }
  else {
    res.redirect('/vitco-india/control/admin/not-allowed')
  }
})



// print sale report -- parts
router.get('/vitco-impex/control/sales-report/:category/print/:id', async (req, res, next) => {
  if (await authorizedRoles("partSalesData", req, res, next, ["view"])) {
    printPartSaleReport(req, res)
  }
  else {
    res.redirect('/vitco-india/control/admin/not-allowed')
  }
})

// add new parts sales report -- ADMIN -- POST
// router.post('/vitco-impex/control/sales-report/parts/add-new', async (req, res, next) => {
//   if (await authorizedRoles("partSalesData", req, res, next, ["create"])) {
//     addNewPartSalesDataForm(req, res)
//   }
//   else {
//     res.redirect('/vitco-india/control/admin/not-allowed')
//   }
// })

// // upload sales data 
// router.post('/vitco-india/control/sales-report/upload/new', upload.single("saleDataCSVfile"), async (req, res, next) => {
//   if (await authorizedRoles("all", req, res, next, ["view", "edit", "create", "delete"])) {
//     uploadSalesData(req, res)
//   } else {
//     res.redirect('/vitco-india/control/admin/not-allowed')
//   }
// })

module.exports = router