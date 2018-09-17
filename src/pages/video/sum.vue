<template>
    <div class="flex sum-list">
        <div class="sum-wrapper" v-for="(lv1, index) in lv1s">
            <div class="sum" :style="{height: height + 'px'}" @click="$emit('lv1clk', index)">
                <img :src="lv1.pic" v-if="lv1.pic !== 'https://fitment.chenyoujiu.com/'"/>
                <span class="sum-title">{{lv1.title}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        lv1s: {
            type: Array,
            default(){
                return []
            }
        }
    },

    data(){
        return {
            height: 0
        };
    },

    mounted(){
        this.refreshHeight();
    },

    methods: {
        refreshHeight(){
            const width = $(this.$el).width()/2 - 20;
            this.height = width / 3 * 2;
        }
    }
}
</script>
<style scoped>
.sum-list{
    flex-wrap:wrap;
}

.sum-wrapper{
    width:50%;
    padding:10px;
}

.sum{
    background-color:#b7b7b7;
    position:relative;
    cursor:pointer;
}

.sum, .sum img{
    width:100%;
    height:100%;
    border-radius:6px;
}

.sum-title{
    position:absolute;
    left:0px;
    top:0px;
    display:inline-block;
    font-size:14px;
    color:#fff;
    margin:10px;
}
</style>
