<template>
  <div>
    <ul class="product-list flex">
      <item :item="item" v-for="(item, index) in items.product" :key="index"></item>
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
    async getProductList(id = '') {
      let { data } = await this.http('/productApi/getProductCatInfo', {
        data: {
          id,
          cur_page: this.items.paginate.cur_page,
          page_size: this.items.paginate.page_size
        },
        method: 'POST'
      })
      data.result.paginate.cur_page = parseInt(data.result.paginate.cur_page)
      this.items = data.result
    },
  },
  created() {
    this.getProductList()
    this.$bus.on('GALLERY_SELECT_PRODUCT_LINE', id => {
      this.getProductList(id)
    })
  },
  watch: {
    '$route': 'getProductList'
  }
}
</script>

<style scoped>

</style>
