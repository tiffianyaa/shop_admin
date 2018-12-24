import Vue from 'vue'
import App from './App'
import router from './router'
import '@/assets/base.less'
// 导入element-ui
import ElementUI from 'element-ui'
// 导入element-ui的样式
import 'element-ui/lib/theme-chalk/index.css'
// 导入axios
import axios from 'axios'
Vue.prototype.axios = axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前设置请求头
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response.data
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
// 安装element-ui插件
Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
