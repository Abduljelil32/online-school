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

app.get('/', (req, res) => res.send('Hello World!'))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))