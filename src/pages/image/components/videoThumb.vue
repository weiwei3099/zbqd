<template>
    <Modal v-model="visible" width="600">
        <p slot="header" style="color:#2d8cf0; text-align:center">
            <Icon type="compose"></Icon>
            <span>自动生成缩略图</span>
        </p>
        <div style="padding-right: 20px;">
            <video :src="pre + video.url" style="width:100%;" ref="video" @loadeddata="loadedmetadata"></video>
            <div>{{status}}</div>
        </div>
        <div slot="footer">
            <Button type="default" size="large" @click="close">取消</Button>
            <Button type="info" size="large" @click="createThumb" :disabled="fail" :loading="!fail">从新生成</Button>
        </div>
    </Modal>
</template>
<script>
import modal from '@/pages/video/modal.mixin'
import { hex_md5 } from '@/util/md5'
import axios from 'axios'
const timestamp = Date.now()

export default {
    mixins: [modal],
    props: {
        video: null
    },

    data(){
        return {
            pre: process.env.VIDEO_PRE,
            status: '正在等待视频加载...',
            fail: false
        };
    },

    mounted(){

    },

    methods: {
        async save(thumb, time) {
            this.status = '上传完毕，正在更新视频属性...';
            // this.close();
        },

        async uploadFile(blob, time){
            this.status = '缩略图生成完毕, 正在上传...';
            var formData = new FormData();
            formData.append('userToken', this.$store.state.user.userInfo.userToken);
            formData.append('Filedata', blob, `${this.video.id}.png`);
            formData.append('timestamp', timestamp)
            formData.append('token', hex_md5('fitment_' + timestamp))
            formData.append('type', 'images');

            let {data} = await axios.post(`/uploadFile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if(!data.code){
                this.save(data.result.file, time);
            }else{
                this.status = '上传缩略图失败...';
                this.fail = true;
                this.$Message.error(data.msg.zh);
            }
        },

        createThumb(){
            this.fail = false;
            this.status = '准备生成缩略图...';
            const video = this.$refs.video;
            var canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob)=>{
                this.uploadFile(blob, video.duration);
            });
        },

        loadedmetadata(){
            this.createThumb();
        }
    }
}
</script>
<style>

</style>
