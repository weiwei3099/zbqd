export default {
    state: {
        userInfo: JSON.parse(localStorage.getItem('userInfo')) || {}
    },
    mutations: {
        SIGNIN(state, data) {
            state.userInfo = data
            localStorage.setItem('userInfo', JSON.stringify(data))
        }
    },
    actions: {
        SIGNIN({commit}, data) {
            commit('SIGNIN', data)
        }
    }
}
