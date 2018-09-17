<template>
  <i-page :aside="false">
    <div class="page-content" slot="page-content">
      <div v-if="item.pid != '0'">
        <Button type="primary" @click="go({name: '产品详细', params: {productId: item.pid}})">查看产品详细</Button>
      </div>
      <div @dblclick="showHot" class="" style="margin: 0 -20px">
        <div class="threesixty" style="margin: 86px auto 0 auto" @mousedown="hide()">
          <!-- put your preloader here -->
          <div class="ui-spinner">
            <span class="side side-left">
              <span class="fill"></span>
            </span>
            <span class="side side-right">
              <span class="fill"></span>
            </span>
          </div>
          <!-- end preloader -->
        </div>
        <div class="gde flex center" ref="gde">
          左右拖拽 • 开启360体验 • 双击图片添加产品热点
          <div class="gde-left">

          </div>
          <div class="gde-right">

          </div>
        </div>
      </div>

      <div class="pic-items" style="margin-top: 50px; border-top: solid 3px #ccc; ">
        <ul>
          <li @click="show(i)" class="cursor" v-for="(pic, i) in item.pic" :key="i">
            <span class="del cursor" @click.stop="delPic(pic)">
              <Icon type="ios-trash" size="14"></Icon>
            </span>
            <span v-if="i != 0" class="sort-left cursor" @click.stop="sortPic(pic, 'left')">
              <Icon type="ios-arrow-thin-left" size="14"></Icon>
            </span>
            <span  v-if="i != item.pic.length - 1" class="sort-right cursor" @click.stop="sortPic(pic, 'right')">
              <Icon type="ios-arrow-thin-right" size="14"></Icon>
            </span>
            <div>
              <img :src="server+ pic.url" alt="">
              <p>{{pic.raw_name}}</p>
            </div>
          </li>
        </ul>
      </div>

      <img-info :detail="detail" @on-modifypic="modifypic()"></img-info>
      <modal-hot-product @save="selectProduct" :show="ShowHotProduct"/>

      <div class="gallery-toolbar">
          <span @click="scaleSmall"><img src="/static/icon/Symbol 43 – 1@3x.png" width="30" alt=""></span>
          <span @click="scaleLarge"><img src="/static/icon/Symbol 42 – 1@3x.png" width="30" alt=""></span>
          <span @click="setSort"><Icon type="android-sync" size="24"></Icon></span>
      </div>

    </div>
  </i-page>
</template>

<script>
import mixins from '@/mixins'
import '../../directive/3deye'
import ImgInfo from './components/img-360-info'
import ModalHotProduct from './modal-hot-product'

