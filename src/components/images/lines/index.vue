<template>
    <div class="line-collapse collapse">
        <Collapse accordion @on-change="changeImagePanel">
            <Panel name="2">
                <span class="line-title-bar">
                    <span style="width:160px; display:inline-block">
                        产品图片
                    </span>
                    <span class="btn" @click.stop="showAddInput(line1.id)"><Icon type="plus" size="12"></Icon></span>
                    <span class="btn" @click.stop="delProductCat(line1.id)"><Icon type="ios-trash" size="12"></Icon></span>
                </span>
                <line-panel slot="content" :line="series1"></line-panel>
                <!-- <ul slot="content">
                    <li class="sery-item cursor" v-for="(sery, x) in series1" :key="x" @click="select(2, sery.id, sery.title)" v-hover-sery>{{sery.title}}</li>
                </ul> -->
            </Panel>
            <Panel name="1">
                背景图片
                <ul slot="content">
                    <li class="sery-item cursor" v-for="(sery, x) in series0" :key="x" @click="select(1, sery.id, sery.title)" v-hover-sery>{{sery.title}}</li>
                </ul>
            </Panel>
            <Panel name="3">
                360图片
                <ul slot="content">
                    <li class="sery-item cursor" v-for="(sery, x) in series3" :key="x" @click="select360(3, sery.id, sery.title)" v-hover-sery>{{sery.title}}</li>
                </ul>
            </Panel>
            <Panel name="4">
                默认图库
                <ul slot="content">
                    <li class="sery-item cursor" v-for="(sery, x) in series4" :key="x" @click="selectGallery(4, sery.id, sery.title)" v-hover-sery>{{sery.title}}</li>
                </ul>
            </Panel>
        </Collapse>
    </div>
</template>

<script>
import LinePanel from './line-panel'
export default {
    data() {
        return {
            type: 0,
            series0: '',
            series1: [],
            series3: '',
            series4: ''
        }
    },
    components: {
        LinePanel
    },
    methods: {
        changeImagePanel(k) {
            this.type = k[0]
        },
        select(type, id, name) {
            this.$store.commit('IMAGE_CLEAR')
            this.$bus.emit('clearImageSelect')
            this.$bus.emit('selectLine',{
                type: type,
                cid: id,
                name: name
            })
        },
        select360(type, id, name) {
            this.$store.commit('IMAGE_CLEAR')
            this.$bus.emit('clearImageSelect')
            this.$bus.emit('selectLine',{
                type: type,
                cid: id,
                name: name
            })
        },
        selectGallery(type, id, name) {
            this.$store.commit('IMAGE_CLEAR')
            this.$bus.emit('clearImageSelect')
            this.$bus.emit('selectLine',{
                type: type,
                cid: id,
                name: name
            })
        },
        async getList() {
            let { data } = await this.http('/productApi/getProductCatList', {
                method: 'GET'
            })
            this.series0 = data.result.productCats.filter((item) => {
                return item.is_sell == '0'
            })
            this.series1 = data.result.productCats.filter((item) => {
                return item.is_sell == '1'
            })
            let { data: data3 } = await this.http('/productApi/getFullSceneCat', {
                method: 'GET'
            })
            this.series3 = data3.result.data

            let { data: data4 } = await this.http('/picApi/factoryAlbumList', {
                method: 'GET'
            })
            this.series4 = data4.result.albums
            //console.log(line1)
            // console.log(this.items.find(function (x) {
            //   return x.id === '1'
            // }))
        }
    },
    created() {
        // this.getList()

        // this.$bus.on('ImageSelectChildLine', args => {
        //     this.select(this.type, args.id, args.title)
        // })
    }
}
</script>


<style lang="less" scoped>
.line-collapse {
    .ivu-collapse {
        background: none;
        border: none;
        .ivu-icon-arrow-right-b {
            font-size: 12px;
            font-weight: normal;
        }
        .ivu-icon-arrow-right-b:before {
            content: "\F218"
        }
        .ivu-collapse-header {
            padding-left: 16px;
            font-size: 14px;
            font-weight: bold;
        }
        .ivu-collapse-content {
            background: none;
        }
        .ivu-collapse-content-box {
            padding-top: 0;
        }
        li {
            padding: 5px 12px;
            &.on{
                color:#2d8cf0
            }
        }
    }
}
</style>
