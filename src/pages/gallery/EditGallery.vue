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
    border: solid 3px #ff0000
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


.drawing {
    width: 900px;
    height: 560px;
    border: solid 1px #33ccff;
    position: absolute;
    top: 49%;
    left: 50%;
    z-index: 10;
    display: none;
    .left {
        margin-top: -270px;
        margin-left: -420px;
    }
    .right {
        margin-top: -270px;
        margin-left: 30px;
    }
    .hot-bar {
        position: absolute;
        top: 10px;
        right: 20px;
        background: #fff;
        padding: 5px 20px;
    }
}

.hotlink {
    position: absolute;
    background: rgba(51, 204, 255, 0.5);
    top: 50%;
    left: 50%;
    .hotlink-link {
        display: block;
    }
    .hotlink-del {
        position: absolute;
        top: 2px;
        right: 2px;
        cursor: pointer;
    }
}

.hover-scale {
    transition: transform ease 0.5s;
    &:hover {
        transform: scale(1.1)
    }
}

.page-wrapper {
    overflow: visible!important;
}
</style>
<template>
    <div class="layout">
        <div slot="navbar">
            <navbar>
                <div slot="menus">
                     <div class="hot-move" @click="showToolbar()">
                        <Tooltip content="添加热点" placement="right">
                            <div class="navbar-icon"></div>
                        </Tooltip>
                    </div>
                    <div class="hot-link0" @click="hotProduct()">
                        <Tooltip content="链接产品" placement="right">
                            <div class="navbar-icon"></div>
                        </Tooltip>
                    </div>
                    <!-- <div class="hot-link1" @click="showToolbar(1)">
                        <Tooltip content="右边热点" placement="right">
                            <div class="navbar-icon"></div>
                        </Tooltip>
                    </div> -->
                    <!-- <div class="hot-product" @click="hotProduct()">
                        <Tooltip content="链接产品" placement="right">
                            <div class="navbar-icon"></div>
                        </Tooltip>
                    </div> -->
                </div>
            </navbar>
        </div>
        <div slot="header" class="layout-header">
            <div style="margin: 0px 0 0 53px" class="flex">
                <div class="cursor" @click="goback" style="margin-right: 30px;">
                    退出
                </div>
                <!-- <div ref="saveBtn" class="cursor" @click="addHot">
                    保存
                </div> -->
            </div>
            <div style="padding-right: 15px; height: 32px; position: relative">
                <Input icon="ios-search-strong" placeholder="请输入..." style="width: 200px; height: 20px;"></Input>
            </div>
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
                                        <div class="hover-scale hotlink" v-for="(hotlink, h) in item.hotlink" :key="h" :style="'width:'+hotlink.attr[0].width +'px; height:'+hotlink.attr[0].height+'px; left:'+hotlink.attr[0].left+'px; top:'+ hotlink.attr[0].top+'px'">
                                            <a class="hotlink-link" :style="'width:'+ hotlink.attr[0].width + 'px;height:'+ hotlink.attr[0].height +'px'"></a>
                                            <div class="hover-scale hotlink-del" @click="delHotlink(hotlink.id)">
                                                <Icon type="close-circled" size="18" color="#fff"></Icon>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- <div class="pager">
                            <span></span>
                        </div> -->

                        <div ref="drawing" id="drawing" class="drawing left"></div>

                    </div>

                </div>
                <div class="content-aside thumbnails">
                    <ul>
                        <li v-for="(th, i) in thumbnails" :key="i" class="cursor" style="display: flex; justify-content: space-around" @click="turn(i)">
                            <div style="padding: 5px;" v-for="(th1, i1) in th" :key="i1" v-if="th1">
                              <img width="100" :src="server + th1.url" />
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
      <modal-hot-product @save="selectProduct" :show="ShowHotProduct"/>
    </div>
</template>

<script>
import '@/directive/turn'
import header from '@/components/layout/header'
import navbar from '@/components/layout/navbar'
import mixins from '../../mixins'

import SVG from 'svg.js'
import select from 'svg.select.js'
import resize from 'svg.resize.js'
import draggable from 'svg.draggable.js'

import ModalHotProduct from './modal-hot-product'

