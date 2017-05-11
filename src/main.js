// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueBus from 'vue-bus'

import '@/common/stylus/index.styl'

Vue.use(VueResource)
Vue.use(VueBus)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  VueResource,
  template: '<App/>',
  components: { App }
}).$mount('#app')

// router.push('goods')
