const { default: mongoose } = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true,"Please enter a product name"],
    },
    description:{
        type: String,
        required: [true,"Please enter a description"],
    },
    price:{
        type: Number,
        required: [true,"Please enter a price"],
    },
    rating:{
        type: Number,
        default:0
    },
    images:
    [
        {
          public_id: {
                type:String,
                required: true
            },
            url:{
                type:String,
                required: true
            }
        }
    ],
    category:{
        type:String,
        required:[ true,"Please enter a category name"]
    },
    Stock:{
        type:Number,
        required: [true,"Please enter a stock number"],
        default: 1

    },
    numberOfReviews:{
        type:Number,
        default: 0
    },
    reviews:[
        {
            name:{
                type:String,
                required: [true,"Please enter a review"],
            },
            rating:{
                type:Number,
                default:0
            },
            comment:{
                type:String,
                required: [true,"Please enter a comment"]
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model("Product",productSchema)