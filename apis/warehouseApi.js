const express = require('express');
const router = express.Router();
const path = require('path');
const { createNewWarehouse } = require(path.join(__dirname, '../apisController/warehouseController'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/warehouse/base-img')
    },
    filename: function (req, file, cb) {
      cb(null, + Date.now() + '---' + req.body.warehouseName + path.extname(file.originalname))
    }
  })
  
const upload = multer({ storage:storage })

// create new qr code layout
router.post('/api/v1/warehouse/create-new',upload.single("warehouseImgFile"), async (req, res, next) => {
    if (await authorizedRoles("all", req, res, next, ["view","edit","create","delete"])) { createNewWarehouse(req, res) }
    else { res.send({ success: false, }); }
})


module.exports = router