import './turn.js'
import './style.css'

import Vue from 'vue'
Vue.directive('turn', {
    inserted (el, arg) {
      console.log(arg.value)
      let width = arg.value.width
      let height = arg.value.height
      // if (arg.value.width > arg.value.height) {
      //   width = ($(window).width() - 340) / 2
      //   height = arg.value.height * width / arg.value.width
      // } else {
      //   height = $(window).height() - 60
      //   width = arg.value.width * height / arg.value.height
      // }
      $('.flipbook-viewport .flipbook').css('width', 2 * width)
      $('.flipbook-viewport .flipbook').css('height', height)
      $('.flipbook-viewport .flipbook .page').css('width', width)
      $('.flipbook-viewport .flipbook .page').css('height', height)
      $('.flipbook-viewport .flipbook').css('left', -width )
      $('.flipbook-viewport .flipbook').css('top', -height / 2)
    //     $(el).find('.flipbook').turn({
    // 		width:922,
    // 		height:600,
    // 		elevation: 50,
    // 		gradients: true,
    //         autoCenter: true,
    //         pages:2,
    //         duration: 1000,
    //         when: {
    //             turning(event, page, view) {
    //                 $(el).find('.thumbnails li').eq(parseInt(page/2)).addClass('on').siblings().removeClass('on')
    //             },
    //             turned(event, page, view) {
    //                 $(el).find('.thumbnails li').eq(parseInt(page/2)).addClass('on').siblings().removeClass('on')
    //             }
    //         }
    //     });
    //     $(el).find('.previous').click(() => {
    //         $(el).find('.flipbook').turn('previous')
    //     })
    //     $(el).find('.next').click(() => {
    //         $(el).find('.flipbook').turn('next')
    //     })
    //     $(el).find('.thumbnails li').click((t) => {
    //         const i = $(t.currentTarget).index()
    //         $(el).find('.flipbook').turn('page', 2 * i + 1)
    //     })
    },
    componentUpdated(el, arg) {
      let width = arg.value.width
      let height = arg.value.height
        // const width = $(window).width() - 340
        // let height = 0
        // let width = 0
        // if (arg.value.width > arg.value.height) {
        //   width = ($(window).width() - 340) / 2
        //   height = arg.value.height * width / arg.value.width
        // } else {
        //   height = $(window).height() - 60
        //   width = arg.value.width * height / arg.value.height
        // }
        // $('.flipbook-viewport .flipbook .page').css('width', width)
        // $('.flipbook-viewport .flipbook').css('left', -width / 2)
        let sound =  $('.audio')[0]
        $(el).find('.flipbook').turn({
            width: 2 * width,
            height: height,
            elevation: 50,
            gradients: true,
            autoCenter: true,
            pages: 2,
            duration: 1000,
            when: {
                turning(event, page, view) {
                    let html = '封面'
                    if ( page > 1){
                        html = (page - 1)  + '-' + page + '页'
                    }
                    $(el).find('.pager span').html(html)
                    console.log(sound.paused)
                    if(sound.paused){
                        sound.play()
                    }
                    //sound.play()
                    $(el).parent().find('.thumbnails li').eq(parseInt(page/2)).addClass('on').siblings().removeClass('on')
                    $('.drawing').fadeOut()
                },
                turned(event, page, view) {
                    window.localStorage.setItem('galleryPage', page)
                    if(!sound.paused){
                        sound.pause()
                    }
                    $(el).parent().find('.thumbnails li').eq(parseInt(page/2)).addClass('on').siblings().removeClass('on')
                    if (page>1){
                        // $(".flipbook").turn("size", 1500, 900);
                        //$('.drawing.left').width(width/2 - 40).css({'marginLeft': -width/2+20, 'marginTop': -280})
                        // $(el).find('.drawing.right').width(width/2 - 40).css({'marginLeft': 20, 'marginTop': -280})
                       // $(el).find('.drawing').width(width/2 - 40).css({'marginLeft': -width/4+20, 'marginTop': -250})
                    }

                }
            }
        });
        var page = parseInt(arg.value.current)
        if (page > 1) {
            $(el).find('.flipbook').turn('page', page)
        }
        $(el).parent().find('.previous').click(() => {
            $(el).find('.flipbook').turn('previous')
        })
        $(el).parent().find('.next').click(() => {
            $(el).find('.flipbook').turn('next')
        })
        $(el).parent().find('.thumbnails li').click((t) => {
            console.log(t)
            const i = $(t.currentTarget).index()
            $(el).find('.flipbook').turn('page', 2 * i + 1)
        })

        // $(el).find('.showToolbar').on('click', (e)=>{
        //     console.log($(e.target).data('id'))
        //     $(el).find('.drawing').fadeIn()
        // })


    }
})
