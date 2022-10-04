const express = require('express')

const router = express.Router()

const courseMod = require('./../../model/school/course')
const studentDetMod = require('./../../model/Student/student_Det')

router.get('/', (req, res) => {
    res.render('school/login', { emailMsg: '', passwordMsg: '', msg: '' })
})

router.post('/', async(req, res) => {
    const sess = req.session
    const adminEmail = process.env.admin
    const adminPassword = process.env.password
    const email = req.body.email
    const password = req.body.password
    const courses = await courseMod.find()
    const students = await studentDetMod.find()
    if (email != adminEmail && password != adminPassword) {
        res.render('school/login', { emailMsg: '', passwordMsg: '' , msg: 'Incorrect Email and Password'})
    } else if (password != adminPassword) {
        res.render('school/login', { emailMsg: '', passwordMsg: 'Incorrect Password' , msg: ''})
    } else if (email != adminEmail) {
        res.render('school/login', { emailMsg: 'Incorrect Email', passwordMsg: '' , msg: '' })
    } else {
        sess.email = email
        sess.password = password
        // console.log(sess)
        res.render('school/dashboard', { courses, students })
    }
})

module.exports = router