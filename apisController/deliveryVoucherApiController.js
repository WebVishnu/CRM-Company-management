const path = require("path");
const Admin = require(path.join(__dirname, "../models/adminSchema"));
const DOVoucher = require(path.join(__dirname, "../models/vouchers/deliveryOrderSchema"));

// get admin details
exports.createNewDO = async function (req, res) {
  try {
    console.log(req.body)
    res.send({
      body:req.body,
      success: true,
    });
  } catch (error) {
    res.send({
        success: false,
      });
  }
};
