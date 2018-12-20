import Vue from 'vue'
import App from './App'
import router from './router'
import '@/assets/base.less'
// 导入element-ui
import ElementUI from 'element-ui'
// 导入element-ui的样式
import 'element-ui/lib/theme-chalk/index.css'
// 安装element-ui插件
Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
