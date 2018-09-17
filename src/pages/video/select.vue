<template>
    <div class="zd">
        <div class="zd-ct">
            <div class="zd-main">
                <!-- 视频列表 -->
                <ul class="flex" style="flex-wrap:wrap;padding-bottom:40px;">
                    <li class="cursor video-item" v-for="item in videos">
                        <div class="video-wrapper" @click="item.checked = !item.checked">
                            <video :src="server + item.url" preload="metadata" v-on:loadedmetadata="loadedmetadata(item, $event)" v-on:ended="ended(item)" :ref="item.id"></video>
                            <div class="video-time" v-if="item.time">{{item.time}}</div>
                            <div class="box-mask flex center" v-if="item.checked">
                                <div><img src="/static/icon/Symbol 37 – 1@3x.png" width="50" class="share-wechat"></div>
                            </div>
                        </div>
                        <div class="video-bar">
                            <div class="video-title">{{item.title}}</div>
                            <div @click="play(item)">
                                <Icon type="pause" size="16" class="play" v-if="item.playing"></Icon>
                                <Icon type="play" size="16" class="play" v-if="!item.playing"></Icon>
                            </div>
                        </div>
                    </li>
                </ul>

                <div style="position: fixed; bottom: 20px; right: 300px;">
                    <Page :total="paginate.total_record" @on-page-size-change="pageSizeChange" show-total placement="top" :page-size="paginate.page_size" :page-size-opts="[10, 20, 30, 40]" @on-change="toPage" :current="paginate.cur_page" size="small" show-elevator show-sizer></Page>
                </div>
            </div>

            <div class="zd-sbar">
                <div class="zd-sbar-main">
                    <div class="video-cate" v-for="cate in cates" :class="{active: cate.active}" @click="active(cate)">
                        {{cate.title}}
                    </div>
                </div>

                <div class="zd-sbar-bbar flex flex-center">
                    <Button type="primary" size="large" @click="addPrd">确定</Button>
                    <Button type="ghost" size="large" @click="selectAllPrd">全选</Button>
                    <Button type="ghost" size="large" @click="close">取消</Button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import fmt from '@/util/dateFmt'
import videoMixin from './video.mixin'
export default {
    mixins: [videoMixin],
	data() {
		return {
            cate: null,
            cates: [],
            videos: [],
            paginate : {
                page_size: 10,
                cur_page: 1,
                total_record: 0
            }
		}
	},

    mounted(){
        this.loadCates();
    },

	methods: {
        async loadCates(){
            let {data} = await this.http('/videoApi/getGalleryCategory', {
                method: 'POST',
                data: {
                    page_size: 9999
                }
            });

            if(data.code){
                this.$Message.error(data.msg.zh);
                return ;
            }
            const cates = data.result.data || [];
            for(let cate of cates){
                cate.active = false;
            }
            this.cates = cates;
            if(this.cates.length > 0){
                this.active(this.cates[0]);
            }
        },

        active(cate){
            for(let tmp of this.cates){
                tmp.active = tmp === cate;
            }
            this.cate = cate;
            this.cur_page = 1;
            this.loadList();
        },

        async loadList(){
            let {data} = await this.http('/videoApi/getVideoGalleryCategoryInfo', {
                method: 'POST',
                data: {
                    cid: this.cate.id,
                    page_size: this.paginate.page_size,
                    cur_page: this.paginate.cur_page,
                }
            });

            if(data.code){
                this.$Message.error(data.msg.zh);
                this.noData();
                return ;
            }

            const videos = data.result.data || [];
            for(let video of videos){
                video.checked = false;
                video.time = '';
                video.playing = false;
            }
            data.result.paginate.cur_page = Number(data.result.paginate.cur_page);
            this.paginate = data.result.paginate;
            this.videos = data.result.data;
        },

        noData(){
            this.paginate.cur_page = 0;
            this.paginate.total_record = 0;
            this.videos = [];
        },

        pageSizeChange(size){
            this.paginate.cur_page = 1;
            this.paginate.page_size = size;
            this.loadList();
        },

        toPage(page){
            this.paginate.cur_page = page;
            this.loadList();
        },

        addPrd(){
            const checkeds = this.videos.filter(item=>item.checked);
            if(checkeds.length > 0){
                this.$emit('ok', checkeds);
            }
            this.$emit('close');

        },

        selectAllPrd(){
            for(let item of this.videos){
                item.checked = !item.checked;
            }
        },

        close(){
            this.$emit('close');
        }
	}
};

</script>
<style scoped>
.zd-ct{
    position:fixed;
    left:40px;
    top:38px;
    right:0;
    bottom:0;
    background:rgb(240, 240, 240);
}

.zd-main{
    height:100%;
    padding:10px;
    margin-right: 240px;
    overflow: auto;
}

.zd-sbar{
    position:absolute;
    right:0;
    width:240px;
    top:3px;
    bottom:0;
    background:#fff;
}

.zd-cate{
    padding-left:24px;
    color: #666;
    border-top: 1px solid #dddee1;
}

.zd-cate-txt{
    height:28px;
    line-height: 28px;
    font-size: 14px;
    font-weight: 700;
    cursor:pointer;
}

.zd-lv2{
    padding-left:12px;
}

.zd-lv2-txt{
    line-height:28px;
    cursor:pointer;
}

.zd-lv2-checked{
    color:#2d8cf0;
}

.zd-sbar-main{
    margin-bottom:60px;
}

.zd-sbar-bbar{
    position:absolute;
    right:0;
    bottom:0;
    height:60px;
    width:240px;
    border-top: solid 3px #f5f7f9;
}

.zd-sbar-bbar > *{
    margin-left:5px;
}

.zd-sbar{
    background-color:#f7f7f7;

}

.serie-prd{
    border-bottom: 1px solid #e4e4e4;
}

.zd-bar, .zd-sbar-bbar{
    border-color:#e4e4e4;
}

.video-cate{
    padding:6px 12px;
    font-size:14px;
    cursor:pointer;
}
.video-cate.active{
    color:#008eea;
}

.video-item{
    width:320px;
    background-color:#fff;
    margin:8px 3px;
}

.video-wrapper{
    height:208px;
    background:#2a2a2a;
    position: relative;
    display:flex;
    background:#000;
}

.video-wrapper > video{
    width:100%;
    max-height:100%;
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

.video-time{
    position:absolute;
    bottom:8px;
    right:12px;
    color:#fff;
    font-size:14px;
    padding:2px 10px;
    border-radius:12px;
    border:1px solid #bdb8b7;
    background-color:rgba(36,36,36, 0.5);
}

.box-mask {
    position: absolute;
    z-index: 3;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.5);
}

.video-title{
    white-space:nowrap;
    text-overflow:ellipsis;
    overflow:hidden;
}
</style>
