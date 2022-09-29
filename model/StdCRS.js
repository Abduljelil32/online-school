const mongoose= require('mongoose')

const Schema = mongoose.Schema

const stdCourse = new Schema({
    stdID:{
        required:true,
        type:String
    },
    crsID:{
        required:true,
        type:String,
        
    },
    RecieptIMG:{
        required:true,
        type:String,
        
    },
    publicID:{
        required:true,
        type:String,
        
    },
    Verified:{
        required:true,
        type:Boolean,
        default:false
        
    },
    AmountPaid:{
        required:true,
        type:String,
        
    },
})

module.exports= mongoose.model('StdCourse', stdCourse)
