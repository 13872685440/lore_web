// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'
import message from 'ant-design-vue/es/message'
import notification from 'ant-design-vue/es/notification'
import 'element-ui/lib/theme-chalk/index.css'
import { Modal } from 'ant-design-vue'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
// import './utils/filter' // global filter

import globalVariable from './store/mutation-types'

Vue.use(ElementUI, { size: 'small' })

import FormMaking from 'form-making'
import 'form-making/dist/FormMaking.css'
import '@/style/lore.css'

Vue.use(FormMaking)

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.GLOBAL = globalVariable

import VueAMap from 'vue-amap';
Vue.use(VueAMap);

Vue.use(require('vue-wechat-title'))
//初始化
VueAMap.initAMapApiLoader({
  key: 'bc8ff7de07da8e1d2be6f67274a94bea',
  plugin: ['AMap.PlaceSearch', 'AMap.Scale', 'AMap.Geocoder'],//依赖配置，根据自己的需求引入
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')

