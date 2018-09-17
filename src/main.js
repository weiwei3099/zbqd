// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import iView from 'iview';
import 'iview/dist/styles/iview.css';
import '@/styles/common.less'

Vue.use(iView);
Vue.config.productionTip = false

import './directive'

import comps from './components'
Vue.use(comps)

const VueCookie = require('vue-cookie');
Vue.use(VueCookie);

router.beforeEach((to, from, next) => {
    //iView.LoadingBar.start();
    next();
});

router.afterEach((to, from, next) => {
    //iView.LoadingBar.finish();
});

import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
import qs from 'qs'

Vue.prototype.http = async(url, { params, data, header, method = 'GET' } = {}) => {
    //url = '/api' + url
    if (method == 'GET') {
        if (params) {
            params.userToken = store.state.user.userInfo.userToken
            return await axios.get(url, {
                params: params
            })
        } else {
            return await axios.get(url, {
                params: {
                    userToken: store.state.user.userInfo.userToken
                }
            })
        }
    } else {
        if (data) {
            data.userToken = store.state.user.userInfo.userToken
            return await axios.post(url, qs.stringify(data))
        } else {
            return await axios.post(url, qs.stringify({
                userToken: store.state.user.userInfo.userToken
            }))
        }
    }
}


axios.interceptors.request.use(function (config) {
    iView.LoadingBar.start();
    if (process.env.NODE_ENV != 'production') {
        config.url = '/api' + config.url
    }

    // if(config.method=='get') {
    //     if (config.params) {
    //         config.params.userToken = store.state.user.userInfo.userToken
    //     } else {
    //         config.params = {
    //             'userToken': store.state.user.userInfo.userToken
    //         }
    //     }

    // }
    // if(config.method=='post' && config.url != '/api/userApi/ourLogin') {
    //     console.log(config)
    //     if(config.data) {
    //         config.data.userToken = store.state.user.userInfo.userToken
    //     } else {
    //         config.data = {
    //             'userToken': store.state.user.userInfo.userToken
    //         }
    //     }
    // }

    return config;
}, function (error) {
    return Promise.reject(error);
});
axios.interceptors.response.use(function (response) {
    iView.LoadingBar.finish();
    if (response.data.code == 1000) {
        router.push({
            name: '登录'
        })
    }
    if (response.data.code == 1011) {
        router.push({
            name: '登录'
        })
    }
    return response;
}, function (error) {
    return Promise.reject(error);
});

import VueBus from 'vue-bus';
Vue.use(VueBus);

Vue.mixin({
    data() {
        return {
            server: 'https://fitment.chenyoujiu.com',
            api: process.env.NODE_ENV == 'production' ? '' : '/api'
        }
    },
    methods: {
        go(url) {
            this.$router.push(url)
        },
        logout() {
          window.localStorage.removeItem('userInfo')
          this.$router.push({name: '登录'})
        },
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: {
        App
    }
})
