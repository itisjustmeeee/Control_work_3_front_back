const express = require('express');
const socketIo = require('socket.io');
const webpush = require('web-push');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

let subscriptions = [];
let tasks = [];
let reminderTimers = {};

const server = http.createServer(app);

const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

function scheduleReminder(task) {
    if (!task.reminder) return;

    const delay = new Date(task.reminder).getTime() - Date.now();

    if (delay <= 0) return;

    if (reminderTimers[task.id]) {
        clearTimeout(reminderTimers[task.id]);
    }

    reminderTimers[task.id] = setTimeout(() => {
        console.log('Напоминание:', task.text);

        const payload = JSON.stringify({
            title: 'Напоминание',
            body: task.text,
            reminder: task.reminder,
            id: task.id
        });

        subscriptions.forEach(sub => {
            webpush.sendNotification(sub, payload)
                .catch(err => console.error('Push error:', err));
        });

        io.emit('reminderTriggered', task);

        delete reminderTimers[task.id];

    }, delay);
}

io.on('connection', (socket) => {
    console.log('Клиент подключен', socket.id);

    socket.on('newTask', (task) => {
        tasks.push(task);

        io.emit('taskAdded', task);

        scheduleReminder(task);

        const payload = JSON.stringify({
            title: 'Новая задача',
            body: task.text,
            reminder: task.reminder,
            id: task.id
        });

        subscriptions.forEach(sub => {
            webpush.sendNotification(sub, payload)
                .catch(err => console.error('Push error:', err));
        });
    });

    socket.on('disconnect', () => {
        console.log('Клиент отключен:', socket.id);
    });
});

app.post('/snooze', (req, res) => {
    const { id } = req.body;

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({ error: 'Задача не найдена' });
    }

    const newReminder = Date.now() + 5 * 60 * 1000;

    task.reminder = newReminder;

    scheduleReminder(task);

    io.emit('reminderUpdated', task);

    res.json({ message: 'Отложено', task });
});

app.get('/vapid-public-key', (req, res) => {
    res.send(process.env.VAPID_PUBLIC_KEY);
});

app.post('/subscribe', (req, res) => {
    subscriptions.push(req.body);
    res.status(201).json({ message: 'Подписка сохранена' });
});

app.post('/unsubscribe', (req, res) => {
    const { endpoint } = req.body;
    subscriptions = subscriptions.filter(sub => sub.endpoint !== endpoint);
    res.json({ message: 'Подписка удалена' });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});