// Nama cache
const CACHE_NAME = 'nakulaku-ecosystem-v2.3'; // Saya naikkan versinya

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // 'https://cdn.tailwindcss.com',  <-- HAPUS BARIS INI (Ini biang keroknya)
  'https://unpkg.com/lucide@latest',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
  'https://raw.githubusercontent.com/iwan4943/nakulaku/refs/heads/main/nakula.png'
];

// Install SW
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Mulai caching file penting...');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Gagal cache (Install Gagal):', err))
  );
});

// Fetch Strategy: Stale-While-Revalidate (Lebih aman untuk PWA)
// Strategi ini: Cek cache dulu, tampilkan, lalu update di background
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 1. Jika ada di cache, pakai itu
      if (cachedResponse) {
        // (Opsional) Update cache di background
        fetch(event.request).then(networkResponse => {
            if(networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, networkResponse.clone());
                });
            }
        }).catch(() => {}); // Abaikan error offline
        return cachedResponse;
      }

      // 2. Jika tidak ada di cache, ambil dari internet
      return fetch(event.request);
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
