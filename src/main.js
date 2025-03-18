import router from "./router/router.js";
import "../src/assets/reset.css"
import { createApp } from 'vue'
import App from './App.vue'

createApp(App)
    .use(router)
    .mount('#app')
