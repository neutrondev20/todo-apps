import { precacheAndRoute } from 'workbox-precaching'
import { LocalMission } from './data/local/local_missions';

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// the cache version gets updated every time there is a new deployment
const CACHE_VERSION = 1;
const CURRENT_CACHE = `main-${CACHE_VERSION}`;
const DENIED_LIST   = ["/missions"]

// these are the routes we are going to cache for offline support
// const cacheFiles = ['/index.html'];

async function fetchMission(request : {url : string, method : string, body : any}, checkServer : boolean = true) : Promise<Response>{

    const local    = new LocalMission();
    let   response : Response | null = null;
    let   error    = false;

    try {

        console.log(request.body);

        const headers = new Headers();

        headers.append("Content-Type", "application/json")
        headers.append("Accept", "application/json")
        
        response = checkServer ? await fetch(request.url) : await fetch(request.url, {
            method  : request.method,
            headers : headers, 
            body    : JSON.stringify(request.body)
        });

        if (response.status !== 200) {

            error = true;
        }
    } catch {

        error = true
    }

    if (error) {
        
        local.request.add({
            body   : request.body,
            method : request.method,
            url    : request.url
        });

        console.log("Register background sync");

         // @ts-ignore
         self.registration.sync.register("background-missions");
    }


    return response as Response;
}

// cache the current page to make it available for offline
async function update(request : Request, response : Response) : Promise<void> {

    console.log("[Service worker] Update cache");

    const cache = await caches.open(CURRENT_CACHE)

    cache.put(request, response.clone());
}

// fetch the resource from the network
function fromNetwork(request : Request, timeout : number) {

    return new Promise( async (resolve, reject) => {
        try {

            const timeoutId = setTimeout(reject, timeout);

            const response = await fetch(request);

            clearTimeout(timeoutId);

            await update(request, response);

            console.log("[Service worker] From network");

            resolve(response);  

        } catch {

            reject();
        }
    })
}

// fetch the resource from the browser cache
async function fromCache(request : Request) {

    console.log("[Service worker] From cache");

    return await caches.match(request);
}

// on activation we clean up the previously registered service workers
self.addEventListener("activate", (event) => {

    console.log('[Service Worker] Active');

    self.skipWaiting();

    // event.waitUntil(
    //     caches.keys().then(cacheNames => {
    //         return Promise.all(
    //             cacheNames.map(cacheName => {
    //                 if (cacheName !== CURRENT_CACHE) { return caches.delete(cacheName) }
    //             })
    //         )
    //     })
    // )
})

// on install we download the routes we want to cache for offline
self.addEventListener("install", (event) => {
    
    console.log('[Service Worker] Install');

    self.skipWaiting();   
})

self.addEventListener("fetch", async (event) => {

    const url = new URL(event.request.url);

    if (DENIED_LIST.includes(url.pathname) || event.request.method !== "GET")
        return console.log(event.request.method, url.pathname,  " Denied");

    event.respondWith(fromNetwork(event.request, 10000).catch(() => fromCache(event.request)) as Promise<Response>)
})  

self.addEventListener('sync', (event) => {

    const local = new LocalMission();

    console.log("run sync");
    // @ts-ignore
    console.log(event.tag);    
    
    // @ts-ignore
    if (event.tag === "background-missions") {

        console.log("Run background-missions sync");
        
        // @ts-ignore
        event.waitUntil((async () => {

            const request = await local.request.toArray() as any[];

            for (let i in request) {

                console.log(request[i]);

                await local.request.where("id").equals(request[i].id).delete();

                await fetchMission({...request[i]}, false);
            }

            self.registration.showNotification("Data berhasil sync ke server 👍");
        })())
        
    }
});