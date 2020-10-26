import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'carbon-components/css/carbon-components.css'
import CarbonComponentsVue from '@carbon/vue'
// import '@carbon/charts/styles-g100.css';
import '@carbon/charts/styles.css';
import chartsVue from '@carbon/charts-vue'

Vue.config.productionTip = false
Vue.use(CarbonComponentsVue)
Vue.use(chartsVue)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
