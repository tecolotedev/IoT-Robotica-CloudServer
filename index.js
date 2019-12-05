const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const theta11Server = 0;
const theta21Server = 0;
const theta12Server = 48.18*Math.PI/180;
const theta22Server = 131.82*Math.PI/180;

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
  axios.post(`${process.env.PUERTO}/posicion`,req.body).then(res=>{
                                                            io.emit('iniciarAngulos',res.data);
                                                            theta11Server = res.data.theta11Server;
                                                            theta21Server = res.data.theta21Server;
                                                            theta12Server = res.data.theta12Server;
                                                            theta22Server = res.data.theta22Server;
                                                          }).catch(err=>console.log('hubo un error'));
  res.json({ok:true,puerto:process.env.PUERTO,prueba:'asdfjahkjf'})
});



io.on('connection', (client) => { 
  console.log('conectado')
  io.emit('iniciarAngulos',{theta11Server,
                            theta21Server,
                            theta12Server,
                            theta22Server})  
});



let puerto = process.env.PORT || 9000;
server.listen(puerto,()=>console.log(9000));