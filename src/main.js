import Vue from 'vue'
import App from './App.vue'

//main.js
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import {router} from './router'
import './theme/index.less'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
import {initI18n} from '@/utils/i18n'
import bootstrap from '@/bootstrap'
import 'moment/locale/zh-cn'

const i18n = initI18n('CN', 'US')

Vue.use(Antd)
Vue.use(Viewer)
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)

bootstrap({router, store, i18n, message: Vue.prototype.$message})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
