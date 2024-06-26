const path = require("path");
const ServiceReport = require(path.join(
  __dirname,
  "../models/machineServiceReportSchema"
));
const catchAsyncErrors = require(path.join(
  __dirname,
  "../middlewares/catchAsyncErrors"
));
const Admin = require(path.join(__dirname, "../models/adminSchema"));

exports.getServiceReportNumber = catchAsyncErrors(async (req, res, next) => {
  data = await ServiceReport.find().select(
    "-customerSignImgDataUrl -technicianSignImgDataUrl"
  );
  res.send({
    success: true,
    reportNumber: data.length,
  });
});
// get machines of service report
exports.getAllServiceReportMachines = catchAsyncErrors(
  async (req, res, next) => {
    const skipValue = parseInt(req.params.from, 10);
    if (isNaN(skipValue) || skipValue < 0) {
      console.error("Invalid or negative skip value:", req.params.from);
      res.status(400).send("Invalid or negative skip value");
    } else {
      const reports = await ServiceReport.find()
        .skip(req.params.from)
        .limit(parseInt(req.params.to))
        .select("-customerSignImgDataUrl -technicianSignImgDataUrl");
      res.status(200).send({
        status: true,
        machines: reports,
      });
    }
  }
);

// add new service report
exports.addNewServiceReport = catchAsyncErrors(async (req, res, next) => {
  try {
    const { adminToken } = req.cookies;
    const admin = await Admin.find({ _id: adminToken.uID });
    const tempReport = await ServiceReport.find().select(
      "-customerSignImgDataUrl -technicianSignImgDataUrl"
    );
    await ServiceReport.create({
      createdBy: {
        name: admin[0].adminName,
        adminId: admin[0]._id,
      },
      reportNumber: `${await pad(tempReport.length, 3)}`,
      date: req.body.formData.date,
      time: req.body.formData.time,
      customerName: req.body.formData.customerName.replaceAll("'", ""),
      mobile: req.body.formData.mobile.replaceAll("'", ""),
      technicianName: req.body.formData.technicianName.replaceAll("'", ""),
      attendingLocation: req.body.formData.attendingLocation.replaceAll(
        "'",
        ""
      ),
      address: req.body.formData.address
        .replace(/(\r\n|\n|\r)/gm, "")
        .replaceAll("'", ""),
      customerSignImgDataUrl: req.body.formData.customerSignImgDataUrl,
      technicianSignImgDataUrl: req.body.formData.technicianSignImgDataUrl,
      service: req.body.allMachines,
    });
    res.send({
      success: true,
    });
  } catch (error) {
    console.log("This is add new service report error\n" + error);
    res.send({
      success: false,
    });
  }
});

