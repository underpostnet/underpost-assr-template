/*
Copyright 2015, 2019, 2020, 2021 Google LLC. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
const OFFLINE_VERSION = 1;

console.warn('[Service Worker] Base URL ', _URL);
console.warn('[Service Worker] Assets ', _ASSETS);
console.warn('[Service Worker] Api ', _API);
console.warn('[Service Worker] Dev ', _DEV);
console.warn('[Service Worker] Views ', _VIEWS);

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {

    // Setting {cache: 'reload'} in the new request will ensure that the response
    // isn't fulfilled from the HTTP cache; i.e., it will be from the network.

    for(let viewSrc of _VIEWS){
      console.warn('[Service Worker] Install View ', viewSrc);
      const cache = await caches.open(viewSrc);
      await cache.add(new Request(viewSrc, {cache: 'reload'}));
    }
    for(let assetsSrc of _ASSETS){
      console.warn('[Service Worker] Install Asset ', assetsSrc);
      const cacheAssetsSrc = await caches.open(assetsSrc);
      await cacheAssetsSrc.add(new Request(assetsSrc, {cache: 'reload'}));
    }

  })());
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Enable navigation preload if it's supported.
    // See https://developers.google.com/web/updates/2017/02/navigation-preload

    console.warn('[Service Worker] Activate ', event);

    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  })());

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

// -----------------------------------------------------------------------------
// WORKER SERVER
// -----------------------------------------------------------------------------

self.addEventListener('fetch', (event) => {
  // We only want to call event.respondWith() if this is a navigation request
  // for an HTML page.

  // console.warn('[Service Worker] Fetch ', event);

  // GET URI REQ
  const _URI = event.request.url.split(_URL)[1];

  console.warn('[Service Worker] Fetch ', _URI);
  const assetsValidator = _ASSETS.includes(_URI);
  const apiValidator = _API.includes(_URI);
  if (event.request.mode === 'navigate' || assetsValidator || apiValidator) {
    const REQ = event.request.clone();
    event.respondWith((async () => {
      try {

        if(apiValidator){
          console.warn('[Service Worker] [API Request]', event);
        }
        // First, try to use the navigation preload response if it's supported.
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          console.warn('[Service Worker] [Navigator Middleware] [Preload Response]', _URI);
          return preloadResponse;
        }

        // Always try the network first.
        const networkResponse = await fetch(event.request);
        console.warn('[Service Worker] [Navigator Middleware] [Network Response]', _URI);
        return networkResponse;
      } catch (error) {
        // catch is only triggered if an exception is thrown, which is likely
        // due to a network error.
        // If fetch() returns a valid HTTP response with a response code in
        // the 4xx or 5xx range, the catch() will NOT be called.
        // console.log('Fetch failed; returning offline page instead.', error);
        // console.warn('[Service Worker] [Navigator Middleware] [Cached Response]', event.request);
        if(assetsValidator){
          console.warn('[Service Worker] [Navigator Middleware] [Cached Response] [Asset]', _URI);
          const cacheAsset = await caches.open(_URI);
          const cachedAssetResponse = await cacheAsset.match(_URI);
          return cachedAssetResponse;
        }else if(apiValidator){
          console.warn('[Service Worker] [Navigator Middleware] [Cached Response] [Api] '+event.request.method+' -> ', _URI);

          switch (_URI) {
            case '/posts/':
              if(event.request.method === 'GET'){
                return new Response(JSON.stringify({
                  success: true,
                  data: []
                }),{
                     headers: { "Content-Type" : "application/json" }
                 });
              }
            case '/posts':
              if(event.request.method === 'POST'){

                 // Clone headers as request headers are immutable

                 // await REQ.arrayBuffer();
                 // await REQ.blob();
                 // await REQ.json();
                 // await REQ.text();
                 // await REQ.formData();

                console.warn('BODY', await REQ.json());

                // almacenar y recuperar data en cache de posts

                return new Response(JSON.stringify({
                  success: false,
                  data: []
                }),{
                     headers: { "Content-Type" : "application/json" }
                 });
              }
            default:
              return new Response(JSON.stringify({
                success: false,
                data: []
              }),{
                   headers: { "Content-Type" : "application/json" }
               });
          }
        }else{
          console.warn('[Service Worker] [Navigator Middleware] [Cached Response] [Url]', _URI);
          const cache = await caches.open(_URI);
          const cachedResponse = await cache.match(_URI);
          return cachedResponse;
        }
      }
    })());
  }

  // If our if() condition is false, then this fetch handler won't intercept the
  // request. If there are any other fetch handlers registered, they will get a
  // chance to call event.respondWith(). If no fetch handlers call
  // event.respondWith(), the request will be handled by the browser as if there
  // were no service worker involvement.
});






// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
























// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
