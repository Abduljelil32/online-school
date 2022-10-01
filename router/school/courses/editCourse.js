const express = require('express')

const router = express.Router()

const courseMod = require('../../../model/school/course')

router.get('/:id', (req, res, next) => {
    const id = req.params.id
    console.log(id)
    courseMod.findOneAndUpdate({ _id: id }, req.body, { new:true }, (err, docs) => {
        if (err) {
            console.log(err)
            next(err)
        } else {
            res.render('school/courses/editCourse', { course: docs })
        }
    })
})

router.post('/:id', (req, res, next) => {
    const id = req.params.id
    console.log(id)
    console.log(req.body)
    courseMod.findByIdAndUpdate({ _id: id }, { Name: req.body.courseName, CourseCode: req.body.courseCode, Price: req.body.price},  (err, docs) => {
        if (err) {
            console.log(err)
            next(err)
        } else {
            console.log("Updated Succesfully")
            res.redirect('/admin/dashboard')
        }
    })
})

module.exports = router