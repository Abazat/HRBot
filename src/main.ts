import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import router from './router'
import App from './App.vue'
import './style.css'

// Import language files
import en from './locales/en.json'
import ru from './locales/ru.json'
import uz from './locales/uz.json'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'ru',
  fallbackLocale: 'en',
  messages: {
    en,
    ru,
    uz
  }
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')