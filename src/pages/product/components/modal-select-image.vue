<template>
  <div>
    <div v-if="pics">
      <ul class="pic-list">
        <li @click="selectImage(item)" v-for="(item, i) in pics" :key="i">
          <img :src="server + item.url" alt="">
        </li>
      </ul>
      <div>
        <Page :total="paginate.total_record" @on-page-size-change="pageSizeChange" show-total placement="top" :page-size="paginate.page_size" :page-size-opts="[10, 20, 30, 40]" @on-change="getPage" :current="paginate.cur_page" size="small" show-elevator show-sizer></Page>
      </div>
    </div>
    <div v-if="!pics">
      暂无图片
    </div>
  </div>
</template>

<script>
export default {
  name: "name",
  data: function() {
    return {
      cid: 0,
      title: '',
      pics: [],
      paginate: {
        cur_page: 1,
        page_size: 10,
        total_record: 1,
      }
    };
  },
  methods: {
    selectImage(item) {
      console.log(item)
      this.$store.commit('ADD_OTHER_PRODUCT', {
        title: this.title,
        type: 3,
        cid: this.cid,
        product: {
          id: item.id,
          url: item.url,
          attr: { width: item.width, height: item.height},
          is_default: 0
        }
      })
    },
    async get({cid, title}, p = 1) {
      if (!this.cid || this.cid != cid) {
        this.cid = parseInt(cid);
        this.title = title
      }
      let { data } = await this.http("/picApi/getPicList", {
        data: {
          pic_category_id: this.cid,
          page_size: this.paginate.page_size,
          cur_page: parseInt(p)
        },
        method: "POST"
      });
      this.pics = data.result.pics;
      // this.$store.dispatch('PARTS_PICS', {
      //   cid: this.cid,
      //   pics: this.pics
      // })
      this.paginate.cur_page = parseInt(data.result.paginate.cur_page);
      this.paginate.total_record = data.result.paginate.total_record;
    },
    pageSizeChange(size) {
      this.paginate.page_size = size;
      this.paginate.cur_page = 1;
      this.get({cid: this.cid, title: this.title});
    },
    getPage(p) {
      this.get({cid: this.cid, title: this.title}, p);
    }
  }
};
</script>

<style lang="less" scoped>
.pic-list{
  display: flex; padding: 10px 0 20px 0;
  li {
    border: solid 1px #ccc; text-align: center; padding: 10px; margin-right: 10px; cursor: pointer;
    width: 180px; height: 180px; background-size: 100% auto; background-repeat: no-repeat; background-position: center center;
    img{
      max-height: 100%; max-width: 100%;
    }
    &:hover {
      border: solid 1px #2d8cf0;
    }
  }
}
</style>
