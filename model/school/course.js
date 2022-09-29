const mongoose= require('mongoose')

const Schema = mongoose.Schema

const Course = new Schema({
    Name:{
        required:true,
        unique:true,
        type:String
    },
    CourseCode:{
        required:true,
        type:String,
        unique:true,

    },
    Price:{
        type:Number,
        default:false,
        required:true
    }
})

module.exports= mongoose.model('Course', Course)
