<template>
  <i-page>
    <div slot="header-handler"></div>
    <div class="page-content" slot="page-content">
      <!-- <router-view></router-view> -->
      <div>
        <full-item ref="fullItem"></full-item>
      </div>
      <div style="position: fixed; right: 242px; width: 100px; bottom: 0; top: 36px; background:#fff; padding: 5px;">
        <ul>
          <list-item :show="show" @del-callback="get360Products" :item="item" v-for="(item, i) in items.list" :key="i"></list-item>
        </ul>
        <div v-if="current_category" @click="show360Modal" class="flex flex-center cursor" style="height: 100px; border:solid 2px #f0f0f0;">
          <Button icon="plus" type="text"></Button>
        </div>
      </div>
    </div>

    <div class="page-aside" slot="page-aside">
      <div class="aside line-collapse collapse">
        <div class="cursor flex center" @click="open" style="height: 50px; border-bottom: solid 2px #f2f2f2;">
          显示全部
        </div>
        <Collapse>
          <Panel :ref="'col'+index" :name="'col'+index" v-for="(item, index) in categories" :key="index">
            <span class="line-title-bar">
              <span style="width:180px; display:inline-block">
                {{item.title}}
              </span>
              <span class="btn" @click.stop="addChildLine(index)">
                <Icon type="plus" size="8"></Icon>
              </span>
            </span>
            <category slot="content" @on-get="getCategory" :parent="item" :ref="'category'+index" :lines="item.children"></category>
          </Panel>
        </Collapse>
        <Input v-show="showAddLine" v-model="newCategory" size="small" @on-enter="addCategory" />
      </div>
      <div class="aside-btn img-info-box">
        <Button @click="addLine" type="text" size="large">新建系列</Button>
      </div>
      <modal-360-product ref="Modal360Product" @cancel="hideAdd" @save="add360Products" :show="Show360Product"/>
    </div>

  </i-page>
</template>

<script>
import Category from '../../components/360/category'
import axios from 'axios'

import ListItem from './components/ListItem'
import FullItem from './360Detail'

import Modal360Product from './modal-360-product'

export default {
  data() {
    return {
      newCategory: '',
      categories: [],
      showAddLine: false,
      formValidate: {
        parent_id: 0,
        title: ''
      },
      ruleValidate: {
        title: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      },
      uploadData: {},
      items: {},
      current_category: '',
      Show360Product: 0,
      show: 0
    }
  },
  components: {
    Category, ListItem, FullItem, Modal360Product
  },
  methods: {
    hideAdd() {
      this.Show360Product = 0
    },
    show360Modal() {
      this.Show360Product = 1
    },
    async add360Products() {
      let { data } = await this.http('/productApi/addFullSceneProduct', {
        data: {
          cid: this.current_category,
          pp_id: this.$store.state.images.image_for_360_pp_id
        },
        method: 'POST'
      })
      if (data.code) {
        this.$Message.error(data.msg.zh)
      } else {
        this.$Message.success(data.msg.zh)
      }
      this.get360Products()
      this.Show360Product = 0

    },
    async get360Products() {
      let { data } = await this.http('/productApi/getFullSceneCatInfo', {
        data: {
          cid: this.current_category
        },
        method: 'POST'
      })
      if(data.code) {
        this.$Message.info(data.msg.zh)
      }
      this.items = data.result
      this.$bus.emit('SHOW_360', this.items.list[0])
    },
    async del360Product (id) {
      let { data } = await this.http('/productApi/deleteFullSceneProduct', {
        data: {
          id: id,
        },
        method: 'POST'
      })
    },
    async submit() {
      let param = new FormData();

      for (let f of this.$refs.file.files) {
        param.append('pic[]', f)
      }

      param.append('userToken', this.$store.state.user.userInfo.userToken)
      param.append('cid', this.uploadData.cid)
      let { data } = await axios.post('/productApi/addFullSceneProduct', param, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      this.productList = data.result.pics
    },
    open() {
      for (let i = 0; i < this.categories.length; i++) {
        this.$refs['col' + i][0].toggle()
      }
    },
    addChildLine(i) {
      this.$refs['category' + i][0].showAdd()
    },
    submitAddLine() {
      this.$refs['formValidate'].validate(async (valid) => {
        if (valid) {
          let { data } = await this.http('/productApi/addFullSceneCategory', {
            data: {
              title: this.formValidate.title
            },
            method: 'POST'
          })
          if (!data.code) {
            this.$Message.success('提交成功!');
            this.getCategory()
          }
        } else {
          this.$Message.error('表单验证失败!');
        }
      })

    },
    addLine() {
      this.showAddLine = true
    },
    async addCategory() {
      let { data } = await this.http('/productApi/addFullSceneCategory', {
        data: {
          title: this.newCategory
        },
        method: 'POST'
      })
      this.showAddLine = false

      this.getCategory()
    },
    async getCategory() {
      let { data } = await this.http('/productApi/getFullSceneCat', {
        method: 'POST'
      })
      this.categories = data.result.data
      this.current_category = this.categories[0].children[0].id
      this.get360Products()
    }
  },
  created() {
    this.getCategory()
    this.$bus.on('onSelect360Category', args => {
      this.current_category = args.id
      this.get360Products()
      // this.uploadData.cid = args.id
    })
    this.$bus.on('SHOW_360', (item) => {
      this.show = item.id
    })
  },
  // watch: {
  //   '$route': 'changeStatus'
  // }
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
      &.on {
        color: #2d8cf0
      }
    }
    .btn {
      color: #ff0000;
    }
  }
}
</style>
