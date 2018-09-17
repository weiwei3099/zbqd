<template>
<div class="xvideo-wrapper" :class="{xstop: !playing}">
    <video :src="server + item.url" preload="metadata" @loadedmetadata="loadedmetadata($event)" @ended="ended" ref="video" @play="playing = true" @pause="playing = false" @dblclick="full"></video>

    <!--播放、暂停按钮-->
    <div class="play-wrapper pv" @click="play" v-show="!hideplay">
        <Icon type="pause" size="30" class="play" v-if="playing"></Icon>
        <Icon type="play" size="30" class="play" v-if="!playing"></Icon>
    </div>

    <!--时长-->
    <div class="video-time pv" v-if="item.time">
        {{item.time}}
    </div>
</div>
</template>
<script>
import fmt from '@/util/dateFmt'
export default{
    props: {
        item: null,
        hideplay: {
            type: Boolean,
            default: false
        }
    },

    data(){
        return {
            playing: false
        };
    },

    methods: {
        // 加载meta完毕
        loadedmetadata(event){
            const video = this.$refs.video;
            this.item.time = fmt.fmt(new Date(video.duration * 1000), video.duration >= 3600 ? 'hh:mm:ss' : 'mm:ss');
            this.$emit('time', this.item.time);
        },

        // 全屏显示
        full(){
            const video = this.$refs.video;
            if (video.requestFullscreen) {
              video.requestFullscreen();
            } else if (video.msRequestFullscreen) {
              video.msRequestFullscreen();
            } else if (video.mozRequestFullScreen) {
              video.mozRequestFullScreen();
            } else if (video.webkitRequestFullscreen) {
              video.webkitRequestFullscreen();
            }
        },

        // 播放
        play(){
            if(this.playing){
                this.stop();
            }else{
                this.$refs.video.play();
                this.playing = true;
                this.$emit('playing', this, this.item);
            }
        },

        // 停止播放
        stop(){
            this.$refs.video.pause();
            this.playing = false;
        },

        // 播放完成
        ended(){
            this.playing = false;
        },

        onresize(){
            console.log(this.$refs.video);
        }
    }
}
</script>
<style>
.xvideo-wrapper{
    position:relative;
    background:#000;
}

.xvideo-wrapper video{
    width:100%;
    height:100%;
    background-color:#000000;
}

.xvideo-wrapper:hover .pv, .xstop .pv{
    visibility:visible;
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
    position:absolute;
}

.video-time{
    position:absolute;
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
