import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

const app = createApp(App);

const pinia = createPinia(); // 創建 Pinia 實例
app.use(pinia); // 注入 Pinia
app.use(router); // 注入路由（如果有使用）

app.mount('#app');
