const cloudinary = require('cloudinary')
const course = require('../../../model/school/course')
const StdCRS = require('../../../model/StdCRS')
const student = require('../../../model/Student/student')
const student_Det = require('../../../model/Student/student_Det')
const router = require('express').Router()

router.get('/',async(req,res)=>{
    const sess= req.session
    if (sess.student) {

        try {
            const stud = await student.findOne({Email:sess.student})
            if (stud) {
                if (stud.verified==true) {
                    const det= await student_Det.findOne({stdID:stud._id})
                    const allCrs= await course.find({})
                    
                    res.render('student/course/add', {allCrs ,schoolAccount:{bank:process.env.bankName, nmbr:process.env.acctNumber, Name:process.env.acctName }})
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


router.post('/',async(req,res)=>{
    const sess= req.session,
        collect = req.body;
    if (sess.student) {

        try {
            const stud = await student.findOne({Email:sess.student})
            if (stud) {
                if (stud.verified==true) {
                    const det= await student_Det.findOne({stdID:stud._id})
                    if (collect.crse!=null ) {
                        if ((collect.crse).length==24) {
                            const checkcrse = await course.findOne({_id:collect.crse})
                            if (checkcrse) {
                                const StdCrsCheck = await StdCRS.findOne({stdID:stud._id, crsID:checkcrse._id})
                                if (StdCrsCheck) {
                                    res.render('student/course/add',{user:det, info:stud, msg:'Already registered this course'})
                                    
                                } else {
                                    const reciept = req.files.image;
                                    if (reciept.mimetype=='image/apng' || reciept.mimetype=='image/avif' ||reciept.mimetype=='image/gif' || reciept.mimetype=='image/jpeg' || reciept.mimetype=='image/png' || reciept.mimetype=='image/svg+xml' || reciept.mimetype=='image/webp') {
                                        const upload = await cloudinary.v2.uploader.upload(reciept.tempFilePath,{resource_type:'image',folder:process.env.recieptfile,use_filename:false,unique_filename:true})
                                        const addreciept= new StdCRS({
                                            stdID:stud._id,
                                            crsID: checkcrse._id,
                                            RecieptIMG:upload.secure_url,
                                            publicID:upload.public_id,

                                        })
                                    } else {
                                        res.render('student/course/add',{user:det, info:stud, msg:'Invalid file type'})
                                    }
                                }
                            } else {
                                res.render('student/course/add',{user:det, info:stud, msg:'Invalid'})
                            }
                        } else {
                            res.render('student/course/add',{user:det, info:stud, msg:'fill the inputs well'})
                        }
                    } else {
                        res.render('student/course/add',{user:det, info:stud, msg:'fill the form'})
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
            res.render('student/course/add',{user:det, info:stud, msg:'error occured'})

        }
    } else {
        res.status(404).render('404')
    }
})

module.exports= router