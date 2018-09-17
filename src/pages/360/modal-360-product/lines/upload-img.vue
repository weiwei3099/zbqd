<template>
  <Upload :data="form" style="display:inline;" :show-upload-list="false" name="pic" :action="api + '/productApi/productCatPicModify'" :on-success="uploadProductLineIcon">
    <span class="btn" style="color:#999">
      <Icon type="android-image" size="12" v-if="!line.img_url"></Icon>
      <img style="width:12px; height:12px;" :src="server + line.img_url" v-if="line.img_url"/>
    </span>
  </Upload>
</template>

<script>
export default {
  props: {
    line: ''
  },
  data: function() {
    return {
      form: {
        userToken: this.$store.state.user.userInfo.userToken,
        id: this.line.id
      }
    }
  },
  methods: {
    uploadProductLineIcon(res, file, fileList) {
      this.$Message.success('提交成功!');
      this.$bus.emit('getProductLines')
    },
  }
}
</script>

<style scoped>

</style>
