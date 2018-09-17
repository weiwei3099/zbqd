<template>
    <div class="page-content">
      <div>
        <div style="height: 500px;" id="threesixty" class="flex center cursor">
          <div ref="threesixty" class="threesixty" style="margin-top: 150px" @mousedown="hide()">
            <div class="ui-spinner">
              <span class="side side-left">
                <span class="fill"></span>
              </span>
              <span class="side side-right">
                <span class="fill"></span>
              </span>
            </div>
          </div>
        </div>
        <div class="gde flex center" ref="gde">
          左右拖拽•开启360体验
          <div class="gde-left">

          </div>
          <div class="gde-right">

          </div>
        </div>

      </div>
      <!-- <div class="flex flex-center" v-if="!item.id">
        请选择右侧产品
      </div> -->
    </div>

</template>

<script>
import mixins from '@/mixins'
import '../../directive/3deye'

export default {
  mixins: [mixins],
  data() {
    return {
      categories: [],
      productList: [],
      item: {},
      flag: 0
    }
  },
  computed: {
    // item() {
    //   return this.$store.state.product.full_images
    // }
  },
  methods: {
    hide() {
      this.$refs.gde.style.display = 'none'
    },
    async getProductList(id) {
      this.cid = id
      let { data } = await this.http('/productApi/getFullSceneProductList', {
        data: { cid: id },
        method: 'POST'
      })
      this.productList = data.result.list
    },
    async getInfo() {
      let { data } = await this.http('/productApi/getFullScenePicProductInfo', {
        data: {
          id: this.$route.params.id
        },
        method: 'POST'
      })
      this.item = data.result.info
    }
  },
  created() {
    this.$bus.on('SHOW_360', async (item) => {
      this.item = item
      this.$Spin.show()
      let loaded = await new Promise((resolve, reject) =>{
        let load = 0
        for (let i in item.pic_product.pic) {
          let img = new Image()
          img.src = this.server + item.pic_product.pic[i].url
          img.onload = () => {
            load ++
            if (load == item.pic_product.pic.length) {
              resolve(load)
            }
          }
        }
      })
      if (loaded) {
        this.$Spin.hide()
      }
      if (this.flag) {
        $('.threesixty').destroy()
      }
      $('.threesixty').threeSixty({
        dragDirection: 'horizontal',
        useKeys: true,
        draggable: true,
        imgs: item.pic_product.pic
      })
      this.flag = 1
    })
  },
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
</style>
