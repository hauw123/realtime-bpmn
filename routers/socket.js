const express = require('express');
const M_user = require('../models/user');
const M_project = require('../models/project');
const M_friend = require('../models/friendship');

// sockets.js
var socketio = require('socket.io');
exports.socketServer = function (app, server) {
  var io = socketio.listen(server);
  
  const projectroom = ["aaasgag","testgag"]

  io.of("/bpmndiagram")
    .on("connection", (socket) => {
      console.log("Client connected in namespace" + socket);
  
      socket.on("joinRoom",(room) => {
        console.log("join room chat")
        console.log(room.id)
        console.log(room.user)
        socket.join(room.id);
        socket.broadcast.to(room.id).emit('joinproject', {
          user: room.user,
          date:room.date
        });
        // console.log('joining room : '+ room);
          
        //   io.of("/bpmndiagram").emit("newUser", "New user has join the "+room)
        //   .in(room).emit("newUser", "New user has join "+ room)
        //   return socket.emit("success", "you have succesfully join this "+ room);

      });

      socket.on("joinRoomProject",(room) => {
        console.log("join room project")
        console.log(room.id)
        console.log(room.user)
        socket.join(room.id);
        // console.log('joining room : '+ room);
          
        //   io.of("/bpmndiagram").emit("newUser", "New user has join the "+room)
        //   .in(room).emit("newUser", "New user has join "+ room)
        //   return socket.emit("success", "you have succesfully join this "+ room);

      });
  
      socket.on("send message",(data) =>{
        // console.log('sending room post', data.room);
        // console.log('user : ',data.user)
        // console.log('message', data.message)
        // console.log('date ', data.date)
        
        socket.broadcast.to(data.room).emit('conversationproject', {
          message: data.message,
          user : data.user,
          date: data.date
        });
      })

      socket.on("send xml",(data)=>{
        console.log("update project xml")

        M_project
        .findOneAndUpdate({ _id: data.room }, { dataxml: data.xml, lastEdited: Date.now() })
        .then(function (project) {
        })
        
        socket.broadcast.to(data.room).emit('xmlproject',{
          xml:data.xml
        })
      })
  
      // socket.on('disconnect', function(data){
      //   console.log('Client disconnected')
      // });
    })

    setInterval(() => io.emit('time', new Date().toTimeString()), 10);
};



