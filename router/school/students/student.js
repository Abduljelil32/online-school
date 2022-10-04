const express = require('express')

const router = express.Router()

const studentDetMod = require('./../../../model/Student/student_Det')
const studentCourseMod = require('./../../../model/StdCRS')

router.get('/:id', async (req, res) => {
    const sess = req.session
    if (sess.email && sess.password) {
        const id = req.params.id
        const student = await studentDetMod.findById({ _id: id })
        const stdID = student.stdID
        const verify = await studentCourseMod.find({ stdID: stdID })
        // console.log(verify[0].RecieptIMG)
        res.render("school/students/student", { student, verify })
    } else {
        res.redirect('/admin')
    }
})


module.exports = router