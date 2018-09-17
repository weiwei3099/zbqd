<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
    <Form-item label="画册标题" prop="title">
      <Input v-model="formValidate.title" placeholder="画册标题"></Input>
    </Form-item>

    <Form-item>
      <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
      <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
    </Form-item>
  </Form>
</template>
<script>
import { hex_md5 } from '../../util/md5'
const timestamp = Date.now()
export default {
  props: {
    modal: true
  },
  data() {
    return {
      uploader: {
        timestamp: timestamp,
        token: hex_md5('fitment_' + timestamp),
        type: 'images'
      },
      fileList: [],
      formValidate: {
        title: '',
        mail: '',
        // city: '',
        // gender: '',
        // interest: [],
        // date: '',
        // time: '',
      },
      ruleValidate: {
        title: [
          { required: true, message: '画册标题不能为空', trigger: 'blur' }
        ],
        // mail: [
        //   { required: true, message: '邮箱不能为空', trigger: 'blur' },
        //   { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        // ],
        // city: [
        //   { required: true, message: '请选择城市', trigger: 'change' }
        // ],
        // gender: [
        //   { required: true, message: '请选择性别', trigger: 'change' }
        // ],
        // interest: [
        //   { required: true, type: 'array', min: 1, message: '至少选择一个爱好', trigger: 'change' },
        //   { type: 'array', max: 2, message: '最多选择两个爱好', trigger: 'change' }
        // ]
      }
    }
  },
  methods: {
    async submit() {
      let { data } = await this.http('/picApi/factoryAlbumModify', {
        data: {
          title: this.formValidate.title,
          share_content: '新款画册发布',
          share_icon: '/static/albums/album-icon.png',
          background: '/static/albums/album-bg.png',
          modify_pic: 0,
          pic: JSON.stringify(this.fileList)
        },
        method: 'POST'
      })
      if (!data.code) {
        this.$emit('close', 'Add')
        this.$Message.success('提交成功!');
      } else {
        this.$Message.error(data.result.zh);
      }
    },
    uploadComplete(res, file) {
      this.fileList.push(res.result.file)
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.submit()
        } else {
          this.$Message.error('表单验证失败!');
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
}
</script>
