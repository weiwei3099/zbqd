<template>
    <i-page>
        <div slot="header-handler">
            <a @click="addProduct" v-if="$route.query.from=='product'">保存</a>
            <a @click="addDesign" v-if="$route.query.from=='design'">选择返回</a>
        </div>
        <div class="page-content" slot="page-content">

            <product2 v-if="show==2"></product2>
            <product1 v-if="show==1"></product1>
            <item-360 v-if="show==3"></item-360>
            <gallery v-if="show==4"></gallery>

        </div>

        <div class="page-aside" slot="page-aside">
            <div class="aside">
                <lines @select="selectLine"></lines>
            </div>
            <div v-if="show==1 || show==2">
                <Upload :on-success="uploadProduct" :show-upload-list="false" :data="form" name="fileData" :action="api+ '/picApi/addPic'" multiple type="drag">
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或将文件拖拽到这里上传</p>
                    </div>
                </Upload>
            </div>

            <div v-if="show==3">
                <Upload :on-success="upload360" :show-upload-list="false" :data="form" name="fileData" :action="api+ '/picApi/addPic'" multiple type="drag">
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>3点击或将文件拖拽到这里上传</p>
                    </div>
                </Upload>
            </div>

            <div v-if="show==4">
                <Upload :on-success="uploadGallery" :show-upload-list="false" :data="form" name="fileData" :action="api+ '/picApi/addPic'" multiple type="drag">
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或将文件拖拽到这里上传</p>
                    </div>
                </Upload>
            </div>
        </div>

    </i-page>
</template>

<script>
import mixins from '@/mixins'
import product from '@/components/images/items/product'
import Item360 from '@/components/images/items/show360'
import gallery from '@/components/images/items/gallery'

import { hex_md5 } from '../../util/md5'

const timestamp = Date.now()

export default {
    mixins: [mixins],
    data() {
        return {
            status: '',
            uploader: {
                timestamp: timestamp,
                token: hex_md5('fitment_' + timestamp),
                type: 'images'
            },
            fileList: [],
            show: 0,
            selectLineName: '',
            form: {
                type: 1,
                pc_id: 0,
                userToken: this.$store.state.user.userInfo.userToken
            }
        }
    },
    components: {
        product1: product,
        product2: product,
        Item360: Item360,
        gallery: gallery,
    },
    methods: {
        uploadProduct() {
            this.$bus.emit('getProductImage', {
                type: this.form.type,
                cid: this.form.pc_id
            });
        },
        upload360() {
            this.$bus.emit('get360Image', {
                type: this.form.type,
                cid: this.form.pc_id
            });
        },
        uploadGallery() {
            this.$bus.emit('getGalleryImage', {
                type: this.form.type,
                cid: this.form.pc_id
            });
        },
        selectLine(...args) {
            this.form =  {
                type: args[0],
                pc_id: args[1]
            }

            this.show = args[0]
        },
        addDesign() {
            this.$bus.emit('designSelectImage', {
                lineId: this.form.pc_id,
                pics:  this.$store.state.images.selection,
                line: this.selectLineName
            })
            this.$router.push({name: '编辑装配', params: {productId: this.$route.query.productId}})
        },
        async addProduct() {
            let pic = []
            for(let p of this.$store.state.images.selection) {
                pic.push(p.id)
            }
            var attr = [
                {pic: pic, title: '默认产品'}
            ]
            let { data } = await this.http('/productApi/productNew', {
                data: {
                    category_id: this.$store.state.product.line_id,
                    title: '新建产品',
                    price: '0',
                    attr: JSON.stringify(attr)
                },
                method: 'POST'
            })
            this.$router.push({'name': '产品系列详细', params: {lineId: this.$store.state.product.line_id}})
        },
        changeStatus() {
            this.status = this.$route.params.status
        }
    },
    created() {
        this.status = this.$route.params.status
        this.$bus.on('selectLine', (res) =>{
            this.show = res.type
            this.$nextTick(()=>{
                console.log(res)
                this.form.type = res.type
                this.form.pc_id = res.cid
                this.selectLineName = res.name
                switch(res.type) {
                    case 2:
                        this.$bus.emit('getProductImage', res);
                        break;
                    case 1:
                        this.$bus.emit('getProductImage', res);
                        break;
                    case 3:
                        this.$bus.emit('get360Image', res);
                        break;
                    case 4:
                        this.$bus.emit('getGalleryImage', res);
                        break;
                }

            })
        })
    }
}
</script>


<style lang="less">
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
        }
    }
}
</style>
