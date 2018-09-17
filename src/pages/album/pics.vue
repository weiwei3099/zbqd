<template>
<i-page :aside="false">
    <div slot="header-handler">
        <a class="albumpics-tbtn" href="javascript:void(0)" @click="$router.go(-1)">返回</a>
        <Upload ref="uploader" class="albumpics-tbtn" :data="uploader" :show-upload-list="false" type="drag" name="Filedata" :action="api + '/uploadFile'" :before-upload="beforeUpload" :on-success="uploadComplete" :on-error="uploadError" accept="image/*" multiple>
            添加页面
        </Upload>

        <a class="albumpics-tbtn" href="javascript:void(0)" @click="delAll">全部删除</a>
    </div>

    <div class="albumpics-content" slot="page-content">
        <div class="albumpics flex" ref="albumpics">
            <template v-for="(item, index) in album.pic">
                <div class="albumpic xbox-shadow" :class="{'albumpic-dd-ing': item.dd.ing}" :style="{top: item.dd.y + 'px', left: item.dd.x + 'px'}">
                    <div class="albumpic-content" :ref="'ref'+item.id" @mousedown="movestart($event, item, index)" @click="toDetail(item, index)">
                        <img :src="server + item.thumbnail"/>
                    </div>

                    <div class="flex space-between zalbumpic-bbar">
                        <div class="zalbumpic-bbar-txt">{{index === 0 ? '封面' : '内页' + index}}</div>

                        <div class="zalbumpic-bbar-sm" @click="changeCurr(item)">
                            <Upload class="albumpics-tbtn albumpics-tbtn-img zalbumpic-bbar-img icon-img" :data="uploader" :show-upload-list="false" type="drag" name="Filedata" :action="api + '/uploadFile'" :before-upload="beforeUpload" :on-success="editUploadComplete" :on-error="uploadError" accept="image/*">
                                &nbsp;
                            </Upload>
                            <div class="zalbumpic-bbar-img icon-del" @click="del(item, index)"></div>
                        </div>
                    </div>
                </div>

                <div class="albumpic albumpic-dd-pd" :ref="'pd' + item.id" v-show="item.dd.ing" :style="{height: item.dd.pdHeight + 'px'}">

                </div>
            </template>

        </div>

        <Modal v-model="delConfirm.visible" width="360">
            <p slot="header">
                提示
            </p>
            <div>
                <p>{{delConfirm.title}}</p>
            </div>
            <div slot="footer">
                <Button type="default" size="large" @click="delConfirm.visible = false">取消</Button>
                <Button type="info" size="large" @click="doDel" ref="cfbtn">确定</Button>
            </div>
        </Modal>
    </div>
</i-page>
</template>
<script>
import Vue from 'vue'
import { hex_md5 } from '../../util/md5'
const timestamp = Date.now()

