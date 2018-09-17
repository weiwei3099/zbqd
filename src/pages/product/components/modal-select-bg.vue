<template>
  <div style="height: 450px;">
    <div>
      <Select v-model="category" style="width:200px" @on-change="getPage(1)">
        <Option v-for="item in categorys" :value="item.id" :key="item.title">{{ item.title }}</Option>
      </Select>
    </div>
    <div v-if="pics.length > 0">
      <ul class="pic-list" style="height: 400px;">
        <li @click="selectImage(item)" v-for="(item, i) in pics" :key="i">
          <img :src="server + item.url" alt="">
        </li>
      </ul>
      <div>
        <Page :total="paginate.total_record" @on-page-size-change="pageSizeChange" show-total placement="top" :page-size="paginate.page_size" :page-size-opts="[10, 20, 30, 40]" @on-change="getPage" :current="paginate.cur_page" size="small" show-elevator show-sizer></Page>
      </div>
    </div>
    <div v-if="pics.length == 0">
      <div style="padding-top: 10px;">
        暂无图片
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      cid: 0,
      title: "",
      pics: [],
      paginate: {
        cur_page: 1,
        page_size: 10,
        total_record: 1
      },
      categorys: [],
      category: ""
    };
  },
  methods: {
    async getList() {
      let { data } = await this.http('/picApi/getPicCategory', {
        data: {
          type: 2,
          page_size: 1000
        },
        method: 'POST'
      })

      this.categorys = data.result.data
      this.category = this.categorys[0].id
      //this.get(this.category)
    },
    selectImage(item) {
      this.$store.commit("ADD_BGS", item);
    },
    async get(id, p = 1) {
      this.pics = []
      let { data } = await this.http("/picApi/getPicList", {
        data: {
          pic_category_id: parseInt(id),
          page_size: this.paginate.page_size,
          cur_page: parseInt(p)
        },
        method: "POST"
      });
      if (data.result.pics) {
        this.pics = data.result.pics;

        this.paginate.cur_page = parseInt(data.result.paginate.cur_page);
        this.paginate.total_record = data.result.paginate.total_record;
      }
    },
    pageSizeChange(size) {
      this.paginate.page_size = size;
      this.paginate.cur_page = 1;
      this.get(this.category);
    },
    getPage(p) {
      this.get(this.category, p);
    }
  }
};
</script>

<style lang="less" scoped>
.pic-list {
  display: flex;
  padding: 10px 0 20px 0;
  li {
    border: solid 1px #ccc;
    text-align: center;
    padding: 10px;
    margin-right: 10px;
    width: 180px;
    height: 180px;
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-position: center center;
    cursor: pointer;
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
