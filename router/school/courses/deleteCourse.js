const express = require('express')

const router = express.Router()

const courseMod = require('./../../../model/school/course')
const noteMod = require('./../../../model/school/Notes')
const videoMod = require('./../../../model/school/video')

router.get('/:id', async (req, res, next) => {
    const sess = req.session
    if (sess.email && sess.password) {
        try {
            const id = req.params.id
            console.log(id)
            const note = await noteMod.findOne({ stdID: id })
            console.log(note)
            const video = await videoMod.findOne({ stdID: id })
            console.log(video)
            noteMod.findOneAndDelete({ stdID: id }, (err, docs) => {
                if (err) {
                    console.log(err)
                    next(err)
                }  else {
                    videoMod.findOneAndDelete({ stdID: id }, (err, docs) => {
                        if (err) {
                            console.log(err)
                            next(err)
                        } else {
                            courseMod.findByIdAndDelete({ _id: id }, (err, docs) => {
                                if (err) {
                                    console.log(err)
                                    next(err)
                                } else {

                                    array.forEach(element => {
                                        
                                    });
                                    console.log("Deleted Succesfully")
                                    res.redirect('/admin/dashboard')
                                }
                            })
                        }
                    })
                }
            })
        } catch (err) {
            console.log(err)
        }
    } else {
        res.redirect('/admin')
    }
})

module.exports = router