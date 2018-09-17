import Vue from 'vue'

Vue.directive('mask', {
    inserted(el) {
        $(el).find('.del').hide()
        $(el).find('.box-mask').hide()
        $(el).on('mouseenter', () => {
            $(el).find('.del').fadeIn()
            $(el).find('.box-mask').fadeIn()
        }).on('mouseleave', () => {
            $(el).find('.del').fadeOut()
            $(el).find('.box-mask').fadeOut()
        })
    }
})


Vue.directive('open', {
    componentUpdated(el) {
        $(el).find('.ivu-collapse-item').eq(0).addClass('ivu-collapse-item-active')
        $(el).find('.ivu-collapse-item').eq(0).find('.ivu-collapse-content').show()
    }
})

Vue.directive('navbar', {
  inserted(el, arg) {
      $(el).find('.menu').removeClass('on')
      $(el).find('.' + arg.value).addClass('on')
  },
  componentUpdated(el, arg) {
      $(el).find('.menu').removeClass('on')
      $(el).find('.' + arg.value).addClass('on')
  }
})


Vue.directive('hoverSery', {
    inserted(el, arg) {
        $(el).on('click', () => {
            $('.sery-item').removeClass('on')
            $(el).addClass('on')
        })
    }
})


Vue.directive('menuChildren', {
    inserted(el, arg) {
        $('.menu-children').slideUp()
        $(el).find('.menu-children-title').on('click', () => {
            // $('.menu-children').slideUp()
            $(el).find('.menu-children-title').next().slideToggle()
        })
    }
})