export default {
    mixins: [mixins],
    data() {
        return {
            menus: [
                { name: '左边热点', icon: 'hot-link0', size: 22, route: '/ucenter' },
                { name: '右边热点', icon: 'hot-link1', size: 22, route: '/home' },
                { name: '移动热点', icon: 'hot-move', size: 22, route: '/home' },
                { name: '链接产品', icon: 'hot-product', size: 18, route: '/product' },
            ],
            items: [],
            page: {},
            show_toolbar: 0,
            hotAttr: {
              left: 0,
              top: 0,
                width: 100,
                height: 100,
                page_width: 500,
                page_height: 500
            },
            side: 0,
            show_hot: 0,
            width: 0,
            height: 0,
            dir: 'x',
            ShowHotProduct: 0,
            pid: 0,
            hasHot: 0
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
        navbar,
        ModalHotProduct
    },
    methods: {
      selectProduct() {
        this.pid = this.$store.state.product.gallery_hot_product_id
        this.hot()
      },
        showHot() {
            this.show_hot = !this.show_hot
        },
        cancelHot() {
            $(".flipbook").turn("disable", false);
            $('.drawing').fadeOut()
        },
        hotProduct() {
          if (!this.hasHot) {
            this.$Message.error('链接产品前，请先添加热点!')
            return
          }
          this.ShowHotProduct = 1
        },
        async delHotlink(id) {
            let { data } = await this.http('/picApi/delAlbumHotLink', {
                data: {
                    attr_id: id
                },
                method: 'POST'
            })
            location.reload()
        },
        showToolbar(h) {
            this.$Modal.confirm({
                title: '请选择',
                content: '<p>选择左侧或右侧图片进行编辑</p>',
                okText: '右侧',
                cancelText: '左侧',
                onOk: () => {
                    this.side = 1
                    this.hotInit()
                },
                onCancel: () => {
                    this.side = 0
                    this.hotInit()
                }
            });

        },
        hotInit () {
          this.hasHot = 1;
          $(".flipbook").turn("disable", true);
          const width = this.page.width
          const height = this.page.height
          let marginLeft = -width / 2;

          if (this.side) {
              marginLeft = 0;
          } else {
              marginLeft = -width
          }

          $(this.$refs.drawing)
              .width(width)
              .height(height)
              .css({ 'marginLeft': marginLeft, 'marginTop': -height / 2 })
              .fadeIn()
        },
        addHot() {
            this.hot()
        },
        goback() {
            window.history.go(-1)
        },
        turn(i) {
            $('.flipbook').turn('page', 2 * i + 1)
        },
        async hot() {
            const galleryPage = parseInt(window.localStorage.getItem('galleryPage'))
            let album_pic_id = this.items[galleryPage-1].id
            if (this.side) {
                album_pic_id = this.items[galleryPage].id
            }

            let { data } = await this.http('/picApi/modifyAlbumHotLink', {
                data: {
                    album_pic_id,
                    pid: this.pid,
                    attr: [this.hotAttr]
                },
                method: 'POST'
            })
            if (data.code) {
              this.$Message.error(data.msg.zh)
            } else {
              this.$Message.success(data.msg.zh)
            }

            // this.ShowHotProduct = 0
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
        $(this.$refs.saveBtn).hide()
        //const width = ($(window).width() - 340) / 2 - 40
        const width = this.page.width
        const height = this.page.height
        var draw = SVG('drawing').size(width, height)
        var set = draw.set()
        var rect = draw.rect(100, 100).fill({color:'#33ccff', opacity: 0.6})
        set.add(rect)

        rect.selectize({ deepSelect: true });
        rect.draggable()
        rect.selectize().resize();

        rect.on('resizedone', (e) => {
            $(this.$refs.saveBtn).fadeIn()
            this.hotAttr = {
              left: e.target.x.animVal.value,
              top: e.target.y.animVal.value,
                // style: `width: ${e.target.width.animVal.value}px; height: ${e.target.height.animVal.value}px; left: ${e.target.x.animVal.value + 20}px; top: ${e.target.y.animVal.value + 20}px`,
                width: e.target.width.animVal.value,
                height: e.target.height.animVal.value,
                page_width: this.page.width,
                page_height: this.page.height
            }
        })
        rect.on('dragend', (e) => {
            $(this.$refs.saveBtn).fadeIn()
            this.hotAttr = {
              left: e.target.x.animVal.value,
              top: e.target.y.animVal.value,
                // style: `width: ${e.target.width.animVal.value}px; height: ${e.target.height.animVal.value}px; left: ${e.target.x.animVal.value + 20}px; top: ${e.target.y.animVal.value + 20}px`,
                width: e.target.width.animVal.value,
                height: e.target.height.animVal.value,
                page_width: this.page.width,
                page_height: this.page.height
            }
        })
        console.log(rect)
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
        }
    }
}
</script>
