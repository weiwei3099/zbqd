<template>
    <li class="cursor" :class="{'on': show == item.id}" @click="goDetail">
      <div class="img-box flex flex-center" v-if="item.pic_product.pic.length">
        <img :src="server + item.pic_product.pic[0].url" alt="">
      </div>
      <span class="delete cursor" @click.stop="productDel(item.id)"><Icon type="ios-trash" size="14"></Icon></span>
      <div class="flex center">
        <span>
          <span class="cursor">360名称</span>
        </span>
      </div>
    </li>
</template>

<script>
export default {
  props: {
    item: {},
    show: 0
  },
  data: function() {
    return {
    };
  },
  methods: {
    goDetail() {
      this.$bus.emit('SHOW_360', this.item)
      // console.log(this.item)
      // this.$store.commit('FULL_IMAGES', this.item)
      // this.$router.push({
      //   name: '360详细',
      //   params: {
      //     id: this.item.id
      //   }
      // })
    },
    productDel(id) {
      this.$Modal.confirm({
        title: "提示框",
        content: "<p>确认删除本产品吗？</p>",
        loading: true,
        onOk: async () => {
          let { data } = await this.http("/productApi/deleteFullSceneProduct", {
            data: {
              id: id
            },
            method: "POST"
          });
          if (!data.code) {
            this.$Modal.remove();
            this.$emit('del-callback');
          }
          this.$Message.info(data.msg.zh);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
li{
  position: relative;
  height: 100px;
  background: #f2f2f2;
  margin-bottom: 10px;
  // border: solid 1px #f0f0f0;
  .img-box {
    height: 80px;
  }
  .delete { position: absolute; top: 0px; right: 0px; padding: 10px;}
  &.on {
    border: solid 1px #ff0000;
  }
}
img {
  max-width: 100%;
  max-height: 100%;
}
</style>
