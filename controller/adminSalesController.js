const path = require("path");
const Handlebars = require("hbs");
const jwt = require("jsonwebtoken");
const Admin = require(path.join(__dirname, "../models/adminSchema"));
const salesData = require(path.join(__dirname, "../models/salesSchema/machineSalesSchema"));
const partSalesData = require(path.join(__dirname, "../models/salesSchema/partSalesSchema"));


Handlebars.registerHelper('convert', function (date) {
    if (!date) {
        return;
    }
    return JSON.stringify(date);
});



// ============================= ========================================= ====================================================
// ============================= ========================================= ====================================================
// ============================= ========================================= ====================================================
//                                                 MACHINE
// ============================= ========================================= ====================================================
// ============================= ========================================= ====================================================
// ============================= ========================================= ====================================================


// all sales data admin
exports.showAllSalesData = async (req, res) => {
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
                const sales_Data = await salesData.find()
                res.render('admin/salesData/salesData', { "admin": admin, "webHost": req.headers.host, "protocol": req.headers.host, "salesData": sales_Data })
            }
        });
    }
    else {
        res.redirect('/vitco-india/admin/login')

    }
}


// add new sales report 
exports.addNewSalesReport = async function (req, res) {
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
                res.render('admin/salesData/addNew', { "admin": admin, "webHost": req.headers.host, "protocol": req.headers.host })
            }
        });
    }
    else {
        res.redirect('/vitco-india/admin/login')
    }
}

// upload new sales report page -- 
exports.addNewSalesReportPage = async function (req, res) {
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
                res.render('admin/salesData/addNew', { "admin": admin, "webHost": req.headers.host, "protocol": req.headers.host })
            }
        });
    }
    else {
        res.redirect('/vitco-india/admin/login')
    }
}



function pad(n, length) {
    var len = length - ('' + n).length;
    return (len > 0 ? new Array(++len).join('0') : '') + n
}

// upload new sales report
exports.addnewSaleReportForm = async function (req, res) {
    const { adminToken } = req.cookies;
    if (adminToken) {
        jwt.verify(adminToken.token, process.env.JWT_SECRET_ADMIN, async function (err, decoded) {
            if (err) {
                res.clearCookie("adminToken");
                res.send({
                    success: false
                })
            } else {
                const admin = await Admin.find({ _id: adminToken.uID })
                const data = await salesData.find()
                await salesData.create({
                    createdBy: {
                        adminName: admin[0].adminName,
                        adminID: admin[0]._id,
                    },
                    reportNumber: pad(data.length, 3),
                    invoiceDate: req.body.invoiceDate,
                    invoiceNum: req.body.invoiceNum,
                    customerName: req.body.customerName,
                    address: req.body.address,
                    mobileNum: req.body.mobileNum,
                    warranty: req.body.warranty,
                    machines: req.body.allMachines
                })
                res.send({
                    success: true
                })
            }
        });
    }
    else {
        res.send({
            success: false
        })
    }
}



// ============================= ========================================= ====================================================
// ============================= ========================================= ====================================================
// ============================= ========================================= ====================================================
//                                                 PARTS
// ============================= ========================================= ====================================================
// ============================= ========================================= ====================================================
// ============================= ========================================= ====================================================



// all sales data admin
exports.showAllPartsSalesData = async (req, res) => {
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
                const parts_sales_Data = await partSalesData.find()
                res.render('admin/salesData/parts/allSalesPart', { "admin": admin, "webHost": req.headers.host, "protocol": req.headers.host, "salesData": parts_sales_Data })
            }
        });
    }
    else {
        res.redirect('/vitco-india/admin/login')

    }
}



// upload new sales report
exports.addNewPartSalesData = async function (req, res) {
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
                res.render('admin/salesData/parts/addNewSalesPart', { "admin": admin, "webHost": req.headers.host, "protocol": req.headers.host })
            }
        });
    }
    else {
        res.redirect('/vitco-india/admin/login')
    }
}

// print sales report -- parts
exports.printPartSaleReport = async function (req, res) {
    try {
        const { adminToken } = req.cookies;
        const admin = await Admin.findById(adminToken.uID)
        let report;
        let option = req.params.category
        if(req.params.category == "parts"){
            report = await partSalesData.find({ _id: req.params.id })
        }else if(req.params.category == "machine"){
            report = await salesData.find({ _id: req.params.id })
        }else{
            report = []
        }
        res.render('admin/salesData/printSalesData/partSalesData', { admin,option, report, "webHost": req.headers.host, "protocol": req.headers.host })
    } catch (error) {
        console.log(error)
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
}

// upload new sales report
// exports.addNewPartSalesDataForm = async function (req, res) {
//     const { adminToken } = req.cookies;
//     if (adminToken) {
//         jwt.verify(adminToken.token, process.env.JWT_SECRET_ADMIN, async function (err, decoded) {
//             if (err) {
//                 res.clearCookie("adminToken");
//                 res.redirect("/vitco-india/admin/login");
//             } else {
//                 const admin = await Admin.find({ _id: adminToken.uID })
//                 const data = await partSalesData.find()
//                 console.log(req.body.parts)
//                 await partSalesData.create({
//                     createdBy: {
//                         adminName:admin[0].adminName,
//                         adminID:admin[0]._id
//                     },
//                     reportNumber: pad(data.length, 3),
//                     invoiceDate: req.body.invoiceDate,
//                     invoiceNum: req.body.invoiceNum,
//                     customerName: req.body.customerName,
//                     address: req.body.address,
//                     mobileNum: req.body.mobileNum,
//                     warranty: req.body.warranty,
//                     parts: req.body.parts

//                 })
//                 res.redirect('/vitco-impex/control/sales-report/machine/add-new')
//             }
//         });
//     }
//     else {
//         res.redirect('/vitco-india/admin/login')
//     }
// }