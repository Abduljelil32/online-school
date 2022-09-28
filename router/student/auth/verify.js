const router = require('express').Router()
const cloudinary = require('cloudinary'),
    bcrypt = require('bcrypt');
const student = require('../../../model/Student/student');
const student_Det = require('../../../model/Student/student_Det');
    
router.get('/',async(req,res)=>{
    res.render('student/auth/login',{msg:''})
})


router.post('/',async(req,res)=>{
    const sess = req.session;
    const collect = req.body;
    try {
        if (collect.Email!=null && collect.Pass!=null ) {
            if ((collect.Email).length>3 && (collect.Pass).length>6) {
                const checkEmail = await student.findOne({Email:collect.Email})
                if (checkEmail ) {
                    const chkpass = bcrypt.compareSync(collect.Pass,checkEmail.password)
                    if (chkpass==true) {
                        sess.student=collect.Email
                        if (checkEmail.verified==true) {
                            res.redirect('/')
                        } else {
                            res.redirect('/v/otp')
                        }
                    } else {
                        res.render('student/auth/login',{msg:'incorrect Password'})
                    }
                } else {
                    res.render('student/auth/login',{msg:'User doesnt exist'})
                }
            } else {
                res.render('student/auth/login',{msg:'fill all the field well'})
            }
        } else {
            res.render('student/auth/login',{msg:'fill all the field'})
        }
    } catch (error) {
        console.log(error);
        res.render('student/auth/login',{msg:'error occurred'})
    }
})


module.exports= router