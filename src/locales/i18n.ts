import { createI18n } from "vue-i18n" //引入vue-i18n组件
import messages from "./index"
import { language } from "~/composables"
const lang = useSessionStorage("lang", language)
const i18n = createI18n({
  fallbackLocale: "zh",
  globalInjection: true,
  legacy: false, // you must specify 'legacy: false' option
  locale: lang.value || "en",
  messages,
})

export default i18n
