import { createApp } from 'vue'
import App from './App.vue'
import Popper from 'vue3-popper';
import moment from "moment";
import momentDurationFormat from "moment-duration-format";

import createRouter from './plugin/router';
import createOverlayController from "./plugin/overlay";

// @ts-ignore TS2345 This is correct
momentDurationFormat(moment);

const app = createApp(App);

app.use(createRouter());
app.use(Popper);
app.use(createOverlayController());

app.config.globalProperties.$moment = moment;

app.mount('#app');
