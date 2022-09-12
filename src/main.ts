import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { registerSW } from "virtual:pwa-register";

// import style
import './index.css'

const app   = createApp(App);
const pinia = createPinia();

// register service wor
if ("serviceWorker" in navigator) {
    console.log("register service worker");
    registerSW();
    console.log("request notification");
    Notification.requestPermission();
}

app.use(pinia)
app.use(router);

app.mount('#app')
