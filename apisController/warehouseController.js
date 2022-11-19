const path = require('path');
const catchAsyncErrors = require(path.join(__dirname, "../middlewares/catchAsyncErrors"));
const warehouse = require(path.join(__dirname, "../models/inventory/warehouseSchema.js"));
const moment = require('moment')
const Admin = require(path.join(__dirname, "../models/adminSchema"));


// CREATE NEW WAREHOUSE
exports.createNewWarehouse = catchAsyncErrors(async (req, res, next) => {
    const { adminToken } = req.cookies;
    const admin = await Admin.findById(adminToken.uID)
    await warehouse.create({
        createdBy: {
            adminName: admin.adminName,
            date: moment().format('DD/MM/YYYY'),
            adminId: admin._id
        },
        permissions: req.body.warehousePermissions.split('  ,  '),
        warehouseName: req.body.warehouseName,
        warehouseImg: `${req.file.filename}`,
        categories: []
    }).then(async () => {
        res.send({
            success: true,
            warehouses: await warehouse.find()
        })
    }).catch((e) => {
        console.log(e)
        res.send({
            success: false,
        })
    })
})


// ADD NEW PRODUCT 
exports.addNewProduct = catchAsyncErrors(async (req, res, next) => {
    const { adminToken } = req.cookies;
    const admin = await Admin.findById(adminToken.uID)
    const category = await warehouse.findOne({ 'categories.categoryName': req.body.categoryName })
    if (category != null) {
        await warehouse.findOneAndUpdate({ 'categories.categoryName': req.body.categoryName }, {
            $push: {
                "categories.$.products": {
                    createdBy: {
                        adminName: admin.adminName,
                        date: moment().format('DD/MM/YYYY'),
                        adminId: admin._id,
                    },
                    productName: req.body.productName,
                    productImg: req.file.filename,
                    dateAdded: req.body.dateAdded,
                    description: req.body.description,
                    rate: req.body.rate,
                    minimumStock: req.body.minimumStock,
                    maximumStock: req.body.maximumStock,
                    currentStock: req.body.currentStock,
                }
            }
        }).then(() => {
            res.send({
                success: true
            })
        }).catch(err => {
            console.log(err)
            res.send({
                success: false
            })
        })
    } else {
        await warehouse.updateOne({ _id: req.params.warehouseID }, {
            $push: {
                categories: {
                    createdBy: {
                        adminName: admin.adminName,
                        date: moment().format('DD/MM/YYYY'),
                        adminId: admin._id,
                    },
                    categoryName: req.body.categoryName,
                    products: [
                        {
                            createdBy: {
                                adminName: admin.adminName,
                                date: moment().format('DD/MM/YYYY'),
                                adminId: admin._id,
                            },
                            productName: req.body.productName,
                            productImg: req.file.filename,
                            dateAdded: req.body.dateAdded,
                            description: req.body.description,
                            rate: req.body.rate,
                            minimumStock: req.body.minimumStock,
                            maximumStock: req.body.maximumStock,
                            currentStock: req.body.currentStock,
                        }
                    ]
                }
            }
        }).then(() => {
            res.send({
                success: true
            })
        }).catch(err => {
            console.log(err)
            res.send({
                success: false
            })
        })
    }
})
