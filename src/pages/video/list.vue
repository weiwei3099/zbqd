<template>
<div class="flex video-list">
    <!--视频项-->
    <div class="cursor video-item" v-for="item in videos">
        <xvideo class="video-wrapper" :item="item" :ref="item.id" @playing="stopOthers" :hideplay="item.menu"></xvideo>

        <!--视频底部按钮条-->
        <div class="video-bar" v-show="!item.menu">
            <!--标题-->
            <div class="flex">
                <div @click="showTitleEdit(item)">
                    <Icon type="ios-compose-outline" size="18" class="blue xicon"></Icon>
                </div>
                <span class="video-title" v-show="!item.editing">{{item.title}}</span>
                <Input class="shadow" v-show="item.editing" size="small" @on-enter="updateTitle(item)" v-model="item.value" :placeholder="item.title"></Input>
            </div>

            <!--按钮条-->
            <div class="flex">
                <div @click="maxsize(item)">
                    <Icon type="arrow-expand" size="18" class="xicon"></Icon>
                </div>
                <div @click="del(item)">
                    <Icon type="ios-trash-outline" size="18" class="red xicon"></Icon>
                </div>
                <div @click="item.menu = true">
                    <Icon type="ios-more" size="18" class="grey xicon" ></Icon>
                </div>

            </div>
        </div>

        <!--设置表单-->
        <div class="video-menu flex flex-center" v-show="item.menu">
            <!--logo-->
            <div class="menu-item menu-item-logo" @click="curr = item">
                <img :src="server + item.share_icon">
                <Upload class="uploader" :data="uploader" :show-upload-list="false" type="select" name="Filedata" :action="api + '/uploadFile'" :before-upload="beforeUpload" :on-success="uploadBGComplete" :on-error="uploadError" accept="image/*">
                </Upload>
            </div>

            <!--分享文字-->
            <div class="menu-item menu-item-txt" @click="showShareTxtEdit(item)">{{item.share_content}}</div>
            <!-- 二维码 -->
            <div class="menu-item" :ref="'qr' + item.id" @click="showQr(item)"></div>
            <!--复制链接-->
            <div class="menu-item menu-item-icon" :id="'cp'+item.id"><img src="/static/albums/album-link.png"></div>
        </div>
        <div class="video-bar" v-if="item.menu">
            <div class="video-bar-cancel" @click="item.menu = false">取消</div>
        </div>
    </div>

    <div class="video-item flex flex-center" v-if="cate">
        <div @click="showSelect" class="btn-add">
            <Icon type="plus-round" size="32"></Icon>
        </div>
    </div>

    <div v-if="delConfirm.visible">
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

    <Modal
        v-model="shareTxt.show" title="编辑分享文字" @on-ok="saveShareTxt">
        <Input placeholder="请输入分享文字" v-model="shareTxt.value" @on-enter="saveShareTxt"></Input>
    </Modal>

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

    <selection v-if="selectionVisible" @close="selectionVisible = false" @ok="addPrds"></selection>
</div>
</template>
<script>

