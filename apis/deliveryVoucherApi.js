const express = require('express');
const router = express.Router();
const path = require('path');
const { createNewDO } = require(path.join(__dirname, '../apisController/deliveryVoucherApiController'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));
const DOVoucher = require(path.join(__dirname, "../models/vouchers/deliveryOrderSchema"));
const Admin = require(path.join(__dirname, "../models/adminSchema"));


// create new delivery voucher
router.post('/api/v1/vitco-impex/voucher/delivery-order/new', async (req, res, next) => {
    if (await authorizedRoles("deliveryOrderVoucher", req, res, next, ["create"])) { createNewDO(req, res) }
    else { res.send({ success: false }); }
})

// filter delivery vouchers
router.get('/api/v1/vitco-impex/filter/delivery-order/:filter', async (req, res, next) => {
    if (await authorizedRoles("deliveryOrderVoucher", req, res, next, ["view"])) {
        try {
            const { adminToken } = req.cookies;
            const admin = await Admin.findById(adminToken.uID)
            if (req.params.filter === "all") {
                res.send({
                    success: true,
                    vouchers: await DOVoucher.find().catch((e) => { throw e })
                })
            } else if (req.params.filter === "admin") {
                res.send({
                    success: true,
                    vouchers: await DOVoucher.find({ 'createdBy.adminID': admin._id }).catch((e) => { throw e })
                })
            } else if (req.params.filter.includes("query=")) {
                query = req.params.filter.replace('query=',"").replaceAll("-","/")
                console.log(query)
                res.send({
                    success: true,
                    vouchers:await DOVoucher.find({
                        $or: [
                            { "createdBy.adminName": { $regex: query, $options: 'i' } },
                            { "voucherNum": { $regex: query, $options: 'i' } },
                            { "orderDate": { $regex: query, $options: 'i' } },
                            { "dispatchDate": { $regex: query, $options: 'i' } },
                            { "receiverName": { $regex: query, $options: 'i' } },
                            { "representativeName": { $regex: query, $options: 'i' } },
                            { "consignee": { $regex: query, $options: 'i' } },
                            { "consigneeMobile": { $regex: query, $options: 'i' } },
                            { "products.productName": { $regex: query, $options: 'i' } },
                            { "dispatchDetails.dispatchedBy": { $regex: query, $options: 'i' } },
                            { "dispatchDetails.dispatchVehicleNum": { $regex: query, $options: 'i' } },
                            { "dispatchDetails.machineSrNum": { $regex: query, $options: 'i' } },
                            { "dispatchDetails.invoiceNum": { $regex: query, $options: 'i' } },
                            { "dispatchDetails.invoiceDate": { $regex: query, $options: 'i' } }
                        ]
                    }).catch((e) => { throw e })
                })
            }
        } catch (e) {
            console.log(e)
            res.send({ success: false });
        }
    }
    else { res.send({ success: false }); }
})
module.exports = router