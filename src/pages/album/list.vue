<template>
<i-page :aside="false">
    <div slot="header-handler">
        <a href="javascript:void(0)" @click="showAdd">添加画册</a>
    </div>
    <div slot="header-rightbar">
        <Input v-model="keyword" icon="ios-search" placeholder="搜索" style="width: 200px" size="small" @on-enter="search"></Input>
    </div>
    <div class="page-content" slot="page-content">
        <div class="qrcode-mask ivu-modal-mask"></div>
        <div class="share">
            <div id="qrcode"></div>
            <Row type="flex">
                <Col>
                    <Input id="share_url" class="share_url"></Input>
                </Col>
                <Col>
                    <Button class="btn" type="primary">复制</Button>
                </Col>
            </Row>
        </div>
        <ul class="zalbums flex">
            <li v-for="(item, index) in albums" :key="item.id" class="zalbum">
                <!-- 内容窗口 -->
                <div class="zalbum-content" :class="{'zalbum-content-hidden': item.showSetting}">
                    <div class="zalbum-img" :style="{'background-image':`url(${server}${item.pic.url})`}"  @click="toDetail(item, $event)">
                        <div class="zalbum-visible" @click="visibleSwitch(item)">{{item.visible ? '开' : '关'}}</div>
                    </div>
                    <div class="flex space-between zalbum-bbar">
                        <div class="zalbum-name" v-show="!item.editing" @click="titleClick(item)">
                            <span>{{item.title}}</span>
                        </div>
                        <Input v-show="item.editing" v-model="item.title" size="small" @on-enter="titleEditFinish(item)" autofocus></Input>
                        <div class="flex space-between zalbum-bbar-rt">
                            <img class="zsize-16" src="/static/albums/album-del.png" @click="del(item, index)"/>
                            <span class="xswit">
                                <i-switch size="small" v-model="item.share" @on-change="changeShare(item)"></i-switch>
                                <div class="zalbum-size10">分享</div>
                            </span>
                            <span class="xswit">
                                <i-switch size="small" v-model="item.ad" @on-change="changeAd(item)"></i-switch>
                                <div class="zalbum-size10">广告</div>
                            </span>
                            <span @click="showSetting(item)" class="zalbum-p5">
                                <img class="zsize-w" src="/static/albums/album-more.png"/>
                            </span>

                        </div>
                    </div>
                </div>
                <!--设置窗口-->
                <div class="zalbum-setting" v-show="item.showSetting">
                    <div class="zalbum-setting-content">
                        <div class="flex space-around" @click="changeCurr(item)">
                            <div class="zalbum-setting-btn flex flex-center">
                                <img :src="server + item.background" class="zalbum-setting-btnimg" v-if="item.background"/>
                                <div class="zalbum-setting-btxt">画册背景</div>
                                <Upload class="zalbum-setting-upload" :data="uploader" :show-upload-list="false" type="drag" name="Filedata" :action="api + '/uploadFile'" :before-upload="beforeUpload" :on-success="uploadBGComplete" :on-error="uploadError" accept="image/*"></Upload>
                            </div>

                            <div class="zalbum-setting-btn flex flex-center">
                                <Upload  class="zalbum-setting-upload" :data="midiaUploader" :show-upload-list="false" type="drag" name="Filedata" :action="api + '/uploadFile'" :before-upload="beforeUpload" :on-success="uploadMusicComplete" :on-error="uploadError" accept="audio/*"></Upload>
                                <img src="/static/albums/album-music-on.png" class="zalbum-setting-btn-icon"/>
                                <div class="zalbum-setting-btxt">画册音乐</div>
                            </div>
                            <div class="zalbum-setting-btn flex flex-center" @click="showShareTxtEdit(item)">
                                <div class="zalbum-setting-stxt zalbum-small-txt">
                                    {{item.share_content}}
                                </div>
                                <div class="zalbum-setting-btxt">分享文字</div>
                            </div>
                        </div>
                        <div class="flex space-around zalbum-p34" @click="changeCurr(item)">
                            <div class="zalbum-setting-btn flex flex-center">
                                <Upload  class="zalbum-setting-upload" :data="uploader" :show-upload-list="false" type="drag" name="Filedata" :action="api + '/uploadFile'" :before-upload="beforeUpload" :on-success="uploadIconComplete" :on-error="uploadError" accept="image/*"></Upload>
                                <img :src="server + item.share_icon" class="zalbum-setting-btnimg" v-if="item.share_icon"/>
                                <div class="zalbum-setting-btxt">分享图标</div>
                            </div>
                            <div class="zalbum-setting-btn flex flex-center" @click="showQr(item)">
                                <div class="zalbum-setting-btnqr" :ref="'qr' + item.id"></div>
                                <div class="zalbum-setting-btxt">二维码</div>
                            </div>
                            <div  :id="'cp'+item.id" class="zalbum-setting-btn flex flex-center">
                                <img src="/static/albums/album-link.png" class="zalbum-setting-btn-icon"/>
                                <div class="zalbum-setting-btxt">复制链接</div>
                            </div>
                        </div>
                    </div>
                    <div class="zalbum-setting-bbar">
                        <span class="zalbum-setting-cancel" @click="item.showSetting = false">取消</span>
                    </div>
                </div>
            </li>
        </ul>

        <Modal
            v-model="shareTxt.show" title="编辑分享文字" @on-ok="saveShareTxt">
            <Input placeholder="请输入分享文字" v-model="shareTxt.value" @on-enter="saveShareTxt"></Input>
        </Modal>

        <Modal v-model="add.show" width="600">
            <p slot="header" style="color:#2d8cf0;text-align:center">
                <Icon type="compose"></Icon>
                <span>新增画册</span>
            </p>
            <div style="padding-right: 20px;">
                <add-item @close="onClose"></add-item>
            </div>
            <div slot="footer">
                <!-- <Button type="primary" size="large" long :loading="modal_loading" @click="del">删除</Button> -->
            </div>
        </Modal>

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
import Clipboard from 'clipboard'
import QRCode from '@/util/qrcode'
import { hex_md5 } from '../../util/md5'
import AddItem from './AddItem'
const timestamp = Date.now()
let clips = [];

