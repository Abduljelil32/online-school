const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('school/courses/notes/addNote')
})

module.exports = router