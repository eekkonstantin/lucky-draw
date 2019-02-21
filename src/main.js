import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import store from '@/plugins/store'

Vue.config.productionTip = false

import HoldBtn from "@/components/HoldBtn.js"
Vue.component("hold-btn", HoldBtn)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
