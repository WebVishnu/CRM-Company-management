const { default: mongoose } = require("mongoose");

const qrCodeLayouts = mongoose.Schema({
    title: {
        type: 'string'
    },
    fields: []
});


module.exports = mongoose.model("qr-code-layouts", qrCodeLayouts);