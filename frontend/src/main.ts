import { createApp } from 'vue'
import App from './App.vue'
import Popper from 'vue3-popper';

import createRouter from './plugin/router';

createApp(App)
    .use(createRouter())
    .use(Popper)
    .mount('#app')
