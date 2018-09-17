export default {
  state: {
    type: '',
    selection: new Set(),
    detail: {},
    image_for_360_pp_id: 0,
    img_for_360_product: new Set()
  },
  mutations: {
    SET_IMAGE_FOR_360_PP_ID(state, data) {
      state.image_for_360_pp_id = data
    },
    IMG_ADD_FOR_360(state, data) {
      state.img_for_360_product.clear()
      state.img_for_360_product.add(data)
    },
    IMG_REMOVE_FOR_360(state, data) {
      state.img_for_360_product.delete(data)
    },
    IMAGE_PAGE_TYPE(state, data) {
      state.type = data
    },
    IMAGE_ADD(state, data) {
      state.selection.add(data)
    },
    IMAGE_REMOVE(state, data) {
      state.selection.delete(data)
    },
    IMAGE_CLEAR(state) {
      state.selection.clear()
    },
    IMAGE_DETAIL(state, data) {
      state.detail = data
    }
  },
  actions: {
    IMAGE_ADD({
      commit
    }, data) {
      commit('ADD', data)
    }
  }
}