// search service reports
exports.searchServiceReport = catchAsyncErrors(async (req, res, next) => {
  var query = req.params.query.toString();
  let reports = [];
  if (query.includes("cond:")) {
    searchingQuery = {};
    tempArray = [];
    req.body.forEach((element, i) => {
      if (element.name == "adv-search-combination-select") {
        tempArray.push(element.value);
      } else if (element.name == "adv-search-input-query") {
        tempArray.push(element.value);
      }
    });
    for (let i = 0; i < tempArray.length; i += 2) {
      if (tempArray[i] == "date") {
        searchingQuery["date"] = {
          $regex: `${tempArray[i + 1].split("/")[1]}/${
            tempArray[i + 1].split("/")[0]
          }/${tempArray[i + 1].split("/")[2]}`,
          $options: "i",
        };
      } else {
        searchingQuery[tempArray[i]] = {
          $regex: `${tempArray[i + 1]}`,
          $options: "i",
        };
      }
    }
    reports = await ServiceReport.find(searchingQuery).select(
      "-customerSignImgDataUrl -technicianSignImgDataUrl"
    );
  } else if (query.includes("sn:")) {
    reports = await ServiceReport.find({
      $or: [
        {
          reportNumber: {
            $regex: `${query.replace("sn: ", "")}`,
            $options: "i",
          },
        },
      ],
    }).select("-customerSignImgDataUrl -technicianSignImgDataUrl");
  } else if (query.includes("advWty")) {
    reports = await ServiceReport.find({
      $or: [
        { "service.warranty": { $regex: `${req.body.wty}`, $options: "i" } },
      ],
    }).select("-customerSignImgDataUrl -technicianSignImgDataUrl");
  } else if (query.includes("d:")) {
    query = query.replace("d: ", "").replaceAll("-", "/").replaceAll(" ", "");
    reports = await ServiceReport.find({
      $or: [
        {
          date: {
            $regex: `${query.split("/")[1]}/${query.split("/")[0]}/${
              query.split("/")[2]
            }`,
            $options: "i",
          },
        },
      ],
    }).select("-customerSignImgDataUrl -technicianSignImgDataUrl");
  } else if (query.includes("filter: ")) {
    query = query.replace("filter: ", "").split(" =>on ");
    reports = await ServiceReport.find({
      $or: [
        { [`service.${query[1]}`]: { $regex: `${query[0]}`, $options: "i" } },
      ],
    }).select("-customerSignImgDataUrl -technicianSignImgDataUrl");
  } else if (query.includes("mn:")) {
    query = query.replace("mn: ", "");
    reports = await ServiceReport.find({
      $or: [{ "service.machineNum": { $regex: `${query}`, $options: "i" } }],
    }).select("-customerSignImgDataUrl -technicianSignImgDataUrl");
  } else {
    reports = await ServiceReport.find({
      $or: [
        { reportNumber: { $regex: `${query}`, $options: "i" } },
        { time: { $regex: `${query}`, $options: "i" } },
        { mobile: { $regex: `${query}`, $options: "i" } },
        { customerName: { $regex: `${query}`, $options: "i" } },
        { technicianName: { $regex: `${query}`, $options: "i" } },
        { attendingLocation: { $regex: `${query}`, $options: "i" } },
        { address: { $regex: `${query}`, $options: "i" } },
        { "service.status": { $regex: `${query}`, $options: "i" } },
      ],
    }).select("-customerSignImgDataUrl -technicianSignImgDataUrl");
  }
  res.status(200).send({
    status: true,
    reports: reports,
    query: req.body.wty ? req.body.wty : "",
  });
});

// Update service Report -- admin
exports.updateServiceReport = catchAsyncErrors(async (req, res, next) => {
  let Sid = req.params.id;
  if (req.params.task == "report") {
    await ServiceReport.findByIdAndUpdate(Sid, req.body);
    res.send({
      success: true,
      report: await ServiceReport.find({ _id: Sid }),
    });
  } else if (req.params.task == "machine") {
    await ServiceReport.updateOne({ "service._id": Sid }, { $set: req.body });
    res.send({
      success: true,
      report: await ServiceReport.find({ "service._id": Sid }),
    });
  }
});

// Update Check Status -- admin
exports.updateCheckStatus = catchAsyncErrors(async (req, res, next) => {
  if (req.params.task == "tally") {
    await ServiceReport.findByIdAndUpdate(req.body.id, {
      [`checked.${req.params.task}`]: req.body.data,
    });
    res.send({ success: true });
  } else if (req.params.task == "viewed") {
    if (req.body.id != "0") {
      if (req.body.data != false) {
        await ServiceReport.findOneAndUpdate(
          {
            _id: req.body.id,
            $ne: { "checked.adminViewed.admins": req.body.Cid },
          },
          {
            $addToSet: {
              "checked.adminViewed.admins": req.body.Cid,
            },
          }
        );
      } else {
        await ServiceReport.findOneAndUpdate(
          {
            _id: req.body.id,
            $eq: { "checked.adminViewed.admins": req.body.Cid },
          },
          {
            $pull: {
              "checked.adminViewed.admins": req.body.Cid,
            },
          }
        );
      }
    } else {
      if (req.body.data != false) {
        await ServiceReport.updateMany(
          { $ne: { "checked.adminViewed.admins": req.body.Cid } },
          {
            $addToSet: {
              "checked.adminViewed.admins": req.body.Cid,
            },
          }
        );
      } else {
        await ServiceReport.updateMany(
          { $eq: { "checked.adminViewed.admins": req.body.Cid } },
          {
            $pull: {
              "checked.adminViewed.admins": req.body.Cid,
            },
          }
        );
      }
    }
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
});


function pad(n, length) {
  var len = length - ("" + n).length;
  return (len > 0 ? new Array(++len).join("0") : "") + n;
}
