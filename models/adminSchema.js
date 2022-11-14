const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = mongoose.Schema({
  adminName: {
    type: String,
    required: [true, "Please enter your admin name"],
  },
  userName: {
    type: String,
    required: [true, "Please enter your Username"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
  },
  profilePhoto: {
    type: String,
    default:"/images/avatar/boy-avatar.png"
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  notificationNumber: {
    type: Number,
    default: 0
  },
  notifications: [
    {
      notificationTitle: {
        type: String
      },
      profilePhoto: {
        type: String
      },
      adminID: {
        type: String,
      },
      adminName: {
        type: String,
      },
      time: {
        type: String
      },
      message: {
        type: String
      }
    }
  ],
  role: [
    {
      roleName: {
        type: String,
        required: [true, "Please enter a role"],
      }
    }
  ],
  permissions: [
    {
      permissionName: {
        type: String,
        required: [true, "Please enter a permission"],
      },
      permissionKeys: [
        {
          keyName: {
            type: String
          }
        },
      ],
    },
  ],
});

// hashing password
adminSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
});

// generating jwt token
adminSchema.methods.getJWTtoken = function () {
  return jwt.sign({ id: this.__id }, process.env.JWT_SECRET_ADMIN, {
    expiresIn: process.env.ADMIN_JWT_EXPIRES,
  });
};

// comparing password
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("admin", adminSchema);