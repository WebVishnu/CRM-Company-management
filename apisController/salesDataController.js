const path = require("path");
const mongodb = require("mongodb").MongoClient;
const csvtojson = require("csvtojson");
const SData = require(path.join(__dirname, "../models/salesSchema/machineSalesSchema"));

const fs = require('fs');
// get all sale data
exports.getAllSalesData = async function (req, res) {
  try {
    allreportLength = await SData.find()
    res.send({
      success: true,
      salesData: await SData.find().limit(req.params.limit),
      totalReports:allreportLength.length
    })
  } catch (error) {
    res.send({
      success: false,
    });
  }
};

// get single sale data
exports.getSingleSalesData = async function (req, res) {
  try {
    res.send({
      success: true,
      saleData: await SData.findById(req.params.id)
    })
  } catch (error) {
    res.send({
      success: false,
    });
  }
};


// search sale data
exports.getSearchedSaleData = async function (req, res) {
  query = `${req.params.query}`
  try {
    const salesData = await SData.find({
      $or: [
        { "invoiceDate": { $regex: query, $options: 'i' } },
        { "invoiceNum": { $regex: query, $options: 'i' } },
        { "reportNumber": { $regex: query, $options: 'i' } },
        { "customerName": { $regex: query, $options: 'i' } },
        { "address": { $regex: query, $options: 'i' } },
        { "warranty": { $regex: query, $options: 'i' } },
        { "machines.machineName": { $regex: query, $options: 'i' } },
        { "machines.machineNum": { $regex: query, $options: 'i' } },
        { "machines.password": { $regex: query, $options: 'i' } },
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
exports.editSalesDataAdmin = async function (req, res) {
  try {
    const salesData = {
      invoiceNum: req.body.invoiceNum,
      customerName: req.body.customerName,
      address: req.body.address,
      mobileNum: req.body.mobileNum,
      warranty: req.body.warranty,
      machines:req.body.machines
    }
    await SData.findOneAndUpdate({ _id: req.params.id }, salesData)
    const report = await SData.findOne({ _id: req.params.id })
    res.send({
      success: true,
      report
    })
  } catch (error) {
    res.send({
      success: false,
      error
    });
  }
}


// get service report number
exports.getSaleReportNumber = async (req, res) => {
  const data = await SData.find()
  res.send({ success: true, reportNumber: data.length })
}

// save bulk sale data
exports.addBulkSalesDataAdmin = async function (req, res) {
  const data = await SData.find()
  await csvtojson().fromFile(req.file.path).then(source => {
    // Fetching the all data from each row
    arrayToInsert = []
    for (var i = 0, reportNumber = data.length + 1; i < source.length; i++, reportNumber++) {
      var singleRow = {
        reportNumber: pad(reportNumber, 3),
        invoiceDate: source[i]["invoiceDate"],
        machineName: source[i]["machineName"],
        machineNum: source[i]["machineNum"],
        barCode: source[i]["barCode"],
        customerName: source[i]["customerName"],
        address: source[i]["address"],
        mobileNum: source[i]["mobileNum"],
        status: source[i]["status"],
      };
      arrayToInsert.push(singleRow);
    }
    // inserting into the table student
    // return arrayToInsert
    mongodb.connect(
      process.env.DB_URL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (err) throw err;
        client
          .db("VitcoDatabase")
          .collection("sales datas")
          .insertMany(arrayToInsert, (err, res) => {
            if (err) throw err;
            client.close();
          });
      }
    );
    fs.unlinkSync(req.file.path)
    res.send({
      success: true,
    })
  });
}



function pad(n, length) {
  var len = length - ('' + n).length;
  return (len > 0 ? new Array(++len).join('0') : '') + n
}




