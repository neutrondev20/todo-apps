import { precacheAndRoute } from 'workbox-precaching'
import { LocalMission } from './data/local/local_missions';

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

const cacheName      = 'js13kPWA-v1';
const contentToCache = [ "index.html"]
const denyList       = ["/missions"]

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

self.addEventListener("install", (event) => {
    
    console.log('[Service Worker] Install');

    self.skipWaiting();

    // event.waitUntil((async () => {
        
    //     const cache = await caches.open(cacheName);

    //     console.log('[Service Worker] Caching all: app shell and content');

    //     await cache.addAll(contentToCache);

    // })());
})

self.addEventListener("fetch", async event => {

    const url = new URL(event.request.url);

    if (denyList.includes(url.pathname) || event.request.method !== "GET")
        return console.log(url.pathname, " Denied");

    console.log(`[Service Worker] Fetched resource ${url}`);

    event.respondWith((async () => {
        
        const r = await caches.match(event.request);
        
        console.log(`[Service Worker] Fetching resource: ${url}`);

        if (r) {

            console.log(`[Service Worker] From cache: ${url}`);

            return r;
        } 

        const response = await fetch(event.request);

        const cache    = await caches.open(cacheName);

        console.log(`[Service Worker] Caching new resource: ${url}`);

        cache.put(event.request, response.clone());

        return response;

    })())
})  

self.addEventListener('sync', (event : Event) => {

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