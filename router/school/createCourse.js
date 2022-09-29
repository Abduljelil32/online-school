const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('school/createCourse')
})

module.exports = router