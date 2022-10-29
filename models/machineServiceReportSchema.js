const { default: mongoose } = require("mongoose");

const machineServiceReport = mongoose.Schema({
    reportNumber: {
        type: "string",
    },
    createdBy: {
        name: {
            type: "string",
        },
        adminId: {
            type: "string",
            default: ""
        }
    },
    date: {
        type: "string",
    },
    time: {
        type: 'string',
    },
    customerName: {
        type: "string",
    },
    mobile: {
        type: "string",
    },
    technicianName: {
        type: "string",
    },
    attendingLocation: {
        type: "string",
    },
    address: {
        type: "string",
    },
    customerSignImgDataUrl: {
        type: "string",
    },
    technicianSignImgDataUrl: {
        type: "string",
    },
    service: [
        {
            machineName: {
                type: 'string',
            },
            machinePassword: {
                type: 'string',
                default: "000"
            },
            machineNum: {
                type: 'string',
            },
            warranty: {
                type: "string",
            },
            problem: {
                type: 'string',
            },
            actionTaken: {
                type: "string",
            },
            partsIN: [{
                partName: {
                    type: "string",
                    default: ""
                },
                partSerialNumber: {
                    type: "string",
                    default: ""
                },
                partWty: {
                    type: "string",
                    default: ""
                }
            }],
            partsOUT: [{
                partName: {
                    type: "string",
                    default: ""
                }
            }],
            status: {
                type: "string",
            }
        }
    ]
})


module.exports = mongoose.model("service-reports", machineServiceReport)