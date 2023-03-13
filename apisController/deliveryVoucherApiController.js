const path = require("path");
const Admin = require(path.join(__dirname, "../models/adminSchema"));
const DOVoucher = require(path.join(__dirname, "../models/vouchers/deliveryOrderSchema"));
const moment = require("moment");
const mongoose = require("mongoose");
// get admin details
exports.createNewDO = async function (req, res) {
  try {
    const { adminToken } = req.cookies;
    const admin = await Admin.findById(adminToken.uID);
    allVouchers = await DOVoucher.find()
    await DOVoucher.create({
      createdBy: {
        adminName: admin.adminName,
        adminID: admin._id,
        createdOn: moment().format('DD/MM/YYYY')
      },
      voucherNum: pad(allVouchers.length + 1, 3),
      orderDate: req.body.orderDate,
      consignee: req.body.consignee,
      consigneeMobile: req.body.consigneeMobile,
      consigneeAddress: req.body.consigneeAddress,
      gstInNum: req.body.gstInNum,
      panNumORaadharNum: req.body.panNumORaadharNum,
      dispatchedBy: req.body.dispatchedBy,
      products: req.body.products,
      advancePayment: req.body.advancePayment,
      advancePaymentReceived: req.body.advancePaymentReceived,
      signatures: {
        admin: req.body.adminSignaturePad,
        receiver: req.body.receivedBySignaturePad
      }
    }).catch((e) => {
      console.log(e)
      throw "error"
    }).then((response) => {
      res.send({
        success: true,
        id: response._id
      });
    })
  } catch (error) {
    res.send({
      success: false,
    });
  }
};

// filter out delivery orders
exports.filterDO = async function (req, res) {
  try {
    const { adminToken } = req.cookies;
    const admin = await Admin.findById(adminToken.uID)
    if (req.params.filter === "all") {

      res.send({
        success: true,
        vouchers: await DOVoucher.find().skip(req.params.from).limit(req.params.to).select("-signatures.admin").select("-signatures.receiver").catch((e) => { throw e })
      })
    } else if (req.params.filter === "admin") {
      Rvouchers = await DOVoucher.find({ 'createdBy.adminID': admin._id }).select("-signatures.admin").select("-signatures.receiver").catch((e) => { throw e })
      from = Rvouchers.length - (parseInt(req.params.to) - parseInt(req.params.from))
      res.send({
        success: true,
        vouchers: Rvouchers.slice((from > 20) ? from : 0, Rvouchers.length)
      })
    } else if (req.params.filter.includes("query=")) {
      query = req.params.filter.replace('query=', "").replaceAll("-", "/")
      res.send({
        success: true,
        vouchers: await DOVoucher.find({
          $or: [
            { "createdBy.adminName": { $regex: `${query}`, $options: 'i' } },
            { "voucherNum": { $regex: `${query}`, $options: 'i' } },
            { "orderDate": { $regex: `${query}`, $options: 'i' } },
            { "consignee": { $regex: `${query}`, $options: 'i' } },
            { "consigneeMobile": { $regex: `${query}`, $options: 'i' } },
            { "products.productName": { $regex: `${query}`, $options: 'i' } },
          ]
        }).catch((e) => { throw e })
      })
    }
  } catch (e) {
    console.log(e)
    res.send({ success: false });
  }
};

// dispatch delivery orders
exports.dispatchDO = async function (req, res) {
  try {
    const { adminToken } = req.cookies;
    const admin = await Admin.findById(adminToken.uID)
    await DOVoucher.updateOne({ _id: req.body.DOid }, {
      dispatchDetails: {
        adminDetails: {
          adminName: admin.adminName,
          adminID: admin._id,
          createdOn: moment().format('DD/MM/YYYY')
        },
        dispatchedBy: req.body.dispatchedBy,
        dispatchDate: req.body.dispatchDate,
        dispatchVehicleNum: req.body.dispatchVehicleNum,
        transporterID: req.body.transporterID,
        dispatchStatus: "Dispatched"
      }
    }).then(async () => {
      res.send({
        success: true,
        voucher: await DOVoucher.findOne({ _id: req.body.DOid })
      });
    }).catch((e) => {
      throw e
    })
  } catch (e) {
    console.log(e)
    res.send({ success: false });
  }
};


// add after payments
exports.addAfterPayments = async function (req, res) {
  try {
    await DOVoucher.updateOne({ _id: req.body.DOid }, {
      advancePaymentReceived: true,
      $push: {
        advancePayment: req.body.payments
      }
    }).then(async () => {
      res.send({
        success: true,
        voucher: await DOVoucher.findOne({ _id: req.body.DOid })
      });
    }).catch((e) => {
      throw e
    })
  } catch (e) {
    console.log(e)
    res.send({ success: false });
  }
};

// edit Delivery order
exports.Edit_DO = async function (req, res) {
  try {
    let updatedProducts = await DOVoucher.aggregate([{ $match: { _id: new mongoose.Types.ObjectId(req.body.id) } },
    {
      $set: {
        products: {
          $map: {
            input: { $range: [0, req.body.products.length] },
            as: "i",
            in: {
              $mergeObjects: [
                { $arrayElemAt: ["$products", "$$i"] },
                {
                  $arrayElemAt: [req.body.products, "$$i"]
                },
              ]
            }
          }
        }
      }
    }])
    await DOVoucher.updateOne({ _id: req.body.id }, {
      orderDate: req.body.orderDate,
      consignee: req.body.consignee,
      consigneeMobile: req.body.consigneeMobile,
      consigneeAddress: req.body.consigneeAddress,
      gstInNum: req.body.gstInNum,
      panNumORaadharNum: req.body.panNumORaadharNum,
      products: updatedProducts[0].products
    }).then(async (response) => {
      res.send({
        success: true,
        voucher: await DOVoucher.findOne({ _id: req.body.id })
      })
    })
  } catch (e) {
    console.log(e)
    res.send({ success: false });
  }
};


// get details
exports.getDetails = async function (req, res) {
  try {
    let result = await DOVoucher.find({
      consignee: { $regex: req.params.value, $options: "sim" }
    }, {
      consignee: 1, consigneeMobile: 1, consigneeAddress: 1
    })
    res.send({
      success: true,
      result
    });
  } catch (e) {
    console.log(e)
    res.send({ success: false });
  }
};

// functions 
function pad(n, length) {
  var len = length - ('' + n).length;
  return (len > 0 ? new Array(++len).join('0') : '') + n
}