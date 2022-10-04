const express = require('express')

const router = express.Router()

const courseMod = require('./../../model/school/course')
const studentDetMod = require('./../../model/Student/student_Det')

router.get('/', (req, res) => {
    const sess = req.session
    if (sess.email && sess.password) {
        res.redirect('/admin/dashboard')
    } else {
        res.redirect('adminLogin')
    }
})

router.get('/dashboard', async (req, res) => {
    const sess = req.session
    if (sess.email && sess.password) {
        const courses = await courseMod.find()
        const students = await studentDetMod.find()
        console.log(courses) 
        console.log(students)
        res.render('school/dashboard', { courses, students })
    } else {
        res.redirect('/admin')
    }
})

module.exports = router