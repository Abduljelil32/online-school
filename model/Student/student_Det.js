const mongoose= require('mongoose')

const Schema = mongoose.Schema

const StudentDet = new Schema({
    stdID:{
        required:true,
        type:String
    },
    Fname:{
        required:true,
        type:String,
        
    },
    Lname:{
        required:true,
        type:String,
        
    },
    PhnNo:{
        required:true,
        type:String,
        unique:true
    },
    imgUrl:{
        required:true,
        type:String,
        
    },
    publicId:{
        required:true,
        type:String,
        
    },
})

module.exports= mongoose.model('StudentDet', StudentDet)
