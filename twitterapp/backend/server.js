var express= require('express');
var bodyParser=require('body-parser');
var cors= require('cors');
var functions=require('./functions');

var app= express();
app.use(bodyParser.urlencoded({extended:true}))//extended = true use qs that provides more powerful serialization/deserilization
app.use(cors());
app.post('/authorize/',functions.authorize);
console.dir(app.routes);
app.listen(3000);
