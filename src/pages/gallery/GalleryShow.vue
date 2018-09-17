<style lang="less" scoped>
.thumbnails {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    ul {
        flex: 1;
        overflow: auto;
        li {
            background: #fff;
            margin: 10px;
        }
    }
}

.on {
    border: solid 1px #2d8cf0
}

.turn-btn {
    cursor: pointer;
    background: #f5f7f9;
    margin: 20px 0;
    padding: 0 20px;
    display: flex;
    align-items: center;
}

.previous {}

.svg_select_points_lt{cursor:nw-resize}.svg_select_points_rt{cursor:ne-resize}.svg_select_points_rb{cursor:se-resize}.svg_select_points_lb{cursor:sw-resize}.svg_select_points_t{cursor:n-resize}.svg_select_points_r{cursor:e-resize}.svg_select_points_b{cursor:s-resize}.svg_select_points_l{cursor:w-resize}.svg_select_points_rot{stroke-width:1;stroke:#000;fill:#f9ffed}.svg_select_points_point{cursor:move}.svg_select_boundingRect{stroke-width:1;fill:gray;stroke-dasharray:10 10;stroke:#000;stroke-opacity:.8;fill-opacity:.1;pointer-events:none}

.hotlink{
    position: absolute;
    // background: rgba(51,204,255,0.5);
    .hotlink-link{
        display: block;
    }
    .hotlink-del{
        position: absolute; top: 2px; right: 2px; cursor: pointer;
    }
}
.hover-scale{
    transition: transform ease 0.5s;
    &:hover{
        transform: scale(1.1)
    }
}
.gallery-toolbar {
    position: absolute; bottom: 20px; padding: 6px 20px; right: 320px; /*box-shadow: 0 0 10px #eee;*/
    span {
        margin-right: 20px; display: inline-block; cursor: pointer;
    }
}
.page-wrapper{
    overflow: visible!important;
}
.flipbook-viewport {
    transition: transform 0.2s ease-out;
}
</style>
<template>
<div style="height: 100%;">
    <div slot="header">
        <i-header>
            <div slot="toolbar" class="cursor" @click="go({ name: '编辑画册', params: {id: $route.params.id}, query: {width: $route.query.width, height: $route.query.height}})" style="margin-right: 30px;">
                编辑
            </div>
        </i-header>
    </div>
    <div  slot="navbar">
        <navbar></navbar>
    </div>

    <div ref="gallery" class="layout-content-main">
        <audio class="audio">
            <source src="/static/images/fy.mp3" type="audio/ogg"></source>
        </audio>
        <div class="content-main" style="flex: 1" v-turn:page="page">

            <div class="flipbook-viewport">
                <div class="container1">
                    <div class="flipbook">
                        <div :style="'position: absolute;background-image:url(' + server + item.url + ')'" v-for="(item, index) in items" :key="index">
                            <div v-if="item.hotlink.length">
                                <div class="hover-scale hotlink" @click="go({name: '产品详细', params: {productId: hotlink.pid}})" v-for="(hotlink, h) in item.hotlink" :key="h" :style="'width:'+hotlink.attr[0].width+'px; height:'+hotlink.attr[0].height+'px; left:'+hotlink.attr[0].left+'px; top:'+ hotlink.attr[0].top+'px'">
                                    <a href="javascript:void(0)" class="hotlink-link" :style="'width:'+ hotlink.attr[0].width + 'px;height:'+ hotlink.attr[0].height +'px'"></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- <div class="pager">
                    <span></span>
                </div> -->


            </div>
            <div class="gallery-toolbar">
                <span @click="scaleSmall"><img src="/static/icon/Symbol 43 – 1@3x.png" width="30" alt=""></span>
                <span @click="scaleLarge"><img src="/static/icon/Symbol 42 – 1@3x.png" width="30" alt=""></span>
            </div>

        </div>
        <div class="content-aside thumbnails">
            <ul>
                <li v-for="(th, i) in thumbnails" :key="i" class="cursor" style="display: flex; justify-content: space-around" @click="turn(i)">
                    <div style="padding: 5px;" v-for="(th1, i1) in th" :key="i1" v-if="th1">
                      <img width="100px" :src="server + th1.url" />
                    </div>
                </li>
            </ul>
            <!-- <ul>
                <li v-for="(item, i) in items" :key="i" style="display: flex; justify-content: space-around" @click="turn(i)">
                    <div style="padding: 5px;"><img width="115" height="150" :src="server + item.url" /></div>
                </li>
            </ul> -->
            <div style="display: flex; justify-content: space-around; height: 80px; border-top: solid 1px #f0f0f0;">
                <a class="turn-btn previous1">上一页</a>
                <a class="turn-btn" @click="goback">
                    <Icon type="android-apps" size="26"></Icon>
                </a>
                <a class="turn-btn next1">下一页</a>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import '@/directive/turn'
import header from '@/components/layout/header'
import navbar from '@/components/layout/navbar'
import mixins from '../../mixins'

// import SVG from 'svg.js'
// import select from 'svg.select.js'
// import resize from 'svg.resize.js'
// import draggable from 'svg.draggable.js'

export default {
    mixins: [mixins],
    data() {
        return {
            items: [],
            page: {},
            show_toolbar: 0,
            hotAttr:{},
            scale: 1,
            dir: 'x'
        }
    },
    computed: {
        thumbnails() {
            let thumbnails = []
            const page = parseInt(this.items.length / 2) + 1
            this.items.forEach((v, i) => {
                if (i < page) {
                    thumbnails[i] = [this.items[2 * i - 1], this.items[2 * i]]
                }
            })
            return thumbnails
        }
    },
    components: {
        'i-header': header,
        navbar
    },
    methods: {
        scaleSmall() {
            if (this.scale>1.1) {
                this.scale = this.scale - 0.2
                $('.flipbook-viewport').css('transform', `scale3d(${this.scale}, ${this.scale}, ${this.scale})`)
            }
        },
        scaleLarge() {
            if (this.scale<1.6) {
                this.scale = this.scale + 0.2
                $('.flipbook-viewport').css('transform', `scale3d(${this.scale}, ${this.scale}, ${this.scale})`)
            }
        },
        cancelHot() {
            $(".flipbook").turn("disable", false);
            $('.drawing').fadeOut()
        },
        hotProduct() {
            this.$Message.info('已选择产品id391')
        },
        async delHotlink(id){
            let { data } = await this.http('/picApi/delAlbumHotLink', {
                data: {
                    attr_id: id
                },
                method: 'POST'
            })
            location.reload()
        },
        showToolbar(page, pic_id) {
            $(".flipbook").turn("disable", true);
            this.page.current = page
            this.page.pic_id = pic_id
            console.log(page , this.page.count)
            //const width = ($(window).width() - 340)/2-40
            const width = 920 / 2 - 40
            const height = 600
            let marginLeft = -width/2;
            if(page == 1 || (page == this.page.count  && this.page.count%2==0)){
                marginLeft = -width/2;
            } else if(page%2){
                marginLeft = 20;
            } else {
                marginLeft = -width-20;
            }

            $(this.$refs.drawing)
                .width(width)
                .css({'marginLeft': marginLeft, 'marginTop': -280})
                .fadeIn()
        },
        addHot() {
            this.hot()
        },
        goback(){
            window.history.go(-1)
        },
        turn(i) {
            $('.flipbook').turn('page', 2*i+1)
        },
        async hot() {
            window.localStorage.setItem('galleryPage', this.page.current)
            const width = ($(window).width() - 340)/2-40
            const height = 560
            let { data } = await this.http('/picApi/modifyAlbumHotLink', {
                data: {
                    album_pic_id: this.page.pic_id,
                    pid: 381,
                    attr: [this.hotAttr]
                },
                method: 'POST'
            })
            window.location.reload()
        },
        async getList() {
            let { data } = await this.http('/picApi/factoryAlbumInfo', {
                data: {
                    id: this.$route.params.id
                },
                method: 'POST'
            })
            this.item = data.result.album
            this.items = data.result.album.pic
            this.page.count = data.result.album.pic.length

            for (let item of this.items) {
              if (item.hotlink.length) {
                for (let hotlink of item.hotlink) {
                  let zoom = 1
                  if (this.dir == 'x') {
                    zoom = this.page.width / hotlink.attr[0].page_width
                  } else {
                    zoom = this.page.height / hotlink.attr[0].page_height
                  }
                  hotlink.attr[0].width = hotlink.attr[0].width * zoom
                  hotlink.attr[0].height = hotlink.attr[0].height * zoom
                  hotlink.attr[0].left = hotlink.attr[0].left * zoom
                  hotlink.attr[0].top = hotlink.attr[0].top * zoom
                }
              }
            }
        }
    },
    mounted() {
    },
    created() {
        this.getList()
        this.page.current = window.localStorage.getItem('galleryPage') || 1
        let width = parseInt(this.$route.query.width)
        let height = parseInt(this.$route.query.height)
        if (width > height) { // 横版
          this.page.width = ($(window).width() - 340) / 2
          this.page.height = height * this.page.width / width
        } else { // 竖版
          this.page.height = $(window).height() - 60
          this.page.width = width * this.page.height / height
          this.dir = 'y'
        }
    }
}
</script>
