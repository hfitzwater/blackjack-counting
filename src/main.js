import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'carbon-components/css/carbon-components.css'
import CarbonComponentsVue from '@carbon/vue'

Vue.config.productionTip = false
Vue.use(CarbonComponentsVue)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
