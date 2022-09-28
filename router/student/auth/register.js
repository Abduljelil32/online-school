const router = require('express').Router()

router.get('/',async(req,res)=>{
    const sess= req.session
    if (sess.Student) {
        try {
            
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/register')
    }
})

module.exports= router