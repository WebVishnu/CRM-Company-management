const path = require('path');
const Complaint = require(path.join(__dirname, '../models/complaintSchema'))
const User = require(path.join(__dirname, "../models/userSchema"));
const Handlebars = require('hbs')
const jwt = require('jsonwebtoken');
const Admin = require(path.join(__dirname, "../models/adminSchema"));

// search complaints
exports.SearchUserComplaints = async (req, res, next) => {
    try {
        const query = req.body.query.trim()
        if (query == undefined) {
            res.send({ success: true, complaints: [] })
        } else {
            let searchedComplaints = [];
            try {
                searchedComplaints = await Complaint.find({
                    $or: [
                        { "userDetails.customerName": { $regex: query, $options: 'i' } },
                        { "userDetails.contactNumber": query },
                        { "userDetails.address": { $regex: query, $options: 'i' } },
                        { "issue": { $regex: query, $options: 'i' } },
                        { "DOP": { $regex: query, $options: 'i' } },
                        { "machineSerielNumber": query },
                        { "complaintID": query },

                    ]
                })
            } catch {
                searchedComplaints = await Complaint.find({
                    $or: [
                        { "userDetails.customerName": { $regex: query, $options: 'i' } },
                        { "userDetails.address": { $regex: query, $options: 'i' } },
                        { "issue": { $regex: query, $options: 'i' } },
                        { "DOP": { $regex: query, $options: 'i' } },
                    ]
                })
            }
            res.send({ success: true, complaints: searchedComplaints })
        }
    } catch (error) {
        res.send({
            err: error,
            success: false
        })
    }

}


// get all complaints 
exports.getAllComplaints = async (req, res, next) => {
    try {
        const complaints = await Complaint.find()
        res.send({
            success: true,
            complaints
        })
    } catch (error) {
        res.send({
            success: false
        })
    }

}


// edit complaints
exports.updateComplaintStatus = async (req, res, next) => {
    try {
        const complaintID = req.body.query.complaintID
        await Complaint.findOneAndUpdate({ _id: complaintID}, { complaintStatus: req.body.query.status })
        const updatedComplaint = await Complaint.find({ _id:complaintID})
        res.status(200).send({
            success: true,
            complaintStatus: updatedComplaint[0].complaintStatus
        })
    }
    catch (err) {
        res.send({
            success: false
        })
    }
}

// get a single complaint
exports.getSingleComplaintDetails = async (req, res, next) => {
    try {
        const complaint = await Complaint.find({
            complaintID: req.params.cID
        })
        res.status(200).send({
            success: true,
            complaint
        })
    } catch (error) {
        res.send({
            success: false
        })

    }
}


// get actions of a single complaint
exports.getActionsSingleComplaint = async (req, res, next) => {
    try {
        const complaint = await Complaint.find({
            complaintID: req.params.cID
        })
        res.status(200).send({
            success: true,
            actions: complaint[0].actions
        })
    } catch (error) {
        res.send({
            success: false
        })

    }
}



// add actions to a single complaint
exports.addActionSingleComplaint = async (req, res, next) => {
    try {
        const { adminToken } = req.cookies;
        if (adminToken) {
            jwt.verify(adminToken.token, process.env.JWT_SECRET_ADMIN, async function (err, decoded) {
                if (err) {
                    res.send({
                        success: false
                    })
                } else {
                    const admin = await Admin.findById(adminToken.uID)
                    await Complaint.updateOne(
                        { complaintID: req.params.cID },
                        {
                            $push: {
                                actions: {
                                    $each: [
                                        {
                                            adminName: admin.userName,
                                            time: req.body.query.time,
                                            date: req.body.query.date,
                                            action: req.body.query.action
                                        }
                                    ]
                                }
                            }
                        }
                    )
                    const addedActionComplaint = await Complaint.find({ complaintID: req.params.cID })
                    res.send({
                        success: true,
                        complaint: addedActionComplaint
                    })
                }
            });
        }
        else {
            res.send({
                success: false
            })
        }
    } catch (error) {
        res.send({
            success: false
        })

    }
}

// filter complaint
exports.filterStatusComplaint = async (req, res, next) => {
    try {
        const complaints = await Complaint.find({
            complaintStatus: req.params.status
        })
        res.status(200).send({
            success: true,
            complaints
        })
    } catch (error) {
        res.send({
            success: false
        })

    }
}


// update complaint details
exports.updateComplaintDetails = async (req, res, next) => {
    try {
        updatedComplaint = await Complaint.findOneAndUpdate({ _id: req.params.cID },req.body )
        res.status(200).send({
            success: true,
            complaint: updatedComplaint
        })
    }
    catch (err) {
        res.send({
            success: false
        })
    }
}


// delete a single complaint
exports.deleteSingleComplaintDetails = async (req, res, next) => {
    try {
        await Complaint.findOneAndUpdate({ complaintID: req.params.cID }, { complaintStatus: "Deleted" })
        const updatedComplaint = await Complaint.find({ complaintID: req.params.cID })
        res.status(200).send({
            success: true,
            complaintStatus: updatedComplaint[0].complaintStatus
        })
    }
    catch (err) {
        res.send({
            success: false
        })
    }
}