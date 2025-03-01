let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = null;
let admins = new Set(['Elforjane']);
let messages = JSON.parse(localStorage.getItem('messages')) || [];
let onlineUsers = new Set();

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

    users[username] = { password, role: admins.has(username) ? 'admin' : 'user' };
    localStorage.setItem('users', JSON.stringify(users));

    currentUser = username;
    onlineUsers.add(username);
    updateOnlineUsers();

    document.getElementById('login-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'flex';
    document.getElementById('input-container').style.display = 'flex';

    if (username === 'Elforjane') {
        document.getElementById('admin-panel').style.display = 'block';
    }

    displayMessages();
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (messageText === '') return;

    const message = { user: currentUser, text: messageText, time: new Date().toLocaleTimeString() };
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
    messageInput.value = '';

    displayMessages();
}

function displayMessages() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.innerHTML = '';

    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.innerHTML = `<strong>${msg.user}:</strong> ${msg.text} <small>${msg.time}</small>`;
        chatContainer.appendChild(messageElement);
    });

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function updateOnlineUsers() {
    const onlineList = document.getElementById('online-users');
    onlineList.innerHTML = '';
    onlineUsers.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        onlineList.appendChild(li);
    });
    document.getElementById('online-count').textContent = onlineUsers.size;
}

window.onload = () => {
    displayMessages();
    updateOnlineUsers();
}
