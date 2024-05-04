const path = require("path");
const Complaint = require(path.join(__dirname, "../models/complaintSchema"));
const Handlebars = require("hbs");
const jwt = require("jsonwebtoken");
const Admin = require(path.join(__dirname, "../models/adminSchema"));
const ServiceReport = require(path.join(
  __dirname,
  "../models/machineServiceReportSchema"
));
const bcrypt = require("bcryptjs");
const { sendTokenAdmin } = require(path.join(__dirname, "../utils/jwtToken"));

Handlebars.registerHelper("ifCond", function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper("ifeq", function (a, b, options) {
  if (a == b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper("ifnoteq", function (a, b, options) {
  if (a != b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper("ifEqualsChained", function () {
  var options = arguments[arguments.length - 1];
  // Assuming that all wanted operator are '||'
  valueToTest = arguments[0];
  for (var i = 1; i < arguments.length - 1; i++) {
    if (valueToTest === arguments[i]) {
      return options.fn(this);
    }
  }
  return options.inverse(this);
});

async function clearUserToken(req, res) {
  const { cookies } = req;
  if ("token" in cookies) {
    res.clearCookie("token");
  }
}

// admin login -- get req
exports.adminLogin = async (req, res, next) => {
  const { adminToken } = req.cookies;
  // console.log(
  //   await Admin.create({
  //     adminName: "demo account",
  //     userName: "demo",
  //     password: "demo",
  //     role: { roleName: "admin" },
  //     permissions: [
  //       {
  //         permissionName: "all",
  //         permissionKeys: [
  //           { keyName: "view" },
  //           { keyName: "edit" },
  //           { keyName: "create" },
  //           { keyName: "delete" },
  //         ],
  //       },
  //     ],
  //   })
  // );
  if (adminToken) {
    clearUserToken(req, res);
    jwt.verify(
      adminToken.token,
      process.env.JWT_SECRET_ADMIN,
      function (err, decoded) {
        if (err) {
          res.clearCookie("adminToken");
          res.render("admin/login/login");
        } else {
          res.redirect("/vitco-india/control");
        }
      }
    );
  } else {
    res.render("admin/login/login");
  }
};

// admin login -- POST req
exports.adminLoginPost = async (req, res, next) => {
  const loginDetails = {
    userName: req.body.userName.trim(),
    password: req.body.password.trim(),
  };
  const adminUserDetails = await Admin.find({
    userName: loginDetails.userName,
  });
  if (adminUserDetails[0]) {
    if (await adminUserDetails[0].comparePassword(req.body.password)) {
      await sendTokenAdmin(adminUserDetails[0], 201, res);
    } else {
      res.render("admin/login/login", { error: "Wrong Details" });
    }
  } else {
    res.render("admin/login/login", { error: "Wrong Details" });
  }
};

// add - delete - edit ADMINS
exports.adminNotificationsPage = async (req, res, next) => {
  const { adminToken } = req.cookies;
  if (adminToken) {
    clearUserToken(req, res);
    jwt.verify(
      adminToken.token,
      process.env.JWT_SECRET_ADMIN,
      async function (err, decoded) {
        if (err) {
          res.clearCookie("adminToken");
          res.redirect("/vitco-india/admin/login");
        } else {
          const admin = await Admin.findById(adminToken.uID);
          res.render("admin/notifications/notifications", {
            admin: admin,
          });
        }
      }
    );
  } else {
    res.redirect("/vitco-india/admin/login");
  }
};

// admin dashboard -- HOMEPAGE
exports.adminControlPanel = async (req, res, next) => {
  const { adminToken } = req.cookies;
  console.log("Admin Token " + adminToken.token);
  console.log("ENV Token " + process.env.JWT_SECRET_ADMIN);

  if (adminToken) {
    clearUserToken(req, res);
    jwt.verify(
      adminToken.token,
      process.env.JWT_SECRET_ADMIN,
      async function (err, decoded) {
        if (err) {
          console.log("Admin token is not verified and cleared");
          res.clearCookie("adminToken");
          res.redirect("/vitco-india/admin/login");
        } else {
          const admin = await Admin.findById(adminToken.uID);
          if (admin) {
            const serviceReports = await ServiceReport.find({
              "createdBy.adminId": admin._id,
            });
            res.render("admin/home/admin", {
              admin: admin,
              serviceReports: serviceReports.reverse().slice(0, 10),
              serviceReportsLength: serviceReports.length,
            });
          } else {
            res.clearCookie("adminToken");
            res.redirect("/vitco-india/admin/login");
          }
        }
      }
    );
  } else {
    res.redirect("/vitco-india/admin/login");
  }
};

// add - delete - edit ADMINS
exports.allAdminsControlPanel = async (req, res, next) => {
  const { adminToken } = req.cookies;
  if (adminToken) {
    clearUserToken(req, res);
    jwt.verify(
      adminToken.token,
      process.env.JWT_SECRET_ADMIN,
      async function (err, decoded) {
        if (err) {
          res.clearCookie("adminToken");
          res.redirect("/vitco-india/admin/login");
        } else {
          const admin = await Admin.findById(adminToken.uID);
          const allAdmins = await Admin.find().select("-profilePhoto");
          res.render("admin/controlAdmins/controlAdmins", {
            admin: admin,
            allAdmins: allAdmins,
            webHost: req.headers.host,
          });
        }
      }
    );
  } else {
    res.redirect("/vitco-india/admin/login");
  }
};
// create admin
exports.adminCreateNewAdmin = async (req, res, next) => {
  const { adminToken } = req.cookies;
  if (adminToken) {
    clearUserToken(req, res);
    jwt.verify(
      adminToken.token,
      process.env.JWT_SECRET_ADMIN,
      async function (err, decoded) {
        if (err) {
          res.clearCookie("adminToken");
          res.redirect("/vitco-india/admin/login");
        } else {
          adminDetails = {
            adminName: req.body.fullName.trim(),
            userName: req.body.userName.trim(),
            password: req.body.password.trim(),
            role: { roleName: req.body.roleName.trim() },
            permissions: [],
          };
          permissionNames = [
            "complaints",
            "machineSalesData",
            "partSalesData",
            "serviceReport",
            "vouchers",
            "deliveryOrderVoucher",
          ];
          for (let i = 0; i < permissionNames.length; i++) {
            if (req.body.permissionName.includes(permissionNames[i])) {
              const Per = {
                permissionName: permissionNames[i],
                permissionKeys: [
                  { keyName: "" },
                  { keyName: "" },
                  { keyName: "" },
                  { keyName: "" },
                ],
              };
              if (
                req.body.permissionName.includes(`view-${permissionNames[i]}`)
              ) {
                Per.permissionKeys[0].keyName = "view";
              }
              if (
                req.body.permissionName.includes(`edit-${permissionNames[i]}`)
              ) {
                Per.permissionKeys[1].keyName = "edit";
              }
              if (
                req.body.permissionName.includes(`create-${permissionNames[i]}`)
              ) {
                Per.permissionKeys[2].keyName = "create";
              }
              if (
                req.body.permissionName.includes(`delete-${permissionNames[i]}`)
              ) {
                Per.permissionKeys[3].keyName = "delete";
              }
              if (
                !(
                  Per.permissionKeys[0].keyName == "" &&
                  Per.permissionKeys[1].keyName == "" &&
                  Per.permissionKeys[2].keyName == "" &&
                  Per.permissionKeys[3].keyName == ""
                )
              ) {
                adminDetails.permissions.push(Per);
              }
            }
          }
          Admin.create(adminDetails);
          res.redirect("/vitco-india/control/admins");
        }
      }
    );
  } else {
    res.redirect("/vitco-india/admin/login");
  }
};

// edit Admin

exports.adminEditAdmin = async (req, res, next) => {
  const { adminToken } = req.cookies;
  if (adminToken) {
    clearUserToken(req, res);
    jwt.verify(
      adminToken.token,
      process.env.JWT_SECRET_ADMIN,
      async function (err, decoded) {
        if (err) {
          res.clearCookie("adminToken");
          res.redirect("/vitco-india/admin/login");
        } else {
          adminDetails = {
            adminName: req.body.fullName,
            userName: req.body.userName,
            role: { roleName: req.body.roleName },
            permissions: [],
          };
          permissionNames = [
            "complaints",
            "machineSalesData",
            "partSalesData",
            "serviceReport",
            "vouchers",
            "deliveryOrderVoucher",
          ];
          for (let i = 0; i < permissionNames.length; i++) {
            if (req.body.permissionName.includes(permissionNames[i])) {
              const Per = {
                permissionName: "",
                permissionKeys: [
                  { keyName: "" },
                  { keyName: "" },
                  { keyName: "" },
                  { keyName: "" },
                ],
              };
              Per.permissionName = permissionNames[i];
              if (
                req.body.permissionName.includes(`view-${permissionNames[i]}`)
              ) {
                Per.permissionKeys[0].keyName = "view";
              }
              if (
                req.body.permissionName.includes(`edit-${permissionNames[i]}`)
              ) {
                Per.permissionKeys[1].keyName = "edit";
              }
              if (
                req.body.permissionName.includes(`create-${permissionNames[i]}`)
              ) {
                Per.permissionKeys[2].keyName = "create";
              }
              if (
                req.body.permissionName.includes(`delete-${permissionNames[i]}`)
              ) {
                Per.permissionKeys[3].keyName = "delete";
              }
              if (
                !(
                  Per.permissionKeys[0].keyName == "" &&
                  Per.permissionKeys[1].keyName == "" &&
                  Per.permissionKeys[2].keyName == "" &&
                  Per.permissionKeys[3].keyName == ""
                )
              ) {
                adminDetails.permissions.push(Per);
              }
            }
          }
          await Admin.updateOne({ _id: req.body.adminID }, adminDetails);
          res.redirect("/vitco-india/control/admins");
        }
      }
    );
  } else {
    res.redirect("/vitco-india/admin/login");
  }
};

//update admin profile
exports.updateAdminProfile = async (req, res) => {
  const { adminToken } = req.cookies;
  if (adminToken) {
    clearUserToken(req, res);
    jwt.verify(
      adminToken.token,
      process.env.JWT_SECRET_ADMIN,
      async function (err, decoded) {
        if (err) {
          res.clearCookie("adminToken");
          res.redirect("/vitco-india/admin/login");
        } else {
          await Admin.updateOne(
            { _id: req.body.adminID },
            {
              adminName: req.body.adminName,
              profilePhoto: req.body.profilePhoto,
              email: req.body.email,
              phone: req.body.phone,
            }
          );
          res.redirect("/vitco-india/control");
        }
      }
    );
  } else {
    res.redirect("/vitco-india/admin/login");
  }
};

// change password admin
exports.changePasswordAdmin = async (req, res) => {
  const { adminToken } = req.cookies;
  if (adminToken) {
    clearUserToken(req, res);
    jwt.verify(
      adminToken.token,
      process.env.JWT_SECRET_ADMIN,
      async function (err, decoded) {
        if (err) {
          res.clearCookie("adminToken");
          res.redirect("/vitco-india/admin/login");
        } else {
          if (adminToken.role[0].roleName == "admin") {
            admin = await Admin.updateOne(
              { _id: req.body.adminID },
              {
                password: await bcrypt.hash(
                  req.body.newPassword.trim().toLowerCase(),
                  12
                ),
              }
            );
            res.redirect("/vitco-india/control/admins");
          } else {
            res.redirect("/vitco-india/admin/login");
          }
        }
      }
    );
  } else {
    res.redirect("/vitco-india/admin/login");
  }
};

exports.logOutAdmin = async (req, res, next) => {
  res.clearCookie("adminToken");
  res.redirect("/vitco-india/admin/login");
};
