const express = require('express')

const router = express.Router()

const courseMod = require('./../../../../model/school/course')
const videoMod = require('./../../../../model/school/video')

const cloudinary = require('cloudinary')

router.get('/', async (req, res) => {
    const courses = await courseMod.find()
    console.log(courses)
    res.render("school/courses/videos/addVideo", { courses, msg: '' })
})

router.post('/', async (req, res) => {
    try {
        const courses = await courseMod.find()
        console.log(courses)
        console.log(req.body)
        console.log(req.files)
        if (req.body.crsID != null && req.body.Name != null) {
            const video = req.files.Video
            if (video.mimetype == 'video/x-flv' || video.mimetype == 'video/mp4' || video.mimetype == 'application/x-mpegURL' || video.mimetype == 'video/MP2T' || video.mimetype == 'video/3gpp' || video.mimetype == 'video/quicktime' || video.mimetype == 'video/x-msvideo' || video.mimetype == 'video/x-ms-wmv') {
                const upload = await cloudinary.v2.uploader.upload(video.tempFilePath, { resource_type: 'auto ', folder: process.env.courseVideo, use_filename: false, unique_filename:true })
                const addNote = new noteMod({
                    crsID: req.body.crsID,
                    Name: req.body.Name,
                    Video: upload.secure_url,
                    PublicID: upload.public_id
                })
                await addNote.save()
                res.redirect(`/viewCourse/${req.body.crsID}`)
            } else {
                res.render('school/courses/videos/addNote', { courses, msg: 'Invalid File Type'})
            }
        } else {
            res.render('school/courses/videos/addNote', { courses, msg: 'Fill all the Fields'})
        }
        // res.render('school/courses/notes/addNote',{ courses })
    } catch (err) {
        console.log(err)
    }
})

module.exports = router