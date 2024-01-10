import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/vuex/index';
import components from '@/components/global/index';
import directives from '@/directives';
import '@/assets/main.css';

const app = createApp(App);

components.forEach(component => app.component(component.name, component));
directives.forEach(item => app.directive(item.name, item.directive));

app.use(router);
app.use(store);

app.mount('#app');

window.onbeforeunload = () => localStorage.setItem('customEvents', JSON.stringify((store.state as any).calendar.customEvents));
