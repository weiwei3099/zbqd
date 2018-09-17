// 弹窗类组件的基础属性和方法
export default {
    props: {
        // 本弹窗的v-model
        value: Boolean,
    },

    data(){
        return {
            visible: this.value
        }
    },

    methods: {
        close(){
            this.$emit('input', false);
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
};
