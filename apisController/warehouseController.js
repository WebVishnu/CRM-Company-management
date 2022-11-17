const path = require('path');
const catchAsyncErrors = require(path.join(__dirname, "../middlewares/catchAsyncErrors"));
const warehouse = require(path.join(__dirname, "../models/inventory/warehouseSchema.js"));
const moment = require('moment')
const Admin = require(path.join(__dirname, "../models/adminSchema"));

exports.createNewWarehouse = catchAsyncErrors(async (req, res, next) => {
    const { adminToken } = req.cookies;
    const admin = await Admin.findById(adminToken.uID)
    await warehouse.create({
        createdBy: {
            adminName:admin.adminName,
            date:moment().format('DD/MM/YYYY'),
            adminId:admin._id
        },
        permissions:req.body.warehousePermissions.split('  ,  '),
        warehouseName:req.body.warehouseName,
        warehouseImg:`${req.file.filename}`,
        categories:[]
    }).then(async ()=>{
        res.send({
            success: true,
            warehouses: await warehouse.find()
        })
    }).catch((e)=>{
        console.log(e)
        res.send({
            success: false,
        })
    })
})
