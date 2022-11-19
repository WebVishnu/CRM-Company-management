const path = require("path");
const Admin = require(path.join(__dirname, "../models/adminSchema"));
const DOVoucher = require(path.join(__dirname, "../models/vouchers/deliveryOrderSchema"));
const moment = require("moment");

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
    }).catch((e) => {
      console.log(e)
      throw "error"
    }).then(() => {
      res.send({
        success: true,
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
        vouchers: await DOVoucher.find().catch((e) => { throw e })
      })
    } else if (req.params.filter === "admin") {
      res.send({
        success: true,
        vouchers: await DOVoucher.find({ 'createdBy.adminID': admin._id }).catch((e) => { throw e })
      })
    } else if (req.params.filter.includes("query=")) {
      query = req.params.filter.replace('query=', "").replaceAll("-", "/")
      res.send({
        success: true,
        vouchers: await DOVoucher.find({
          $or: [
            { "createdBy.adminName": { $regex: query, $options: 'i' } },
            { "voucherNum": { $regex: query, $options: 'i' } },
            { "orderDate": { $regex: query, $options: 'i' } },
            { "consignee": { $regex: query, $options: 'i' } },
            { "consigneeMobile": { $regex: query, $options: 'i' } },
            { "products.productName": { $regex: query, $options: 'i' } },
            { "dispatchDetails.dispatchedBy": { $regex: query, $options: 'i' } },
            { "dispatchDetails.dispatchVehicleNum": { $regex: query, $options: 'i' } },
            { "dispatchDetails.dispatchDate": { $regex: query, $options: 'i' } },
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



// functions 
function pad(n, length) {
  var len = length - ('' + n).length;
  return (len > 0 ? new Array(++len).join('0') : '') + n
}