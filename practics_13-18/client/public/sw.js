const CACHE_NAME = 'new_notes_cache_v1.0';
const DYNAMIC_CACHE_NAME = 'dynamic_new_notes_cache_v1.0'

const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/omori_icon_512.png',
    '/icons/omori_icon_256.png',
    '/icons/omori_icon_192.png',
    '/icons/omori_icon_128.png',
    '/icons/omori_icon_64.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME && key !== DYNAMIC_CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) return cachedResponse;

            return fetch(event.request)
                .then(networkResponse => {
                    return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                })
                .catch(() => {
                    if (event.request.mode == "navigate") {
                        return caches.match('/index.html');
                    }
                });
        })
    );
});

self.addEventListener('push', (event) => {
    let data = {
        title: "Новое уведомление",
        body: "У вас есть задача",
        reminder: null
    };
    
    if (event.data) data = event.data.json();

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/icons/omori_icon_192.png',
            badge: '/icons/omori_icon_64.png',

            actions: [
                { action: 'open', title: 'Открыть' },
                { action: 'snooze', title: 'Отложить' }
            ],

            data: {
                id: data.id,
                url: '/'
            }
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'snooze') {
        event.waitUntil(
            fetch('http://localhost:3001/snooze', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: event.notification.data.id
                })
            })
        );
    } else {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});