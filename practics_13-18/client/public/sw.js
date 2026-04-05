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
            .then(cache => {
                return cache.addAll(ASSETS);
            })
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
            if (cachedResponse) {
                return cachedResponse
            }

            return fetch(event.request)
                .then(networkResponse => {
                    return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        console.log('SW fetch', event.request.url);
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
        body: "У вас есть новое сообщение"
    };
    
    if (event.data) {
        data = event.data.json();
    }

    const options = {
        body: data.body,
        icon: '/icons/omori_icon_192.png',
        badge: '/icons/omori_icon_64.png'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow('/')
    );
});