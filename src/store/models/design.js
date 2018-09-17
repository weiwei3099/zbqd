function _findIndex(arr, key, value) {
  return arr.findIndex(item => {
    return item[key] === value
  })
}

export default {
  state: {
    main_product: {},
    main_zindex: 1,
    main_attr: {
      self: {},
      copy: {},
      zone: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      }
    },
    products: {
      bg_info: { id: []},
      other_product: []
    },
    bgs: [],
    tool: '选择',
    currentCategory: ''
  },
  getters: {
    GET_OTHER_PRODUCT_COPY_ATTR: (state) => ({title, product_id}) => {
      const other_product = state.products.other_product.find(p => {
        return p.title == title
      })
      const product = other_product.products.find(p => {
        return p.id == product_id
      })
      console.log(product.attr)
      return product.attr[1]
    }
  },
  mutations: {
    CLEAR_DESIGN(state) {
      state.main_product = {}
      state.main_zindex= 1
      state.main_attr= {
        self: {},
        copy: {},
        zone: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          width: 0,
          height: 0
        }
      }
      state.products= {
        bg_info: { id: []},
        other_product: []
      }
      state.bgs= []
      state.tool= '选择'
      state.currentCategory= ''
    },
    SET_OTHER_FLIP(state, {title, pid, direction, attr_id}) {
      console.log({title, pid, direction, attr_id})
      const i = _findIndex(state.products.other_product, 'title', title)
      const x = _findIndex(state.products.other_product[i].products, 'id', pid)
      const y = _findIndex(state.products.other_product[i].products[x].attr, 'attr_id', attr_id)

      if (!state.products.other_product[i].products[x].attr[y]['flip_' + direction]) {
        state.products.other_product[i].products[x].attr[y]['flip_' + direction] = 1
      } else {
        state.products.other_product[i].products[x].attr[y]['flip_' + direction] = 0
      }
    },
    SET_OTHER_PRODUCT(state, data){
      state.products.other_product = data
    },
    SET_CURRENT_CATEGORY(state, category) {
      state.currentCategory = category
    },
    SET_MAIN_ZINDEX(state, main_zindex) {
      state.main_zindex = main_zindex
    },
    SET_ZONE_LT(state, {left, top}) {
      state.main_attr.zone.left = left
      state.main_attr.zone.top = top
    },
    SET_ZONE_RB(state, {right, bottom}) {
      state.main_attr.zone.right = right
      state.main_attr.zone.bottom = bottom
    },
    SET_ZONE(state) {
      state.main_attr.zone.width = state.main_attr.zone.right - state.main_attr.zone.left
      state.main_attr.zone.height = state.main_attr.zone.bottom - state.main_attr.zone.top
    },
    SET_MAIN_ATTR(state, attr) {
      state.main_attr = attr
    },
    SET_MAIN_PRODUCT_ATTR(state, attr) {
      state.main_attr.self = attr
    },
    ADD_BG_INFO(state, id) {
      state.products.bg_info.id.push(id)
    },
    REMOVE_BG_INFO(state, id) {
      const i = state.products.bg_info.id.findIndex(bgId => {
        return bgId === id
      })
      state.products.bg_info.id.splice(i, 1)
    },
    ADD_OTHER_PRODUCT(state, {title, type, cid, zindex, product}) {
      const i = _findIndex(state.products.other_product, 'title', title)
      if ('-1' == i) {
        state.products.other_product.push({
          cid,
          title,
          type,
          zindex,
          products: []
        })
        return false
      }
      const x = _findIndex(state.products.other_product[i].products, 'id', product.id)
      if ('-1' == x) {
        state.products.other_product[i].products.push({
          id: product.id,
          url: product.url,
          is_default: 0,
          attr: [{
            attr_id: 1,
            width: product.attr.width,
            height: product.attr.height,
            x: 0,
            y: 0
          }]
        })
      }
    },
    REMOVE_OTHER(state, id) {
      const i = state.products.other_product.findIndex((item) => {
        return item.cid == id
      })
      state.products.other_product.splice(i, 1)
    },
    DEL_OTHER_PRODUCT(state, {category, product}) {
      const o = state.products.other_product.findIndex((item) => {
        return item.title == category
      })
      const i = state.products.other_product[o].products.findIndex((item) => {
        return item.id == product.id
      })
      state.products.other_product[o].products.splice(i, 1)
    },
    DEL_BG(state, pic) {
      const i = state.bgs.findIndex((item) => {
        return item.id == pic.id
      })
      state.bgs.splice(i, 1)
    },
    SET_OTHER_ATTR(state, {title, pid, attr, attr_id}) {
      const i = _findIndex(state.products.other_product, 'title', title)
      const x = _findIndex(state.products.other_product[i].products, 'id', pid)
      const y = _findIndex(state.products.other_product[i].products[x].attr, 'attr_id', attr_id)
      for (let product of state.products.other_product[i].products) {
        product.is_default = 0;
      }
      state.products.other_product[i].products[x].is_default = 1
      if ('-1' == y) {
        attr.attr_id = attr_id
        state.products.other_product[i].products[x].attr.push(attr)
      } else {
        state.products.other_product[i].products[x].attr[y].width = attr.width
        state.products.other_product[i].products[x].attr[y].height = attr.height
        state.products.other_product[i].products[x].attr[y].x = attr.x
        state.products.other_product[i].products[x].attr[y].y = attr.y
      }
    },
    SET_OTHER_ZINDEX(state, {title, zindex}) {
      const i = _findIndex(state.products.other_product, 'title', title)

      state.products.other_product[i].zindex = zindex
    },
    SET_MAIN_PRODUCT(state, main_product) {
      state.main_product = main_product
    },
    ADD_BGS(state, bg) {
      state.bgs.push({
        id: bg.id,
        url: bg.url
      })
      state.products.bg_info.id.push(bg.id)
    },
    REMOVE_BGS(state, bg) {
      const i = _findIndex(state.products.bgs, 'id', bg.id)
      state.bgs.splice(i, 1)
    },
    SET_DESIGN_TOOL(state, data){
      state.tool = data
    },
  },
  actions: {
    SET_MAIN_ZINDEX({commit}, data) {
      commit('SET_MAIN_ZINDEX', data)
    },
    SET_MAIN_ATTR({commit}, data){
      commit('SET_MAIN_ATTR', data)
    },
    SET_OTHER_PRODUCT({commit}, data) {
      commit('SET_OTHER_PRODUCT', data)
    },
    SET_OTHER_ATTR({commit}, data) {
      commit('SET_OTHER_ATTR', data)
    },
    ADD_OTHER_PRODUCT({commit}, data) {
      commit('ADD_OTHER_PRODUCT', data)
    },
    SET_MAIN_PRODUCT({
      commit
    }, data) {
      commit('SET_MAIN_PRODUCT', data)
    },
    ADD_BG_INFO({commit}, data) {
      commit('ADD_BG_INFO', data)
    },
    ADD_BGS({
      commit
    }, data) {
      commit('ADD_BGS', data)
    },
    OTHER({
      commit
    }, data) {
      commit('OTHER', data)
    }
  }
}
