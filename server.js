const path=require('path');
const http=require('http');
const express=require('express');
const socketio=require('socket.io');
const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser, userLeave,getRoomUser}=require('./utils/users');
const botname='Chatcord Bot';

const app=express();
const server=http.createServer(app);
const io=socketio(server);
//static folder
app.use(express.static(path.join(__dirname,'public')));

//when client connects

io.on("connection",(socket)=>{

    socket.on('joinRoom',({username,room})=>{
        const user=userJoin(socket.id,username,room);
        socket.join(user.room);



        socket.emit("message",formatMessage(botname,"Welcome to chatcord ! "));

        //broadcast whwn a user connects

        socket.broadcast.to(user.room).emit("message",formatMessage(botname,`${user.username} has joined the chat`));

        //send user and room info

        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUser(user.room)
        })

        

    });

    

   
   

    //when a client disconnects

    socket.on("disconnect",()=>{
        const user=userLeave(socket.id);

        if(user){

            io.to(user.room).emit('message',formatMessage(botname,` ${user.username}  has left the chat`));

        }

        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUser(user.room)
        })

        
    });

    //listen for chatmsg

    socket.on('chatMessage',(msg)=>{
        const user=getCurrentUser(socket.id);

        io.to(user.room).emit('message',formatMessage(user.username,msg));
    })
    
    
});

















server.listen(process.env.PORT||3000,()=>{
    console.log("server started on ", 3000);
})