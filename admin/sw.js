// Versi Cache (Ubah angka ini jika Anda update kodingan HTML agar user dapat versi baru)
const CACHE_NAME = 'nakula-admin-v1.0';

// Daftar file yang akan disimpan di memori HP (Offline Support)
const urlsToCache = [
  './admin.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
  'https://raw.githubusercontent.com/iwan4943/nakulaku/refs/heads/main/admin/nkladm.png'
];

// 1. Install Service Worker & Cache Aset
self.addEventListener('install', event => {
  self.skipWaiting(); // Langsung aktifkan SW baru tanpa menunggu tutup tab
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Menyimpan aset Admin ke cache...');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Gagal cache:', err))
  );
});

// 2. Fetch Strategy: Cache First, Network Fallback
// (Cari di HP dulu, kalau gak ada baru download internet)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika ada di cache, pakai itu
        if (response) {
          return response;
        }
        // Jika tidak, ambil dari internet
        return fetch(event.request).then(response => {
          // Cek validitas respon
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          return response;
        });
      })
  );
});

// 3. Aktivasi & Hapus Cache Lama (Agar user tidak terjebak di versi jadul)
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
