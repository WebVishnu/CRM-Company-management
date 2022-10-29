const express = require('express');
const router = express.Router();
const path = require('path')
const {addComplaint,uploadComplaint,viewComplaints} = require(path.join(__dirname, '../controller/complaintController'))
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/userUploads/problemVideos')
    },
    filename: function (req, file, cb) {
      cb(null, + Date.now() + '---' + file.originalname )
    }
  })
  
const upload = multer({ storage:storage })



// view complaints --- USER
router.get('/complaint/:state',(req,res,next)=>{viewComplaints(req,res)})

// add new complaints --- USER
router.get('/complaint-new/new',(req,res,next)=>{addComplaint(req,res)})

// add new complaints --- USER -- POST
router.post('/complaint-new/new',upload.single("problemVideo"),(req,res)=>{uploadComplaint(req,res)})

module.exports = router