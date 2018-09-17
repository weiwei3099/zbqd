<template>
    <Form ref="formInline" :label-width="80" :model="formItem">
        <FormItem label="简介">
            <Input type="textarea" :rows="6" v-model="formItem.introduction" placeholder="简介"></Input>
        </FormItem>
        <FormItem label="背景">
             <img width="300" height="150" v-if="formItem.background" :src="server + formItem.background" class="avatar"/>
             <Upload :data="uploader" name="Filedata" :action="api + '/uploadFile'" :on-success="uploadComplete">
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
      props: {
        info: {}
      },
        data () {
            return {
                uploader: {
                    timestamp: timestamp,
                    token: hex_md5('fitment_' + timestamp),
                    type: 'images'
                },
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
                // formItem: {
                //     introduction: '',
                //     background: ''
                // }
            }
        },
        computed: {
          formItem() {
            return {
              introduction: this.info.introduction,
              background: this.info.background
            }
          }
        },
        methods: {
          uploadComplete(res, file) {
              this.formItem.background = res.result.file
          },
            async handleSubmit() {
              let form = {
                  introduction: this.formItem.introduction,
                  background: this.formItem.background,
              }

              let { data } = await this.http('/userApi/factoryInfoUpdate', {
                  data: form,
                  method: 'POST'
              })

              if (!data.code) {
                this.$emit('edited-factory-info')
              }

            }
        }
    }
</script>
