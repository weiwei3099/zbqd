<template>
<i-page :aside="false">
  <div slot="header-handler">
    <a href="javascript:void(0)" @click="goback">返回列表</a>
  </div>
  <div class="page-content" slot="page-content" :class="{'grey': color}" style="height: 100%;">
    <div class="prev" v-if="detail.last_id" @click="go({name: '产品图库详情', query: {id: detail.last_id, page: 'pro-detail'}})"><Icon type="ios-arrow-left" size="32"></Icon></div>
    <div class="next" v-if="detail.next_id" @click="go({name: '产品图库详情', query: {id: detail.next_id, page: 'pro-detail'}})"><Icon type="ios-arrow-right" size="32"></Icon></div>
    <div class="content-main flex flex-center">
      <img :src="server+detail.url" height="86%" :style="'transform: scale(' + scale+')'" alt="">
    </div>
    <div style="position: absolute; bottom: 50px; right: 270px;">
      <div style="padding: 10px 0"><span class="grey-color">黑底</span> <i-switch v-model="color" @on-change="change"></i-switch></div>
      <div class="cursor flex" style="justify-content: flex-end; padding: 10px 0" @click="plus">
        <img src="../../../static/icon/Symbol 42 – 1@3x.png" width="24" alt="">
      </div>
      <div class="cursor flex" style="justify-content: flex-end; padding: 10px 0" @click="min">
        <img src="../../../static/icon/Symbol 43 – 1@3x.png" width="24" alt="">
      </div>
    </div>

    <img-info :detail="detail" @on-modifypic="get"></img-info>
  </div>

</i-page>
</template>

<script>
import ImgInfo from './components/img-info'
export default {
  name: "name",
  data: function() {
    return {
      scale: 1,
      color: '',
      detail: {},
      form: {
        userToken: this.$store.state.user.userInfo.userToken,
        id: this.$route.query.id
      }
    };
  },
  components: {
    ImgInfo
  },
  // computed:{
  //   detail() {
  //     return this.$store.state.images.detail
  //   }
  // },
  methods: {
    goback() {
      history.go(-1)
    },
    plus() {
      if (this.scale < 3) {
        this.scale +=0.2
      }
    },
    min() {
      if (this.scale > 0.2) {
        this.scale -=0.2
      }
    },
    change (status) {
      // this.$Message.info('开关状态：' + status);
    },
    uploadProduct() {
      this.get()
    },
    async get() {
      let { data } = await this.http("/picApi/getPic", {
        data: {
          id: this.$route.query.id
        },
        method: "POST"
      });
      this.detail = data.result.pic;
    }
  },
  created() {
    this.get();
  },
  watch: {
    '$route': 'get'
  }
};
</script>

<style lang="less" scoped>
  .grey-color {
    color:#666;
  }
  .grey {
    background: #333;
  }
  .grey .grey-color {
   color:#fff;
  }
</style>
