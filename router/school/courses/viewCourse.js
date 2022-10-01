const express = require('express')

const router = express.Router()

const courseMod = require('./../../../model/school/course')
const stdCRSMod = require('./../../../model/StdCRS')
const studentMod = require('./../../../model/Student/student')

router.get('/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    const course = await courseMod.findById({ _id: id })
    // const students = await stdCRSMod.findOne({ crsID: id })
    const students = await stdCRSMod.findOne({ crsID: "6335acb28e00107fcfaa2f12" })
    console.log(students)
    if (course == null) {
        res.redirect('/admin/dashboard')
    } else {
        res.render('school/courses/viewCourse', { course })
    }
})

module.exports = router