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
        createdOn: moment().format('L')
      },
      voucherNum: pad(allVouchers.length + 1, 3),
      orderDate: req.body.orderDate,
      dispatchDate: req.body.dispatchDate,
      receiverName: req.body.receiverName,
      representativeName: req.body.representativeName,
      consignee: req.body.consignee,
      consigneeMobile: req.body.consigneeMobile,
      consigneeAddress: req.body.consigneeAddress,
      gstInNum: req.body.gstInNum,
      panNum: req.body.panNum,
      aadharNum: req.body.aadharNum,
      specialInstructions: req.body.specialInstructions,
      products: req.body.products,
      advancePaymentReceived: req.body.advancePaymentReceived,
      advancePayment: req.body.advancePayment,
      paymentModeDetails: req.body.paymentModeDetails,
      dispatchDetails: {
        dispatchedBy: req.body.dispatchedBy,
        dispatchVehicleNum: req.body.dispatchVehicleNum,
        machineSrNum: req.body.machineSrNum,
        invoiceNum: req.body.invoiceNum,
        invoiceDate: req.body.invoiceDate,
        remark: req.body.remark,
      }
    }).catch((e) => {
      throw "error"
    }).then(()=>{
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





// functions 
function pad(n, length) {
  var len = length - ('' + n).length;
  return (len > 0 ? new Array(++len).join('0') : '') + n
}