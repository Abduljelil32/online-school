const express = require('express')
const app = express()
const port = 5001

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

//express session
app.use(require('express-session')({secret:process.env.secret, resave:true, saveUninitialized:true, cookie:{expires:2678400000}}))

app.use('/addVideo', require('./router/school/courses/videos/addVideo')) // Create New Video

//express fileupload
app.use(require('express-fileupload')({useTempFiles:true}))


//mongoose
const mongoose= require('mongoose');
mongoose.connect(process.env.mongolink,{useUnifiedTopology:true,useNewUrlParser:true}).then(res=>{
    if (res) {
        console.log('db connected');
        app.listen(port, () => console.log(`listening on port ${port}!`))

    } else {
        console.log('db not conected');
    }
})

app.set('view engine', 'ejs')

app.use(express.static('public'))

////////////////////////////////////////////student////////////////////////////////////////////////////
app.use('/', require('./router/student/home'))// student home

app.use('/register', require('./router/student/auth/register'))// student register

app.use('/login', require('./router/student/auth/login'))// student login

app.use('/v', require('./router/student/auth/verify'))// student Verify

app.use('/student/edit', require('./router/student/editdetails'))// student home

app.use('/regcourse', require('./router/student/course/addCourse'))// student home

app.use('/student/course', require('./router/student/course/home'))// student home

//Admin routes
app.use('/adminLogin', require('./router/school/login')) // admin login

app.use('/admin', require('./router/school/dashboard')) // admin Dashboard

app.use('/createCourse', require('./router/school/courses/createCourse')) // createCourse

app.use('/editCourse', require('./router/school/courses/editCourse')) // Course Edit

app.use('/deleteCourse', require('./router/school/courses/deleteCourse')) // Course Delete

app.use('/viewCourse', require('./router/school/courses/viewCourse')) // View Course Details

app.use('/addNote', require('./router/school/courses/notes/addNote')) // Create New Note

app.use('/student', require('./router/school/students/student')) // View Student

app.use('/approve', require('./router/school/students/approve')) // Confirm Payment

app.use('/deleteStudent', require('./router/school/students/delete')) // Delete Student

app.use('/deleteNote', require('./router/school/courses/notes/deleteNote')) // Delete Note

app.use('/deleteVideo', require('./router/school/courses/videos/deleteVideo')) // Delete Video

// Global 404 Page
app.use((req, res)=>{
    res.status(404).render('404')
})