const mongoose = require("mongoose");
const deliveryOrder = new mongoose.Schema({
    orderDate:{
        type: 'string',
        required: true
    },
    dispatchDate:{
        type: 'string',
        required: true
    },
    
})


module.exports = mongoose.model("deliveryOrder",deliveryOrder)