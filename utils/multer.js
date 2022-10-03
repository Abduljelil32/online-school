const multer = require('multer')
const path = require('path')
const uploadPath = 'public/tmp'

// Multer config
module.exports = multer({
    storage: multer.diskStorage({
        destination: uploadPath
    }),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname)
        if (ext !== ".mp4"){
            cb(new Error("File type is not supported"), false)
            return
        }
        cb(null, true)
    }
})