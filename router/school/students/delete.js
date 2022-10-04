const express = require('express')

const router = express.Router()

const studentDetMod = require('./../../../model/Student/student_Det')
const studentMod = require('./../../../model/Student/student')
const courseMod = require('./../../../model/StdCRS')
const authMod = require('./../../../model/Student/auth')

router.get('/:id', async (req, res, next) => {
    const sess = req.session
    const id = req.params.id
    console.log(id)
    if (sess.email && sess.password) {
        try {
            const studentDetail = await studentDetMod.findById({ _id: id })
            // console.log(studentDetail)
            const studentID = studentDetail.stdID
            // console.log(studentID)
            const student = await studentMod.findById({ _id: studentID })
            // console.log(student)
            const studentCourse = await courseMod.findOne({ stdID: studentID })
            // console.log(studentCourse)
            const studentAuth = await authMod.findOne({ stdID: studentID})
            // console.log(studentAuth)
            authMod.findOneAndDelete({ stdID: studentID }, (err, docs) => {
                if (err) {
                    console.log(err)
                    next(err)
                } else {
                    courseMod.findOneAndDelete({ stdID: studentID }, (err, docs) => {
                        if (err) {
                            console.log(err)
                            next(err)
                        } else {
                            studentDetMod.findOneAndDelete({ stdID: studentID }, (err, docs) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    studentMod.findByIdAndDelete({ _id: studentID }, (err, docs) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            console.log("Deleted Succesfully")
                                            res.redirect('/admin/dashboard')
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        } catch (err) {
            console.log(err)
        }
        // res.send("Deleted")
    } else {
        res.redirect('/admin')
    }
})

module.exports = router