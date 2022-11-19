const path = require('path');
const catchAsyncErrors = require(path.join(__dirname, "/catchAsyncErrors"));
const ErrorHandler = require(path.join(__dirname, "../utils/errorHandler"));
const jwt = require('jsonwebtoken');
const { resolve } = require('path');
const User = require(path.join(__dirname, "../models/userSchema"));
const Admin = require(path.join(__dirname, "../models/adminSchema"));
const warehouse = require(path.join(__dirname, "../models/inventory/warehouseSchema.js"));

exports.isAuthenticatedUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token.token, process.env.JWT_SECRET, async function (err, decoded) {
      if (err) {
        throw false;
      } else {
        req.user = await User.find({ id: token.uID })
        throw true;
      }
    });
  }
  else {
    return false;
  }
};
// search through an array
function searchPermissionObj(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].permissionName == nameKey) {
      return myArray[i];
    }
  }
}
//
function searchPermissionKeyObj(nameKey, myArray) {
  AllPermissions = []
  for (var i = 0; i < nameKey[0].length; i++) {
    for (var j = 0; j < myArray.length; j++) {
      if (myArray[j].keyName == nameKey[0][i]) {
        AllPermissions.push(myArray[j])
      }
    }
  }
  return AllPermissions;
}
// authorize the admins to access pages
exports.authorizedRoles = async (Pname, req, res, next, ...roles) => {
  adminPermissionKeys = []
  isAllowed = false
  const { adminToken } = req.cookies;
  if (adminToken) {
    result = await jwt.verify(
      adminToken.token,
      process.env.JWT_SECRET_ADMIN,
      async function (err, decoded) {
        if (err) {
          console.log(err)
        } else {
          if (adminToken.role[0].roleName != "admin") { // if it it not all
            const admin = await Admin.findById(adminToken.uID)
            let permission = await searchPermissionObj(Pname, admin.permissions)
            if (permission) {
              Pkey = await searchPermissionKeyObj(roles, permission.permissionKeys)
              if (Pkey.length > 0) {
                isAllowed = true
              }
            }
          } else {
            isAllowed = true
          }
        }
        return isAllowed
      }
    );
    return result
  }
}



// authorize the admins to access pages
exports.isAuthenticatedWarehouse = async (req, warehouseID) => {
  const { adminToken } = req.cookies;
  if (adminToken) {
    result = await jwt.verify(
      adminToken.token,
      process.env.JWT_SECRET_ADMIN,
      async function (err, decoded) {
        if (err) {
          console.log(err)
          return { success: false }
        } else {
          wareHouse = await warehouse.findOne({ _id: warehouseID })
          const admin = await Admin.findById(adminToken.uID)
          
          if (adminToken.role[0].roleName != "admin") { // if it it not all
            return { success: wareHouse.permissions.includes(admin._id), admin, wareHouse }
          } else {
            return { success: true, admin, wareHouse }
          }
        }
      }
    );
    return result
  }
}