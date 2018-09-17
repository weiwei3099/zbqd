<template>
  <div class="line-collapse collapse">
    <div class="cursor flex center" @click="open" style="height: 50px; border-bottom: solid 2px #f2f2f2;">
      显示全部
    </div>
    <Collapse>
      <Panel :ref="'line'+i" :name="line1.id" v-for="(line1, i) in lines" :key="i">
        <span class="line-title-bar">
          <span style="width:150px; display:inline-block">
            {{line1.title}}
          </span>
          <!-- <upload-img :line="line1"></upload-img>

          <span class="btn" style="color:#999" @click.stop="delProductCat(line1.id)">
            <Icon type="ios-trash" size="12"></Icon>
          </span>
          <span class="btn" @click.stop="showAddInput(line1.id)">
            <Icon type="plus" size="12"></Icon>
          </span> -->

        </span>
        <line-panel slot="content" :line="line1"></line-panel>
      </Panel>
    </Collapse>
    <Modal v-model="showAdd" width="600" @on-ok="submitAddLine">
      <p slot="header" style="color:#2d8cf0; text-align:center">
        <Icon type="compose"></Icon>
        <span>新建系列</span>
      </p>
      <div style="padding-right: 20px;">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <Form-item label="系列名称" prop="title">
            <Input v-model="formValidate.title" placeholder="系列名称"></Input>
          </Form-item>
          <!-- <FormItem label="是否为背景">
              <RadioGroup v-model="formValidate.type">
                <Radio label="1">是</Radio>
                <Radio label="2">否</Radio>
              </RadioGroup>
            </FormItem> -->
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import LinePanel from './line-panel'
import LineInput from './line-input'
import UploadImg from './upload-img'
// import { hex_md5 } from '../../../util/md5'
const timestamp = Date.now()

export default {
  data: function() {
    return {
      lines: [],
      showAdd: false,
      formValidate: {
        parent_id: 0,
        title: '',
        type: 2,
        isSell: 1
      },
      ruleValidate: {
        title: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      },
      // uploader: {
      //   timestamp: timestamp,
      //   token: hex_md5('fitment_' + timestamp),
      //   type: 'images'
      // },
    }
  },
  components: {
    LinePanel,
    LineInput,
    UploadImg
  },
  methods: {
    open() {
      for (let i=0; i< this.lines.length; i++) {
        this.$refs['line'+i][0].toggle()
      }
    },
    showAddInput(id) {
      this.formValidate.parent_id = id
      this.formValidate.title = ''
      this.showAdd = !this.showAdd
    },
    async delProductCat(id) {
      this.$Modal.confirm({
        title: '提示框',
        content: '<p>确认删除本系列吗？</p>',
        loading: true,
        onOk: async () => {
          let { data } = await this.http('/productApi/productCatDel', {
            data: {
              ids: id
            },
            method: 'POST'
          })
          if (!data.code) {
            this.$Modal.remove();
            this.getList()
          }
          this.$Message.info(data.msg.zh);

        }
      });
    },
    async getList() {
      let { data } = await this.http('/productApi/getProductCatList', {
        method: 'POST'
      })
      this.lines = data.result.productCats
    },
    submitAddLine() {
      this.$refs['formValidate'].validate(async (valid) => {
        if (valid) {
          let { data } = await this.http('/productApi/productCatNew', {
            data: {
              parent_id: this.formValidate.parent_id,
              title: this.formValidate.title,
            },
            method: 'POST'
          })
          if (!data.code) {
            this.$Message.success('提交成功!');
            this.getList()
          }
        } else {
          this.$Message.error('表单验证失败!');
        }
      })

    }
  },
  created() {
    this.getList()
    this.$bus.on('getProductLines', () => {
      this.getList()
    })
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
      .btn {
        color: #ff0000;
        padding: 3px 2px;
      }
    }
    .ivu-collapse-content {
      background: none;
    }
    .ivu-collapse-content-box {
      padding-top: 0;
    }
    li {
      padding: 5px 0px 5px 12px;
    }
  }
}
</style>

