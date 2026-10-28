// Service Worker do Fotoprova/Revistec (Relatório Fotográfico de Campo)
// Objetivo: depois da primeira visita (com internet), o app deve abrir
// e funcionar 100% mesmo sem nenhuma conexão, para uso em campo.

const CACHE_NAME = 'relatorio-campo-v5'; // v5: master troca de empresa offline; v4: link da empresa (?empresa=) abre do cache; v3: SDK do Firebase offline
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// Arquivos do Firebase (versão FIXA, então nunca mudam). Antes não eram guardados:
// o navegador os trata como "opacos" (status 0) e a regra antiga só guardava status 200.
// Sem eles no cache, sem sinal o login/nuvem ficava esperando a rede até dar erro.
const FIREBASE_SDK = [
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
];

// Na instalação, guarda uma cópia do app inteiro. Cada arquivo é adicionado
// individualmente (cache.addAll falharia por inteiro se UM arquivo não existisse).
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled([
        ...APP_SHELL.map((url) => cache.add(url)),
        ...FIREBASE_SDK.map((url) =>
          fetch(new Request(url, { mode: 'no-cors' })).then((resp) => cache.put(url, resp))
        ),
      ])
    )
  );
});

// Ao ativar, remove versões antigas do cache.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // 1) SDK do Firebase: cache primeiro (versão fixa). Sem cache, tenta a rede e guarda.
  if (FIREBASE_SDK.includes(req.url)) {
    event.respondWith(
      caches.match(req.url).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((resp) => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req.url, clone));
          return resp;
        });
      })
    );
    return;
  }

  // 2) Qualquer outro endereço de fora do app (mapas, geocodificação, Firebase API,
  //    WhatsApp...): NÃO intercepta. O navegador cuida direto, sem camada extra de espera.
  if (new URL(req.url).origin !== self.location.origin) return;

  // 3) Arquivos do próprio app: responde NA HORA com a cópia salva (rápido e funciona
  //    sem internet) e, por trás, busca versão nova para a próxima abertura.
  // Abrir o app por um link com parâmetro (ex.: ?empresa=K7P2QX) usa a mesma cópia salva do app.
  const chave = req.mode === 'navigate' ? './index.html' : req;
  event.respondWith(
    caches.match(chave).then((cached) => {
      const networkFetch = fetch(req)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(chave, clone));
          }
          return response;
        })
        .catch(() => cached); // sem internet: usa o que já está salvo
      if (cached) { event.waitUntil(networkFetch.catch(() => {})); return cached; }
      return networkFetch;
    })
  );
});
