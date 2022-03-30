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
const CACHE_NAME = 'offline';
// Customize this with a different URL if needed.
const OFFLINE_URL = '/';

const getURI = url => url.split(_URL)[1];

console.warn('[Service Worker] Base URL ', _URL);
console.warn('[Service Worker] Assets ', _ASSETS);

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {

    console.warn('[Service Worker] Install ', CACHE_NAME);

    const cache = await caches.open(CACHE_NAME);
    // Setting {cache: 'reload'} in the new request will ensure that the response
    // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
    await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));

    for(let assetsSrc of _ASSETS){

      console.warn('[Service Worker] Install ', assetsSrc);

      const cacheAssetsSrc = await caches.open(assetsSrc);
      // Setting {cache: 'reload'} in the new request will ensure that the response
      // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
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

self.addEventListener('fetch', (event) => {
  // We only want to call event.respondWith() if this is a navigation request
  // for an HTML page.

  // console.warn('[Service Worker] Fetch ', event);
  console.warn('[Service Worker] Fetch ', getURI(event.request.url));
  const assetsValidator = _ASSETS.includes(getURI(event.request.url));
  if (event.request.mode === 'navigate' || assetsValidator) {
    event.respondWith((async () => {
      try {
        // First, try to use the navigation preload response if it's supported.
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          console.warn('[Service Worker] [Navigator Middleware] [Preload Response]', event.request);
          return preloadResponse;
        }

        // Always try the network first.
        console.warn('[Service Worker] [Navigator Middleware] [Network Response]', event.request);
        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        // catch is only triggered if an exception is thrown, which is likely
        // due to a network error.
        // If fetch() returns a valid HTTP response with a response code in
        // the 4xx or 5xx range, the catch() will NOT be called.
        // console.log('Fetch failed; returning offline page instead.', error);
        // console.warn('[Service Worker] [Navigator Middleware] [Cached Response]', event.request);
        if(assetsValidator){
          console.warn('[Service Worker] [Navigator Middleware] [Cached Response] [Asset]', event.request);
          const cacheAsset = await caches.open(getURI(event.request.url));
          const cachedAssetResponse = await cacheAsset.match(getURI(event.request.url));
          return cachedAssetResponse;
        }else{
          console.warn('[Service Worker] [Navigator Middleware] [Cached Response] [Url]', event.request);
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
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
