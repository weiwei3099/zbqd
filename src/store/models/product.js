export default {
  state: {
    full_images: [],
    line_id: 0,
    gallery_hot_product_id: 0,
    full_hot_product_id: 0
  },
  mutations: {
    FULL_IMAGES(state, data) {
      state.full_images = data
    },
    PRODUCT_LINE_ID(state, data) {
      state.line_id = data
    },
    SET_GALLERY_HOT_PRODUCT_ID(state, data) {
      state.gallery_hot_product_id = data
    },
    SET_FULL_HOT_PRODUCT_ID(state, data) {
      state.full_hot_product_id = data
    }
  },
  actions: {
    // IMAGE_ADD({commit}, data) {
    //     commit('ADD', data)
    // }
  }
}
