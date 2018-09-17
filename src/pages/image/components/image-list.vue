
<template>
  <div>
    <div class="flex center" v-if="items.pics.length == 0" style="height: 500px;">
      <Alert show-icon>该分类下暂无图片</Alert>
    </div>
    <div v-if="items.pics.length > 0">
      <ul class="product-list flex" style="padding-bottom: 50px;">
        <item :type="type" :item="item" @click="select(item.id)" @del="delPic" v-for="(item, index) in items.pics" :key="index"></item>
      </ul>
      <div style="position: fixed; bottom: 20px; right: 300px;">
        <Page :total="items.paginate.total_record" @on-page-size-change="pageSizeChange" show-total placement="top" :page-size="items.paginate.page_size" :page-size-opts="[10, 20, 30, 40]" @on-change="getPage" :current="items.paginate.cur_page" size="small" show-elevator show-sizer></Page>
      </div>
    </div>
  </div>
</template>

<script>
import Item from './image-item'

export default {
  props: {
    type: ''
  },
  data: function() {
    return {
      status: '',
      selected: false,
      cid: null,
      items: {
        pics: [],
        paginate: {
          cur_page: 1,
          page_size: 10
        }
      },
    }
  },
  components: {
    Item
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
      this.$Spin.show();
      let params = {
        pic_category_id: this.cid,
        cur_page: this.items.paginate.cur_page,
        page_size: this.items.paginate.page_size
      }
      if (!this.cid) {
        delete params.pic_category_id
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
        data.result.paginate.cur_page = parseInt(data.result.paginate.cur_page)
        this.items = data.result
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
    select(id) {
      if (this.status === 'select') {
        this.selected = !this.selected
        if (this.selected) {
          this.$store.commit('IMAGE_ADD', id)
        } else {
          this.$store.commit('IMAGE_REMOVE', id)
        }
      }
    }
  },
  created() {
    this.status = this.$route.params.status
    this.$bus.on('clearImageSelect', aa => {
      this.selected = false
    })
    this.$bus.on('getProductImage', ({ type, cid }) => {
      this.cid = cid
      this.items.paginate.cur_page = 1
      this.getProductList()
    })
    this.$bus.on('GET_IMAGE_LIST', id => {
      this.cid = id

      this.items = {
        pics: [],
        paginate: {
          cur_page: 1,
          page_size: 10
        }
      }
      // this.items.paginate.cur_page = 1
      this.getProductList()
    })
    this.getProductList()
  }
}
</script>

<style scoped>

</style>
