<template>
    <li class="cursor" @click="select">
        <div class="box-mask flex center" v-if="selected">
            <div>
                <img class="share-wechat" :data-id="item.id" src="/static/icon/Symbol 37 – 1@3x.png" width="50" alt="">
            </div>
        </div>
        <div class="img-box" :style="'background-image:url(' + server + item.url +')'"></div>
        <div class="flex space-between p-t-10">
            <span>{{item.pic_title}}</span>
            <span class="cursor" @click="delPic(item.id)"><Icon type="ios-trash" size="14"></Icon></span>
        </div>
    </li>
</template>

<script>

export default {
    props: {
        item: ''
    },
    data: function() {
        return {
            status: '',
            selected: false,
        }
    },
    methods: {
        delPic(id){
            this.$emit('del', id)
        },
        select() {
            if(this.status === 'select') {
                this.selected = !this.selected
                if(this.selected) {
                    this.$store.commit('IMAGE_ADD', this.item)
                } else {
                    this.$store.commit('IMAGE_REMOVE', this.item)
                }
            }
        }
    },
    created() {
        this.status = this.$route.params.status
        this.$bus.on('clearImageSelect', aa => {
            this.selected = false
        })
    }
}
</script>

<style scoped>

</style>
