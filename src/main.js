import Vue from 'vue'
import store from './store'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueTouch from 'vue-touch'

Vue.config.productionTip = false
Vue.use(VueTouch)

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
