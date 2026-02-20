// Service Worker for 英語学習ガイド PWA
const CACHE_NAME = 'english-study-v1';
const ASSETS = [
    '/english-study/',
    '/english-study/index.html',
    '/english-study/style.css',
    '/english-study/script.js',
    '/english-study/manifest.json',
    '/english-study/icon-192.png',
    '/english-study/icon-512.png'
];

// インストール時：アセットをキャッシュ
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// アクティベート時：古いキャッシュを削除
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(key) {
                    return key !== CACHE_NAME;
                }).map(function(key) {
                    return caches.delete(key);
                })
            );
        })
    );
    self.clients.claim();
});

// フェッチ時：キャッシュ優先、なければネットワーク
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(cached) {
            if (cached) return cached;
            return fetch(event.request).then(function(response) {
                // 正常なレスポンスのみキャッシュに追加
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                var toCache = response.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, toCache);
                });
                return response;
            }).catch(function() {
                // オフライン時はキャッシュ済みのindex.htmlを返す
                return caches.match('/english-study/index.html');
            });
        })
    );
});
