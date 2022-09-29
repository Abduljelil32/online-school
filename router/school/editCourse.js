const express = require('express')

const router = express.Router()

const courseMod = require('./../../model/school/course')

router.get('/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    res.render('school/editCourse',{ id })
})

router.post('/:id', (req, res) => {
    console.log(req.body)
    console.log(req.params)
    // const course = await courseMod.findOne({ })
    // await courseMod.updateOne({ })
})

module.exports = router