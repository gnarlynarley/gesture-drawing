const timestamp = 1646034744445;
const build = [
  "/gesture-drawing/internal/start-3b9ef1de.js",
  "/gesture-drawing/internal/pages/__layout.svelte-fe1023b4.js",
  "/gesture-drawing/internal/assets/pages/__layout.svelte-92706ff4.css",
  "/gesture-drawing/internal/error.svelte-34b39950.js",
  "/gesture-drawing/internal/pages/index.svelte-744ee445.js",
  "/gesture-drawing/internal/assets/pages/index.svelte-2fead316.css",
  "/gesture-drawing/internal/chunks/vendor-e39e129d.js",
  "/gesture-drawing/internal/chunks/paths-4b3c6e7e.js"
];
const files = [
  "/gesture-drawing/assets/100.png",
  "/gesture-drawing/assets/1024.png",
  "/gesture-drawing/assets/114.png",
  "/gesture-drawing/assets/120.png",
  "/gesture-drawing/assets/128.png",
  "/gesture-drawing/assets/144.png",
  "/gesture-drawing/assets/152.png",
  "/gesture-drawing/assets/16.png",
  "/gesture-drawing/assets/167.png",
  "/gesture-drawing/assets/180.png",
  "/gesture-drawing/assets/192.png",
  "/gesture-drawing/assets/20.png",
  "/gesture-drawing/assets/256.png",
  "/gesture-drawing/assets/29.png",
  "/gesture-drawing/assets/32.png",
  "/gesture-drawing/assets/40.png",
  "/gesture-drawing/assets/50.png",
  "/gesture-drawing/assets/512.png",
  "/gesture-drawing/assets/57.png",
  "/gesture-drawing/assets/58.png",
  "/gesture-drawing/assets/60.png",
  "/gesture-drawing/assets/64.png",
  "/gesture-drawing/assets/72.png",
  "/gesture-drawing/assets/76.png",
  "/gesture-drawing/assets/80.png",
  "/gesture-drawing/assets/87.png",
  "/gesture-drawing/favicon.png",
  "/gesture-drawing/manifest.json"
];
const worker = self;
const FILES = `cache${timestamp}`;
const assets = /* @__PURE__ */ new Set([...build, ...files]);
worker.addEventListener("install", (event) => {
  event.waitUntil(caches.open(FILES).then((cache) => cache.addAll(Array.from(assets))).then(() => {
    worker.skipWaiting();
  }));
});
worker.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then(async (keys) => {
    for (const key of keys) {
      if (key !== FILES)
        await caches.delete(key);
    }
    worker.clients.claim();
  }));
});
async function fetchAndCache(request) {
  const cache = await caches.open(`offline${timestamp}`);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (err) {
    const response = await cache.match(request);
    if (response)
      return response;
    throw err;
  }
}
worker.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || event.request.headers.has("range"))
    return;
  const url = new URL(event.request.url);
  const isHttp = url.protocol.startsWith("http");
  const isDevServerRequest = url.hostname === self.location.hostname && url.port !== self.location.port;
  const isStaticAsset = url.host === self.location.host && assets.has(url.pathname);
  const skipBecauseUncached = event.request.cache === "only-if-cached" && !isStaticAsset;
  if (isHttp && !isDevServerRequest && !skipBecauseUncached) {
    event.respondWith((async () => {
      const cachedAsset = isStaticAsset && await caches.match(event.request);
      return cachedAsset || fetchAndCache(event.request);
    })());
  }
});