export default {
    components: {
        AddItem
    },
    data(){
        return {
            delConfirm: {
                visible: false,
                title: '确定要删除本画册吗？',
                item: null
            },
            add: {
                show: false
            },
            shareTxt: {
                show: false,
                value : ''
            },
            uploader: {
                timestamp: timestamp,
                token: hex_md5('fitment_' + timestamp),
                type: 'images'
            },
            midiaUploader: {
                timestamp: timestamp,
                token: hex_md5('fitment_' + timestamp),
                type: 'media'
            },
            albums: [],
            keyword: ''
        };
    },


    created(){
        this.reload();
    },

    methods: {
        search(){
            this.reload();
        },
        async reload(){
            console.log(this.keyword);
            let { data } = await this.http('/picApi/factoryAlbumList', {
                data: {title: this.keyword},
                method: 'POST'
            });

            for(let item of data.result.albums){
                item.showSetting = false;
                item.editing = false;
                item.visible = item.wx_miniprogram_close === '0';
                item.share = item.close_share == '0'; // 0是不关闭，所以就是share
                item.ad = item.close_ad == '0';
            }
            this.albums = data.result.albums;
            this.$nextTick(()=>{
                for(let cli of clips){
                    cli.destroy();
                }
                clips = [];

                for(let item of this.albums){
                    const share_url = this.server + "/static/h5/static/book/index.html?id=" + item.id + '&width=' + item.pic.thumbnail_width + '&height=' + item.pic.thumbnail_height + '&v=' + new Date().getTime();
                    const el = this.$refs['qr' + item.id][0];
                    if(el.qrcode){
                        continue;
                    }

                    el.qrcode = new QRCode(el, {
                        text: share_url,
                        width: 30,
                        height: 30,
                        colorDark : "#000000",
                        colorLight : "#ffffff",
                        correctLevel : QRCode.CorrectLevel.H
                    });

                    const that = this;
                    (function(url, item){

                        const el = $('#cp' + item.id)[0];

                        const clipboard = new Clipboard('#cp' + item.id, {
                            text: function(trigger) {
                                return url;
                            }
                        });

                        clipboard.on('success',()=>{
                            that.$Message.info('复制成功');
                        });
                        clips.push(clipboard);


                    })(share_url, item)
                }
            })
        },

        titleClick(item){
            if(!item.editing){
                item.editing = true;
            }
        },

        beforeUpload(res){
            this.$Loading.start();
        },

        changeCurr(item){
            if(item){
                this.item = item;
            }
        },

        // 上传成功
        uploadComplete(res, file, fileList){
            this.$Loading.finish();
        },

        uploadError(){
            this.$Loading.finish();
        },

        // 上传背景成功
        uploadBGComplete(res, file, fileList){
            if(res.code){
                this.$Message.error(res.msg.zh);
                return ;
            }
            this.uploadComplete(res, file, fileList);
            this.item.background = res.result.file;
            this.save(this.item, 'background', res.result.file);
        },

        // 上传音乐成功
        uploadMusicComplete(res, file, fileList){
            if(res.code){
                this.$Message.error(res.msg.zh);
                return ;
            }
            this.uploadComplete(res, file, fileList);
            this.item.music = res.result.file;
            this.save(this.item, 'music', res.result.file);
        },

        // 上传图标成功
        uploadIconComplete(res, file, fileList){
            if(res.code){
                this.$Message.error(res.msg.zh);
                return ;
            }
            this.uploadComplete(res, file, fileList);
            this.item.share_icon = res.result.file;
            this.save(this.item, 'share_icon', res.result.file);
        },

        titleEditFinish(item){
            if(!item.title){
                return ;
            }

            item.editing = false;
            this.save(item, 'title', item.title);
        },

        // 删除
        del(item, index){
            this.delConfirm.visible = true;
            this.delConfirm.item = item;
            this.delConfirm.index = index;
            this.$nextTick(()=>{
                this.$refs.cfbtn.$el.focus();
            });
        },

        async doDel(){
            this.delConfirm.visible = false;
            const item = this.delConfirm.item;
            const index = this.delConfirm.index;
            let { data } = await this.http('/picApi/factoryAlbumDel', {
                data: {
                    id: item.id
                },
                method: 'POST'
            });

            if (!data.code) {
                this.albums.splice(index, 1);
            };
            this.$Message.info(data.msg.zh);
        },

        changeShare(item){
            this.save(item, 'close_share', item.share ? '0' : '1');
        },

        changeAd(item){
            this.save(item, 'close_ad', item.ad ? '0' : '1');
        },


        async save(item, key, val){
            // TODO 通用保存方法
            console.log('save:', item, key, val);

            const params = {
                title : item.title,
                share_content : item.share_content,
                share_icon : item.share_icon,
                close_share : item.close_share,
                background : item.background,
                music : item.music,
                close_ad : item.close_ad,
                album_id : item.id,
                modify_pic : false
            };
            params[key] = val;

            let { data } = await this.http('/picApi/factoryAlbumModify', {
                data: params,
                method: 'POST'
            });

            if (!data.code) {
                this.$Message.success('修改成功');
            }else{
                this.$Message.error(data.msg.zh);
            }
        },

        showQr(item){
            const share_url = this.server + "/static/h5/static/book/index.html?id=" + item.id + '&width=' + item.pic.thumbnail_width + '&height=' + item.pic.thumbnail_height + '&v=' + new Date().getTime()
            $('.qrcode-mask').fadeIn()
            $('#qrcode').html('')

            $('#share_url').html(share_url)
            var qrcode = new QRCode("qrcode", {
                text: share_url,
                width: 280,
                height: 280,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
            $('.box-list').addClass('blur')
            $('.share').fadeIn();

            $('.qrcode-mask').one('click', (e) =>{
                $('.qrcode-mask').fadeOut()
                $('.share').fadeOut();
                $('.box-list').removeClass('blur');
            });

            // 复制
            const el = $('.btn')[0];
            if(el.clipboard){
                el.clipboard.destroy();
            }
            el.clipboard = new Clipboard('.btn', {
                text: function(trigger) {
                    return share_url;
                }
            });
            el.clipboard.on('success',()=>{
                this.$Message.info('复制成功');
            });
        },

        // 展示分享文字的编辑
        showShareTxtEdit(item){
            this.item = item;
            this.shareTxt.show = true;
            this.shareTxt.value = item.share_content;
        },

        saveShareTxt(){
            if(!this.shareTxt.value){
                return false;
            }
            this.shareTxt.show = false;
            this.item.share_content = this.shareTxt.value;
            this.save(this.item, 'share_content', this.shareTxt.value);
        },

        // 展示添加画册
        showAdd(){
            this.add.show = true;
            this.add.title = '';
        },

        // 新增窗口关闭
        onClose(){
            this.add.show = false;
            this.reload();
        },

        // 跳到详情页
        toDetail(item, event){
            if($(event.target).is('.zalbum-visible')){
                return ;
            }
            this.$router.push({name: '画册详情', params: {id: item.id}});
        },

        showSetting(item){
            item.showSetting = true;
            for(let tmp of this.albums){
                if(tmp !== item && tmp.showSetting){
                    tmp.showSetting = false;
                }
            }
        },

        visibleSwitch(item){
            item.visible = !item.visible;
            this.save(item, 'wx_miniprogram_close', item.visible ? '0' : '1');
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
.zalbums{
    flex-wrap:wrap;
}
.zalbum{
    margin:14px;
    width:326px;
    height:250px;
    background:#fff;
    padding:10px 10px 0px 10px;
    position:relative;
}

.zalbum-img{
    position:relative;
    cursor:pointer;
    height:200px;
    background-color:#E4E4E4;
    background-repeat:no-repeat;
    background-position:top center;
    background-size:contain;
}

.zalbum-bbar{
    height:40px;
    padding-left:12px;
    padding-right:16px;
}

.zalbum-name{
    height:12px;
    font-size:12px;
    line-height:12px;
    padding-left:16px;
    background-image:url("/static/albums/album-edit.png");
    background-repeat:no-repeat;
    background-size:contain;
    background-position:left;
}

.zsize-16{
    height: 16px;
    margin-top:4px;
}

.zalbum-bbar-rt:first-child{
    margin-left:0;
}
.zalbum-bbar-rt > *{
    margin-left:10px;
}
.zalbum-size10{
    position:absolute;
    top:100%;
    height:10px;
    -webkit-transform-origin:top;
}

.zalbum-size10, .zalbum-small-txt{
    font-size:10;
    -webkit-transform:scale(0.6);
}


.xswit:hover .zalbum-size10{
    display:block;
}

.zalbum-size10{
    display:none;
}

.zsize-w{
    height:4px;
}

.zalbum-bbar > *, .zalbum-bbar-rt > img{
    cursor:pointer;
}

.xswit{
    position:relative;
}

.zalbum-content-hidden{
    filter:blur(10px);
    .zalbum-bbar{
        display:none;
    }
}

.zalbum-content{
    width:100%;
    height:100%;
}

.zalbum-setting{
    position:absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    background:rgba(247, 247, 247, 0.8);
}

.zalbum-setting-bbar{
    position:absolute;
    bottom:0;
    left:0;
    right:0;
    height:38px;
    line-height:38px;
    font-size:14px;
    background:#fff;
    text-align:center;
}

.zalbum-setting-cancel{
    cursor:pointer;
}

.zalbum-setting-content{
    padding:34px 52px 0 52px;
}

.zalbum-setting-btn{
    cursor:pointer;
    width:52px;
    height:52px;
    border-radius:26px;
    background:#fff;
    position:relative;
}
.zalbum-p34{
    margin-top:34px;
}

.zalbum-setting-btxt{
    top:100%;
    left:0;
    width:100%;
    line-height:34px;
    text-align:center;
    position:absolute;
}

.zalbum-setting-btn-icon{
    width:26px;
    height:26px;
}

.zalbum-setting-btn-bicon{
    width:44px;
    height:44px;
}

.zalbum-setting-stxt{
    font-size:10px;
    padding:0 4px;
    text-align:center;
    overflow:hidden;
    text-overflow:ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.zalbum-setting-upload{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;

    .ivu-upload-drag{
        width:100%;
        height:100%;
        border:none;
    }
}
.zalbum-p10{
    padding:5px 0;
}

.zalbum-setting-btnqr{
    width:30px;
    height:30px;
}

.zalbum-setting-btnimg{
    width:44px;
    height:44px;
    border-radius:22px;
}

.qrcode-mask {
    display: none;
}
.share {
    display:none; width: 500px; height: 500px; top: 50%; left: 50%; position: absolute; z-index: 1000; margin: -250px 0 0 -250px;
    .share_url {
        width: 430px; line-height: 20px; padding: 10px; font-size: 16px; border:solid 1px #2b86fc; background:#fff; overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .btn {
        height: 42px; width: 70px; border-radius: 0;
    }
}
#qrcode {
    background:#fff; padding: 20px;
    width: 320px; height: 320px; margin: 0 auto 50px auto;
}
.zalbum-visible{
    display:inline-block;
    font-size:12px;
    line-height:20px;
    height:20px;
    padding:0 16px;
    border-radius:10px;
    background:rgba(255,255,255,0.9);
    position:absolute;;
    right:20px;
    top:20px;
    user-select:none;
}
</style>
