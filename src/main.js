import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const savedAuth = localStorage.getItem('auth')
if (savedAuth) {
  try {
    const { token } = JSON.parse(savedAuth)
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.defaults.headers.common['Accept'] = 'application/json'
    }
  } catch {}
}
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Toast, {
  position: "top-right",
  timeout: 3000,
});

app.mount('#app')