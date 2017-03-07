'use strict'
const app = require('express')();

app.get('/',function(req,res){
	res.send("express api page");
});
app.get('/hello',function(req,res){
	res.send({message:'hello world'});
});

app.listen(3001,function(){
	console.log('express api listen on 30001');
});

