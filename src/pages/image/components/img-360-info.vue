<template>
  <div class="img-info" v-if="detail.url">
    <div class="img-info-box">
      <Row type="flex" justify="space-between">
        <Col><div style="margin-bottom: 20px">替换图片</div>
          <strong>
            <span class="cursor" style="margin:15px; display:inline-block" @click="delPic(detail.id)">
              <Icon type="ios-trash" size="24"></Icon>
            </span>
          </strong>
        </Col>
        <Col>
          <Upload :on-success="uploadProduct" :show-upload-list="false" :data="uploadData" name="fileData" :action="api+ '/picApi/modifyPic'" type="drag">
            <div class="img-info-img"><img class="cursor" :src="server + detail.url" alt=""></div>
          </Upload>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    detail: {}
  },
  data() {
    return {

    }
  },
  computed: {
    uploadData() {
      return {
        userToken: this.$store.state.user.userInfo.userToken,
        id: this.detail.id
      }
    }
  },
  methods: {
    uploadProduct() {
      this.$emit('on-modifypic')
    },
    async delPic() {
      let { data } = await this.http('/productApi/delFullScenePic', {
        data: {
          pic_id: this.detail.pic_id
        },
        method: 'POST'
      })
      if (!data.code) {
        this.$emit('on-modifypic')
        this.$Message.success(data.msg.zh);
      } else {
        this.$Message.error(data.msg.zh);
      }
    },
  }
}
</script>

<style scoped>

</style>
