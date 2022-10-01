const course = require('../../../model/school/course')
const Notes = require('../../../model/school/Notes')
const video = require('../../../model/school/video')
const StdCRS = require('../../../model/StdCRS')
const student = require('../../../model/Student/student')
const student_Det = require('../../../model/Student/student_Det')

const router = require('express').Router()

router.get('/:id',async(req,res)=>{
    const sess= req.session,
    id = req.params.id
    if (sess.student) {

        try {
            const stud = await student.findOne({Email:sess.student})
            if (stud) {
                if (stud.verified==true) {
                    const studentCSR = await StdCRS.findOne({_id:id,stdID:stud._id})
                    if (studentCSR) {
                        const courseDet= await course.findOne({_id:studentCSR.crsID})
                        if (courseDet) {
                            const allVideo= await video.find({crsID:courseDet._id}),
                                allnotes = await Notes.find({crsID:courseDet._id}),
                                det = await student_Det.findOne({stdID:stud._id});
                            res.render('student/course/home',{user:det, courseDet,allVideo,allnotes})
                            
                        } else {
                            res.status(404).render('404')
                        }
                    } else {
                        res.status(404).render('404')
                    }
                } else {
                    res.redirect('/v/otp')
                }
                
            } else {
                res.status(404).render('404')
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(404).render('404')
    }
})

module.exports=router