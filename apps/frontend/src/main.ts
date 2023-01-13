import { createApp } from 'vue'
import App from './App.vue'
import moment from "moment";
import momentDurationFormat from "moment-duration-format";

import createRouter from './plugin/router';
import createOverlayController from "./plugin/overlay";
import vuetify from "./plugin/vuetify";
import pinia from "./plugin/pinia";

// @ts-ignore TS2345 This is correct
momentDurationFormat(moment);

const app = createApp(App);

const router = createRouter();
app.use(router);

app.use(pinia);

app.use(vuetify);

app.use(createOverlayController(router));

app.config.globalProperties.$moment = moment;

app.mount('#app');
