const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const webpush = require('web-push');

app.use(express.json());

// Cấu hình cặp khóa VAPID (Khóa định danh để gửi thông báo an toàn)
// Bạn có thể giữ nguyên cặp khóa mẫu này để chạy thử ngay lập thiện
const vapidKeys = {
    publicKey: 'BJ0_l8D_jD4qXvC8VzP0DEX-8W9XW_9vO27pU6X2mB_D3N3oD3K9N3mO2_R3vX3oD_D3N3oD3K9N3mO27pU6Xw',
    privateKey: 'h_D3N3oD3K9N3mO27pU6Xw_D3N3oD3K9N3mO27pU6Xw'
};

webpush.setVapidDetails(
    'mailto:example@yourdomain.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Lưu trữ token thiết bị của 2 máy ngầm trên bộ nhớ server
let subscriptions = {
    "mina_user_1": null, // Của Chi
    "mina_user_2": null  // Của Anh
};

// Cho phép truy cập trực tiếp file cấu hình PWA từ thư mục gốc
app.get('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, 'manifest.json')));
app.get('/service-worker.js', (req, res) => res.sendFile(path.join(__dirname, 'service-worker.js')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API nhận và lưu Token thông báo từ điện thoại gửi lên
app.post('/api/subscribe', (req, res) => {
    const { userId, subscription } = req.body;
    if (userId && subscription) {
        subscriptions[userId] = subscription;
    }
    res.status(201).json({});
});

// API để máy này kích hoạt chuông báo thức máy kia khi bấm gọi
app.post('/api/trigger-call', (req, res) => {
    const { partnerId, callerName } = req.body;
    const partnerSub = subscriptions[partnerId];

    if (!partnerSub) {
        return res.status(404).json({ error: 'Người nhận chưa bật nhận thông báo hoặc ngoại tuyến!' });
    }

    const payload = JSON.stringify({
        title: '📞 Cuộc gọi đến từ ' + callerName,
        body: 'Bấm vào đây để mở ứng dụng và nhận cuộc gọi ngay!'
    });

    webpush.sendNotification(partnerSub, payload)
        .then(() => res.status(200).json({ success: true }))
        .catch(err => {
            console.error("Lỗi gửi push:", err);
            res.status(500).json({ error: 'Không thể gửi thông báo!' });
        });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server PWA đang chạy trên port: ${PORT}`);
});
