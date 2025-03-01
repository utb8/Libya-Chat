let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = null;
let messages = JSON.parse(localStorage.getItem('messages')) || [];

function validateUsername(input) {
    const regex = /^[a-zA-Z0-9_]+$/;
    if (!regex.test(input.value)) {
        input.setCustomValidity('اليوزر يجب أن يحتوي على أحرف إنجليزية فقط.');
    } else {
        input.setCustomValidity('');
    }
}

function register() {
    const username = document.getElementById('username-input').value.trim();
    const password = document.getElementById('password-input').value.trim();

    if (!/^[a-zA-Z0-9_]+$/.test(username) || password.length < 4) {
        alert('تأكد من أن اليوزر بالإنجليزية وكلمة السر أكثر من 4 أحرف.');
        return;
    }

    users[username] = { password };
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = username;

    document.getElementById('login-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'flex';
    document.getElementById('input-container').style.display = 'flex';

    displayMessages();
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (messageText === '') return;

    const message = { id: Date.now(), user: currentUser, text: messageText, time: new Date().toLocaleTimeString() };
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
    messageInput.value = '';

    playNotification();
    displayMessages();
}

function displayMessages() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.innerHTML = '';

    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.innerHTML = `
            <strong>${msg.user}:</strong> ${msg.text} <small>${msg.time}</small>
            <div>
                <button class="edit-btn" onclick="editMessage(${msg.id})">تعديل</button>
                <button class="delete-btn" onclick="deleteMessage(${msg.id})">حذف</button>
            </div>
        `;
        chatContainer.appendChild(messageElement);
    });

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function editMessage(id) {
    const newText = prompt('عدل رسالتك:');
    if (!newText) return;

    const message = messages.find(msg => msg.id === id);
    if (message && message.user === currentUser) {
        message.text = newText;
        localStorage.setItem('messages', JSON.stringify(messages));
        displayMessages();
    } else {
        alert('لا يمكنك تعديل رسالة شخص آخر!');
    }
}

function deleteMessage(id) {
    messages = messages.filter(msg => msg.id !== id || msg.user === currentUser);
    localStorage.setItem('messages', JSON.stringify(messages));
    displayMessages();
}

function playNotification() {
    document.getElementById('notification-sound').play();
}

window.onload = () => {
    displayMessages();
}
