import { createApp } from 'vue'
import App from './App.vue'

import createRouter from './plugin/router';
import createOverlayController from "./plugin/overlay";
import vuetify from "./plugin/vuetify";
import pinia from "./plugin/pinia";

const app = createApp(App);

const router = createRouter();
app.use(router);

app.use(pinia);

app.use(vuetify);

app.use(createOverlayController(router));

app.mount('#app');
