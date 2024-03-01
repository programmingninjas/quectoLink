const mongoose = require('mongoose')

const linkSchema = mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User"
        },
        short:{
            type:String,
            required: [true,'Please add a short url'],
        },
        long:{
            type:String,
            required: [true,'Please add a long url'],
        },
        expires:{
            type:Date,
            required: [true,'Please add a expiry'],
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Link',linkSchema)