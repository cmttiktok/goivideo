const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);

// Cho phép truy cập trực tiếp file index.html ở thư mục gốc
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Cấu hình Port cho Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server đang chạy trên port: ${PORT}`);
});
