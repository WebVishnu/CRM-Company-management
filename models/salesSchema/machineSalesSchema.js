const { default: mongoose } = require("mongoose");

const salesSchema = mongoose.Schema({
    createdBy: {
        adminName: {
            type: 'string',
            required: true,
            default: "No data"
        },
        adminID: {
            type: 'string',
            required: true,
            default: "No data"
        }
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
        default: "null"
    },
    machines: [{
        machineName: {
            type: "string",
            required: [true, "Please enter a machine name"],
        },
        machineNum: {
            type: "string",
            required: [true, "Please enter a machine Number"],
        },
        password: {
            type: "string",
            default: "null"
        },
    }],
})


module.exports = mongoose.model("Machine-Sale-Data", salesSchema)