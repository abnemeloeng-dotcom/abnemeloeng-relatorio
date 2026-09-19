// Service Worker do Fotoprova (Relatório Fotográfico de Campo)
// Objetivo: depois da primeira visita (com internet), o app deve abrir
// e funcionar 100% mesmo sem nenhuma conexão, para uso em campo.

const CACHE_NAME = 'relatorio-campo-v2'; // v2: adicionou ícone/manifest da marca Fotoprova
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// Na instalação, guarda uma cópia do app inteiro. Cada arquivo é
// adicionado individualmente (em vez de cache.addAll, que falha por
// inteiro se UM arquivo não existir) — assim, se por acaso faltar subir
// algum ícone novo, quem já está usando o app não fica sem atualização.
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(APP_SHELL.map((url) => cache.add(url)))
    )
  );
});

// Ao ativar, remove versões antigas do cache (de atualizações anteriores).
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Estratégia: responde IMEDIATAMENTE com a cópia salva (rápido e funciona
// sem internet), e por trás tenta buscar uma versão nova na rede para
// atualizar o cache silenciosamente, para a próxima vez que abrir.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached); // sem internet: usa o que já está salvo

      return cached || networkFetch;
    })
  );
});
