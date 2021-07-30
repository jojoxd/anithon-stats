import { createApp } from 'vue'
import App from './App.vue'

import createRouter from './plugin/router';

createApp(App)
    .use(createRouter())
    .mount('#app')
