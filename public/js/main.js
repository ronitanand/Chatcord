const chatForm=document.getElementById('chat-form');
const socket=io();
const chatMessages=document.querySelector(".chat-messages");
const roomName=document.getElementById('room-name');
const  userList=document.getElementById('users')

const {username,room}=json.parse(location.search,{
    ignoreQueryPrefix:true
})

// console.log(username,room);
//join chatrrom

socket.emit('joinRoom',{username,room});

//get room and users

socket.on('roomUsers',({room,users})=>{
  outputRoomName(room);
  outputUsers(users);  
});


socket.on("message",message=>{
    console.log(message);
    outputMessage(message);


    //scroll down
     chatMessages.scrollTop=chatMessages.scrollHeight;

})

//message submit

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg=e.target.elements.msg.value;

    //emit msg to server
    socket.emit('chatMessage',msg);
    
    //clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();



})

const outputMessage=(message)=>{
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`
    <p class="meta">${message.username}<span>${message.time}</span></p>
						<p class="text">
${message.text}
						</p>
    `;

    document.querySelector('.chat-messages').appendChild(div);
    

}


function outputRoomName(room){

    roomName.innerText=room;

}

function outputUsers(users){
    userList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}
    
    `
}