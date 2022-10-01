const express = require('express')
const app = express()
const port = 3000

//dotenv
require('dotenv').config()

//bodyparser
const bodyparser= require('body-parser')
app.use(bodyparser.urlencoded({extended:true}))

//cloudinary
const cloudinary= require('cloudinary')
cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret
})

//morgan
app.use(require('morgan')('dev'))

//express fileupload
app.use(require('express-fileupload')({useTempFiles:true}))

//express session
app.use(require('express-session')({secret:process.env.secret, resave:true, saveUninitialized:true, cookie:{expires:2678400000}}))

//mongoose
const mongoose= require('mongoose')
mongoose.connect(process.env.mongolink,{useUnifiedTopology:true,useNewUrlParser:true}).then(res=>{
    if (res) {
        console.log('db connected');
        app.listen(port, () => console.log(`listening on port ${port}!`))

    } else {
        console.log('db not conected');
    }
})

app.set('view engine', 'ejs')


////////////////////////////////////////////student////////////////////////////////////////////////////
app.use('/', require('./router/student/home'))// student home

app.use('/register', require('./router/student/auth/register'))// student register

app.use('/login', require('./router/student/auth/login'))// student login

app.use('/v', require('./router/student/auth/verify'))// student Verify

app.use('/edit', require('./router/student/editdetails'))// student home


//Admin routes
app.use('/adminLogin', require('./router/school/login')) // admin login

app.use('/admin', require('./router/school/dashboard')) // admin Dashboard

app.use('/createCourse', require('./router/school/createCourse')) // createCourse

app.use('/editCourse', require('./router/school/editCourse')) // Course Edit