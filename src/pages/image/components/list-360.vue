<template>
  <div>
    <div class="flex center" v-if="!items.list.length" style="height: 500px;">
      <Alert show-icon>该分类下暂无图片</Alert>
    </div>
    <div v-if="items.list.length">
      <ul class="product-list flex" style="padding-bottom: 50px;">
        <item :item="item" @click="select(item.id)" @del360="delPic" v-for="(item, index) in items.list" :key="index"></item>
      </ul>
      <div style="position: fixed; bottom: 20px; right: 300px;">
        <Page :total="items.paginate.total_record" @on-page-size-change="pageSizeChange" show-total placement="top" :page-size="items.paginate.page_size" :page-size-opts="[10, 20, 30, 40]" @on-change="getPage" :current="items.paginate.cur_page" size="small" show-elevator show-sizer></Page>
      </div>
    </div>
  </div>
</template>

<script>
import Item from './item-360'

export default {
  data: function() {
    return {
      status: '',
      selected: false,
      type: 2,
      cid: 1,
      items: {
        list: [],
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
      let { data } = await this.http('/productApi/getFullScenePicProductList', {
        data: {
          cid: this.cid,
          cur_page: this.items.paginate.cur_page,
          page_size: this.items.paginate.page_size
        },
        method: 'POST'
      })

      this.items = {
        list: data.result.list,
        paginate: {
          cur_page: parseInt(data.result.paginate.cur_page),
          total_record: parseInt(data.result.paginate.total_record),
        }
      }
    },
    async delPic(id) {
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
    }
  },
  created() {
    this.status = this.$route.params.status
    this.$bus.on('clearImageSelect', aa => {
      this.selected = false
    })
    this.$bus.on('getProductImage', ({ type, cid }) => {
      this.type = type
      this.cid = cid
      this.items.paginate.cur_page = 1
      this.getProductList()
    })
    this.$bus.on('GET_IMAGE_360', id => {
      this.cid = id

      this.items = {
        list: [],
        paginate: {
          cur_page: 1,
          page_size: 10
        }
      }
      // this.items.paginate.cur_page = 1
      this.getProductList()
    })
  }
}
</script>

<style scoped>

</style>
