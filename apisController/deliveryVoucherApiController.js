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
      voucherNum:pad(allVouchers.length + 1 , 3),
      orderDate: req.body.orderDate,
      consignee: req.body.consignee,
      consigneeMobile: req.body.consigneeMobile,
      consigneeAddress: req.body.consigneeAddress,
      gstInNum: req.body.gstInNum,
      panNumORaadharNum: req.body.panNumORaadharNum,
      dispatchedBy: req.body.dispatchedBy,
      products:req.body.products,
      advancePayment:req.body.advancePayment,
      advancePaymentReceived:req.body.advancePaymentReceived,
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





// functions 
function pad(n, length) {
  var len = length - ('' + n).length;
  return (len > 0 ? new Array(++len).join('0') : '') + n
}