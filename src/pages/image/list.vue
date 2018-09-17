
<template>
  <div>
      <div v-if="type ==='video'">
        <!-- <div class="flex center" v-if="items.pics.length == 0" style="height: 500px;">
          <Alert show-icon>该分类下暂无图片</Alert>
        </div> -->
        <div v-if="items.videos && items.videos.length > 0">
          <ul class="flex" style="flex-wrap:wrap;padding-bottom:40px;">
            <item-video :ref="'img'+item.id" :type="type" :item="item" @click="select(item.id)" @del="delPic" v-for="(item, index) in items.videos" :key="item.id" @playing="videostop"></item-video>
          </ul>
          <div style="position: fixed; bottom: 20px; right: 300px;">
            <Page :total="items.paginate.total_record" @on-page-size-change="pageSizeChange" show-total placement="top" :page-size="items.paginate.page_size" :page-size-opts="[10, 20, 30, 40]" @on-change="getPage" :current="items.paginate.cur_page" size="small" show-elevator show-sizer></Page>
          </div>
        </div>
      </div>

    <div v-else-if="type!=='360'">
      <!-- <div class="flex center" v-if="items.pics.length == 0" style="height: 500px;">
        <Alert show-icon>该分类下暂无图片</Alert>
      </div> -->
      <div v-if="items.pics.length > 0">
        <ul class="product-list flex" style="padding-bottom: 50px;">
          <item :ref="'img'+item.id" :type="type" :item="item" @click="select(item.id)" @del="delPic" v-for="(item, index) in items.pics" :key="index"></item>
        </ul>
        <div style="position: fixed; bottom: 20px; right: 300px;">
          <Page :total="items.paginate.total_record" @on-page-size-change="pageSizeChange" show-total placement="top" :page-size="items.paginate.page_size" :page-size-opts="[10, 20, 30, 40]" @on-change="getPage" :current="items.paginate.cur_page" size="small" show-elevator show-sizer></Page>
        </div>
      </div>
    </div>

    <!-- 360 -->
    <div v-if="type==='360'">
      <!-- <div class="flex center" v-if="!items.list.length" style="height: 500px;">
        <Alert show-icon>该分类下暂无图片</Alert>
      </div> -->
      <div v-if="items.list.length">
        <ul class="product-list flex" style="padding-bottom: 50px;">
          <item-360 :item="item" @click="select(item.id)" @del3="del360Pic" v-for="(item, index) in items.list" :key="index"></item-360>
        </ul>
        <div style="position: fixed; bottom: 20px; right: 300px;">
          <Page :total="items.paginate.total_record" @on-page-size-change="pageSizeChange" show-total placement="top" :page-size="items.paginate.page_size" :page-size-opts="[10, 20, 30, 40]" @on-change="getPage" :current="items.paginate.cur_page" size="small" show-elevator show-sizer></Page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Item from './components/image-item'
import ItemVideo from './components/video-item'
import Item360 from './components/item-360'

