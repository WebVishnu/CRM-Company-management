const express = require('express');
const router = express.Router();
const path = require('path');
const { adminLogin, adminLoginPost, adminControlPanel, logOutAdmin, allAdminsControlPanel, adminCreateNewAdmin, adminEditAdmin, changePasswordAdmin ,updateAdminProfile,sendNotificationsAdmin,adminNotificationsPage} = require(path.join(__dirname, '../controller/adminController'));
const { authorizedRoles } = require(path.join(__dirname, "../middlewares/auth"));

// login page -- admin
router.get('/vitco-india/admin/login', (req, res, next) => { adminLogin(req, res) })
// login page -- admin -- POST 
router.post('/vitco-india/admin/login', (req, res, next) => { adminLoginPost(req, res) })
// homepage admin
router.get('/vitco-india/control', (req, res, next) => { adminControlPanel(req, res) })

// all admin
router.get('/vitco-india/control/admins', async (req, res, next) => {
    if (await authorizedRoles("all", req, res, next, ["view", "edit", "create", "delete"])) {
        allAdminsControlPanel(req, res)
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})

//create new admin
router.post('/vitco-india/control/create-admin', async (req, res, next) => {
    if (await authorizedRoles("all", req, res, next, ["view", "edit", "create", "delete"])) {
        adminCreateNewAdmin(req, res)
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})

// edit admin
router.post('/vitco-india/control/edit-admin', async (req, res, next) => {
    if (await authorizedRoles("all", req, res, next, ["view", "edit", "create", "delete"])) {
        adminEditAdmin(req, res)
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})

// change password admin
router.post('/vitco-india/control/admin/change-pass', async (req, res, next) => {
    if (await authorizedRoles("all", req, res, next, ["view", "edit", "create", "delete"])) {
        changePasswordAdmin(req, res)
    } else {
        res.redirect('/vitco-india/control/admin/not-allowed')
    }
})

// admin notification
router.get('/vitco-india/control/admin/notifications', async (req, res, next) => {adminNotificationsPage(req, res)})

// update admin -- from admin profile
router.post('/vitco-impex/control/admin-profile/update-admin', async (req, res, next) => {updateAdminProfile(req, res)})

// change password admin
router.get('/vitco-india/control/admin/not-allowed', async (req, res, next) => { res.render('errors/notAllowed') })
// log out admin
router.get('/vitco-india/control/log-out', async (req, res, next) => { logOutAdmin(req, res) })

module.exports = router

