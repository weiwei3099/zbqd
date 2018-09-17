<template>
<div>
    <div class="flex center" v-if="items.length == 0" style="height: 500px;">
        <Alert show-icon>该分类下暂无图片</Alert>
    </div>
    <ul class="product-list flex">
        <li class="cursor" @click="select(item.id)" @del="delPic" v-for="(item, index) in items" :key="index">
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
    </ul>
</div>
</template>

<script>

export default {
    data: function() {
        return {
            status: '',
            selected: false,
            items: []
        }
    },
    methods: {
        async select360(id) {
            this.show = 3
            let { data } = await this.http('/picApi/factoryAlbumInfo', {
                data: {
                    id: id
                },
                method: 'POST'
            })
            this.items = data.result
        },
        delPic(id){
            this.$emit('del', id)
        },
        select(id) {
            if(this.status === 'select') {
                this.selected = !this.selected
                if(this.selected) {
                    this.$store.commit('IMAGE_ADD', id)
                } else {
                    this.$store.commit('IMAGE_REMOVE', id)
                }
            }
        }
    },
    created() {
        this.status = this.$route.params.status
        this.$bus.on('clearImageSelect', aa => {
            this.selected = false
        })
        this.$bus.on('get360Image', ({type, cid}) => {
            this.select360(cid)
        })
    }
}
</script>

<style scoped>

</style>
