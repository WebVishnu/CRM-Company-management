const path = require('path');
const Complaint = require(path.join(__dirname, '../models/complaintSchema'))
const Handlebars = require('hbs')
const jwt = require('jsonwebtoken');
const Admin = require(path.join(__dirname, "../models/adminSchema"));
const ServiceReport = require(path.join(__dirname, '../models/machineServiceReportSchema'))
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



function getTime() {
    let date_ob = new Date();
    return date_ob.getHours() + ":" + date_ob.getMinutes() + ":" + date_ob.getSeconds();
}
function getDate() {
    let date_ob = new Date();
    return date_ob.getDate() + "-" + date_ob.getMonth() + "-" + date_ob.getFullYear();
}

// admin login -- get req
exports.adminAllServiceReport = catchAsyncErrors(async (req, res, next) => {
    const { adminToken } = req.cookies;

    if (adminToken) {
        jwt.verify(adminToken.token, process.env.JWT_SECRET_ADMIN, async function (err, decoded) {
            if (err) {
                res.clearCookie("adminToken");
                res.redirect(
                    "/vitco-india/admin/login"
                );
            } else {
                // var url = process.env.BASE_DB_URL;
                // MongoClient.connect(url).then((client) => {
  
                //     console.log('Database created');
                      
                //     // database name
                //     const db = client.db("nishu");
                      
                //     // collection name
                //     db.createCollection("nishu1");
                // })
                const admin = await Admin.findById(adminToken.uID)
                const reports = await ServiceReport.find()
                if (reports.length == 0) {
                    res.render('admin1/serviceReports/serviceReport', { "admin": admin })
                }
                else {
                    res.render('admin/serviceReports/serviceReport', {
                        "admin": admin,
                        "reports": reports
                    })
                }
            }
        });
    }
    else {
        res.redirect('/vitco-india/admin/login')

    }
})



// add new ServiceReport -- get req
exports.addNewServiceReport = catchAsyncErrors(async (req, res, next) => {
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
                res.render('admin/serviceReports/addNewReport', { "admin": admin, "host": req.headers.host, "protocol": req.protocol })
            }
        });
    }
    else {
        res.redirect('/vitco-india/admin/login')

    }
})


function pad(n, length) {
    var len = length - ('' + n).length;
    return (len > 0 ? new Array(++len).join('0') : '') + n
}

// Post Service Report -- post 
exports.PostServiceReport = catchAsyncErrors(async (req, res, next) => {
    const { adminToken } = req.cookies;
    if (adminToken) {
        jwt.verify(adminToken.token, process.env.JWT_SECRET_ADMIN, async function (err, decoded) {
            if (err) {
                res.clearCookie("adminToken");
                res.redirect(
                    "/vitco-india/admin/login"
                );
            } else {
                const admin = await Admin.find({ _id: adminToken.uID })
                const tempReport = await ServiceReport.find()
                await ServiceReport.create({
                    createdBy: {
                        name: admin[0].adminName,
                        adminId: admin[0]._id
                    },
                    reportNumber: `${await pad(tempReport.length, 3)}`,
                    date: req.body.formData.date,
                    time: req.body.formData.time,
                    customerName: req.body.formData.customerName.replaceAll("'", ""),
                    mobile: req.body.formData.mobile.replaceAll("'", ""),
                    technicianName: req.body.formData.technicianName.replaceAll("'", ""),
                    attendingLocation: req.body.formData.attendingLocation.replaceAll("'", ""),
                    address: req.body.formData.address.replace(/(\r\n|\n|\r)/gm, "").replaceAll("'", ""),
                    customerSignImgDataUrl: req.body.formData.customerSignImgDataUrl,
                    technicianSignImgDataUrl: req.body.formData.technicianSignImgDataUrl,
                    service: req.body.allMachines
                })
                res.redirect('/vitco-india/control/service-reports/new-form')
            }
        });
    }
    else {
        res.redirect('/vitco-india/admin/login')

    }
})


// print report
exports.printServiceReport = catchAsyncErrors(async (req, res, next) => {
    const { adminToken } = req.cookies;
    if (adminToken) {
        jwt.verify(adminToken.token, process.env.JWT_SECRET_ADMIN, async function (err, decoded) {
            if (err) {
                res.clearCookie("adminToken");
                res.redirect(
                    "/vitco-india/admin/login"
                );
            } else {
                const serviceReport = await ServiceReport.find({ _id: req.params.id })
                res.render("admin/serviceReports/printServiceReport", { report: serviceReport, length: serviceReport[0].service.length, reportID: `${serviceReport[0].id}` })
            }
        });
    }
    else {
        res.redirect('/vitco-india/admin/login')

    }
})