export default {

    data(){
        return {
            isClk: true,
            album: {
                pic: []
            },
            delConfirm: {
                title: null,
                visible: false,
                item: null
            },
            uploader: {
                timestamp: timestamp,
                token: hex_md5('fitment_' + timestamp),
                type: 'images'
            },


        };
    },

    mounted(){
        this.reload();
    },

    methods: {
        async reload(){
            let {data} = await this.http('/picApi/factoryAlbumInfo', {
                data: {id: this.$route.params.id},
                method: 'POST'
            });

            if(data.code){
                that.$Message.error(data.msg.zh);
                this.album = {pic: []};
            }else{
                for(let pic of data.result.album.pic){
                    pic.dd = {
                        ing: false,
                        x: 0,
                        y: 0
                    };
                }
                this.album = data.result.album;
            }
        },

        beforeUpload(res){
            this.$Loading.start();
        },

        uploadComplete(response, file, fileList){
            for(let f of fileList){
                if(f.status !== 'finished'){
                    return;
                }
            }

            const fs = [];

            for(let f of fileList){
                if(!f.response.code){
                    fs.push(f.response.result.file);
                }
            }

            this.$Loading.finish();

            if(fs.length > 0){
                this.addPic(fs);
            }

            this.$refs.uploader.clearFiles();
        },

        uploadError(){
            this.$Loading.finish();
        },

        addPic(fs){
            const pics = this.album.pic.map(item=>item.url);
            for(let f of fs){
                pics.push(f);
            }
            this.save('pic', JSON.stringify(pics));
        },

        async save(feild, val){
            const params = {
                title : this.album.title,
                share_content : this.album.share_content,
                share_icon : this.album.share_icon,
                close_share : this.album.close_share,
                background : this.album.background,
                music : this.album.music,
                close_ad : this.album.close_ad,
                album_id : this.album.id,
                modify_pic : feild === 'pic' ? 1 : 0
            };
            params[feild] = val;

            let { data } = await this.http('/picApi/factoryAlbumModify', {
                data: params,
                method: 'POST'
            });

            if (!data.code) {
                this.$Message.success('修改成功');
                this.reload();
            }else{
                this.$Message.error(data.msg.zh);
            }
        },

        // 全部删除
        delAll(){
            this.delConfirm.title = '确定要删除全部吗?';
            this.delConfirm.item = null;
            this.delConfirm.visible = true;
            this.$nextTick(()=>{
                this.$refs.cfbtn.$el.focus();
            });
        },

        del(item, index){
            this.delConfirm.title = '确定要删除吗?';
            this.delConfirm.item = item;
            this.delConfirm.visible = true;
            this.$nextTick(()=>{
                this.$refs.cfbtn.$el.focus();
            });
        },

        doDel(){
            if(this.delConfirm.item){
                const pics = this.album.pic
                    .filter(tmp=>tmp !== this.delConfirm.item)
                    .map(tmp=>tmp.url);
                this.save('pic', JSON.stringify(pics));
            }else{
                this.save('pic', JSON.stringify([]))
            }

            this.delConfirm.visible = false;
        },

        editUploadComplete(response, file, fileList){
            this.$Loading.finish();
            if(response.code){
                this.$Message.error(response.msg.zh);
                return ;
            }

            const pics = [];

            for(let pic of this.album.pic){
                if(pic === this.curr){
                    pics.push(response.result.file);
                }else{
                    pics.push(pic.url);
                }
            }
            this.save('pic', JSON.stringify(pics));
        },

        changeCurr(item){
            this.curr = item;
        },

        movestart(event, item, index){
            this.isClk = true;
            let finished = false;
            const event2point = function(evt){
                return {x: evt.clientX, y: evt.clientY};
            };

            const inRect = function(x, y, rect){
                return x > rect.x && x < rect.x1 && y > rect.y && y < rect.y1;
            };

            const swap = function(arr, x, y){
                var origin = arr[x];
                arr[x] = arr[y];
                Vue.set(arr, y, origin);
            }

            const calOffset = function($el, parentOffset){
                const offset = $el.offset();
                offset.left = offset.left - parentOffset.left;
                offset.top = offset.top - parentOffset.top;
                return offset;
            };

            let changed = false;
            item.dd.ing = true;
            const $container = $(this.$refs.albumpics);
            const $el = $(this.$refs['ref' + item.id]);
            const startPoint = event2point(event);
            const parentOffset = $container.offset();
            const startOffset = calOffset($el, parentOffset);
            const elWidth = $el.width();
            const elHeight = $el.height();
            const startCenterX = startOffset.left + elWidth/2;
            const startCenterY = startOffset.top + elHeight/2;

            item.dd.x = startOffset.left;
            item.dd.y = startOffset.top;
            item.dd.pdHeight = $el.height();

            const moving = (evt)=>{
                this.isClk = false;
                evt.preventDefault();
                const currPoint = event2point(evt);
                const moveX = currPoint.x - startPoint.x;
                const moveY = currPoint.y - startPoint.y;
                item.dd.x = startOffset.left + moveX;
                item.dd.y = startOffset.top + moveY;

                const x = startCenterX + moveX;
                const y = startCenterY + moveY;

                for(let i=0;i<this.album.pic.length;i++){
                    let tmp = this.album.pic[i];

                    if(index === i){
                        continue;
                    }

                    const $tmp = $(this.$refs['ref'+tmp.id]);
                    const tmpOffset = calOffset($tmp, parentOffset);
                    const tmpWidth = $tmp.width();
                    const tmpHeight = $tmp.height();
                    const rect = {x: tmpOffset.left, x1: tmpOffset.left + tmpWidth, y: tmpOffset.top, y1: tmpOffset.top + tmpHeight};

                    // 最后一个
                    if(i === this.album.pic.length - 1 && x > rect.x1 && y > rect.y){
                        this.album.pic.splice(index, 1);
                        this.album.pic.push(item);
                        index = i;
                    }else if(inRect(x, y, rect)){
                        let newIndex = i - 1;
                        if(x > rect.x + tmpWidth/2){
                            newIndex = i;
                        }

                        if(index !== newIndex){
                            this.album.pic.splice(index, 1);
                            if(newIndex < index){
                                newIndex--;
                            }
                            this.album.pic.splice(newIndex, 0, item);
                            index = newIndex;
                            changed = true;
                        }

                        break;
                    }
                }
            };

            const end = ()=>{
                if(finished){
                    return ;
                }
                finished = true;
                item.dd.ing = false;
                item.dd.x = 0;
                item.dd.y = 0;
                $(window).off('mousemove');
                $(window).off('mouseup');
                if(changed){
                    const pics = this.album.pic.map(tmp=>tmp.url);
                    this.save('pic', JSON.stringify(pics));
                }
            };

            $(window).on('mousemove', moving);
            $(window).on('mouseup', end);

        },

        toDetail(item, index){
            if(!this.isClk){
                return ;
            }
            window.localStorage.setItem('galleryPage', index)
            this.$router.push({ name: '画册翻页', params: {id: this.$route.params.id}, query: { width: item.thumbnail_width, height: item.thumbnail_height}})
        }
    },

    watch: {
        $route(){
            this.reload();
        }
    }
};
</script>
<style lang="less">
.albumpics-tbtn{
    display:inline-block;
    vertical-align:middle;
    margin-right:10px;
    border:none;
    color:#666;

    .ivu-upload-drag{
        border:none!important;
        color:#2d8cf0!important;
    }

    &.albumpics-tbtn-img{
        margin-right:0px;
    }
}

