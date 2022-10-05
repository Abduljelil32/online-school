const router = require('express').Router(),
    bcrypt = require('bcrypt');
const student = require('../../../model/Student/student');
const student_Det = require('../../../model/Student/student_Det');
const randToken =require('rand-token').generator()

const mailer = require('nodemailer');
const auth = require('../../../model/Student/auth');
// const { uid } = require('rand-token');
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
                    console.log(otp)
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
                    const det = await student_Det.findOne({stdID:user._id})
                    if (collect.otp!=null && collect.otp1!=null&& collect.otp2!=null&& collect.otp3!=null) {
                        const otp = `${collect.otp}${collect.otp1}${collect.otp2}${collect.otp3}`
                        if (otp==authchk.OTP) {
                            await student.updateOne({_id:user._id, Email:sess.student},{verified:true})
                            await auth.updateOne({stdID:user._id},{OTP:randToken.generate(4,'1234567890'), reset:randToken.generate(16,'1234567890qwertyuiopasdfghjklzxcvbnm$')})
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


router.get('/reset',async(req,res)=>{
    res.render('student/auth/verify/reset1',{msg:''})
})


router.post('/reset',async (req,res)=>{
    const collect = req.body
        try {
            if (collect.email!=null) {
                const user= await student.findOne({Email:collect.email})
            if (user) {
                    const det = await student_Det.findOne({stdID:user._id})
                    const otp = randToken.generate(4,'1234567890'),
                        reset = randToken.generate(16,'1234567890qwertyuiopasdfghjklzxcvbnm$')
                    await auth.updateOne({stdID:user._id},{OTP:otp, reset})

                        const mailoption= {
                                from: `${process.env.schoolName} <${process.env.email}>`,
                                to: user.Email,
                                subject: `Mr/Mrs ${det.Fname} ${det.Lname} password Reset`,
                                html:`
                                <body>
                <center><h3>click the link below to reset your password</h3></center>
<center><a href="${process.env.website}/v/reset/${reset}/${user._id}">click me</a></center>
                
            </body>`
                        }
                        await myemail.sendMail(mailoption)
                            res.render('success',{tlk:'Sent to email',goTo:'https://mail.google.com/'})
                        
                    
                    
            
            } else {
                res.render('student/auth/verify/reset1',{msg:'email doesnt exist'})


            }
            } else {
                res.render('student/auth/verify/reset1',{msg:'fill the form'})
                
            }
            
        } catch (error) {
            console.log(error);
            res.render('student/auth/verify/reset1',{msg:'error occured refresh'})
        }
    
})


router.get('/reset/:rescode/:uId',async(req,res)=>{
    const rescode= req.params.rescode,
        uID= req.params.uId;
    
    try {
        if (uID.length==24 && rescode.length==16) {
            const chkUID= await student.findOne({_id:uID})
            if (chkUID) {
                const checkreset= await auth.findOne({stdID:uID})
                if (checkreset) {
                    res.render('student/auth/verify/reset2',{msg:'', userID:uID, resetID: rescode})
                } else {
                    res.status(404).render('404')
                }
            } else {
            res.status(404).render('404')
                
            }
        } else {
            res.status(404).render('404')
        }
    } catch (error) {
        console.log(error);
    }
})


router.post('/reset/:rescode/:uId',async(req,res)=>{
    const rescode= req.params.rescode,
        uID= req.params.uId,
        collect = req.body;

    try {
        if (uID.length==24 && rescode.length==16) {
            const chkUID= await student.findOne({_id:uID})
            if (chkUID) {
                const checkreset= await auth.findOne({stdID:uID})
                if (checkreset) {
                    if (collect.pass!=null) {
                        if ((collect.pass).length>6) {
                            const det = await student_Det.findOne({})
                            await student.updateOne({_id:uID},{password:bcrypt.hashSync(collect.pass,10)})
                            await auth.updateOne({stdID:uID},{OTP:randToken.generate(4,'1234567890'), reset:randToken.generate(24,'1234567890qwertyuiopasdfghjklzxcvbnm$')})
                            const mailoption= {
                                from: `${process.env.schoolName} <${process.env.email}>`,
                                to: chkUID.Email,
                                subject: `Mr/Mrs ${det.Fname} ${det.Lname} password Reset`,
                                html:`
                                <body>
                <center><h3>Your password has been reset</h3></center>
<center><a href="${process.env.website}">Visit US</a></center>
                
            </body>`
                        }
                        await myemail.sendMail(mailoption)
                        res.redirect('/login')
                        } else {
                    res.render('student/auth/verify/reset2',{msg:'password should be greater than 6', userID:uID, resetID: rescode})
                            
                        }
                    } else {
                        res.render('student/auth/verify/reset2',{msg:'fill in your password', userID:uID, resetID: rescode})
                    }
                } else {
                    res.status(404).render('404')
                }
            } else {
            res.status(404).render('404')
                
            }
        } else {
            res.status(404).render('404')
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports= router