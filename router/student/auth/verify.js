const router = require('express').Router(),
    bcrypt = require('bcrypt');
const student = require('../../../model/Student/student');
const student_Det = require('../../../model/Student/student_Det');
const randToken =require('rand-token').generator()

const mailer = require('nodemailer');
const auth = require('../../../model/Student/auth');
// const auth = require('../../../model/Student/auth');
const myemail = mailer.createTransport({
    service:process.env.service,
    host:process.env.host,
    port:465 ,
    auth: {
        user:process.env.email,
        pass: process.env.pass
    }
})

router.get('/otp',async(req,res)=>{
    const sess= req.session
    if (sess.student) {
        try {
            const user= await student.findOne({Email:sess.student})
            if (user) {
                if (user.verified==false) {
                    const det = await student_Det.findOne({stdID:user._id})
                    const otp= randToken.generate(4,'1234567890')
                    const reset = randToken.generate(16,'1234567890qwertyuiopasdfghjklzxcvbnm$')
                    await auth.updateOne({stdID:user._id},{OTP:otp, reset})
                    const mailoption= {
                        from: `${process.env.schoolName} <${process.env.email}>`,
                        to: user.Email,
                        subject: `Mr/Mrs ${det.Fname} ${det.Lname} OTP is here`,
                        html:`
                        <body>
        <center><h3>Your OTP to your accout is</h3></center>
        <center><h1>${otp}</h1></center>
    </body>`
                }
                await myemail.sendMail(mailoption)
                res.render('student/auth/verify/otp',{msg:''})
            } else {
                    res.redirect('/')
                }
            } else {
                sess.destroy()
                res.status(404).render('404')

            }
        } catch (error) {
            console.log(error);
            res.render('student/auth/verify/otp',{msg:'error occured refresh'})
        }
    } else {
        res.status(404).render('404')
    }
})

router.post('/otp',async (req,res)=>{
    const sess= req.session
    const collect = req.body
    if (sess.student) {
        try {
            const user= await student.findOne({Email:sess.student})
            if (user) {
                if (user.verified==false) {
                    const authchk = await auth.findOne({stdID:user._id})
                    const det = await student_Det({stdID:user._id})
                    if (collect.OTP!=null) {
                        if (collect.otp==authchk.OTP) {
                            await student.updateOne({_id:user._id, Email:sess.student},{verified:true})
                            const mailoption= {
                                from: `${process.env.schoolName} <${process.env.email}>`,
                                to: user.Email,
                                subject: `Mr/Mrs ${det.Fname} ${det.Lname} Account Verified`,
                                html:`
                                <body>
                <center><h3>Your account has been successfully been verified</h3></center>
            </body>`
                        }
                        await myemail.sendMail(mailoption)
                            res.redirect('/')
                        } else {
                            res.render('student/auth/verify/otp',{msg:'wrong OTP'})
                        }
                    } else {
                        res.render('student/auth/verify/otp',{msg:'Fill the form'})
                        
                    }
                    
            } else {
                    res.redirect('/')
                }
            } else {
                sess.destroy()
                res.status(404).render('404')

            }
        } catch (error) {
            console.log(error);
            res.render('student/auth/verify/otp',{msg:'error occured refresh'})
        }
    } else {
        res.status(404).render('404')
    }
})


module.exports= router