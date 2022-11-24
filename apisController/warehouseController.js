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
    console.log(req.body)
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
                    rate: req.body.rate,
                    minimumStock: req.body.minimumStock,
                    unit: req.body.unit,
                    SKU: req.body.SKU
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
                            rate: req.body.rate,
                            minimumStock: req.body.minimumStock,
                            unit: req.body.unit,
                            SKU: req.body.SKU
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




// ADD STOCK
exports.addStock = catchAsyncErrors(async (req, res, next) => {
    const { adminToken } = req.cookies;
    const admin = await Admin.findById(adminToken.uID)
    temp = req.body.product.split(" >> ")
    cStock = `categories.${temp[3]}.products.${temp[2]}.currentStock`
    sHistory = `categories.${temp[3]}.products.${temp[2]}.stockHistory`
    await warehouse.updateOne({ _id: req.params.warehouseID }, {
        $inc: { [cStock]: req.body.quantity },
        $push: {
            [sHistory]: {
                createdBy: {
                    adminName: admin.adminName,
                    date: moment().format('DD/MM/YYYY'),
                    adminId: admin._id,
                },
                cmd: "+",
                quantity: req.body.quantity,
                productName: temp[0],
                unit: temp[4],
                description: req.body.description,
                productID: temp[1],
            }
        }
    }).then(() => {
        res.send({
            success: true,
        })
    }).catch(e => {
        console.log(e)
        res.send({
            success: false,
        })
    })
})



// REMOVE STOCK
exports.removeStock = catchAsyncErrors(async (req, res, next) => {
    const { adminToken } = req.cookies;
    const admin = await Admin.findById(adminToken.uID)
    temp = req.body.product.split(" >> ")
    cStock = `categories.${temp[3]}.products.${temp[2]}.currentStock`
    sHistory = `categories.${temp[3]}.products.${temp[2]}.stockHistory`
    wh = await warehouse.updateOne({ _id: req.params.warehouseID, [cStock]: { $gte: req.body.quantity } }, {
        $inc: { [cStock]: -req.body.quantity },
        $push: {
            [sHistory]: {
                createdBy: {
                    adminName: admin.adminName,
                    date: moment().format('DD/MM/YYYY'),
                    adminId: admin._id,
                },
                cmd: "-",
                quantity: req.body.quantity,
                productName: temp[0],
                unit: temp[4],
                description: req.body.description,
                productID: temp[1],
            }
        }
    }).then(data => {
        if (data.modifiedCount == 0) {
            throw "error"
        } else {
            res.send({
                success: true,
            })
        }

    }).catch(e => {
        console.log(e)
        res.send({
            success: false,
        })
    })
})
