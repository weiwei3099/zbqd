<style lang="less" scoped>
.albums {
    width: 398px;
    height: 330px;
}

.bg-grey {
    background: #f0f0f0;
}

.gallery-image {
    width: 378px;
    height: 259px;
    overflow: hidden;
    margin-bottom: 6px;
    text-align: center;
    background: #f0f0f0;
    img {
      max-width: 100%;
      max-height: 100%;
    }
}

.m-r-20 {
    margin-right: 20px
}
.box-list {
  width: 100%; box-sizing: border-box;
  li {
    width: 33.3%; float: left; background: none; box-sizing: border-box; margin: 30px 0;
  }
  .albums { margin: 0 auto; background: #fff;}
}
</style>


<template>
    <i-page :aside="false">
        <div class="page-content" slot="page-content">
            <ul class="box-list flex">
                <li v-for="(pic, index) in item.pic" :key="index">

                    <div class="albums box-shadow" v-if="pic">
                        <div class="gallery-image cursor" @click="show(item.id, (index + 1))">
                            <img :src="server + pic.thumbnail" alt="">
                        </div>
                        <div class="p-10 flex space-between">
                            <div class="cursor" @click="show(item.id, (index + 1))">
                                <span v-if="index==0">封面</span>
                                <span v-if="index>0">内页{{index}}</span>
                            </div>
                            <div>
                                <span class="cursor" v-if="item.pic.length>1" @click="delPic(index)">
                                    <Icon type="ios-trash" size="20"></Icon>
                                </span>
                            </div>
                        </div>
                    </div>

                </li>

                <li class="bg-grey flex">
                   <div class="albums cursor box-shadow">
                    <Upload :data="uploader" :show-upload-list="false" multiple type="drag" name="Filedata" :action="api + '/uploadFile'" :before-upload="beforeUpload" :on-success="uploadComplete">
                        <div class="albums flex center" style="height: 308px">
                          <div>
                            <Icon type="plus" size="32"></Icon>
                            <p>拖拽图片到这里或点击选择图片上传可新加页面</p>
                          </div>
                        </div>
                    </Upload>
                      </div>
                </li>

            </ul>
        </div>
    </i-page>
</template>
<script>
import mixins from '@/mixins'
import { hex_md5 } from '../../util/md5'
const timestamp = Date.now()

export default {
    mixins: [mixins],
    data() {
        return {
            uploadCount: 0,
            item: {},
            picList:[],
            uploader: {
                timestamp: timestamp,
                token: hex_md5('fitment_' + timestamp),
                type: 'images'
            },
            uploadIngList: [],
            width: 0,
            height: 0
        }
    },
    methods: {
        show(gallery_id, page) {
            window.localStorage.setItem('galleryPage', page)
            this.$router.push({ name: '画册翻页', params: {id: gallery_id}, query: { width: this.width, height: this.height}})
        },
        async modifyPic() {
            let pic
            let modify = 1;
            for (let file of this.uploadIngList) {
              this.picList.push(file.file)
            }
            if (this.picList.length == 0) {
                modify = 0
            }
            let { data } = await this.http('/picApi/factoryAlbumModify', {
                data: {
                    title: this.item.title,
                    modify_pic: modify,
                    album_id: this.$route.params.id,
                    pic: JSON.stringify(this.picList)
                    //pic: '[/uploads/images/2017/08/26/150375142958250.jpg]'
                },
                method: 'POST'
            })
            this.getList()
        },
        delPic(i) {
            this.picList.splice(i, 1)
            // this.uploadCount--
            this.modifyPic()
        },
        beforeUpload(res) {
            this.$Loading.start()
            // console.log(res)
            const fileName = res.name.split('.')[0]
            this.uploadIngList.push({
              name: fileName,
              file: ''
            })
        },
        uploadComplete(res, file, fileList) {
          // console.log(file)
            this.uploadCount++
            // this.picList.push(res.result.file)
            let fileFlag = this.uploadIngList.find((item) => {
              return item.name === file.name.split('.')[0]
            })
            fileFlag.file = res.result.file
            // console.log(this.uploadCount , fileList.length)
            if(this.uploadCount == fileList.length) {
                this.$Loading.finish()
                this.modifyPic()
            }
        },
        async getList() {
            this.picList = []
            this.uploadIngList=[]
            let { data } = await this.http('/picApi/factoryAlbumInfo', {
                data: {
                    id: this.$route.params.id
                },
                method: 'POST'
            })
            this.item = data.result.album
            for(let {url} of this.item.pic) {
                this.picList.push(url)
            }
            this.width = this.item.pic[0].thumbnail_width
            this.height = this.item.pic[0].thumbnail_height
            // const img = new Image()
            // img.src = this.server + this.item.pic[0].url
            // img.onload = () => {
            //   this.width = img.width
            //   this.height = img.height
            // }
            //this.uploadCount = 0
        }
    },
    watch:{
      '$route': 'getList'
    },
    created() {
        this.getList()
    }
}
</script>
