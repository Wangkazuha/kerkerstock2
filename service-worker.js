// 簡單的 Service Worker，讓網頁符合 PWA 安裝標準
const CACHE_NAME = 'tw-stock-ai-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // 股市資料需要即時性，這裡優先使用網路請求
  event.respondWith(
    fetch(event.request).catch(() => {
      // 若斷線，嘗試讀取快取
      return caches.match(event.request);
    })
  );
});