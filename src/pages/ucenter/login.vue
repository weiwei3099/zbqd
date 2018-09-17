<style lang="less" scoped>
.bg{
    height: 100%;padding-top: 100px; background:#F7F7F7 url('/static/images/indexBG.png');
}
.logo{
    margin: 0 auto; width: 85px; height: 85px; margin-bottom: 30px;
}
.form {
    width: 300px; margin: 0 auto;

}
.ivu-input-group-prepend{
    border-radius: 0; display: none;
}
</style>

<template>
    <div class="bg" @keydown.enter="handleSubmit('formInline')">

        <div class="logo">
            <img src="/static/images/headLogo.png" alt="">
        </div>

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
                    { type: 'string', min: 3, message: '密码长度不能小于3位', trigger: 'blur' }
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
                    // mobile: 13711111111,
                    // password: base64.encode('11111111aa'),
                    mobile: this.formInline.user,
                    password: base64.encode(this.formInline.password),
                    // mobile: 13802465199,
                    // password: base64.encode('123'),
                    // mobile: 15975575887,
                    // password: base64.encode('123'),
                    // mobile: 13726648009,
                    // password: base64.encode('13726648009aa'),
                    type: "1",
                    is_web: "1"
                },
                method: 'POST'
            })
            if (!data.code) {
                this.$store.dispatch('SIGNIN', data.result.userInfo)
                this.$router.push({ path: '/home' })
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
                msg_id: '297847989361',
                code: '209903',
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