import xvideo from './xvideo'
import selection from './select'
import videoMixin from './video.mixin'
import { hex_md5 } from '../../util/md5'
import Clipboard from 'clipboard'
import QRCode from '@/util/qrcode'
const timestamp = Date.now()
let clips = [];
export default {
    mixins: [videoMixin],
    components: {
        selection, xvideo
    },

    props: {
        videos: {
            type: Array,
            default(){
                return []
            }
        },

        cate: Object
    },

    data(){
        return {
            selectionVisible: false,

            delConfirm: {
                title: '确定要删除吗?',
                visible: false,
                item: null
            },

            uploader: {
                timestamp: timestamp,
                token: hex_md5('fitment_' + timestamp),
                type: 'images'
            },

            shareTxt: {
                item: null,
                show: false,
                value : ''
            },

            curr: null
        };
    },

    mounted(){
        this.initQR();
    },

    methods: {
        stopOthers(video, item){
            for(let tmp of this.videos){
                const otherVideo = this.$refs[tmp.id][0];
                if(video !== otherVideo && otherVideo.playing){
                    otherVideo.stop();
                }
            }
        },
        maxsize(item){
            this.$refs[item.id][0].full();
        },
        initQR(){
            this.$nextTick(()=>{
                for(let cli of clips){
                    cli.destroy();
                }
                clips = [];

                for(let item of this.videos){
                    const share_url = this.server + "/static/h5/static/video/index.html?id=" + item.id + '&token=' + item.token + '&v=' + new Date().getTime();
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

        showQr(item){
            const share_url = this.server + "/static/h5/static/video/index.html?id=" + item.id + '&token=' + item.token + '&v=' + new Date().getTime()
            $('.qrcode-mask').fadeIn();
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

        // 显示产品选择
        showSelect(){
            this.selectionVisible = true;
        },

        // 添加产品
        async addPrds(prds){
            let err = null;
            for(let prd of prds){
                const data = this.addPrd(prd);
                if(data.code){
                    err = data.msg.zh;
                }
            }
            if(err){
                this.$Message.success(err);
            }else{
                this.$Message.success('成功');
                this.$emit('refresh');
            }
        },

        async addPrd(prd){
            let {data} = await this.http('/videoApi/addVideo', {
                method: 'POST',
                data: {
                    cid: this.cate.id,
                    vid: prd.id,
                    title: prd.title
                }
            });
            return data;
        },

        // 显示标题编辑
        showTitleEdit(item){
            item.value = item.title;
            item.editing = true;
        },

        // 更新标题
        async updateTitle(item){
            if(!item.value){
                item.editing = false;
                return ;
            }

            let {data} = await this.http('/videoApi/modifyVideo', {
                method: 'POST',
                data: {
                    id: item.id,
                    title: item.value
                }
            });

            if(data.code){
                this.$Message.error(data.msg.zh);
            }else{
                this.$Message.success(data.msg.zh);
                item.title = item.value;
                item.editing = false;
            }
        },

        del(item){
            this.delConfirm.item = item;
            this.delConfirm.visible = true;
        },

        async doDel(){
            this.delConfirm.visible = false;
            let {data} = await this.http('/videoApi/delVideo', {
                method: 'POST',
                data: {vid: this.delConfirm.item.id}
            });

            this.$bus.emit('video.seri.reload');
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
            this.save(this.curr, 'share_icon', res.result.file);
        },

        // 展示分享文字的编辑
        showShareTxtEdit(item){
            this.curr = item;
            this.shareTxt.show = true;
            this.shareTxt.value = item.share_content;
        },

        saveShareTxt(){
            if(!this.shareTxt.value){
                return false;
            }
            this.shareTxt.show = false;
            this.save(this.curr, 'share_content', this.shareTxt.value);
        },

        async save(item, feild, value){
            const params = {
                id: item.id
            };
            params[feild] = value;
            let {data} = await this.http('/videoApi/modifyVideo', {
                method: 'POST',
                data: params
            });

            if(data.code){
                this.$Message.error(data.msg.zh);
            }else{
                this.$Message.success(data.msg.zh);
                item[feild] = value;
            }

        }
    },

    watch: {
        videos(){
            this.initQR();
        },

        selectionVisible(){
            this.$emit('visible', this.selectionVisible);
        }
    }
};
</script>
<style scoped>

.video-item{
    position:relative;
    width:320px;
    height:256px;
    background-color:#fff;
    margin:8px 3px;
}

.video-wrapper{
    width:322px;
    height:208px;
    background:#2a2a2a;
    position: relative;
    display:flex;
}

.video-bar{
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    height:48px;
    padding:0 12px;
    font-size:16px;
}

.video-edit{
    color:#008eea;
    margin-right:6px;
    cursor:pointer;
}

.video-bar > .flex{
    align-items:center;
}

.video-title{
    color:#2a2a2a;
    font-size:16px;
    line-height:16px;
    vertical-align:top;
    white-space:nowrap;
    text-overflow:ellipsis;
    overflow:hidden;
    max-width:200px;
}

.red{
    color:#ca2625;
}

.grey{
    color:#b7b7b7;
}

.blue{
    color:#008eea;
}

.xicon{
    margin:0 4px;
}

.video-list{
    flex-wrap:wrap;
}

.video-bar-cancel{
    cursor:pointer;
    text-align:center;
    width:100%;
}

.video-menu{
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:48px;
    background:rgba(247, 247, 247, 0.8);
}

.menu-item{
    width:52px;
    height:52px;
    border-radius:26px;
    background:#fff;
    margin:0 5px;
    display:flex;
    justify-content:center;
    align-items:center;
}

.menu-item-icon > img{
    width: 26px;
    height: 26px;
}

.menu-item-txt{
    font-size: 10px;
    padding:4px;
    text-align:center;
    overflow:hidden;
    text-overflow:ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color:#2ba0ec;
}

.menu-item-logo{
    position:relative;
}

.menu-item-logo img{
    width:44px;
    height:44px;
    border-radius:22px;
}


</style>

<style lang="less">
.uploader {
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
}

.uploader .ivu-upload{
    width:100%;
    height:100%;
    border:none;
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

.btn-add{
    cursor:pointer;
}
</style>
