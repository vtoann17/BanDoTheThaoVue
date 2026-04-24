import './assets/main.css'
import "./echo";
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import axios from 'axios'

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";




axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.headers.common['Accept'] = 'application/json'



const token = localStorage.getItem('auth_token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

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