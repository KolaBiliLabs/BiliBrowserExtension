import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

function bootstrap() {
  const app = createApp(App)
  app.mount('#app')
}

bootstrap()
