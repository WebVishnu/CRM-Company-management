const path = require('path');
const ServiceReport = require(path.join(__dirname, "../models/machineServiceReportSchema"));
const catchAsyncErrors = require(path.join(__dirname, "../middlewares/catchAsyncErrors"));


exports.getServiceReportNumber = catchAsyncErrors(async (req, res, next) => {
    data = await ServiceReport.find()
    res.send({
        success: true,
        reportNumber: data.length
    })
})
// get machines of service report
exports.getAllServiceReportMachines = catchAsyncErrors(async (req, res, next) => {
    const reports = await ServiceReport.find().skip(req.params.from).limit(parseInt(req.params.to)).select("-customerSignImgDataUrl").select("-technicianSignImgDataUrl")
    res.status(200).send({
        status: true,
        machines: reports,
    })
})



// search service reports
exports.searchServiceReport = catchAsyncErrors(async (req, res, next) => {
    var query = req.params.query.toString()
    let reports = []
    if (query.includes('cond:')) {
        searchingQuery = {}
        tempArray = []
        req.body.forEach((element, i) => {
            if (element.name == 'adv-search-combination-select') {
                tempArray.push(element.value)
            } else if (element.name == 'adv-search-input-query') {
                tempArray.push(element.value)
            }
        });
        for (let i = 0; i < tempArray.length; i += 2) {
            if (tempArray[i] == 'date') {
                searchingQuery["date"] = { $regex: `${tempArray[i + 1].split('/')[1]}/${tempArray[i + 1].split('/')[0]}/${tempArray[i + 1].split('/')[2]}`, $options: 'i' }
            } else {
                searchingQuery[tempArray[i]] = { $regex: tempArray[i + 1], $options: 'i' }
            }
        }
        reports = await ServiceReport.find(searchingQuery).select("-customerSignImgDataUrl").select("-technicianSignImgDataUrl")
    }
    else if (query.includes('sn:')) {
        reports = await ServiceReport.find({
            $or: [
                { "reportNumber": { $regex: query.replace('sn: ', ""), $options: 'i' } },

            ]
        }).select("-customerSignImgDataUrl").select("-technicianSignImgDataUrl")
    }else if (query.includes('advWty')) {
        reports =  await ServiceReport.find({
            $or: [
                { "service.warranty": { $regex: req.body.wty, $options: 'i' } },
            ]
        }).select("-customerSignImgDataUrl").select("-technicianSignImgDataUrl")
    } else if (query.includes('d:')) {
        query = query.replace('d: ', '').replaceAll('-', '/').replaceAll(' ', "")
        reports = await ServiceReport.find({
            $or: [
                { "date": { $regex: `${query.split('/')[1]}/${query.split('/')[0]}/${query.split('/')[2]}`, $options: 'i' } },
            ]
        }).select("-customerSignImgDataUrl").select("-technicianSignImgDataUrl")
    } else if (query.includes('filter: ')) {
        query = query.replace('filter: ', '').split(' =>on ')
        reports = await ServiceReport.find({
            $or: [
                { [`service.${query[1]}`]: { $regex: query[0], $options: 'i' } }
            ]
        }).select("-customerSignImgDataUrl").select("-technicianSignImgDataUrl")
    } else if (query.includes('mn:')) {
        query = query.replace('mn: ', '')
        reports = await ServiceReport.find({
            $or: [
                { "service.machineNum": { $regex: query, $options: 'i' } },
            ]
        }).select("-customerSignImgDataUrl").select("-technicianSignImgDataUrl")
    } else {
        reports = await ServiceReport.find({
            $or: [
                { "reportNumber": { $regex: query, $options: 'i' } },
                { "time": { $regex: query, $options: 'i' } },
                { "mobile": { $regex: query, $options: 'i' } },
                { "customerName": { $regex: query, $options: 'i' } },
                { "technicianName": { $regex: query, $options: 'i' } },
                { "attendingLocation": { $regex: query, $options: 'i' } },
                { "address": { $regex: query, $options: 'i' } },
                { "service.status": { $regex: query, $options: 'i' } },
            ]
        }).select("-customerSignImgDataUrl").select("-technicianSignImgDataUrl")
    }
    res.status(200).send({
        status: true,
        reports: reports,
        query:(req.body.wty)?req.body.wty:""
    })
})

// Update service Report -- admin
exports.updateServiceReport = catchAsyncErrors(async (req, res, next) => {
    let Sid = req.params.id
    if (req.params.task == "report") {
        await ServiceReport.findByIdAndUpdate(Sid, req.body)
        res.send({
            success: true,
            report: await ServiceReport.find({ _id: Sid })
        })
    } else if (req.params.task == "machine") {
        await ServiceReport.updateOne({ "service._id": Sid }, { '$set': req.body })
        res.send({
            success: true,
            report: await ServiceReport.find({ "service._id": Sid })
        })
    }
})


// send report on whatsapp
// exports.shareReportOnWhatsapp = catchAsyncErrors(async (req, res, next) => {
//     for (contact of contacts) {
//         let message = 'hi';
//         if(contact.group === 'customer') {
//             message = 'Good morning ' + contact.name;
//         }
//         else if(contact.group === 'friend') {
//             message = 'Hey ' + contact.name + '. Wassup?';
//         }
//         await wbm.sendTo(contact.phone, message);
//     }
//     await wbm.end();
// })


// delete service report -- admin
exports.deleteServiceReport = catchAsyncErrors(async (req, res, next) => {
    await ServiceReport.findByIdAndDelete(req.params.Sid, function (err, docs) {
        if (err) {
            res.send({
                success: false,
            })
        }
        else {
            res.send({
                success: true,
            })
        }
    })
})

