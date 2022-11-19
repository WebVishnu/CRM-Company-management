const express = require('express');
const router = express.Router();
const path = require('path');
const { createNewWarehouse, addNewProduct } = require(path.join(__dirname, '../apisController/warehouseController'));
const { authorizedRoles, isAuthenticatedWarehouse } = require(path.join(__dirname, "../middlewares/auth"));
const multer = require('multer')
const warehouse = require(path.join(__dirname, "../models/inventory/warehouseSchema.js"));
const fs = require('fs')

const WarehouseStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/adminUploads/warehouse img')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '---' + req.body.warehouseName + path.extname(file.originalname))
  }
})

// products storage
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/adminUploads/products/img')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '---' + req.body.productName + path.extname(file.originalname))
  }
})



const productStorageUpload = multer({ storage: productStorage })
const warehouseUpload = multer({ storage: WarehouseStorage })


// get all warehouses
router.get('/api/v1/warehouse/get-all', async (req, res, next) => {
  if (await authorizedRoles("all", req, res, next, ["view", "edit", "create", "delete"])) {
    res.send({
      success: true,
      warehouses: await warehouse.find()
    })
  }
  else { res.send({ success: false, }); }
})

// create new warehouse
router.post('/api/v1/warehouse/create-new', warehouseUpload.single("warehouseImgFile"), async (req, res, next) => {
  if (await authorizedRoles("all", req, res, next, ["view", "edit", "create", "delete"])) { createNewWarehouse(req, res) }
  else { res.send({ success: false, }); }
})


// delete warehouse
router.get('/api/v1/warehouse/delete/:id', async (req, res, next) => {
  if (await authorizedRoles("all", req, res, next, ["view", "edit", "create", "delete"])) {
    const whouse = await warehouse.findOne({ _id: req.params.id })
    fs.unlink(process.cwd() + `/public/adminUploads/warehouse img/${whouse.warehouseImg}`, (err) => { })
    await warehouse.deleteOne({ _id: req.params.id })
    res.send({
      success: true,
    })
  }
  else { res.send({ success: false, }); }
})

// =================================================================
// =================================================================

// ADD NEW PRODUCT IN WAREHOUSE
router.post('/api/v1/warehouse/:warehouseID/products/add-new', productStorageUpload.single("productImg"), async (req, res, next) => {
  if (await isAuthenticatedWarehouse(req, req.params.warehouseID)) { addNewProduct(req, res, next) }
  else { res.send({ success: false, }); }
})


// GET ALL CATEGORIES IN WAREHOUSE
router.get('/api/v1/warehouse/:warehouseID/category/all', async (req, res, next) => {
  if (await isAuthenticatedWarehouse(req, req.params.warehouseID)) {
    wHouse = await warehouse.findOne({ _id: req.params.warehouseID })
    res.send({
      success: true,
      categories: wHouse.categories
    })
  }
  else { res.send({ success: false, }); }
})
module.exports = router