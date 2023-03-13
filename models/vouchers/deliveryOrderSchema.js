const mongoose = require("mongoose");
const deliveryOrder = new mongoose.Schema({
    createdBy: {
        adminName: { type: 'string', required: true },
        adminID: { type: 'string', required: true },
        createdOn: { type: 'string', required: true }
    },
    voucherNum: { type: 'string', required: true },
    orderDate: { type: 'string', required: true },
    consignee: { type: 'string', required: true },
    consigneeMobile: { type: 'string', required: true },
    consigneeAddress: { type: 'string', required: true },
    gstInNum: { type: 'string' },
    panNumORaadharNum: { type: 'string' },
    products: [
        {
            productName: { type: 'string', required: true },
            serialNum: { type: 'string', default: "" },
            qty: { type: 'string', required: true },
            unit: { type: 'string', required: true },
            rate: { type: 'string', required: true },
            amount: { type: 'string', required: true },
            gstRate: { type: 'string', required: true },
            totalGst: { type: 'string', required: true },
            grossTotal: { type: 'string', required: true }
        }
    ],
    advancePaymentReceived: { type: 'string', required: true },
    advancePayment: [
        {
            adminID: { type: 'string' },
            mode: { type: 'string', },
            advanceDate: { type: 'string', },
            advanceAmount: { type: 'string', },
            paymentDetails: {}
        }
    ],
    // afterPayments: [
    //     {
    //         adminDetails: {
    //             adminName: { type: 'string' },
    //             adminID: { type: 'string' },
    //             createdOn: { type: 'string' }
    //         },
    //         payments: [
    //             {
    //                 mode: { type: 'string' },
    //                 date: { type: 'string' },
    //                 amount: { type: 'string' },
    //                 details: {}
    //             }
    //         ]
    //     }
    // ],
    paymentStatus: { type: 'string' },
    signatures: {
        admin: {
            type: 'string',
            default: ""
        }
        , receiver: {
            type: 'string',
            default: ""
        }
    },
    dispatchDetails: {
        adminDetails: {
            adminName: { type: 'string' },
            adminID: { type: 'string' },
            createdOn: { type: 'string' }
        },
        dispatchStatus: { type: "string", default: "Pending" },
        dispatchedBy: { type: 'string' },
        dispatchDate: { type: 'string' },
        dispatchVehicleNum: { type: 'string', default: "" },
        transporterID: { type: 'string', default: "" },
        // products:[
        //     {
        //         productName:{type: 'string'},
        //         serialNum:{type: 'string'}
        //     }
        // ]
    }
})

deliveryOrder.index({
    'createdBy.adminName': 'text',
    voucherNum: 'text', orderDate: 'text',
    consigneeMobile: 'text',
    consigneeAddress: 'text',
    gstInNum: 'text',
    panNum: 'text',
    aadharNum: 'text',
    'dispatchDetails.dispatchedBy': 'text',
    'dispatchDetails.dispatchVehicleNum': 'text',
});
module.exports = mongoose.model("delivery-order", deliveryOrder)