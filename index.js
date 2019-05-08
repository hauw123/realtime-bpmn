const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routers/apiuser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// const Auth = require('./middleware');
const Auth = require('./routers/auth');
const cors = require('cors');
const socketIO = require('socket.io');

//set up express app
const app = express();

// Add headers
app.use(cors());


const PORT = process.env.PORT || 3000;
const http = require('http');
const server = http.createServer(app);
const io = socketIO(server);
var sockets = require('./routers/socket');
sockets.socketServer(app, server);

//connect to mongodb Testing Hosting
mongoose.connect('mongodb://localhost/database_rtbpmn', {
  useNewUrlParser: true
});

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/database_rtbpmn', {
//   useNewUrlParser: true
// });
mongoose.Promise = global.Promise;

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({extended: true})); // to support URL-encoded bodies


app.use(session({
  secret: "rtbpmn secret for session",
  resave: false,
  saveUninitialized: false
}));



// app.use(function(req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   // Pass to next layer of middleware
//   next();
// });

//can delete
app.get('/api/users', (req, res) => {
  const users =[
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Rave', lastName: 'Smith'},
    {id: 3, firstName: 'Mary', lastName: 'Swan'}
  ];
  res.json(users);
});

app.use(cookieParser());



app.get('/api/home', Auth, function(req, res) {
  res.json({message : "Success"});
});


//Melakukan pengecekkan terhadap token yang dimiliki oleh user apa masih valid atau tidak
app.get('/auth', Auth, function(req, res) {
  res.sendStatus(200);
});

//routes api yang akan digunakan
app.use('/apiuser', routes);

//error handling middleware
app.use(function(err, req, res, next) {
  //console.log(err);
  res.status(422).send({
    error: err.message
  });
});

//lister for request
// app.listen(process.env.port || 3000, function() {
//   console.log('now listening for request');
// });

//Port yang akan digunakan 
server.listen(PORT, () => console.log('Server started on port'));

// const projectroom = ["aaasgag","testgag"]

// io.of("/project")
//   .on("connection", (socket) => {
//     console.log("Client connected in namespace");

//     socket.on("joinRoom",(room) => {
//       console.log('joining room : '+ room);
//       socket.join(room);
//       if(projectroom.includes(room)){
//         socket.join(room);
//         io.of("/project").emit("newUser", "New user has join the "+room)
//         .in(room).emit("newUser", "New user has join "+ room)
//         return socket.emit("success", "you have succesfully join this "+ room);
//       }
//       else{
//         return socket.emit("err", "No room" + room)
//       }
//     });

//     socket.on("send message",(data) =>{
//       console.log('sending room post', data.room);
//       console.log('user : ',data.user)
//       console.log('message', data.message)
//       socket.broadcast.to(data.room).emit('conversationproject', {
//         message: data.message,
//         user : data.user
//       });
//     })

//     // socket.on('disconnect', function(data){
//   	// console.log('Client disconnected')
//     // });
//   })

// io.on('connection', (socket) => {
//   console.log('new connection : ' + socket.id);


// 	socket.on('chat message', function(msg, user){
// 	console.log('message: ' + msg + user);
//     io.emit('chat message', msg, user);
//   	});

//   socket.on('disconnect', function(data){
//   	console.log('Client disconnected')
//   });
// });


// io.of("/project")
//   .on("connection", (socket) => {
//     console.log("Client connected in namespace");

//     socket.on("joinRoom",(room) => {
//       console.log('joining room : '+ room);
//       socket.join(room);
//     });

//     socket.on("send message",(data) =>{
//       console.log('sending room post', data.room);
//       console.log('user : ',data.user)
//       console.log('message', data.message)
//       socket.emit("check123","checking123")
//       socket.broadcast.to(data.room).emit('conversationproject', {
//         message: data.message,
//         user : data.user
//       });
//     })


//   })

// setInterval(() => io.emit('time', new Date().toTimeString()), 10);
