const express = require('express')

const router = express.Router()

const studentCourseMod = require('./../../../model/StdCRS')
const studentDetMod = require('./../../../model/Student/student_Det')

router.get('/:stdID', async (req, res, next) => {
    const id = req.params.stdID
    console.log(id)
    const locate = await studentCourseMod.findOne({ stdID: id })
    console.log(locate)
    const him = await studentDetMod.findOne({ stdID: id })
    // console.log(him._id)
    const hisID = him._id
    console.log(hisID)
    studentCourseMod.findOneAndUpdate({ stdID: id }, { stdID: locate.stdID, crsID: locate.crsID, RecieptIMG: locate.RecieptIMG, publicID: locate.publicID, Verified: "true", AmountPaid: locate.AmountPaid }, (err, docs) => {
        if (err) {
            console.log(err)
            next(err)
        } else {
            console.log("Payment Confirmed")
            res.redirect(`/student/${hisID}`)
        }
    })
})

module.exports = router