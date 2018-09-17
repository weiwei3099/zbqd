<template>
    <Modal v-model="visible" width="600" @on-ok="save">
        <p slot="header" style="color:#2d8cf0; text-align:center">
            <Icon type="compose"></Icon>
            <span>新建系列</span>
        </p>
        <div style="padding-right: 20px;">
            <Form ref="form" :model="form" :rules="rules" :label-width="80">
                <Form-item label="系列名称" prop="title">
                    <Input v-model="form.title" placeholder="系列名称" ref="input"></Input>
                </Form-item>
            </Form>
        </div>
    </Modal>
</template>
<script>
import modal from './modal.mixin'
export default {
    mixins: [modal],
    props: {
        parent: null
    },

    data(){
        return {
            form: {
                title: ''
            },
            rules: {
                title: [
                    { required: true, message: '名称不能为空', trigger: 'blur' }
                ]
            }
        };
    },

    mounted(){
        this.$nextTick(()=>{
            this.$refs.input.focus();
        });
    },

    methods: {
        save() {
            this.$refs.form.validate( async(valid) => {
                if (valid) {
                    let { data } = await this.http('/videoApi/addCategory', {
                        data: {
                            title: this.form.title,
                            parent_id: this.parent ? this.parent.id : null
                        },
                        method: 'POST'
                    })
                    if(!data.code) {
                        this.$bus.emit('video.seri.added');
                        this.close();
                    }
                    this.$Message.success(data.msg.zh);
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })

        }
    }
}
</script>
<style>

</style>