export default {
  data: function() {
    return {
      type: this.$route.query.type,
      status: '',
      selected: false,
      cid: this.$route.query.cid,
      items: {
        list: [],
        pics: [],
        videos: [],
        paginate: {
          cur_page: 1,
          page_size: 40
        }
      }
    }
  },
  components: {
    Item, Item360, ItemVideo
  },
  methods: {
    pageSizeChange(size) {
      this.items.paginate.cur_page = 1
      this.items.paginate.page_size = size
      this.getProductList()
    },
    getPage(p) {
      this.items.paginate.cur_page = p
      this.getProductList()
    },
    async getProductList() {
      if (this.$route.query.type === '360') {
        this.get360PicList()
    } else if(this.$route.query.type === 'video') {
        this.getVideoPicList()
      } else {
        this.getPicList()
      }
    },
    async getPicList() {
      this.$Spin.show();
      let params = {
        pic_category_id: this.cid,
        cur_page: this.items.paginate.cur_page,
        page_size: this.items.paginate.page_size
      }
      if (!this.cid) {
        delete params.pic_category_id
      }
      if (this.$route.params.status == 'select') {
        params.show_type = 2
      }
      let { data } = await this.http('/picApi/getPicList', {
        data: params,
        method: 'POST'
      })
      this.$Spin.hide();
      if (data.code && this.items.paginate.cur_page > 1) {
        this.items.paginate.cur_page--
        this.getProductList()
      } else {
        if (data.result.pics) {
          data.result.paginate.cur_page = parseInt(data.result.paginate.cur_page)
          this.items.pics = data.result.pics
          $.extend(this.items.paginate, data.result.paginate);
          // this.items.paginate = data.result.paginate
        } else {
          this.items ={
            list: [],
            pics: [],
            videos: [],
            paginate: {
              cur_page: 1,
              page_size: 40
            }
          }
          this.$Message.info(data.msg.zh)
        }
      }
    },
    async get360PicList() {
      this.$Spin.show();
      let { data } = await this.http('/productApi/getFullScenePicProductList', {
        data: {
          cid: this.cid,
          cur_page: this.items.paginate.cur_page,
          page_size: this.items.paginate.page_size
        },
        method: 'POST'
      })
      this.$Spin.hide();
      if (data.result.paginate) {
        this.items = {
          pics: [],
          list: data.result.list,
          videos: [],
          paginate: {
            cur_page: parseInt(data.result.paginate.cur_page),
            total_record: parseInt(data.result.paginate.total_record),
          }
        }
      }
    },
    async getVideoPicList(){
        this.$Spin.show();
        let { data } = await this.http('/videoApi/getVideoGalleryCategoryInfo', {
          data: {
            cid: this.cid,
            cur_page: this.items.paginate.cur_page,
            page_size: this.items.paginate.page_size
          },
          method: 'POST'
        })
        this.$Spin.hide();
        if (data.result.paginate) {
          this.items = {
            pics: [],
            videos: data.result.data,
            list: [],
            paginate: {
              cur_page: parseInt(data.result.paginate.cur_page),
              total_record: parseInt(data.result.paginate.total_record),
            }
          }
        }
    },
    async delPic(id) {
      let { data } = await this.http('/picApi/delPic', {
        data: {
          id: id
        },
        method: 'POST'
      })
      if (!data.code) {
        this.getProductList()
        this.$Message.success(data.msg.zh);
      } else {
        this.$Message.error(data.msg.zh);
      }
    },
    async del360Pic(id) {
      let { data } = await this.http('/productApi/delFullScenePicProduct', {
        data: {
          pid: id
        },
        method: 'POST'
      })
      if (!data.code) {
        this.getProductList()
        this.$Message.success(data.msg.zh);
      } else {
        this.$Message.error(data.msg.zh);
      }
    },
    select(id) {
      if (this.status === 'select') {
        this.selected = !this.selected
        if (this.selected) {
          this.$store.commit('IMAGE_ADD', id)
        } else {
          this.$store.commit('IMAGE_REMOVE', id)
        }
      }
    },
    videostop(video, item){
        for(let tmp of this.items.videos){
            if(tmp !== item){
                this.$refs['img'+tmp.id][0].stop();
            }
        }
    }
  },
  created() {
    this.$bus.on('SelectAllProduct', () => {
      for (let pic of this.items.pics) {
        this.$refs['img'+pic.id][0].select()
      }
      console.log('selectAllProduct')
    })
    this.$bus.on('CancelAllProduct', () => {
      for (let pic of this.items.pics) {
        this.$refs['img'+pic.id][0].select()
      }
      console.log('cancelAllProduct')
    })
    this.status = this.$route.params.status
    this.$bus.on('clearImageSelect', aa => {
      this.selected = false
    })
    this.$bus.on('getProductImage', ({ type, cid }) => {
      this.cid = cid
      this.items.paginate.cur_page = 1
      this.getProductList()
    })
    this.$bus.on('GET_IMAGE_LIST', ({id, type}) => {
      this.cid = id
      this.type = type

      this.items = {
        pics: [],
        list: [],
        paginate: {
          cur_page: 1,
          page_size: 40
        }
      }
      this.getProductList()
    })
    this.$bus.on('GET_IMAGE_360', id => {
      this.cid = id
      this.type = '360'

      this.items = {
        pics: [],
        list: [],
        paginate: {
          cur_page: 1,
          page_size: 40
        }
      }
      this.getProductList()
    })
    this.getProductList()
  }
}
</script>

<style scoped>

</style>
