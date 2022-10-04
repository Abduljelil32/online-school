const express = require('express')

const router = express.Router()

const courseMod = require('./../../../../model/school/course')
const videoMod = require('./../../../../model/school/video')

const cloudinary = require('cloudinary')
const upload = require('./../../../../utils/multer')

router.get('/', async (req, res) => {
    const sess = req.session
    if (sess.email && sess.password) {
        const courses = await courseMod.find()
        console.log(courses)
        res.render("school/courses/videos/addVideo", { courses, msg: '' })
    } else {
        res.redirect('/admin')
    }
})

router.post('/', upload.single('Video'), async (req, res) => {
    try {
        const courses = await courseMod.find()
        console.log(courses)
        console.log(req.body)
        if (req.body.crsID != null && req.body.Name != null) {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    resource_type: "video"
                })
                const addVideo = new videoMod({
                    crsID: req.body.crsID,
                    Name: req.body.Name,
                    Video: result.secure_url,
                    PublicID: result.public_id
                })
                await addVideo.save()
                res.redirect(`/viewCourse/${req.body.crsID}`)
        } else {
            res.render('school/courses/videos/addNote', { courses, msg: 'Fill all the Fields'})
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = router