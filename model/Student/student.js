const mongoose= require('mongoose')

const Schema = mongoose.Schema

const Student = new Schema({
    Email:{
        required:true,
        unique:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    verified:{
        type:Boolean,
        default:false,
        required:true
    }
})

module.exports= mongoose.model('Student', Student)
