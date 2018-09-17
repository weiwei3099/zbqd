<template>
    <Modal v-model="visible" title="上传进度" :closable="false">
        <div class="xpros" v-for="file in files">
            <div class="xpro-item">
                <Progress :percent="file.pro" status="active" :stroke-width="5" :hide-info="true"></Progress>
                <div class="flex flex-between">
                    <span>{{file.name}}</span>
                    <span>{{parseInt(file.pro * 100)/100.0}}%</span>
                </div>
            </div>
        </div>
        <div slot="footer"></div>
    </Modal>

</template>
<script>
export default {
    props: {
        // 本弹窗的v-model
        value: Boolean,
        files: {
            type: Array,
            default(){
                return []
            }
        }
    },

    data(){
        return {
            visible: this.value
        }
    },

    methods: {
        close(){
            this.$emit('input', false);
        },

        update(file, pro){
            const name = file.name;
            for(let file of this.files){
                if(file.name === name){
                    file.pro = pro;
                    break;
                }
            }
        },

        finish(file){
            const name = file.name;
            let finishCount = 0;
            for(let file of this.files){
                if(file.name === name){
                    file.pro = 100;
                }

                if(file.pro === 100){
                    finishCount++;
                }
            }
            if(finishCount === this.files.length){
                this.$emit('ok');
                this.close();
                return true;
            }

            return false;
        }
    },

    watch: {
        value(val){
            this.visible = this.value;
        },

        visible(){
            if(!this.visible){
                this.$emit('input', false);
            }
        }
    }
}
</script>
<style scoped>
.xpros{
    max-height:250px;
    overflow-y:auto;
}

.xpro-item{
    border-bottom:1px dashed #ccc;
    margin-bottom:10px;
    padding-bottom:10px;
}

.xpro-item:last-child{
    border:none;
}
</style>
