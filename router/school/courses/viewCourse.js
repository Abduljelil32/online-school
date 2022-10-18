const express = require('express')

const router = express.Router()

const courseMod = require('./../../../model/school/course')
const stdCRSMod = require('./../../../model/StdCRS')
const studentDetMod = require('./../../..//model/Student/student_Det')
const noteMod = require('./../../../model/school/Notes')
const videoMod = require('./../../../model/school/video')
const Notes = require('./../../../model/school/Notes')

router.get('/:id', async (req, res, next) => {
    const sess = req.session
    if (sess.email && sess.password) {
        const id = req.params.id
        const course = await courseMod.findById({ _id: id })
        const students = await stdCRSMod.find({ crsID: id })
        const notes = await noteMod.find({ crsID: id })
        const videos = await videoMod.find({ crsID: id })
    
        const studentID = []
    
        for (let i = 0; i <= students.length-1; i++){
            const dem = studentID.push(students[i].stdID)
        }
        // console.log(studentID)
    
    
        const data = []
    
        for ( let m = 0; m <= studentID.length-1; m++){
            const studentDetails = await studentDetMod.find({ stdID: studentID[m] })
            // console.log(studentDetails[0])
            const info = data.push(studentDetails[0])
        }
        // console.log(data)
    
        res.render('school/courses/viewCourse', { course, data, notes, videos })
        
        // if (course == null) {
        //     res.redirect('/admin/dashboard')
        // } else {
        //     res.render('school/courses/viewCourse', { course })
        // }
    } else {
        res.redirect('/admin')
    }
})

module.exports = router