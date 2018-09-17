<template>
  <div class="img-info">
    <div class="img-info-box">
      <Row type="flex" justify="space-between">
        <Col><div style="margin-bottom: 20px">名称</div>
          <strong>{{detail.pic_title}}</strong>
        </Col>
        <Col>
          <Upload :on-success="uploadProduct" :show-upload-list="false" :data="uploadData" name="fileData" :action="api+ '/picApi/modifyPic'" type="drag">
            <div class="img-info-img"><img class="cursor" :src="server + detail.url" alt=""></div>
          </Upload>
        </Col>
      </Row>
    </div>
    <div class="img-info-box" v-if="detail.type == '1'">
      <Row type="flex" justify="space-between">
        <Col>
          <div style="margin-bottom: 15px; margin-top: 10px;">单位
            <strong style="padding-left: 20px">
              <Input @on-enter="edit" style="width: 60px" v-model="unit" size="small"/>
            </strong>
          </div>
          <div style="margin-bottom: 15px">价格
            <strong style="padding-left: 20px">
              <Input @on-enter="edit" style="width: 60px" v-model="detail.price" size="small"/>
            </strong>
          </div>
        </Col>
        <Col><span class="cursor" style="margin:20px; display:inline-block" @click="delPic(detail.id)"><Icon type="ios-trash" size="24"></Icon></span></Col>
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
      // unit: this.detail.unit,
      // price: ''
    }
  },
  computed: {
    uploadData() {
      return {
        userToken: this.$store.state.user.userInfo.userToken,
        id: this.detail.id
      }
    },
    price() {
      return this.detail.price
    }
  },
  methods: {
    async edit() {
      let { data } = await this.http('/picApi/modifyPicAttr', {
        data: {
          id: this.detail.id,
          spec: '个',
          price: this.detail.price
        },
        method: 'POST'
      })
      if (!data.code) {
        this.$Message.success(data.msg.zh);
      } else {
        this.$Message.error(data.msg.zh);
      }
    },
    uploadProduct() {
      this.$emit('on-modifypic')
    },
    async delPic(id) {
      let { data } = await this.http('/picApi/delPic', {
        data: {
          id: id
        },
        method: 'POST'
      })
      if (!data.code) {
        history.go(-1)
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
