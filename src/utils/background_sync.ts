import { LocalMission } from "../data/local/local_missions";

const local = new LocalMission();

export const backgroundSync = async (request : {url : string, method : string, body : any}) => {

    const registration = await navigator.serviceWorker.ready;

    // @ts-ignore
    if (!registration.sync) {
        console.log("Browser not support background sync");
        alert("Browser not support background sync");
        return
    }
    
    await local.request.add({
        url    : request.url,
        method : request.method,
        body   : request.body,
    })

    console.log("Sync registered background-missions");
    

    // @ts-ignore
    await registration.sync.register('background-missions');
}