const { default: mongoose } = require("mongoose");

const PartsalesSchema = mongoose.Schema({
    createdBy: {
        adminName:{
            type: 'string',
            required: true,
            default: "No data"
        },
        adminID:{
            type: 'string',
            required: true,
            default: "No data"
        },
    },
    reportNumber: {
        type: 'string',
        required: true,
    },
    invoiceDate: {
        type: 'string',
        required: true,
    },
    invoiceNum: {
        type: 'string',
        required: true,
    },
    customerName: {
        type: "string",
        default: "null"
    },
    address: {
        type: "string",
        default: "null"
    },
    mobileNum: {
        type: "string",
        default: "null"
    },
    warranty: {
        type: "string",
        default: "0"
    },
    parts: [
        {
            partName: {
                type: "string",
                required: [true, "Please enter a part name"],
            },
            partNumber: {
                type: "string",
                required: [true, "Please enter a part Number"],
            },
            password: {
                type: "string",
                default: "null"
            },
        }
    ]
    
})


module.exports = mongoose.model("parts-Sale-Data", PartsalesSchema)