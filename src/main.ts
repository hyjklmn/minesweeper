import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import routes from "virtual:generated-pages"
import App from "./App.vue"

import "@unocss/reset/tailwind.css"
import "./styles/main.css"
import "uno.css"
import i18n from "./language/i18n"
const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(router).use(i18n)
app.mount("#app")
