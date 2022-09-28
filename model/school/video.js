const mongoose= require('mongoose')

const Schema = mongoose.Schema

const Video = new Schema({
    crsID:{
        required:true,
        type:String
    },
    Name:{
        required:true,
        type:String,
        
    },
    Video:{
        required:true,
        type:String,
        
    },
    PublicID:{
        required:true,
        type:String,
        
    },
    
})

module.exports= mongoose.model('Course Video', Video)
