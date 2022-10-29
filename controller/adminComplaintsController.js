const path = require('path');
const Complaint = require(path.join(__dirname, '../models/complaintSchema'))
const Handlebars = require('hbs')
const jwt = require('jsonwebtoken');
const User = require(path.join(__dirname, "../models/userSchema"));
const Admin = require(path.join(__dirname, "../models/adminSchema"));
const bcrypt = require("bcryptjs");

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

  
exports.adminAllComplaints = async (req, res, next) => {
    const { adminToken } = req.cookies;
    if (adminToken) {
        jwt.verify(adminToken.token,process.env.JWT_SECRET_ADMIN, async function(err, decoded) {      
            if (err) {
              res.clearCookie("adminToken");
              res.redirect(
                "/vitco-india/admin/login"
              );
            } else {
                const admin = await Admin.findById(adminToken.uID)
                res.render('admin/complaints/complaints',{"admin":admin,"host":req.headers.host,"protocol":req.headers.host})
          }
        });
    }
    else{
        res.redirect("/vitco-india/admin/login")
    }
}   