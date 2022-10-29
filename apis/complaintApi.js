const express = require('express');
const router = express.Router();
const path = require('path');
const { SearchUserComplaints, getAllComplaints, updateComplaintStatus, getSingleComplaintDetails, deleteSingleComplaintDetails, getActionsSingleComplaint, addActionSingleComplaint, filterStatusComplaint,updateComplaintDetails } = require(path.join(__dirname, '../apisController/complaintController'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));


// search complaints -- admin
router.post('/api/v1/user/complaints/search/:api_key', async (req, res, next) => {
  if (await authorizedRoles("complaints", req, res, next, ["view"])) { SearchUserComplaints(req, res) }
  else {res.send({success:false})}
})

//Edit Complaints -- admin
router.post('/api/v1/user/complaints/update-status/:api_key', async (req, res, next) => {
  if (await authorizedRoles("complaints", req, res, next, ["edit"])) { updateComplaintStatus(req, res) }
  else {res.send({success:false})}
})

// Get allComplaints -- admin
router.get('/api/v1/all-users/complaints/32c1a3bf323a1e635f5f75b1726d3e5', async (req, res, next) => {
  if (await authorizedRoles("complaints", req, res, next, ["view"])) { getAllComplaints(req, res, next) }
  else {res.send({success:false})}
})

// get single complaint
router.get('/api/v1/find-single-user/complaints/:cID', async (req, res, next) => {
  if (await authorizedRoles("complaints", req, res, next, ["view"])) { getSingleComplaintDetails(req, res, next) }
  else {res.send({success:false})}
})

// delete single complaint
router.get('/api/v1/delete-single-user/complaints/:cID', async (req, res, next) => {
  if (await authorizedRoles("complaints", req, res, next, ["delete"])) { deleteSingleComplaintDetails(req, res, next) }
  else {res.send({success:false})}
})

// get actions of a complaint
router.get('/api/v1/get-actions/complaint/:cID', async (req, res, next) => {
  if (await authorizedRoles("complaints", req, res, next, ["view"])) { getActionsSingleComplaint(req, res, next) }
  else {res.send({success:false})}
})

// add action to a complaint
router.post('/api/v1/add-new-action/complaint/:cID', async (req, res, next) => {
  if (await authorizedRoles("complaints", req, res, next, ["edit"])) { addActionSingleComplaint(req, res, next) }
  else {res.send({success:false})}
})

// filter complaint -- admin
router.post('/api/v1/filter-status-complaint/complaint/:status', async (req, res, next) => {
  if (await authorizedRoles("complaints", req, res, next, ["view"])) { filterStatusComplaint(req, res, next) }
  else {res.send({success:false})}
})

// update complaint details -- super admin
router.post('/api/v1/update-complaint-details/:cID', async (req, res, next) => {
  if (await authorizedRoles("all", req, res, next,["view","edit","create","delete"])) { updateComplaintDetails(req, res, next) }
  else {res.send({success:false})}
})

// filter complaint -- admin
// router.get('/api/v1/export/complaints', async (req, res, next) => {
//   if (await authorizedRoles("all", req, res, next, ["view","edit","create","delete"])) { exportComplaints(req, res, next) }
//   else {res.send({success:false})}
// })


module.exports = router