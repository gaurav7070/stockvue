import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // <-- you must import router
import store from './store';    // <-- you must import store

const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
