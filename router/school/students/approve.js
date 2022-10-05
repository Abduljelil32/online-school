const express = require('express')

const router = express.Router()

const studentCourseMod = require('./../../../model/StdCRS')
const studentDetMod = require('./../../../model/Student/student_Det')
const studentMod = require('./../../../model/Student/student')

const mailer = require('nodemailer')
const cloudinary = require('cloudinary')

const myemail = mailer.createTransport({
    service: process.env.service,
    host: process.env.host,
    port: 465,
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
})

router.get('/:stdID', async (req, res, next) => {
    const sess = req.session    
    if (sess.email && sess.password) {
        const id = req.params.stdID
        // console.log(id)
        const locate = await studentCourseMod.findOne({ stdID: id })
        // console.log(locate)
        const him = await studentDetMod.findOne({ stdID: id })
        // console.log(him.stdID)
        const userEmail = him.stdID
        const hisID = him._id
        // console.log(hisID)
        studentCourseMod.findOneAndUpdate({ stdID: id }, { stdID: locate.stdID, crsID: locate.crsID, RecieptIMG: locate.RecieptIMG, publicID: locate.publicID, Verified: "true", AmountPaid: locate.AmountPaid }, (err, docs) => {
            if (err) {
                console.log(err)
                next(err)
            } else {
                sendEmail = async () => {
                    // console.log("Payment Confirmed")
                    const user = await studentMod.findById({ _id: userEmail })
                    // console.log(user.Email)
                    if (user) {
                        const mailoption = {
                            from: `${process.env.schoolName} <${process.env.email}>`,
                            to: user.Email,
                            subject: `Hello ${him.Fname} ${him.Lname}`,
                            html: `<body>
                            <center><h1>Your Payment Has been Confirmed</h1></center>
                            </body>`
                        }
                        await myemail.sendMail(mailoption)
                        res.redirect(`/student/${hisID}`)
                    } else {
                        console.log("No user Available")
                    }
                }
                sendEmail()
            }
        })
    } else {
        res.redirect('adminLogin')
    }
})

router.get('/:stdID/decline', async (req, res, next) => {
    const sess = req.session
    if (sess.email && sess.password) {
        const id = req.params.stdID
        // console.log(id)
        const locate = await studentCourseMod.findOne({ stdID: id })
        // console.log(locate)
        const him = await studentDetMod.findOne({ stdID: id })

        // console.log(him.stdID)

        const receiptUser = await studentCourseMod.findOne({ stdID: him.stdID })
        // console.log(receiptUser)

        const PublicID = receiptUser.publicID
    
        const userEmail = him.stdID
        const hisID = him._id
        // console.log(hisID)
        studentCourseMod.findOneAndUpdate({ stdID: id }, { stdID: locate.stdID, crsID: locate.crsID, RecieptIMG: locate.RecieptIMG, publicID: locate.publicID, Verified: "false", AmountPaid: locate.AmountPaid }, (err, docs) => {
            if (err) {
                console.log(err)
                next(err)
            } else {
                studentCourseMod.findOneAndDelete({ stdID: him.stdID }, (err, docs) => {
                    if (err) {
                        console.log(err)
                        next(err)
                    } else {
                        cloudinary.v2.uploader.destroy(PublicID).then(result => {
                            console.log(result)
                        })
                        sendEmail = async () => {
                            // console.log("Payment Declined")
                            const user = await studentMod.findById({ _id: userEmail })
                            // console.log(user.Email)
                            if (user) {
                                const mailoption = {
                                    from: `${process.env.schoolName} <${process.env.email}>`,
                                    to: user.Email,
                                    subject: `Hello ${him.Fname} ${him.Lname}`,
                                    html: `<body>
                                    <center><h1>Your Payment Has been Declined</h1></center>
                                    </body>`
                                }
                                await myemail.sendMail(mailoption)
                                res.redirect(`/viewCourse/${locate.crsID}`)
                            } else {
                                console.log("No user Available")
                            }
                        }
                        sendEmail()
                    }
                })
            }
        })
    } else {
        res.redirect('/admin')
    }
})

module.exports = router