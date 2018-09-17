<template>
    <i-page>
        <div class="page-content" slot="page-content">
            <router-view></router-view>
        </div>
        <div class="page-aside" slot="page-aside">
            <div class="aside">
                <product-line ref="productLine"></product-line>
            </div>
            <div class="aside-btn img-info-box">
                <Button @click="addLine" type="text" size="large">新建系列</Button>
            </div>
            <Modal v-model="showAddLine" width="600" @on-ok="submitAddLine">
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
                                <Radio label="2">否</Radio>
                                <Radio label="1">是</Radio>
                            </RadioGroup>
                        </FormItem> -->
                    </Form>
                </div>
            </Modal>
        </div>
    </i-page>
</template>

<script>
import ProductLine from '@/components/product/lines'
export default {
    data: function() {
        return {
            showAddLine: false,
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
            }
        }
    },
    components: {
        ProductLine
    },
    methods: {
        addLine() {
            this.showAddLine = true
        },
        submitAddLine() {
            this.$refs['formValidate'].validate( async(valid) => {
                if (valid) {
                    let { data } = await this.http('/productApi/productCatNew', {
                        data: {
                            title: this.formValidate.title,
                            type: this.formValidate.type,
                            isSell: this.formValidate.isSell
                        },
                        method: 'POST'
                    })
                    if(!data.code) {
                        this.$Message.success('提交成功!');
                        this.$refs.productLine.getList()
                    }
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })

        }
    }
}
</script>

<style scoped>

</style>
