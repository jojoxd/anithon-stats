import { createApp } from 'vue'
import App from './App.vue'
import Popper from 'vue3-popper';
import moment from "moment";
import momentDurationFormat from "moment-duration-format";

import createRouter from './plugin/router';

momentDurationFormat(moment);

const app = createApp(App);

app.use(createRouter());
app.use(Popper);

app.config.globalProperties.$moment = moment;

app.mount('#app');