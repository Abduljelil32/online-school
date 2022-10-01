// const bcrypt = require('bcrypt')
// console.log(bcrypt.hashSync('lincoln', 10));


// var x= [{id:3}, {id:2},{id:6}, {id:1}],
//     b= [{id:3},{id:6}];

// const d= b.map

// console.log(b.values);

var shortUrl = require("node-url-shortener");

 shortUrl.short("https://res.cloudinary.com/solutech11/image/upload/v1664549637/ulvxpuyvxjcsedr8b8my.jpg", function (err, url) {
    console.log(url);
});