const express = require('express')

const router = express.Router()

const courseMod = require('./../../../model/school/course')

router.get('/:id', (req, res, next) => {
    const id = req.params.id
    console.log(id)
    courseMod.findByIdAndDelete({ _id: id }, (err, docs) => {
        if (err) {
            console.log(err)
            next(err)
        } else {
            console.log("Deleted Succesfully")
            res.redirect('/admin/dashboard')
        }
    })
})

module.exports = router