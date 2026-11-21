// Service worker do Jokenpy: deixa o app abrir sem internet e recebe os lembretes (Web Push).
// Rodar código e a IA continuam precisando do servidor; escolha, lacuna e montagem funcionam offline.
const VERSAO = 'jokenpy-v4'
const ESSENCIAL = ['/', '/manifest.webmanifest', '/cursos/indice.json', '/icones/icone-192.png']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ESSENCIAL)).then(() => self.skipWaiting()))
})
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k))))
    .then(() => self.clients.claim()))
})

// rede primeiro (conteúdo sempre novo); sem rede, a última cópia guardada
async function redePrimeiro(req, chave = req) {
  const cache = await caches.open(VERSAO)
  try {
    const res = await fetch(req)
    if (res.ok) cache.put(chave, res.clone())
    return res
  } catch {
    const guardado = await cache.match(chave, { ignoreSearch: chave === req && req.mode === 'navigate' })
    if (guardado) return guardado
    throw new Error('offline')
  }
}
// fontes e ícones quase nunca mudam: cache primeiro
async function cachePrimeiro(req) {
  const cache = await caches.open(VERSAO)
  const guardado = await cache.match(req)
  if (guardado) return guardado
  const res = await fetch(req)
  if (res.ok || res.type === 'opaque') cache.put(req, res.clone())
  return res
}

self.addEventListener('fetch', e => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin === location.origin) {
    // não guarda: trilha privada (com senha), progresso, IA e lembretes
    if (/^\/(trilhas|progresso|ia|avisos|executar|salvar)\b/.test(url.pathname)) return
    if (req.mode === 'navigate') return e.respondWith(redePrimeiro(req, '/'))
    if (url.pathname.startsWith('/icones/')) return e.respondWith(cachePrimeiro(req))
    return e.respondWith(redePrimeiro(req))
  }
  if (url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com') e.respondWith(cachePrimeiro(req))
})

// ---------- lembretes ----------
self.addEventListener('push', e => {
  let d = {}
  try { d = e.data?.json() || {} } catch { d = { corpo: e.data?.text() } }
  const titulo = d.titulo || 'Hora de estudar'
  e.waitUntil(Promise.all([
    self.registration.showNotification(titulo, {
      body: d.corpo || 'Cinco minutos hoje mantêm a sua ofensiva.',
      icon: '/icones/icone-192.png', badge: '/icones/badge-96.png',
      tag: d.tag || 'lembrete', renotify: true,
      data: { url: d.url || '/?ir=continuar' },
      actions: [{ action: 'estudar', title: 'Estudar agora' }, { action: 'revisar', title: 'Revisão de 2 min' }],
    }),
    self.navigator.setAppBadge?.(1).catch(() => {}),
  ]))
})

self.addEventListener('notificationclick', e => {
  e.notification.close()
  const destino = e.action === 'revisar' ? '/?ir=revisao' : e.notification.data?.url || '/?ir=continuar'
  e.waitUntil((async () => {
    const abertas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    for (const c of abertas) {
      if (new URL(c.url).origin === location.origin) { await c.focus(); return c.navigate(destino) }
    }
    return self.clients.openWindow(destino)
  })())
})
