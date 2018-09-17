<template>
  <div>
    <ul class="product-list flex">
      <item :item="item" v-for="(item, index) in items.list" :key="index"></item>
    </ul>
    <div style="position: fixed; bottom: 20px; right: 300px;">
      <Page :total="items.paginate.total_record" @on-page-size-change="pageSizeChange" show-total placement="top" :page-size="items.paginate.page_size" :page-size-opts="[10, 20, 30, 40]" @on-change="getPage" :current="items.paginate.cur_page" size="small" show-elevator show-sizer></Page>
    </div>
  </div>
</template>

<script>
import Item from './item'
export default {
  data: function() {
    return {
      items: {
        product: [],
        paginate: {
          cur_page: 1,
          page_size: 10
        }
      }
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
    async getProductList(cid = '') {
      let { data } = await this.http('/productApi/getFullScenePicProductList', {
        data: {
          cid,
          cur_page: this.items.paginate.cur_page,
          page_size: this.items.paginate.page_size
        },
        method: 'POST'
      })
      console.log(data.result)
      data.result.paginate.cur_page = parseInt(data.result.paginate.cur_page)
      this.items = data.result
    },
  },
  created() {
    // this.getProductList()
    this.$bus.on('360_SELECT_IMAGE_LINE', id => {
      this.getProductList(id)
    })
  }
}
</script>

<style scoped>

</style>
