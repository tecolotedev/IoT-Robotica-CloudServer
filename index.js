const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

const path = require('path');

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/posicion',(req,res)=>{
  axios.post(`${process.env.PUERTO}/posicion`,req.data).then(res=>console.log(res)).cath(err=>console.log(err));
  res.json({ok:true,puerto:process.env.PUERTO})
});

let puerto = process.env.PORT || 9000;

app.listen(puerto);