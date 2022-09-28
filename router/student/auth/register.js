const router = require('express').Router()

router.get('/',async(req,res)=>{
    res.render('student/auth/register')
})

module.exports= router