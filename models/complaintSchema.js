const mongoose = require("mongoose");
var dt = new Date();
const complaintSchema = new mongoose.Schema({
    complaintID:{
        type: 'number',
        required: true,
    },
    dateIssued:{
        type: 'string',
        required: true,
    },
    userDetails:{
        customerName: {
            type: "string",
            required: true,
        },
        contactNumber: {
            type: "string",
            required: true,

        },
        address:{
            type: 'string',
            required: true
        }
    },
    machineName: {
        type: "string",
        default:""
    },
    machineSerielNumber: {
        type: "string",
        required: true,
    },
    
    DOP: {
        type: "string",
        required: true,
    },
    files: [
        {
            url: {
                type: "string",
                default:"No file Uploaded"
            }
        }
    ],
    actions:[
        {
            adminName:{
                type:"string",
            },
            time:{
                type:"string",
                //default:dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds()
            },
            date:{
                type:"string",
                // default:(dt.getUTCMonth() + 1) + "/" + dt.getUTCDate() +"/" + dt.getUTCFullYear()
            },
            action:{
                type:"string"
            }

            
        }
    ],
    issue:{
        type: "string",
        required: true,
    },
    complaintStatus:{
        type: "string",
        enum: ['Pending', 'Progress', 'Solved'],
        required: true,
    }

})


module.exports = mongoose.model("Complaint",complaintSchema)