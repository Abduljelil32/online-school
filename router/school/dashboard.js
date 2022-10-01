const express = require('express')

const router = express.Router()

const courseMod = require('./../../model/school/course')

router.get('/', (req, res) => {
    res.redirect('adminLogin')
})

router.get('/dashboard', async (req, res) => {
    const courses = await courseMod.find()
    res.render('school/dashboard', { courses })
})

module.exports = router