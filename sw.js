// Service worker: lưu sẵn giao diện để mở app nhanh. Dữ liệu luôn lấy mới từ máy chủ.
const CACHE = 'cbkt-app-v2';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // không đụng tới API
  e.respondWith(fetch(e.request).then(r => {                                 // mạng trước, mất mạng thì dùng bản lưu
    const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
