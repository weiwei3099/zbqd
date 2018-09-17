import Vue from 'vue'
import Vuex from 'vuex'

import user from './models/user'
import config from './models/config'
import images from './models/images'
import product from './models/product'
import design from './models/design'
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user,
        config,
        images,
        product,
        design
    }
})
