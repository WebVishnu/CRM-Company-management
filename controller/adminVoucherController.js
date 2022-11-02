const path = require('path');
const Handlebars = require('hbs')
const jwt = require('jsonwebtoken');
const Admin = require(path.join(__dirname, "../models/adminSchema"));
const catchAsyncErrors = require(path.join(__dirname, "../middlewares/catchAsyncErrors"));


Handlebars.registerHelper("inc", function (value, options) {
    return parseInt(value) + 1;
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


exports.viewVouchers = catchAsyncErrors(async (req, res, next) => {
    const { adminToken } = req.cookies;
    if (adminToken) {
        jwt.verify(adminToken.token, process.env.JWT_SECRET_ADMIN, async function (err, decoded) {
            if (err) {
                res.clearCookie("adminToken");
                res.redirect(
                    "/vitco-india/admin/login"
                );
            } else {
                const admin = await Admin.findById(adminToken.uID)
                res.render('admin/vouchers/viewVouchers', { "admin": admin, "webHost": req.headers.host, "protocol": req.headers.host})
            }
        });
    }
    else {
        res.redirect('/vitco-india/admin/login')

    }
})

