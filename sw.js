/* DM Maintenance Portal — service worker: shows emergency notifications, even when the portal is closed */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: 'DM Maintenance', body: e.data ? e.data.text() : '' }; }
  var opts = {
    body: d.body || '', tag: d.tag || 'dm', renotify: true, requireInteraction: true,
    icon: 'icon-192.png', badge: 'icon-192.png', vibrate: [300, 120, 300, 120, 600],
    data: { url: d.url || self.registration.scope }
  };
  e.waitUntil(self.registration.showNotification(d.title || 'DM Maintenance', opts));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || self.registration.scope;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) { var c = list[i]; if (c.url.indexOf(self.registration.scope) === 0 && 'focus' in c) { c.navigate(url); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
