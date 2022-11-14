const path = require("path");
const Admin = require(path.join(__dirname, "../models/adminSchema"));
const qrCodeLayout = require(path.join(__dirname, "../models/qrCode/qrCodeLayouts"));
const qrCode = require(path.join(__dirname, "../models/qrCode/qrCodeSchema"));
const moment = require("moment");
// get all sale data
exports.createNewLayout = async function (req, res) {
  try {
    await qrCodeLayout.create(req.body)
    res.send({
      success: true,
      layouts: await qrCodeLayout.find()
    });
  } catch (error) {
    res.send({
      success: false,
    });
  }
};


// create new qr code
exports.createNewQrCode = async function (req, res) {
  try {
    const { adminToken } = req.cookies;
    const admin = await Admin.findById(adminToken.uID)
    await qrCode.create({
      createdBy: {
        adminName: admin.adminName,
        adminID: admin._id,
        createdOn: moment().format('DD/MM/YYYY')
      },
      title: req.body.title,
      fields: req.body.fields
    }).then((r) => {
      res.send({
        success: true,
        id: r._id
      });
    }).catch((e) => {
      console.log(e)
      throw e
    })
  } catch (error) {
    res.send({
      success: false,
      error
    });
  }
};


// update qr code

exports.updateQrCode = async function (req, res) {
  try {
    await qrCode.updateOne({ _id: req.params.id }, { fields: req.body })
      .then(() => {
        res.redirect(`/vitco-impex/qr-code/get-info/${req.params.id}`)
      }).catch((e) => {
        console.log(e)
        res.send("Sorry we found some error")
      })
  } catch (error) {
    res.send({
      success: false,
      error
    });
  }
};