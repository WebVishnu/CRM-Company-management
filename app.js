const cookies = require("cookie-parser");
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const compression = require('compression');

app.use(cookies());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

const shouldCompress = (req, res) => {
    if (req.headers['x-no-compression']) {
        // Will not compress responses, if this header is present
        return false;
    }
    // Resort to standard compression
    return compression.filter(req, res);
};

app.use(compression({
    // filter: Decide if the answer should be compressed or not,
    // depending on the 'shouldCompress' function above
    filter: shouldCompress,
    // threshold: It is the byte threshold for the response 
    // body size before considering compression, the default is 1 kB
    threshold: 0
}));

const errorHandlerMiddleware = require(path.join(__dirname, '/middlewares/error'))
app.use(errorHandlerMiddleware)
// routes
const userRoute = require(path.join(__dirname, '/router/userRoutes'))
const complaintRoute = require(path.join(__dirname, '/router/complaintRoutes'))
const adminRoute = require(path.join(__dirname, '/router/adminRoutes'))
const adminComplaintRoute = require(path.join(__dirname, '/router/adminComplaintRoutes'))
const serviceReports = require(path.join(__dirname, '/router/adminServiceReportRoutes'))
const salesReportsRoute = require(path.join(__dirname, '/router/adminSalesRoutes'))
const adminVouchersRoute = require(path.join(__dirname, '/router/adminVoucherRoutes'))


// file paths
const staticPath = path.join(__dirname, '/public')
const templatePath = path.join(__dirname, '/templates/views')
const partialsPath = path.join(__dirname, 'templates/partials')
// api
const complaintApiRoute = require(path.join(__dirname, '/apis/complaintApi'))
const controlAdminsApiRoute = require(path.join(__dirname, '/apis/controlAdmins'))
const serviceReportApi = require(path.join(__dirname, '/apis/serviceReportApi'))
const machineSalesDataApi = require(path.join(__dirname, '/apis/machineSalesDataApi'))
const partSalesDataApi = require(path.join(__dirname, '/apis/partSalesDataApi'))
const notificationsApi = require(path.join(__dirname, '/apis/notificationsApi'))
const deliveryOrderApi = require(path.join(__dirname, '/apis/deliveryVoucherApi'))

//api use
app.use(complaintApiRoute)
app.use(controlAdminsApiRoute)
app.use(serviceReportApi)
app.use(adminComplaintRoute)
app.use(machineSalesDataApi)
app.use(partSalesDataApi)
app.use(notificationsApi)
app.use(deliveryOrderApi)

// routes use
app.use(userRoute)
app.use(complaintRoute)
app.use(adminRoute)
app.use(serviceReports)
app.use(salesReportsRoute)
app.use(adminVouchersRoute)

// SETTING VIEW ENGINE
app.set('view engine', 'hbs')
app.set('views', templatePath)

// REGISTERING PARTIALS
hbs.registerPartials(partialsPath)

// STATIC PATH
app.use(express.static(staticPath))
app.use((req, res) => {
    res.render('errors/404')
})





module.exports = app;