const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const OTP = require('automatic-otp');
const crypto = require('crypto');


const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true,"Please enter a First name"],
        maxLenght: 30,
    },
    lastName: {
        type: String,
        required: [true,"Please enter a Last name"],
        maxLenght: 30,
    },
    // email: { 
    //     type: String,
    //     required: [true,"Please enter a Email Address"],
    //     unique: true,
    // },
    phoneNumber: {
        type: Number,
        required:  [true,"Please enter a phone number"],
        maxLenght: 13,
        unique: true,
    },
    password: {
        type: String,
        required: [true,"Please enter a password"],
        maxLenght: 20
    },
    role:{
        type: String,
        default: "user"
    },
    // avatar:
    //     {
    //         public_id: {
    //               type:String,
    //               default:"There is no avatar"
    //           },
    //           url:{
    //               type:String,
    //               default:"There is no avatar"
    //           }
    // },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

})


userSchema.pre("save",async function (next) {
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password,12)
})


//JWT TOKEN
userSchema.methods.getJWTtoken = function(){
    return jwt.sign({id:this.__id} , process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
}

// comparing password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

// generating password reset OTP token
userSchema.methods.generateOTPresetToken = async function(){
    const otp = new OTP();
    
    otp.generate(6,{digits:true,specialCharacters:false,alphabet:false})

    resetToken = crypto.randomBytes(20).toString("hex")
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    this.resetPasswordExpires = Date.now()+15*60*1000
    return {resetToken,otp}
}




module.exports = mongoose.model("User",userSchema);