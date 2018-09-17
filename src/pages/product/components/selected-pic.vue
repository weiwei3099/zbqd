<template>
  <li @mouseenter="mouseenter" @mouseleave="mouseleave" class="product-img flex flex-center cursor" @click="design(pic)">
    <span v-if="category !== '产品颜色' && showDelete" class="delete" @click.stop="deleteElement"><Icon type="trash-a" size="12px"></Icon></span>
    <img :src="server + pic.url" alt="">
  </li>
</template>

<script>
export default {
  props: {
    pic: {},
    category: ''
  },
  data() {
    return {
      showDelete: false
    }
  },
  methods: {
    deleteElement() {
      if (this.category != '背景') {
        this.$store.commit('DEL_OTHER_PRODUCT', {
          category: this.category,
          product: this.pic
        })
      } else {
        this.$store.commit('DEL_BG', this.pic)
      }
    },
    mouseenter() {
      this.showDelete = true
    },
    mouseleave() {
      this.showDelete = false
    },
    design(pic) {
      this.$emit('design', pic)
    }
  }
}
</script>

<style lang="less" scoped>
.product-img {
    width: 200px;
    height: 260px;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center center;
    margin: 20px;
    border: solid 1px #ccc;
    text-align: center;
    position: relative;
    img {
      max-height: 100%;
      max-width: 100%;
    }
    &:hover {
      border: solid 1px #2d8cf0;
    }
    .delete {
      display: inline-block;
      width: 16px;
      height: 16px;
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ff0000;
      border-radius: 50%;
      color:#fff;
    }
  }
</style>
