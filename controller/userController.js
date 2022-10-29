const path = require('path');
const catchAsyncErrors = require(path.join(__dirname, "../middlewares/catchAsyncErrors"));
const User = require(path.join(__dirname, "../models/userSchema"));
const { sendToken } = require(path.join(__dirname, "../utils/jwtToken"));
const jwt = require('jsonwebtoken');
const ServiceReport = require(path.join(__dirname, "../models/machineServiceReportSchema"));
const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// HOMEPAGE -- USER
exports.homePage = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        if ('adminToken' in req.cookies) {
            res.clearCookie('adminToken');
        }
        jwt.verify(token.token, process.env.JWT_SECRET, async function (err, decoded) {
            if (err) {
                res.clearCookie("token");
                res.redirect(
                    "/"
                );
            } else {
                const user = await User.findById(token.uID)
                res.render('user/products/products', { "user": user })
            }
        });
    }
    else {
        res.render('user/products/products')
    }
})


// exports.verifiedUser = async (req, res,next) =>{
//     try {
//         isAuthenticatedUser(req, res,next).then((response)=>{
//             if(response){
//                 res.render('products/products',{"user":req.user})
//             }
//             else{
//                 res.render('products/products')
//             }
//         }).catch()
//     } catch (error) {
//         res.send("<h1>Internal Server Error</h1>")
//     }
// }


// SIGN UP  -- USER -- POST
exports.RegisterUser = async (req, res) => {
    const { firstName, lastName, phoneNumber, password, confirmPassword } = req.body;
    if (password != confirmPassword) {
        res.render("user/signup/signup", { "errors": "Passwords are not matching", "userDetails": { firstName, lastName, phoneNumber } })
    }
    else if (Object.keys(await User.find({ "phoneNumber": phoneNumber })).length != 0) {
        res.render("user/signup/signup", { "errors": "This phone number already exists", "userDetails": { firstName, lastName, password } })
    }
    else {
        try {
            const user = await User.create({
                firstName,
                lastName,
                phoneNumber,
                password
            });
            // client.messages
            //     .create({
            //         body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
            //         from: '+15017122661',
            //         to: '+15558675310'
            //     })
            //     .then(message => console.log(message.sid));
            await sendToken(user, 201, res)

        } catch (error) {
            res.render("user/signup/signup", { "errors": "Internal server error " })
        }

    }
}

// SIGN IN --  USER
exports.LoginUser = async (req, res) => {
    const { phoneNumber, password } = req.body;
    const user = await User.find({ "phoneNumber": phoneNumber })
    if (Object.keys(user).length == 1) {
        const isPasswordMatched = await user[0].comparePassword(password)
        if (isPasswordMatched) {
            sendToken(user[0], 201, res)
        } else {
            res.render('user/signin/signin', { "error": "Invalid Details" })
        }
    } else {
        res.render('user/signin/signin', { "error": "Invalid Details" })
    }

}



// PRINT SERVICE REPORT -- USER
exports.viewCustomerServiceReport = async (req, res) => {
    try {
        const serviceReport = await ServiceReport.find({ _id: req.params.id })
    if(serviceReport){
        res.render("user/serviceReport/viewServiceReport", { report: serviceReport, length: serviceReport[0].service.length,reportID:serviceReport[0].id })
    }else{
        res.render("<h5>Sorry we couldn't find your report</h5>")
    }
    } catch (error) {
        res.send("<h5>Sorry we couldn't find your report</h5>")
    }
    
}


// LOG OUT -- USER
exports.LogOutUser = async (req, res) => {
    const { cookies } = req;
    if ('token' in cookies) {
        res.clearCookie('token');
    } else if ('adminToken' in cookies) {
        res.clearCookie('adminToken');
    }
    res.redirect('/')
}