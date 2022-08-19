import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

// import style
import './index.css'

const app = createApp(App);

app.use(router);

app.mount('#app')
