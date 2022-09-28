const router = require('express').Router()

router.get('/',async(req,res)=>{
    const sess= req.session
    if (sess.student) {
        try {
            res.send('home')
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/register')
    }
})

module.exports= router