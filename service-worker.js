self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : { title: 'Cuộc gọi đến', body: 'Đang có cuộc gọi chờ...' };
    
    const options = {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/3616/3616215.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/3616/3616215.png',
        vibrate: [500, 200, 500, 200, 500, 200, 500],
        data: { url: '/' },
        tag: 'call-notification', // Đè lên thông báo cũ nếu có
        renotify: true,
        requireInteraction: true // Thông báo sẽ ghim lại không tự biến mất cho đến khi bấm
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Khi người dùng bấm vào thông báo đẩy, tự động mở hoặc chuyển hướng về app
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
