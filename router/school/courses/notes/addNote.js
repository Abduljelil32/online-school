const express = require('express')
const alert = require('alert')

const router = express.Router()

const courseMod = require('./../../../../model/school/course')
const noteMod = require('./../../../../model/school/Notes')

const cloudinary = require('cloudinary')

router.get('/', async (req, res) => {
    const courses = await courseMod.find()
    console.log(courses)
    res.render('school/courses/notes/addNote',{ courses, msg: '' })
})

router.post('/', async (req, res) => {
    try {
        const courses = await courseMod.find()
        console.log(courses)
        console.log(req.body)
        console.log(req.files)
        if (req.body.crsID != null && req.body.Name != null) {
            const note = req.files.Note
            if (note.mimetype == 'application/pdf' || note.mimetype == 'application/msword') {
                const upload = await cloudinary.v2.uploader.upload(note.tempFilePath, { resource_type: 'auto', folder: process.env.coursebook, use_filename: false, unique_filename:true })
                const thisNote = await noteMod.findOne({ crsID: ' ' })
                console.log(thisNote)
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

router.post('/cover', async (req, res) => {
    try {
        console.log(req.files)
        if (req.files != null) {
            const cover = req.files.Cover
            if (cover.mimetype=='image/apng' || cover.mimetype=='image/avif' ||cover.mimetype=='image/gif' || cover.mimetype=='image/jpeg' || cover.mimetype=='image/png' || cover.mimetype=='image/svg+xml' || cover.mimetype=='image/webp') {
                const upload = await cloudinary.v2.uploader.upload(cover.tempFilePath, { resource_type: 'image', folder: process.env.coursebook, use_filename:false,unique_filename:true})
                const addCover = new noteMod({
                    crsID: ' ',
                    Name: ' ',
                    Note: ' ',
                    Cover: upload.secure_url,
                    PublicID: ' ',
                })
                await addCover.save()
                res.redirect('/addNote')
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