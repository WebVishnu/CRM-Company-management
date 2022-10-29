const path = require("path");
const jwt = require("jsonwebtoken");
const Admin = require(path.join(__dirname, "../models/adminSchema"));
const moment = require("moment");



// get all notifications admin
exports.getAllNotifications = async (req, res) => {
  const { adminToken } = req.cookies;
  if (adminToken) {
    jwt.verify(
      adminToken.token,
      process.env.JWT_SECRET_ADMIN,
      async function (err, decoded) {
        if (err) {
          res.send({
            success: false
          });
        } else {
          const admin = await Admin.find({ _id: req.params.adminID })
          await Admin.updateOne({ _id: admin[0]._id }, { notificationNumber: 0 })
          res.send({
            success: true,
            notifications: admin[0].notifications
          })
        }
      }
    );
  } else {
    res.send({
      success: false
    });
  }
}



//update admin profiel
exports.sendNotificationsAdmin = async (req, res) => {
  const { adminToken } = req.cookies;
  if (adminToken) {
    jwt.verify(
      adminToken.token,
      process.env.JWT_SECRET_ADMIN,
      async function (err, decoded) {
        if (err) {
          res.send({
            success: false
          });
        } else {
          const admin = await Admin.find({ _id: adminToken.uID })
          if (req.params.admin == "vitcoAdmin") {
            admin.findOneAndUpdate
            await Admin.updateOne({ userName: "@vitco-admin9011" }, {
              $inc: { 'notificationNumber': 1 },
              $push: {
                notifications: {
                  $each: [
                    {
                      notificationTitle: req.body.title,
                      profilePhoto: admin[0].profilePhoto,
                      adminID: adminToken.uID,
                      adminName: admin[0].adminName,
                      time: moment().format('L'),
                      message: req.body.message
                    }
                  ]
                }
              }
            });
          } else {
            await Admin.updateOne({ _id: req.params.admin }, {
              $inc: { 'notificationNumber': 1 },
              $push: {
                notifications: {
                  $each: [
                    {
                      notificationTitle: req.body.title,
                      profilePhoto: admin[0].profilePhoto,
                      adminID: adminToken.uID,
                      adminName: admin[0].adminName,
                      time: moment().format('L'),
                      message: req.body.message
                    }
                  ]
                }
              }
            });
          }
          res.send({
            success: true,
          });
        }
      }
    );
  } else {
    res.send({
      success: false
    });
  }
}


// delete notification 
exports.deleteNotification = async (req, res) => {
  const { adminToken } = req.cookies;
  if (adminToken) {
    jwt.verify(
      adminToken.token,
      process.env.JWT_SECRET_ADMIN,
      async function (err, decoded) {
        if (err) {
          res.send({
            success: false
          });
        } else {
          try{
            const admin = await Admin.find({ _id: adminToken.uID })
            await Admin.updateOne(
              { _id: admin[0]._id },
              { "$pull": { notifications: { _id: req.body.notificationID } } },
              { "multi": true })
              res.send({
                success: true,
              });
          }catch(error){
            res.send({
              success: false,
              errors:error
            });
          }
        }
      }
    );
  } else {
    res.send({
      success: false
    });
  }
}