export default {
  mixins: [mixins],
  data() {
    return {
      categories: [],
      productList: [],
      item: [],
      detail: {},
      ShowHotProduct: 0,
      pid: 0,
      hasHot: 0,
      scale: 1,
      sort: 'ASC'
    }
  },
  components: {
    ImgInfo, ModalHotProduct
  },
  methods: {
    async setSort () {
      if (this.sort == 'ASC') {
        this.sort = 'DESC'
      } else {
        this.sort = 'ASC'
      }
      let { data } = await this.http('/productApi/changeFullScenePic', {
        data: {
          pid: this.$route.params.id,
          pic_sort: this.sort
        },
        method: 'POST'
      })
      if (!data.code) {
        $('.threesixty').destroy()
        this.getInfo()
        this.$Message.success(data.msg.zh);
      } else {
        this.$Message.error(data.msg.zh);
      }
    },
    async delPic(pic) {
      let { data } = await this.http('/productApi/delFullScenePic', {
        data: {
          pic_id: pic.pic_id
        },
        method: 'POST'
      })
      if (!data.code) {
        $('.threesixty').destroy()
        this.getInfo()
        this.$Message.success(data.msg.zh);
      } else {
        this.$Message.error(data.msg.zh);
      }
    },
    async sortPic(pic, dir) {
      let sort = parseInt(pic.sort)
      if (dir == 'left') {
        sort --
      } else {
        sort ++
      }
      let { data } = await this.http('/productApi/changeFullScenePic', {
        data: {
          pid: this.$route.params.id,
          pic_id: pic.pic_id,
          sort
        },
        method: 'POST'
      })
      if (!data.code) {
        $('.threesixty').destroy()
        this.getInfo()
        this.$Message.success(data.msg.zh);
      } else {
        this.$Message.error(data.msg.zh);
      }
    },
    hide() {
      this.$refs.gde.style.display = 'none'
    },
    scaleSmall() {
        if (this.scale>1.1) {
            this.scale = this.scale - 0.2
            $('.threesixty').css('transform', `scale3d(${this.scale}, ${this.scale}, ${this.scale})`)
        }
    },
    scaleLarge() {
        if (this.scale<1.6) {
            this.scale = this.scale + 0.2
            $('.threesixty').css('transform', `scale3d(${this.scale}, ${this.scale}, ${this.scale})`)
        }
    },
    async selectProduct() {
      let { data } = await this.http('/productApi/fullSceneLink', {
        data: {
          id: this.$route.params.id,
          pid: this.$store.state.product.full_hot_product_id
        },
        method: 'POST'
      })
      if (data.code) {
        this.$Message.error(data.msg.zh)
      } else {
        this.$Message.success(data.msg.zh)
      }
      this.ShowHotProduct = 0
      $('.threesixty').destroy()
      this.getInfo()
    },
    showHot() {
      this.ShowHotProduct = 1
      console.log('hot')
    },
    async getInfo() {
      this.$Spin.show()
      let { data } = await this.http('/productApi/getFullScenePicProductInfo', {
        data: {
          id: this.$route.params.id,
          // sort: this.sort
        },
        method: 'POST'
      })
      this.item = data.result.info

      let loaded = await new Promise((resolve, reject) =>{
        let load = 0
        for (let i in this.item.pic) {
          let img = new Image()
          img.src = this.server + this.item.pic[i].url
          img.onload = () => {
            load ++
            if (load == this.item.pic.length) {
              resolve(load)
            }
          }
        }
      })
      if (loaded) {
        this.$Spin.hide()
      }

      $('.threesixty').threeSixty({
        dragDirection: 'horizontal',
        useKeys: true,
        draggable: true,
        imgs: this.item.pic
      });
      this.detail = this.item.pic[0]
    },
    show(i) {
      $('.threesixty-frame').css('display', 'none')
      $('.threesixty-frame').eq(i).css('display', 'block')
      this.detail = this.item.pic[i]
      console.log(i)
    },
    modifypic() {
      $('.threesixty').destroy()
      this.getInfo()
    }
  },
  created() {
    this.getInfo()
  },
  destroyed() {
    $('.threesixty').destroy()
  }
}
</script>

<style lang="less">
.line-collapse {
  .ivu-collapse {
    background: none;
    border: none;
    .ivu-icon-arrow-right-b {
      font-size: 12px;
      font-weight: normal;
    }
    .ivu-icon-arrow-right-b:before {
      content: "\F218"
    }
    .ivu-collapse-header {
      padding-left: 16px;
      font-size: 14px;
      font-weight: bold;
    }
    .ivu-collapse-content {
      background: none;
    }
    .ivu-collapse-content-box {
      padding-top: 0;
    }
    li {
      padding: 5px 12px;
    }
  }
}
.pic-items {
  ul {
    display: flex; flex-wrap: wrap; margin-top: 20px;
  }
  li {
    position: relative; display: flex; align-items: center;
    width: 60px; background: #f0f0f0; height: 80px; padding: 5px; margin: 5px; border: solid 1px #e2e2e2; text-align: center;
    img{
      max-width: 100%;
      max-height: 100%;
      margin: 0 auto;
    }
    .del {
      position: absolute; top: 5px; right: 5px;
    }
    .sort-left, .sort-right { position: absolute; bottom: 5px;}
    .sort-left { left: 5px;}
    .sort-right { right: 5px;}
  }
}
.threesixty {
  height: 450px; width: 1000px;
}
.gde {
  padding: 30px; position: relative;
  &-left {
    position: absolute; top: -80px; left: 200px;
    width: 140px; height: 80px; background: url('/static/icons/dragLeft.png')
  }
  &-right {
    position: absolute; top: -80px; right: 200px;
    width: 140px; height: 80px; background: url('/static/icons/dragRight.png')
  }
}
.gallery-toolbar {
    position: absolute; bottom: 0px; padding: 6px 20px; right: 240px; /*box-shadow: 0 0 10px #eee;*/
    span {
        margin-bottom: 20px; display: block; cursor: pointer;
    }
}
</style>