.albumpics-content{
    padding:14px;
}

.albumpics{
    flex-wrap:wrap;
    position:relative;
}
.albumpic{
    margin:15px 14px;
    width:180px;
    font-size:0;
    background:#fff;
    position:relative;
}

.albumpic-content{
    cursor:pointer;

    >img{
        width:100%;
    }
}

.albumpic-img{
    cursor:pointer;
    width:180px;
    background-color:#E4E4E4;
    background-repeat:no-repeat;
    background-position:top center;
    background-size:contain;
}

.zalbumpic-bbar{
    height:16px;
    background:rgba(102, 102, 102, 0.8);
    padding:0 12px;
    line-height:16px;
    color:#b7b7b7;
}

.zalbumpic-bbar-txt{
    font-size:12px;
}

.zalbumpic-bbar-sm{
    height:8px;
}

.zalbumpic-bbar-img{
    vertical-align:top;
    display:inline-block;
    width:8px;
    height:8px;
    margin-left:6px;
    cursor:pointer;
    background-repeat:no-repeat;
    background-position:center;
    background-size:contain;

    &.icon-del:hover{
        background-image:url('/static/albums/album-del1-on.png');
    }

    &.icon-del{
        background-image:url('/static/albums/album-del1.png');
    }

    &.icon-img:hover{
        background-image:url('/static/albums/album-img-on.png');
    }

    &.icon-img{
        background-image:url('/static/albums/album-img.png');
    }
}

.albumpic-dd-pd{
    width:180px;
    border:1px dashed #ccc;
}

.albumpic-dd-ing{
    z-index:9999;
    position:absolute;
}

.xbox-shadow{ box-shadow: 3px 3px 6px 3px rgba(0,0,0,0.5);}
</style>
