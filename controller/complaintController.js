const path = require('path');
const Complaint = require(path.join(__dirname, '../models/complaintSchema'))
const Handlebars = require('hbs')
const jwt = require('jsonwebtoken');
const User = require(path.join(__dirname, "../models/userSchema"));


Handlebars.registerHelper('eq', function () {
    const args = Array.prototype.slice.call(arguments, 0, -1);
    return args.every(function (expression) {
        return args[0] === expression;
    });
});



// VIEW ALL COMPLAINTS -- USER
exports.viewComplaints = async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token.token, process.env.JWT_SECRET, async function (err, decoded) {
            if (err) {
                res.clearCookie("adminToken");
                res.redirect(
                    "/vitco-india/admin/login"
                );
            } else {
                const user = await User.findById(token.uID)
                const complaints = await Complaint.aggregate([
                    {
                        $match: {
                            "userDetails.contactNumber": user.phoneNumber
                        }
                    }])
                if (complaints == []) {
                    if (req.params.state == "submitted") {
                        res.render('user/complaints/viewComplaints', { "user": user, "submitted": true })
                    }
                    else {
                        res.render('user/complaints/viewComplaints', { "user": user })
                    }
                }
                else {
                    if (req.params.state == "submitted") {
                        res.render('user/complaints/viewComplaints', { "user": user, "complaints": complaints, "submitted": true })
                    }
                    else {
                        res.render('user/complaints/viewComplaints', { "user": user, "complaints": complaints })
                    }
                }
            }
        });
    }
    else {
        if (req.params.state == "submitted") {
            res.render('user/complaints/viewComplaints', { 'user': null, "submitted": true })
        }
        else {
            res.render('user/complaints/viewComplaints', { 'user': null })

        }

    }

}

// ADD COMPLAINT PAGE --  USER
exports.addComplaint = async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token.token, process.env.JWT_SECRET, async function (err, decoded) {
            if (err) {
                res.clearCookie("adminToken");
                res.redirect(
                    "/vitco-india/admin/login"
                );
            } else {
                const user = await User.findById(token.uID)
                res.render('user/complaints/newComplaints', { "user": user })
            }
        });
    }
    else {
        res.render('user/complaints/newComplaints')

    }

}

// ADD COMPLAINT PAGE -- USER --> POST
exports.uploadComplaint = async (req, res) => {
    const today = new Date();
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const isAlreadyComplaintRegistered = await Complaint.find({ machineSerielNumber: req.body.MserielNumber })
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token.token, process.env.JWT_SECRET, async function (err, decoded) {
            if (err) {
                res.clearCookie("adminToken");
                res.redirect(
                    "/vitco-india/admin/login"
                );
            } else {
                const user = await User.findById(token.uID)
                if (isAlreadyComplaintRegistered.length > 0) {
                    res.render('user/complaints/newComplaints', { "error": "This Complaint is already registered", "user": user })
                }
                else {
                    Cid = Math.floor(10000000 + Math.random() * 9000)
                    let fileName
                    let filePath

                    try {
                        fileName = req.file.filename
                        filePath = `userUploads/problemVideos/${fileName}`
                    } catch (error) {
                        filePath = null
                        fileName = null
                    }
                    
                    const complaint = {
                        complaintID: Cid,
                        dateIssued: today.toLocaleDateString('en-US', options),
                        userDetails: {
                            customerName: req.body.user_name,
                            contactNumber: req.body.user_number,
                            address: req.body.user_address
                        },
                        machineSerielNumber: req.body.MserielNumber,
                        DOP: req.body.DOP,
                        machineName:req.body.machineName,
                        files: [
                            {
                                fileName: fileName,
                                url: filePath
                            }
                        ],
                        issue: req.body.user_issue,
                        complaintStatus: "Pending"
                    };
                    await Complaint.create(complaint)
                    res.redirect(`/complaint/${'submitted'}`)
                }
            }
        });
    }
    else {
        if (isAlreadyComplaintRegistered.length > 0) {
            res.render('user/complaints/newComplaints', { "error": "This Complaint is already registered" })
        }
        else {
            Cid = Math.floor(10000000 + Math.random() * 9000)
            let fileName
            let filePath
            try {
                fileName = req.file.filename
                filePath = `userUploads/problemVideos/${fileName}`
            } catch (error) {
                filePath = null
                fileName = null
            }
            const complaint = {
                complaintID: Cid,
                dateIssued: today.toLocaleDateString('en-US', options),
                userDetails: {
                    customerName: req.body.user_name,
                    contactNumber: req.body.user_number,
                    address: req.body.user_address
                },
                machineSerielNumber: req.body.MserielNumber,
                machineName:req.body.machineName,
                DOP: req.body.DOP,
                files: [
                    {
                        fileName: fileName,
                        url: filePath
                    }
                ],
                issue: req.body.user_issue,
                complaintStatus: "Pending"
            };
            const complaintRegistred = await Complaint.create(complaint)
            res.redirect(`/complaint/${'submitted'}`)

        }

    }
}