<template>
<li class="cursor video-item" @click="select">
    <xvideo class="video-wrapper" :item="item" ref="video" @playing="stopOthers"></xvideo>
    <div class="video-bar">
        <div class="flex">
            <img src="/static/icons/icon-edit.png" style="width:14px;height:14px;margin-right:4px;" @click="showTitleEdit"/>
            <div class="video-title" v-show="!editing">{{item.title}}</div>
            <Input class="shadow" v-show="editing" size="small" @on-enter="edit" v-model="title" :placeholder="item.title"></Input>

        </div>
        <div class="flex">
            <div @click="maxsize" style="padding:0 8px;">
                <Icon type="arrow-expand" size="18" class="xicon"></Icon>
            </div>
            <img src="/static/icons/icon-delete.png" width="14px;" @click="del"/>
            <Upload :on-success="uploaded" :before-upload="beforeUpload" :on-progress="updateProgress" :show-upload-list="false" :data="form" name="fileData" :action="api+ '/videoApi/modifyVideoGallery'" multiple type="select"  accept="video/*">
                <img src="/static/icons/video-update.png" width="14px;" style="margin-left:8px;"/>
            </Upload>
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
                <Button type="default" size="large" @click="hideDel">取消</Button>
                <Button type="info" size="large" @click="doDel" ref="cfbtn">确定</Button>
            </div>
        </Modal>
    </div>

    <xprogress v-model="progress.visible" :files="progress.files" ref="progress" @ok="progressFinish"></xprogress>
</li>
</template>

<script>
import fmt from '@/util/dateFmt'
import xvideo from '@/pages/video/xvideo'
import xprogress from '../progress'

export default {
    components: {
        xvideo,
        xprogress
    },
	props: {
		item: "",
		type: ""
	},
    mounted(){

    },
	data: function() {
		return {
            time: null,
            playing: false,
			status: "",
			selected: false,
            delConfirm: {
                title: '确定要删除吗?',
                visible: false
            },
            form: {
                vid: null,
                userToken: null
            },
            title: '',
            editing: false,

            progress: {
				visible: false,
                files: []
			},
		};
	},
	methods: {
        // 进度完成
        progressFinish(){
            this.progress.files = [];
        },

        // 展示进度条
        showProgress(file){
            this.progress.files.push({
                name: file.name,
                pro: 0
            });

            this.progress.visible = true;
        },

        // 更新进度条
        updateProgress(event, file){
            this.$refs.progress.update(file, event.percent);
        },

        showTitleEdit(){
            this.title = this.item.title;
            this.editing = true;
        },

        async edit(){
            if(!this.title){
                return ;
            }

            let {data} = await this.http('/videoApi/modifyVideoGallery',{
                method: 'POST',
                data: {
                    vid: this.item.id,
                    title: this.title
                }
            });


            if (!data.code) {
                this.editing = false;
                this.$parent.getProductList();
            }
            this.$Message.success(data.msg.zh);
        },

        uploaded(data, file, fileList){
            this.$refs.progress.finish(file);
            if (!data.code) {
                this.$parent.getProductList();
            }
            this.$Message.success(data.msg.zh);
        },

        beforeUpload(file){
            this.showProgress(file);
            this.form.vid = this.item.id;
            this.form.userToken = this.$store.state.user.userInfo.userToken;
        },

        hideDel(){
            this.delConfirm.visible = false;
        },

		del() {
			this.delConfirm.visible = true;
		},

        async doDel(){
            this.delConfirm.visible = false;
            let {data} = await this.http('/videoApi/delVideoGallery', {
                data: {
                    vid: this.item.id
                },
                method: 'POST'
            });

            if (!data.code) {
                this.$parent.getProductList();
            }
            this.$Message.success(data.msg.zh);
        },
		select() {
			if (this.status === "select") {
				this.selected = !this.selected;
				if (this.selected) {
					this.$store.commit("IMAGE_ADD", this.item);
				} else {
					this.$store.commit("IMAGE_REMOVE", this.item);
				}
			} else {
				this.$store.commit('IMAGE_DETAIL', this.item)
			}
		},
		changeStatus() {
			this.status = this.$route.params.status;
		},

        stopOthers(video, item){
            this.$emit('playing', video, item);
        },

        stop(){
            if(this.$refs.video.playing){
                this.$refs.video.stop();
            }
        },

        maxsize(){
            this.$refs.video.full();
        },
	},
	created() {
		this.status = this.$route.params.status;
		this.$bus.on("clearImageSelect", aa => {
			this.selected = false;
		});
	},
	watch: {
		'$route': 'changeStatus'
	}
};
</script>

<style scoped>

.video-item{
    width:320px;
    background-color:#fff;
    margin:8px 3px;
}

.video-wrapper:hover .play-wrapper, .video-wrapper:hover .video-time,
.video-wrapper.active .play-wrapper, .video-wrapper.active .video-time{
    visibility:visible;
}

.video-wrapper{
    height:208px;
    background:#2a2a2a;
    position: relative;
    display:flex;
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
    max-width:200px;
    white-space:nowrap;
    text-overflow:ellipsis;
    overflow:hidden;
}

.play-wrapper{
    visibility:hidden;
    left:50%;
    top:50%;
    transform:translate(-50%, -50%);
    display:flex;
    justify-content:center;
    align-items:center;
    width:50px;
    height:50px;
    border-radius:25px;
    background-color:rgba(36,36,36, 0.5);
    cursor:pointer!important;
}

.video-time, .play-wrapper{
    position:absolute;
}

.video-time{
    visibility:hidden;
    bottom:8px;
    right:12px;
    color:#fff;
    font-size:14px;
    padding:2px 10px;
    border-radius:12px;
    border:1px solid #bdb8b7;
    background-color:rgba(36,36,36, 0.5);
}

.play{
    color:#fff;
}
</style>
