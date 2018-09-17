import fmt from '@/util/dateFmt'
export default {
    methods: {
        loadedmetadata(item, event){
            const video = event.srcElement || this.$refs[item.id][0];
            item.time = fmt.fmt(new Date(video.duration * 1000), video.duration >= 3600 ? 'hh:mm:ss' : 'mm:ss');
        },

        ended(item){
            item.playing = false;
        },

        play(item){
            const video = this.$refs[item.id][0];
            if(item.playing){
                video.pause();
            }else{
                video.play();
            }
            item.playing = !item.playing;

            for(let tmp of this.videos){
                if(tmp !== item && tmp.playing){
                    this.$refs[tmp.id][0].pause();
                    tmp.playing = false;
                }
            }
        },
    }
}
