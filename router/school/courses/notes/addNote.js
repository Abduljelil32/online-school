const express = require('express')
const alert = require('alert')

const router = express.Router()

const courseMod = require('./../../../../model/school/course')
const noteMod = require('./../../../../model/school/Notes')

const cloudinary = require('cloudinary')

router.get('/:a', async (req, res) => {
    const sess= req.session
    const bam = req.params.a
    if (sess.email && sess.password) {
        const courses = await courseMod.find()
        console.log(courses)
        res.render('school/courses/notes/addNote',{ courses, msg: '', bam })
    } else {
        res.redirect('/admin')
    }
})

router.post('/:bam', async (req, res) => {
    const fID = req.params.bam
    try {
        const courses = await courseMod.find()
        console.log(courses)
        console.log(req.body)
        console.log(req.files)
        if (req.body.crsID != null && req.body.Name != null) {
            const note = req.files.Note
            const check = noteMod.findOne({ })
            if (note.mimetype == 'application/pdf' || note.mimetype == 'application/msword') {
                const upload = await cloudinary.v2.uploader.upload(note.tempFilePath, { resource_type: 'auto', folder: process.env.coursebook, use_filename: false, unique_filename:true })
                const thisNote = await noteMod.findOne({ crsID: fID })
                // console.log(thisNote)
                const data = {
                    crsID: req.body.crsID,
                    Name: req.body.Name,
                    Note: upload.secure_url,
                    Cover: thisNote.Cover,
                    PublicID: upload.public_id
                }
                await noteMod.findOneAndUpdate({ _id: thisNote._id }, data, { new: true })
                // const addNote = new noteMod({
                //     crsID: req.body.crsID,
                //     Name: req.body.Name,
                //     Note: upload.secure_url,
                //     PublicID: upload.public_id
                // })
                // await addNote.save()
                res.redirect(`/viewCourse/${req.body.crsID}`)
            } else {
                res.render('school/courses/notes/addNote', { courses, msg: 'Invalid File Type'})
            }
        } else {
            res.render('school/courses/notes/addNote', { courses, msg: 'Fill all the Fields'})
        }
        // res.render('school/courses/notes/addNote',{ courses })
    } catch (err) {
        console.log(err)
    }
})

router.post('/cover/:bam', async (req, res) => {
    const id = req.params.bam
    try {
        console.log(req.files)
        if (req.files != null) {
            const cover = req.files.Cover
            if (cover.mimetype=='image/apng' || cover.mimetype=='image/avif' ||cover.mimetype=='image/gif' || cover.mimetype=='image/jpeg' || cover.mimetype=='image/png' || cover.mimetype=='image/svg+xml' || cover.mimetype=='image/webp') {
                const upload = await cloudinary.v2.uploader.upload(cover.tempFilePath, { resource_type: 'image', folder: process.env.coursebook, use_filename:false,unique_filename:true})
                const addCover = new noteMod({
                    crsID: id,
                    Name: ' ',
                    Note: ' ',
                    Cover: upload.secure_url,
                    PublicID: ' ',
                })
                await addCover.save()
                res.redirect(`/addNote/${id}`)
            } else {
                alert('Invalid File Type')
            }
        } else {
            alert("The Cover Field must be Filled")
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = router