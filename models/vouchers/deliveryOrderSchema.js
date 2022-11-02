const mongoose = require("mongoose");
const deliveryOrder = new mongoose.Schema({
    createdBy: {
        adminName: {
            type: 'string',
            required: true
        },
        adminID: {
            type: 'string',
            required: true
        },
        createdOn: {
            type: 'string',
            required: true
        }
    },
    voucherNum: {
        type: 'string',
        required: true
    },
    orderDate: {
        type: 'string',
        required: true
    },
    dispatchDate: {
        type: 'string',
        required: true
    },
    receiverName: {
        type: 'string',
        required: true
    },
    representativeName: {
        type: 'string',
        required: true
    },
    consignee: {
        type: 'string',
        required: true
    },
    consigneeMobile: {
        type: 'string',
        required: true
    },
    consigneeAddress: {
        type: 'string',
        required: true
    },
    gstInNum: {
        type: 'string',
        required: true
    },
    panNum: {
        type: 'string',
        required: true
    },
    aadharNum: {
        type: 'string',
        required: true
    },
    specialInstructions: {
        type: 'string',
        required: true
    },
    products: [
        {
            productName: {
                type: 'string',
                required: true
            },
            specification: {
                type: 'string',
                required: true
            },
            qty: {
                type: 'string',
                required: true
            },
            rate: {
                type: 'string',
                required: true
            },
            amount: {
                type: 'string',
                required: true
            },
            gstRate: {
                type: 'string',
                required: true
            },
            totalGst: {
                type: 'string',
                required: true
            },
            grossTotal: {
                type: 'string',
                required: true
            }
        }
    ],
    advancePaymentReceived: {
        type: 'string',
        required: true
    },
    advancePayment: [
        {
            mode: {
                type: 'string',
            },
            advanceDate: {
                type: 'string',
            },
            advanceAmount: {
                type: 'string',
            },
            paymentModeDetails: {}
        }
    ],
    dispatchDetails: {
        dispatchedBy: {
            type: 'string',
            required: true
        },
        dispatchVehicleNum: {
            type: 'string',
            required: true
        },
        machineSrNum: {
            type: 'string',
            required: true
        },
        invoiceNum: {
            type: 'string',
            required: true
        },
        invoiceDate: {
            type: 'string',
            required: true
        },
        remark: {
            type: 'string',
            required: true
        },
    }
})


module.exports = mongoose.model("delivery-order", deliveryOrder)