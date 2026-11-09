'use strict';

self.addEventListener('push', event => {
  let payload;
  try {
    payload = event.data?.json();
  } catch {
    payload = null;
  }
  const id = /^[0-9a-f]{8}$/.test(payload?.id) ? payload.id : '';
  const text = typeof payload?.body === 'string' ? payload.body.slice(0, 180) : 'Получено тестовое уведомление.';
  const body = id ? `${text}\nКод: ${id}` : text;
  event.waitUntil(self.registration.showNotification('Проверка веб-пушей', { body, data: { id } }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL('./', self.registration.scope);
  if (event.notification.data?.id) target.searchParams.set('push', event.notification.data.id);
  event.waitUntil(self.clients.openWindow(target.href));
});
