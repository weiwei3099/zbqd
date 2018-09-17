import './3deye.min.js'

import Vue from 'vue'
Vue.directive('dshow', {
  componentUpdated: function (el, arg) {
    console.log(arg)
    $(el).threeSixty({
      dragDirection: 'horizontal',
      useKeys: true,
      draggable: true,
      imgs: arg.value
    });

  }
})

Vue.directive('dshowu', {
  componentUpdated: function (el, arg) {
    console.log(arg)
    $(el).threeSixty({
      dragDirection: 'horizontal',
      useKeys: true,
      draggable: true,
      imgs: arg.value
    });
  }
})
