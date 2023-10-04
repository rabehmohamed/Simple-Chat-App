const socket = io('http://localhost:5000');

const clientsTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageTone = new Audio('/message-tone.mp3');

socket.on('clients-total' , (data) => {
    clientsTotal.innerText= `Total CLients : ${data}`;
});

messageForm.addEventListener('submit' , (e)=> {
    e.preventDefault();
    sendMessage();
});


function sendMessage() {
    if(messageInput.value === '') return;
    const data = {
        name : nameInput.value,
        message : messageInput.value,
        date : new Date()
    }
    socket.emit('message' , data);
    //CLIENT 
    addMessage(true , data);
    messageInput.value = '';
}

socket.on('chat-message' , data =>{
    messageTone.play();
    addMessage(false , data);
});

function addMessage (myMessage , data){
    const element = `
    <li class="${myMessage ? "message-right" : "message-left"}">
        <p class="message">
            ${data.message}
            <span>${data.name} ● ${moment(data.date).fromNow()}</span>
        </p>
    </li>`;

    messageContainer.innerHTML += element;
    scroll();
}

function scroll(){
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
      feedback: `✍️ ${nameInput.value} is typing a message`,
    })
  })
  
  messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
      feedback: `✍️ ${nameInput.value} is typing a message`,
    })
  })
  messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
      feedback: '',
    })
  })

  socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
          <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
          </li>
    `
    messageContainer.innerHTML += element
  });

  function clearFeedback (){
    document.querySelectorAll('li.message-feedback').forEach(el => {
        el.parentNode.removeChild(el);
    })
  }