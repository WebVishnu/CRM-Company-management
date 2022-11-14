const { default: mongoose } = require("mongoose");

const qrCode = mongoose.Schema({
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
    title: {
        type: 'string'
    },
    fields: {}
});


module.exports = mongoose.model("qr-Code", qrCode);