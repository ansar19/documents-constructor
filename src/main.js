import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import Vuebar from 'vuebar'
import ShardsVue from 'shards-vue'

// Import base styles (Bootstrap and Shards)
import 'bootstrap/dist/css/bootstrap.css'
import 'shards-ui/dist/css/shards.css'
import '@/scss/shards-dashboards.scss'
import '@/assets/scss/date-range.scss'
import '@/assets/scss/meta-table.scss'

// Layouts
import Default from '@/layouts/Default.vue'

Vue.component('default-layout', Default)

ShardsVue.install(Vue)

Vue.config.productionTip = false
Vue.prototype.$eventHub = new Vue()

Vue.use(Vuebar)
Vue.use(ShardsVue)

const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.'
Vue.config.warnHandler = function (msg, vm, trace) {
  // `trace` is the component hierarchy trace
  if (msg === ignoreWarnMessage) {
    msg = null
    vm = null
    trace = null
  }
}

new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')
