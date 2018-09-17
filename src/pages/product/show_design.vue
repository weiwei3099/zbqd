<template>
  <div class="layout">
    <div class="container" style="left: 0">
      <i-page>
        <div class="flex flex-center" style="height: 100%; height: 100%;" slot="page-content">
          <div class="flex-center" style="position:relative; width: 1024px; height: 768px; margin: 0 auto;">
            <img :src="bg.url" :width="1024" alt="">
            <div :style="'position: absolute; top:' + bg.attr.y + 'px; left: ' + bg.attr.x + 'px; width:' + scene.main_attr.zone.width +'px; height:' + scene.main_attr.zone.height + 'px; transform: scale('+ scale +'); transform-origin: 0 0 0;'">
              <div id="drawing"></div>
            </div>
          </div>
        </div>

        <div class="page-aside" slot="page-aside" style="padding-top: 50px;">
          <div class="flex" style="position: fixed; top: 35px; height: 50px; width: 240px; right: 0; flex-wrap: wrap">
            <Button style="margin: 2px 5px" @click="selectPic('产品颜色')" size="small">产品颜色</Button>
            <Button style="margin: 2px 5px" @click="selectPic('背景')" size="small">背景</Button>
            <Button style="margin: 2px 5px" v-for="(other_product, i) in scene.other_product" :key="i" @click="selectPic( other_product.title, i )" size="small">{{other_product.title}}</Button>
          </div>
          <div class="aside">
            <ul class="product-imgs">
              <li @mouseover="reloadPic(pic)" class="flex flex-center cursor" v-for="(pic, i) in pics" :key="i">
                <img :src="server + pic.url" alt="">
              </li>
            </ul>
          </div>
        </div>
      </i-page>
    </div>
  </div>
</template>

<script>
import SVG from 'svg.js'
import select from 'svg.select.js'
import resize from 'svg.resize.js'
import draggable from 'svg.draggable.js'

export default {
  data: function() {
    return {
      main_product: {},
      scene: {
        main_attr: {
          zone: {
            width: 0, height: 0
          }
        },
        bg_info: []
      },
      bg: {
        width: 1000,
        height: 1000,
        attr: {
          width: 510, height: 620, x: 0, y: 0
        }
      },
      drawer: {
        draw: '',
        size: {
          width: $(window).width() - 280,
          height: $(window).height() - 40,
        },
        set: '',
      },
      scale: 1,
      pics: [],
      elements: [],
      category: '产品颜色'
    }
  },
  components: {
    IPage: () => import('../../components/layout/page')
  },
  methods: {
    selectPic(type, i) {
      console.log(this.elements)
      this.category = type
      if (type == '背景') {
        this.pics = this.scene.bg_info
      } else if(type =='产品颜色') {
        this.pics = this.main_product.attr
      } else {
        this.pics = this.scene.other_product[i].products
      }
    },
    reloadPic(pic) {
      if (this.category != '背景') {
        this.elements[this.category].draw.load(this.server + pic.url)
        if (this.elements[this.category].copy) {
          this.elements[this.category].copy.draw.load(this.server + pic.url)
        }
      } else {
        this.designBg(pic)
      }
    },
    designBg(bg) {
      let image = new Image()
      image.src = this.server + bg.url
      image.onload = () => {
        this.bg = {
          width: image.width,
          height: image.height,
          url: this.server + bg.url,
          attr: bg.show_attr
        }
      }

    },
    design({title, url, width, height, x, y, zindex, flipX, flipY}) {
      // console.log({title, url, width, height, x, y, zindex, flipX, flipY})
      const draw = this.drawer.draw.image(this.server + url).size(width, height).move(x, y)
      if (!this.elements[title]) {
        this.elements[title] = {
          draw: draw
        }
        if (flipX) {
          this.elements[title].draw.flip('x')
        }
        if (flipY) {
          this.elements[title].draw.flip('y')
        }
      } else {
        this.elements[title].copy = {
          draw: draw
        }
        if (flipX) {
          this.elements[title].copy.draw.flip('x')
        }
        if (flipY) {
          this.elements[title].copy.draw.flip('y')
        }
      }

    },
    async get() {
      const id = this.$route.params.id
      let { data } = await this.http('/productApi/getProductInfo', {
        data: {
          id: id
        },
        method: 'POST'
      })
      this.main_product = data.result.product
      this.pics = this.main_product.attr

      let { data: data1 } = await this.http('/productApi/getSceneInfo', {
        data: {
          main_product: id
        },
        method: 'POST'
      })
      this.scene = data1.result.scene
      const width = this.scene.main_attr.zone.width
      const height = this.scene.main_attr.zone.height
      this.drawer.draw = SVG('drawing').size(width, height)
      this.designBg(this.scene.bg_info[0])

      this.scale = this.scene.bg_info[0].show_attr.height / this.scene.main_attr.zone.height

      let display = []
      if (!this.scene.main_attr.copy) {
        let flipX = this.scene.main_attr.self.flip_x ? 1 : 0
        let flipY = this.scene.main_attr.self.flip_y ? 1 : 0
        display.push({
          title: '产品颜色',
          url: this.main_product.attr[0].url,
          width: this.scene.main_attr.self.width,
          height: this.scene.main_attr.self.height,
          x: parseInt(this.scene.main_attr.self.x) - parseInt(this.scene.main_attr.zone.left),
          y: parseInt(this.scene.main_attr.self.y) - parseInt(this.scene.main_attr.zone.top),
          zindex: parseInt(this.scene.main_zindex),
          flipX,
          flipY
        })
      }

      for (let other_product of this.scene.other_product) {
        for (let product of other_product.products) {
          if (product.is_default == '1') {
            for (let attr of product.attr) {
              let flipX = attr.flip_x ? 1 : 0
              let flipY = attr.flip_y ? 1 : 0
              display.push({
                title: other_product.title,
                url: product.url,
                width: attr.width,
                height: attr.height,
                x: parseInt(attr.x) - parseInt(this.scene.main_attr.zone.left),
                y: parseInt(attr.y) - parseInt(this.scene.main_attr.zone.top),
                zindex: parseInt(other_product.zindex),
                flipX,
                flipY
              })
            }
          }
        }
      }

      display.sort((a, b) => {
        if(a.zindex > b.zindex) {
          return 1
        } else {
          return -1
        }
      })
      for (let i in display) {
        this.design({
          title: display[i].title,
          url: display[i].url,
          width: display[i].width,
          height: display[i].height,
          x: display[i].x,
          y: display[i].y,
          zindex: display[i].zindex,
          flipX: display[i].flipX,
          flipY: display[i].flipY,
        })
      }

    }
  },
  created() {
    this.get()
  }
}
</script>

<style lang="less" scoped>
.bg-container {
  width: 1024px; height: 768px; margin: 0 auto; position: relative;
}
#drawing{
  position: absolute;
}
.product-imgs {
  li {
    width: 200px;
    height: 260px;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center center;
    margin: 20px;
    border: solid 1px #ccc;
    text-align: center;
    img {
      max-height: 100%;
      max-width: 100%;
    }
    &:hover {
      border: solid 1px #2d8cf0;
    }
  }
}
</style>
