<template>
  <i-page>
    <div class="page-content" slot="page-content">

      <ul class="box-list flex">

        <li class="" v-for="(item, index) in productList" :key="index" v-mask>

          <div class="del" @click="delGallery(item.id)">
            <Icon size="20" color="#2d8cf0" type="close-circled"></Icon>
          </div>

          <div class="box-mask flex center">
            <div>
              <!-- <Button type="primary" icon="ios-compose" @click="onShowModal('Edit', item)">编辑</Button> -->
              <router-link :to="{ name: '360详细', params: {id: item.id}}">
                <Button type="info" icon="ios-search">查看</Button>
              </router-link>
            </div>
          </div>

          <div class="albums" @click="go({name: '360详细', params: {id: item.id}})">
            <img :src="server + item.pic.url" width="200" height="136px" />
            <div class="p-10 flex center">
              {{item.title}}
            </div>
          </div>

        </li>

        <li class="flex center cursor" @click="onShowModal('Add')">
          <div>
            <Icon type="plus" size="32"></Icon>
          </div>
        </li>
      </ul>

      <Modal v-model="modalAdd" width="600">
        <p slot="header" style="color:#2d8cf0;text-align:center">
          <Icon type="compose"></Icon>
          <span>新增360产品</span>
        </p>
        <div style="padding-right: 30px">
          <add-item :cid="cid" @close="onClose"></add-item>
        </div>

        <!-- <div>
          <input ref="file" type="file" name="pic[]" id="" multiple="multiple">
        </div>

        <Button icon="ios-cloud-upload-outline" @click="submit">上传文件</Button> -->

        <div slot="footer">
          <!-- <Button type="error" size="large" long :loading="modal_loading" @click="del">删除</Button> -->
        </div>
      </Modal>

    </div>

    <div class="page-aside" slot="page-aside">
      <div class="aside">
        <div v-open class="line-collapse">
          <Collapse :value="open">
            <Panel :name="category.id" v-for="(category, i) in categories" :key="i">
              {{category.title}}{{category.id}}
              <ul slot="content" v-for="(category1, x) in category.children" :key="x">
                <li @click="getProductList(category1.id)">{{category1.title}}</li>
              </ul>
            </Panel>
          </Collapse>
        </div>
      </div>
      <div class="aside-btn">
        <Button type="primary">新建系列</Button>
      </div>
    </div>
  </i-page>
</template>

<script>
import mixins from '@/mixins'
import axios from 'axios'
import '@/directive'

import AddItem from './AddItem'

export default {
  mixins: [mixins],
  data() {
    return {
      categories: [],
      productList: [],
      modalAdd: false,
      modalEdit: false,
      modal_loading: false,
      cid: -1,
      open: '0'
    }
  },
  components: {
    AddItem
  },
  methods: {
    async delGallery(id) {
      let { data } = await this.http('/productApi/delFullSceneProduct', {
        data: { pid: id },
        method: 'POST'
      })
      this.$Message.info(data.msg.zh)
      if (!data.code) {
        this.getList()
      }
    },
    async submit() {
      let param = new FormData();

      for (let f of this.$refs.file.files) {
        param.append('pic[]', f)
      }

      param.append('userToken', this.$store.state.user.userInfo.userToken)
      param.append('cid', this.cid)
      let { data } = await axios.post('/productApi/addFullSceneProduct', param, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      this.productList = data.result.pics
    },
    onShowModal(modal) {
      this['modal'+modal] = true
    },
    onClose(modal) {
      this.getList()
      this['modal'+modal] = false
    },
    del() {

    },
    async getProductList(id) {
      this.cid = id
      let { data } = await this.http('/productApi/getFullSceneProductList', {
        data: { cid: id },
        method: 'POST'
      })
      if(data.code) {
        this.$Message.info(data.msg.zh)
      }
      this.productList = data.result.list
    },
    async getList() {
      let { data } = await this.http('/productApi/getFullSceneCat', {
        method: 'POST'
      })
      this.categories = data.result.data
      if (this.categories.length > 0) {
        if (this.categories[0].children.length > 0) {
          this.open = this.categories[0].id

          this.getProductList(this.categories[0].children[0].id)
        }
      }
      //console.log(line1)
      // console.log(this.items.find(function (x) {
      //   return x.id === '1'
      // }))
    }
  },
  computed: {

  },
  created() {
    this.getList()
  }
}
</script>

<style lang="less">
.line-collapse {
  .ivu-collapse {
    background: none;
    border: none;
    .ivu-icon-arrow-right-b {
      font-size: 12px;
      font-weight: normal;
    }
    .ivu-icon-arrow-right-b:before {
      content: "\F218"
    }
    .ivu-collapse-header {
      padding-left: 16px;
      font-size: 14px;
      font-weight: bold;
    }
    .ivu-collapse-content {
      background: none;
    }
    .ivu-collapse-content-box {
      padding-top: 0;
    }
    li {
      padding: 5px 12px;
    }
  }
}
</style>
