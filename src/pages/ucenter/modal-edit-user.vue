<template>
    <Form ref="formInline" :label-width="80" :model="formItem">
        <FormItem label="公司名称">
            <Input v-model="formItem.company_name" placeholder="公司名称"></Input>
        </FormItem>
        <!-- <FormItem label="签名">
            <Input v-model="formItem.signature" placeholder="签名"></Input>
        </FormItem> -->
        <FormItem label="头像">
             <img width="86" v-if="formItem.icon" :src="server + formItem.icon" class="avatar"/>
             <Upload :data="uploader" name="icon" :action="api + '/userApi/updateIcon'" :on-success="uploadComplete">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
             </Upload>
        </FormItem>
        <!-- <FormItem>
            <Button type="primary" @click="handleSubmit('formInline')">Signin</Button>
        </FormItem> -->
    </Form>
</template>
<script>
import { hex_md5 } from '../../util/md5'
const timestamp = Date.now()
    export default {
        data () {
            return {
                uploader: {
                  userToken: this.$store.state.user.userInfo.userToken,
                  timestamp: timestamp,
                  token: hex_md5('fitment_' + timestamp),
                    // type: 'images'
                },
                file: this.$store.state.user.userInfo.icon,
                formInline: {
                    user: '',
                    password: ''
                },
                // ruleInline: {
                //     user: [
                //         { required: true, message: 'Please fill in the user name', trigger: 'blur' }
                //     ],
                //     password: [
                //         { required: true, message: 'Please fill in the password.', trigger: 'blur' },
                //         { type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur' }
                //     ]
                // },
                formItem: {
                    // company_name: this.info.company_name,
                    // // signature: this.$store.state.user.userInfo.signature,
                    // icon: this.info.icon
                }
            }
        },
        methods: {
          uploadComplete(res, file) {
            this.formItem.icon = res.result.user.icon
              this.file = res.result.user.file
          },
            async handleSubmit() {
              let form = {
                  company_name: this.formItem.company_name,
                  icon: this.file,
                  // address: address,
                  // signature: this.formItem.signature,
                  // mobile: this.formData.mobile
                }

                let { data } = await this.http('/userApi/factoryInfoUpdate', {
                    data: form,
                    method: 'POST'
                })
                if (!data.cdoe) {
                    // data.result.user.address = data.result.user.address
                    // this.$store.dispatch('SIGNIN', data.result.user)
                    this.editInfo = false
                    this.$emit('success', this.formItem.icon)
                }
            },
            async get() {
              let { data } = await this.http('/userApi/getFactoryInfo', {
                method: 'POST'
              })
              this.formItem = data.result.info
            }
        },
        created() {
          this.get()
        }
    }
</script>
