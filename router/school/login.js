const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('school/login', { emailMsg: '', passwordMsg: '', msg: '' })
})

router.post('/', (req, res) => {
    const adminEmail = "lincoln@gmail.com"
    const adminPassword = "meAndyOu"
    const email = req.body.email
    const password = req.body.password
    if (email != adminEmail && password != adminPassword) {
        res.render('school/login', { emailMsg: '', passwordMsg: '' , msg: 'Incorrect Email and Password'})
    } else if (password != adminPassword) {
        res.render('school/login', { emailMsg: '', passwordMsg: 'Incorrect Password' , msg: ''})
    } else if (email != adminEmail) {
        res.render('school/login', { emailMsg: 'Incorrect Email', passwordMsg: '' , msg: '' })
    } else {
        res.render('school/dashboard')
    }
})

module.exports = router