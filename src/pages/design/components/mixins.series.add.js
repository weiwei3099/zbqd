
const mixinsProductSeries = {
    data(){
        return {
            serieCreateWinVisible : false,
            newSerieVal : ''
        };
    },

    methods: {
        showSerieCreateWin(){
            this.serieCreateWinVisible = true;
            this.newSerieVal = '';
        },

        hideSerieCreateWin(){
            this.serieCreateWinVisible = false;
        },

        addNewSerie(){
            if(!this.newSerieVal || !this.newSerieVal.trim()){
                this.$Message.error('请输入系列名称!');
                return ;
            }
            this.serieCreateWinVisible = false;

            const item = {
                $id : this.seq++,
                title : this.newSerieVal,
                type : null,
                zindex : this.series.length,
                products : []
            };
            const itemName = {
                $id : item.$id,
                title : this.newSerieVal,
                checked : false,
            };
            this.series.push(item);
            this.serieNames.push(itemName);

            this.switchImgList(itemName);
            this.$nextTick(()=>{
                this.scrollSeries2end();
            });
        }
    }
};

export default mixinsProductSeries;
