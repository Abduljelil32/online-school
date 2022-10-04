const express = require('express')

const router = express.Router()
const cloudinary = require('cloudinary')

const videoMod = require('./../../../../model/school/video')

router.get('/:id', async (req, res, next) => {
    const sess = req.session
    if (sess.email && sess.password) {
        try {
            const id = req.params.id
            console.log(id)
            const video = await videoMod.findById({ _id: id })
            console.log(video._id)
            const publicID = video.PublicID
            console.log(video.PublicID)
            const courseID = video.crsID
            console.log(courseID)
            videoMod.findByIdAndDelete({ _id: id }, (err, docs) => {
                if (err) {
                    console.log(err)
                    next(err)
                } else {
                    cloudinary.v2.uploader.destroy(publicID).then(result => {
                        console.log(result)
                    })
                    res.redirect(`/viewCourse/${courseID}`)
                }
            })
        } catch (err) {
            console.log(err)
            next(err)
        }
    } else {
        res.redirect('/admin')
    }
})

module.exports = router