const mongoose= require('mongoose')

const Schema = mongoose.Schema

const auth = new Schema({
    stdID:{
        required:true,
        type:String
    },
    OTP:{
        required:true,
        type:String,
        
    },
    reset:{
        required:true,
        type:String,
        
    },
    
})

module.exports= mongoose.model('AUTH', auth)
