const student = require('../../../model/Student/student');
const student_Det = require('../../../model/Student/student_Det');

const router = require('express').Router()
const cloudinary = require('cloudinary')

router.get('/',async(req,res)=>{
    res.render('student/auth/register',{msg:''})
})

router.post('/',async(req,res)=>{
    const sess = req.session;
    const collect = req.body;
    try {
        if (collect.Email!=null && collect.Pass!=null && collect.FName!=null && collect.LName!=null&& collect.PhoneNo!=null) {
            if ((collect.Email).length>3 && (collect.Pass).length>6 &&(collect.FName).length>2 && (collect.LName).length>2 && (collect.PhoneNo).length>3 ) {
                const checkEmail = await student.findOne({Email:collect.Email})
                const checkPhNO = await student_Det.findOne({PhnNo:collect.PhoneNo});
                if (checkEmail || checkPhNO) {
                    const imagee= req.files.image
                    if (imagee.mimetype=='image/apng' || imagee.mimetype=='image/avif' ||imagee.mimetype=='image/gif' || imagee.mimetype=='image/jpeg' || imagee.mimetype=='image/png' || imagee.mimetype=='image/svg+xml' || imagee.mimetype=='image/webp') {
                        const upload = await cloudinary.v2.uploader.upload(imagee.tempFilePath,{resource_type:'image',folder:process.env.profileFolder, use_filename:false,unique_filename:true})
                        const addstudent = new student({
                            Email:collect.Email,
                            password:collect.Pass,
                            verified:false
                        })
                        const savestudent =await addstudent.save()
                        const addDET = new student_Det({
                            stdID:savestudent._id,
                            Fname:collect.FName,
                            Lname:collect.LName,
                            PhnNo:collect.PhoneNo,
                            imgUrl:upload.secure_url,
                            publicId:upload.public_id
                        })
                        await addDET.save()
                        sess.student = collect.Email
                        res.redirect('/verification')
                    } else {
                        res.render('student/auth/register',{msg:'Invalid filetype'})
                    }
                } else {
                    res.render('student/auth/register',{msg:'User already exist'})
                }
            } else {
                res.render('student/auth/register',{msg:'fill all the field well'})
            }
        } else {
            res.render('student/auth/register',{msg:'fill all the field'})
        }
    } catch (error) {
        console.log(error);
        res.render('student/auth/register',{msg:'error occurred'})
    }
})

module.exports= router