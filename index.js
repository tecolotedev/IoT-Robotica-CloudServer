const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let theta11Server = 0;
let theta21Server = 0;
let theta12Server = 48.18*Math.PI/180;
let theta22Server = 131.82*Math.PI/180;

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
  const {theta11,theta21,theta12,theta22} = req.body;

  io.emit('iniciarAngulos',{theta11:theta11*Math.Pi/180,theta21:theta21*Math.Pi/180,theta12:theta12*Math.Pi/180,theta22:theta22*Math.Pi/180});
  theta11Server = theta11*Math.Pi/180;
  theta21Server = theta21*Math.Pi/180;
  theta12Server = theta12*Math.Pi/180;
  theta22Server = theta22*Math.Pi/180;
  axios.post(`${process.env.PUERTO}/posicion`,req.body).then(res=>{
                                                            io.emit('iniciarAngulos',res.data);
                                                            
                                                          }).catch(err=>{io.emit('iniciarAngulos',res.data);
                                                          console.log('hubo un error');
                                                          });
  res.json({ok:true,puerto:process.env.PUERTO,prueba:'asdfjahkjf'})
});



io.on('connection', (client) => { 
  console.log('conectado');
  io.emit('iniciarAngulos',{theta11Server,
                            theta21Server,
                            theta12Server,
                            theta22Server});  
});



let puerto = process.env.PORT || 9000;
server.listen(puerto,()=>console.log(9000));