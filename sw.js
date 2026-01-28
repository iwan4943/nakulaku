// Nama cache diperbarui agar browser mengambil versi terbaru
const CACHE_NAME = 'nakulaku-ecosystem-v2.0';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
  'https://raw.githubusercontent.com/iwan4943/nakulaku/refs/heads/main/nakula.png'
];

// Install SW
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.error('Gagal cache:', err))
  );
});

// Fetch Strategy: Cache First, Network Fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          // Jangan cache jika respon tidak valid atau dari extension chrome
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          return response;
        });
      })
  );
});

// Activate & Clean Old Caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
