const express = require('express')

const router = express.Router()

const courseMod = require('../../../model/school/course')

router.get('/', (req, res) => {
    const sess= req.session
    if (sess.email && sess.password) {
        res.render('school/courses/createCourse')
    } else {
        res.redirect('adminLogin')
    }
})

router.post('/', async(req, res) => {
    console.log(req.body)
    let courses = await courseMod.find()
    try {
        const course = new courseMod({
            Name: req.body.courseName,
            CourseCode: req.body.courseCode,
            Price: req.body.price
        })
        await course.save()
        // res.render('school/dashboard', { courses })
        res.redirect('/admin/dashboard')
    } catch (err) {
        console.log(err)
        res.redirect('createCourse')
    }
})

module.exports = router