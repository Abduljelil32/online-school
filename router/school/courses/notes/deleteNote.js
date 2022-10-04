const express = require('express')

const router = express.Router()
const cloudinary = require('cloudinary')

const noteMod = require('./../../../../model/school/Notes')

router.get('/:id', async (req, res, next) => {
    const sess = req.session
    if (sess.email && sess.password) {
        try {
            const id = req.params.id
            console.log(id)
            const note = await noteMod.findById({ _id: id })
            console.log(note._id)
            const publicID = note.PublicID
            console.log(note.PublicID)
            const courseID = note.crsID
            console.log(courseID)
            noteMod.findByIdAndDelete({ _id: id }, (err, docs) => {
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