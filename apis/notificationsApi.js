const express = require('express');
const router = express.Router();
const path = require('path');
const { sendNotificationsAdmin,getAllNotifications,deleteNotification } = require(path.join(__dirname, '../apisController/notificationsController'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));


// send notifications admin
router.post('/vitco-impex/control/admin/send/new-notification/:admin', async (req, res,next) => {sendNotificationsAdmin(req, res, next);});

// send notifications
router.get('/vitco-impex/control/admin/get-notifications/:adminID/all', async (req, res,next) => {getAllNotifications(req, res, next);});

// delete notifications
router.post('/vitco-impex/control/admin/delete-notifications', async (req, res,next) => {deleteNotification(req, res, next);});

module.exports = router