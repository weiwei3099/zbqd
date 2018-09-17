<template>
    <Input size="small" @on-enter="submit" v-model="value" placeholder="请输入..."></Input>
</template>

<script>
export default {
    props: {
        id: ''
    },
    data() {
        return {
            value: ''
        }
    },
    methods: {
        async submit() {
            let type = 1
            if(this.id != 1) {
                type = 2
            }
            let { data } = await this.http('/productApi/productCatNew', {
                data: {
                    parent_id: this.id,
                    title: this.value,
                    type: type,
                    isSell: 1
                },
                method: 'POST'
            })
            if( !data.code ) {
                this.$emit('add-ok')
                this.value=''
            }
            this.$Message.info(data.msg.zh);
        }
    }
}
</script>

<style scoped>

</style>
