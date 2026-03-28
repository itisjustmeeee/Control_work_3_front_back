const CACHE_NAME = 'new_notes_cache_v1.0';
const ASSETS = [
    '/',
    '/src/App.jsx',
    '/src/main.jsx',
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
                return Promise.allSettled(
                    ASSETS.map(asset => cache.add(asset))
                );
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request)
                    .then(fetchResponse => {
                        return fetchResponse;
                    })
                    .catch(() => {
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});