<template>
    <div>
        <div class="flex center" v-if="items.pics.length == 0" style="height: 500px;">
            <Alert show-icon>该分类下暂无图片</Alert>
        </div>
        <div v-if="items.pics.length > 0">
            <ul class="product-list flex" style="padding-bottom: 50px;">

                <item :item="item" @click="select(item.id)" @del="delPic" v-for="(item, index) in items.pics" :key="index"></item>
                <!-- <li class="cursor" @click="select(item.id)" @del="delPic" v-for="(item, index) in items.pics" :key="index">
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
                </li> -->

            </ul>
            <div style="position: fixed; bottom: 20px; right: 300px;">
                <Page :total="items.paginate.total_record" @on-page-size-change="pageSizeChange" show-total placement="top" :page-size="items.paginate.page_size" :page-size-opts="[10, 20, 30, 40]" @on-change="getPage" :current="items.paginate.cur_page" size="small" show-elevator show-sizer></Page>
            </div>
        </div>
    </div>
</template>

<script>
import Item from './product-item'

export default {
    data: function() {
        return {
            status: '',
            selected: false,
            type: 2,
            cid: 1,
            items: {
                pics: [],
                paginate: {
                    cur_page: 1,
                    page_size: 10
                }
            },
        }
    },
    components: {
        Item
    },
    methods: {
        pageSizeChange(size) {
            this.items.paginate.cur_page = 1
            this.items.paginate.page_size = size
            this.getProductList()
        },
        getPage(p) {
            this.items.paginate.cur_page=p
            this.getProductList()
        },
        async getProductList() {
            let { data } = await this.http('/picApi/getPic', {
                data: {
                    type: this.type,
                    pc_id: this.cid,
                    cur_page: this.items.paginate.cur_page,
                    page_size: this.items.paginate.page_size
                },
                method: 'POST'
            })
            if (data.code && this.items.paginate.cur_page > 1) {
                this.items.paginate.cur_page--
                this.getProductList()
            } else {
                data.result.paginate.cur_page = parseInt(data.result.paginate.cur_page)
                this.items = data.result
            }

        },
        async delPic(id) {
            let { data } = await this.http('/picApi/delPic', {
                data: {
                    id: id
                },
                method: 'POST'
            })
            if (!data.code) {
                this.getProductList()
                this.$Message.success(data.msg.zh);
            } else {
                this.$Message.error(data.msg.zh);
            }
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
        this.$bus.on('getProductImage', ({type, cid}) => {
            this.type = type
            this.cid = cid
            this.items.paginate.cur_page = 1
            this.getProductList()
        })
    }
}
</script>

<style scoped>

</style>
