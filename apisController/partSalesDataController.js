const path = require("path");
const partSData = require(path.join(__dirname, "../models/salesSchema/partSalesSchema"));

// get all sale data
exports.getAllPartSalesData = async function (req, res) {
  try {
    allreportLength = await partSData.find()
    res.send({
      success: true,
      salesData: await partSData.find().limit(req.params.limit),
      totalReports: allreportLength.length
    })
  } catch (error) {
    res.send({
      success: false,
    });
  }
};


// get single sale data
exports.getSinglePartSalesData = async function (req, res) {
  try {
    res.send({
      success: true,
      saleData: await partSData.findById(req.params.id)
    })
  } catch (error) {
    res.send({
      success: false,
    });
  }
};


// search sale data
exports.getSearchedPartSaleData = async function (req, res) {
  query = `${req.params.query.replaceAll("-","/")}`
  try {
    const salesData = await partSData.find({
      $or: [
        { "createdBy.adminName": { $regex: query, $options: 'i' } },
        { "invoiceDate": { $regex: query, $options: 'i' } },
        { "invoiceNum": { $regex: query, $options: 'i' } },
        { "reportNumber": { $regex: query, $options: 'i' } },
        { "customerName": { $regex: query, $options: 'i' } },
        { "mobileNum": { $regex: query, $options: 'i' } },
        { "address": { $regex: query, $options: 'i' } },
        { "parts.partName": { $regex: query, $options: 'i' } },
        { "parts.partNumber": { $regex: query, $options: 'i' } },
      ]
    })
    res.send({
      success: true,
      salesData: salesData
    })
  } catch (error) {
    res.send({
      success: false,
    });
  }
}


// Edit sales Data
exports.editPartSalesDataAdmin = async function (req, res) {
  try {
    await partSData.findOneAndUpdate({ _id: req.params.id }, {
      invoiceNum: req.body.invoiceNum,
      customerName: req.body.customerName,
      address: req.body.address,
      mobileNum: req.body.mobileNum,
      parts: req.body.parts
    }).catch(err => {
      console.log(err)
      throw "error"
    })
    res.send({
      success: true,
      report:await partSData.findById({ _id: req.params.id })
    })
    
  } catch (error) {
    res.send({
      success: false,
      error
    });
  }
}

// Edit sales Data
exports.getPartSalesReportNumber = async function (req, res) {
  try {
    reports = await partSData.find()
    res.send({
      success: true,
      reportNumber: reports.length
    })
  } catch (error) {
    res.send({
      success: false,
      error
    });
  }
}


// create new parts sales data
exports.createNewPartSales = async () => {
  try {
    const admin = await Admin.find({ _id: adminToken.uID })
    const data = await partSalesData.find()
    await partSalesData.create({
      createdBy: {
        adminName: admin[0].adminName,
        adminID: admin[0]._id
      },
      reportNumber: pad(data.length, 3),
      invoiceDate: req.body.invoiceDate,
      invoiceNum: req.body.invoiceNum,
      customerName: req.body.customerName,
      address: req.body.address,
      mobileNum: req.body.mobileNum,
      warranty: req.body.warranty,
      parts: req.body.parts

    })
    res.send({
      success: true,
    })
  } catch (error) {
    res.send({
      success: false,
    })
  }
}