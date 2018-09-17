<style>
.form {
  width: 300px
}
</style>

<template>
  <div class="flex center" style="height: 100%;">
    <Button @click="get">
      搜
    </Button>
    <Button @click="reg">
      搜
    </Button>
    <Button @click="getcode">
      搜
    </Button>
    <Button @click="getList">
      搜
    </Button>
    <Form ref="formInline" :model="formInline" :rules="ruleInline" class="form">
      <Form-item prop="user">
        <Input type="text" v-model="formInline.user" placeholder="用户名">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </Form-item>
      <Form-item prop="password">
        <Input type="password" v-model="formInline.password" placeholder="密码">
        <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </Form-item>
      <Form-item>
        <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
import mixins from '../../mixins'
import axios from 'axios'
import { xxtea, base64 } from '../../util'
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
import qs from 'qs'
export default {
  mixins: [mixins],
  data() {
    return {
      formInline: {
        user: '',
        password: ''
      },
      ruleInline: {
        user: [
          { required: false, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: false, message: '请填写密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      },
      code: '',
      msg_id: ''
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.get()
        } else {
          this.$Message.error('表单验证失败!');
        }
      })
    },
    async get() {
      let { data } = await this.http('/userApi/ourLogin', {
        data: {
          mobile: 15975575887,
          password: base64.encode('123123'),
          mobile: 15975575887,
          password: base64.encode('123123'),
          // mobile: 13802465199,
          // password: base64.encode('13802465199aa'),
          // mobile: 15975575887,
          // password: base64.encode('123123'),
          // mobile: 13726648009,
          // password: base64.encode('13726648009aa'),
          // type: "1",
          // is_web: "1"
        },
        method: 'POST'
      })
      if (!data.code) {
        this.$store.dispatch('SIGNIN', data.result.userInfo)
        this.$router.push({ name: 'home' })
      }
      this.$Message.info(data.msg.zh);
    },
    async getList() {
      let data = await axios.post('/picApi/factoryAlbumList', qs.stringify({
        userToken: this.$store.state.user.userInfo.userToken
      }))
      console.log(data)
    },
    async reg() {
      let data = await axios.post('/userApi/ourRegister', qs.stringify({
        mobile: 15975575887,
        type: "1",
        msg_id: '309123769386',
        code: '747364',
        password: base64.encode('123123'),
        company_name: 'YYF',
        is_web: "1"
      }))
    },
    async getcode() {
      let { data } = await axios.post('/smsApi/getCode', qs.stringify({
        mobile: 15975575887
      }))
      this.$Message.info(data.msg.zh);
      this.msg_id = data.result.msg_id
    }
  },
  created() {
    //console.log(this.$route.meta.forward.path)
  }
}
</script>
