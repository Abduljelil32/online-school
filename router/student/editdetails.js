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
                    res.render('student/editDet',{user:det, info:stud, msg:''})
                    
                } else {

                    res.redirect('/v/otp')
                }
                
            } else {
                sess.destroy
                res.status(404).render('404')
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/register')
    }
})


router.post('/',async(req,res)=>{
    const sess= req.session,
        collect = req.body;
    if (sess.student) {

        try {
            const stud = await student.findOne({Email:sess.student})
            if (stud) {
                if (stud.verified==true) {
                    const det= await student_Det.findOne({stdID:stud._id})
                    if (collect.FName!=null &&collect.LName!=null ) {
                        if ((collect.FName).length>2&& (collect.LName).length>3) {
                            await student_Det.updateOne({stdID:stud._id}, {Fname:collect.FName, Lname:collect.LName});
                            res.redirect('/')
                        } else {
                            res.render('student/editDet',{user:det, info:stud, msg:'fill the inputs well'})
                        }
                    } else {
                        res.render('student/editDet',{user:det, info:stud, msg:'fill the form'})
                    }                    
                } else {

                    res.redirect('/v/otp')
                }
                
            } else {
                sess.destroy
                res.status(404).render('404')
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(404).render('404')
    }
})

module.exports= router