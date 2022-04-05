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

// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

// https://web.dev/cache-api-quick-guide/

// https://developer.mozilla.org/en-US/docs/Web/API

// https://developer.mozilla.org/es/docs/Web/Progressive_web_apps/Re-engageable_Notifications_Push

// https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification


/*

There are MANY (2021 updated):
I believe the information in this resource from google
and/or this link will help you to find alternatives for
saving information on the client-side.

Basically... there are currently 4 different ways to
 store data on client-side without using cookies:

- Local Storage (Session and Local key/value pairs)
- Web SQL (my favorite, it's a whole SQL Database, and it's NOT obsolete)
- IndexedDB (another Database with different structure and acceptance)
- Service Workers (Persistent background processing,
even while offline, can asynchronously save files and many other things)

I believe that for your specific need the Local Storage pairs are the easiest solution.

A service worker is a type of local service
that interact with operating native systems

*/


// -----------------------------------------------------------------------------
// VIRTUAL EXPRESS SERVER
// -----------------------------------------------------------------------------

var _SERVICES = [];

var MainProcess = {
  app: {
    post: (uri, service) => _SERVICES.push({method: 'POST', uri, service}),
    get: (uri, service) => _SERVICES.push({method: 'GET', uri, service}),
  },
  data: {
    charset: 'utf8'
  }
};

var info = {
  api: (req, obj) => null
};

var fs = {
  readFileSync: async (JSON_POSTS_PATH, charset) => {
    try {
      console.log('readFileSync data:', JSON_POSTS_PATH);
      const cacheAsset = await caches.open(JSON_POSTS_PATH);
      const cachedAssetResponse = await cacheAsset.match(JSON_POSTS_PATH);
      return JSON.stringify(await cachedAssetResponse.json());
    }catch(error){
      // console.error(error);
      console.log('readFileSync return default JSON');
      return JSON.stringify([]);
    }
  },
  writeFileSync: async (JSON_POSTS_PATH, newData, charset) => {
    try {
      console.log('writeFileSync data:', JSON_POSTS_PATH);
      console.log(newData);
      const options = {
         headers: {
           'Content-Type': 'application/json'
         }
      };
      const cache = await caches.open(JSON_POSTS_PATH);
      await cache.put(JSON_POSTS_PATH, new Response(JSON.stringify(JSON.parse(newData)), options));
    }catch(error){
      console.error(error);
      return;
    }
  },
  existsSync: async (JSON_POSTS_PATH) => {
    try {
      console.log('existsSync data:', JSON_POSTS_PATH);
      return caches.has(JSON_POSTS_PATH);
    }catch(error){
      console.error(error);
      return false;
    }
  }
};

var colors = {
  red: strLog => console.error('[Service Woker]', strLog),
  yellow: strLog => console.warn('[Service Woker]', strLog),
  green: strLog => console.log('[Service Woker]', strLog)
};

class Ajv {
  constructor(){}
  addFormat(){}
  getSchema(){
    return () => true;
  }
}

/* POSTS VIRTUAL API */

var POSTS_VIRTUAL_API = new Posts(MainProcess);

// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
const OFFLINE_VERSION = 1;

console.warn('[Service Worker] Base URL ', _URL);
console.warn('[Service Worker] Assets ', _ASSETS);
console.warn('[Service Worker] Api ', _API);
console.warn('[Service Worker] Dev ', _DEV);
console.warn('[Service Worker] Views ', _VIEWS);
console.warn('[Service Worker] Services ', _SERVICES);

// -----------------------------------------------------------------------------
// PWA INIT
// -----------------------------------------------------------------------------

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

      /*
      setInterval(()=>{


            clients.matchAll().then( clientList => {
                  clientList.map( client => {
                        console.log(client);
                        client.postMessage({
                          test: 'test'
                        });
                        // client -> document.visibilityState
                        //           client.visibilityState
                  });
            });


      }, 2000);
      */

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

        // First, try to use the navigation preload response if it's supported.
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          console.warn('[Service Worker] [Navigator Middleware] [Preload Response]', _URI);
          return preloadResponse;
        }

        // Exit early if we don't have access to the client.
        // Eg, if it's cross-origin.
        if (!event.clientId) return;

        // Get the client.
        const client = await clients.get(event.clientId);

        // Exit early if we don't get the client.
        // Eg, if it closed.
        // console.warn('[Service Worker] [Request-Client]', client);
        if (!client) return;

        // Send a message to the client.
        /*
        client.postMessage({
          msg: "Hey I just got a fetch from you!",
          url: event.request.url
        });
        */

        if(apiValidator){
          console.warn('[Service Worker] [API Request]', event);
          let REQUEST_HEADERS = {};
          for (var pair of event.request.headers.entries()) {
             REQUEST_HEADERS[pair[0]] = pair[1];
          }
          console.warn('[Service Worker] [Headers]', REQUEST_HEADERS);
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

          let _HEADERS = {};
          const execResponse = async _REQUEST => {
            for(let apiObj of _SERVICES){
              if((apiObj.uri == _URI || apiObj.uri+'/' == _URI) && (event.request.method==apiObj.method)){
                let _DATA = await apiObj.service(
                  // REQUEST OBJ
                  _REQUEST,
                  // RESPONSE OBJ
                  {
                    end: strResponse => strResponse,
                    writeHead: (status, headers) => {
                      _HEADERS = headers;
                    }
                  }
                );
                return new Response(_DATA, _HEADERS);

              }
            }
          };

          switch (_URI) {
            case '/posts/':
              if(event.request.method === 'GET'){
                return await execResponse({
                  body: {},
                  query: {
                    s: undefined
                  },
                  params: {}
                });
                /*
                return new Response(JSON.stringify({
                  success: true,
                  data: []
                }),{
                     headers: { "Content-Type" : "application/json" }
                 });
                 */
              }
            case '/posts':
              if(event.request.method === 'POST'){

                 // Clone headers as request headers are immutable

                 // await REQ.arrayBuffer();
                 // await REQ.blob();
                 // await REQ.json();
                 // await REQ.text();
                 // await REQ.formData();

                // console.warn('BODY', await REQ.json());

                return await execResponse({
                  body: await REQ.json(),
                  query: {},
                  params: {}
                });

                //  almacenar y recuperar data en cache de posts
                /*
                return new Response(JSON.stringify({
                  success: false,
                  data: []
                }),{
                     headers: { "Content-Type" : "application/json" }
                 });
                 */
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
