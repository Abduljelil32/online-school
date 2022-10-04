const express = require('express')

const router = express.Router()

const courseMod = require('./../../model/school/course')

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
        console.log(courses) 
        res.render('school/dashboard', { courses })
    } else {
        res.redirect('/admin')
    }
})

module.exports = router