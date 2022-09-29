const StdCRS = require('../../model/StdCRS');
const student = require('../../model/Student/student');
const student_Det = require('../../model/Student/student_Det');

const router = require('express').Router()

router.get('/',async(req,res)=>{
    const sess= req.session
    if (sess.student) {

        try {
            const stud = await student.findOne({Email:sess.student})
            if (stud) {
                if (stud.verified==true) {
                    const det= await student_Det.findOne({stdID:stud._id})
                    const myCourse= await StdCRS.find({stdID:stud._id})
                    res.render('student/home',{user:det, info:stud, myCourse})
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
        res.redirect('/register')
    }
})

module.exports= router