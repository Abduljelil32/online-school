const mongoose= require('mongoose')

const Schema = mongoose.Schema

const Notes = new Schema({
    crsID:{
        required:true,
        type:String
    },
    Name:{
        required:true,
        type:String,
        
    },
    Note:{
        required:true,
        type:String,
        
    },
    PublicID:{
        required:true,
        type:String,
        
    },
    
})

module.exports= mongoose.model('Course Notes', Notes)
