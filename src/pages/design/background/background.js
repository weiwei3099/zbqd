import Vue from 'vue';
import Playground from '../components/design/playground';
import prdSelect from '../components/select/select.vue';

Vue.filter('percentage', function(num){
    if(!num){
        return '0%';
    }
    num = Math.round(num*10000)/100;
    return `${num}%`;
});

/**
 * 产品装配主页面
 */
const Component = {
    playground : null,
    components : {
        prdSelect
    },
    data(){
        return {
            ajaxing : true,

            seq : 10,

            // 顶部按钮条
            tbar : [
                {id : 'save', name : '保存(ctrl+s)', icon : 'icon-save', event : false},
                {id : 'copy', name : '复制(ctrl+c)', icon : 'icon-copy'},
                {id : 'flipx', name : '水平翻转', icon : 'icon-flip-x'},
                {id : 'remove', name : '删除(ctrl+c)', icon : 'icon-remove'},
            ],

            // 左边按钮条
            lbar : [
                {id : 'rectAdd', name : '添加矩形框', icon : 'icon-rect', event : false, checked : false},
                {id : 'xselect', name : '选择/移动', icon : 'icon-select', checked : true},
                {id : 'zoomout', name : '放大(z)', icon : 'icon-zoom-out'},
                {id : 'zoomin', name : '缩小(x)', icon : 'icon-zoom-in'},
            ],


            keys : [
                {code : 83, ctrlKey : true, fn : 'save'},
                {code : 67, ctrlKey : true, fn : 'copy'},
                {code : 8, ctrlKey : false, fn : 'remove'},
                {code : 90, ctrlKey : false, fn : 'zoomin'},
                {code : 88, ctrlKey : false, fn : 'zoomout'},
                {code : 37, ctrlKey : false, fn : 'lxmove'},
                {code : 38, ctrlKey : false, fn : 'tymove'},
                {code : 39, ctrlKey : false, fn : 'rxmove'},
                {code : 40, ctrlKey : false, fn : 'bymove'}
            ],

            prdSelectVisible : false,

            zooms : [3, 2, 1, 0.75, 0.5, 0.25],

            zoom : 1,
            last_id : null,
            next_id : null
        };
    },

    mounted(){
        this.$options.playground = new Playground(this.$refs.pannel, this.server);
        this.load();
        this.$on('zoom', this.resetZoom);
    },

    beforeDestroy(){
        $(window).off('keydown');
        if(this.timer){
            clearInterval(this.timer)
        }

        document.oncontextmenu = null;
    },

    watch: {
      '$route': 'reload'
    },

    methods: {
        reload(){
            $(this.$refs.pannel).children('svg').remove();
            this.last_id = null;
            this.next_id = null;
            this.zoom = 1;
            this.$options.playground = new Playground(this.$refs.pannel, this.server);
            this.load();
        },

        initEvent(){
            // 5分钟自动保存一次
            this.timer = setInterval(()=>{
                this.save();
            }, 5*60*1000);

            document.oncontextmenu = function(){
                return false;
            };

            // 初始化键盘事件监听
            $(window).on('keydown', (evt)=>{
                // 正在请求或者正在添加系列、产品图片的时候不监听键盘事件
                if(this.ajaxing || this.prdSelectVisible){
                    return ;
                }
                for(let key of this.keys){
                    if(evt.keyCode === key.code && evt.ctrlKey === key.ctrlKey){
                        this.btnClick({id : key.fn}, evt.shiftKey);
                        event.preventDefault();
                        return ;
                    }
                }
            });
        },


        showPrdSelect(){
            this.prdSelectVisible = true;

            const cates = [
                // {type: '1', title: '产品图片'},
                // {type: '2', title: '背景图片'},
                // {isFull : true, title: '360图片'},
                {type: '3', title: '默认图片'}
            ];

            this.$refs.prdSelect.init(cates);
        },

        resetZoom(zoom){
            this.zoom = zoom;
        },

        changeZoom(zoom){
            this.zoom = zoom;
            this.$options.playground.scaling(zoom);
        },

        hidePrdSelect(){
            this.prdSelectVisible = false;
        },

        /**
         * 点击了按钮
         */
        btnClick(btn, shiftKey){
            if(btn.event !== false){
                this.$options.playground[btn.id] && this.$options.playground[btn.id](shiftKey);
            }else{
                this[btn.id] && this[btn.id]();
            }
        },

        async load(){
            const id = this.$route.query.id;
            let { data } = await this.http("/picApi/getPic", {
                data: {
                    id: id
                },
                method: "POST"
            });

            this.ajaxing = false;
            if(data){
                this.initPlayground(data.result.pic);
            }
            this.initEvent();
        },

        initPlayground(pic){
            this.pic = pic;
            this.last_id = this.pic.last_id;
            this.next_id = this.pic.next_id;
            const series = [];

            // 背景系列
            const bgSerie = {$id : 0, $currPrd : null, type : 'bg', zindex : 0, products : [], isGg : true};
            const bgPrd = {
                isBg : true,
                $seri : bgSerie,
                id: this.seq++,
                url: pic.url,
                is_default: '0',
                width : Number(pic.width),
                height : Number(pic.height),
                attr : [{
                    x : 0,
                    y : 0,
                    width : 1024,
                    height : 768
                }]
            };
            bgPrd.attr[0].$prd = bgPrd;
            bgSerie.$currPrd = bgPrd;
            bgSerie.products.push(bgPrd);
            series.push(bgSerie);

            // 正方形的框
            const rectSeri = {$id : 1, $currPrd : null, type : 'rect', zindex : 1, products : [], isRect : true};

            if(pic.show_attr){
                if(typeof pic.show_attr === 'string'){
                    pic.show_attr = JSON.parse(pic.show_attr);
                }
                const rectPrd = {
                    isRect : true,
                    $seri : rectSeri,
                    id: this.seq++,
                    is_default: '0',
                    width : Number(pic.show_attr.width),
                    height : Number(pic.show_attr.height),
                    attr : [{
                        x : Number(pic.show_attr.x),
                        y : Number(pic.show_attr.y),
                        width : Number(pic.show_attr.width),
                        height : Number(pic.show_attr.height)
                    }]
                };

                rectPrd.attr[0].$prd = rectPrd;
                rectSeri.$currPrd = rectPrd;
                rectSeri.products.push(rectPrd);
            }
            series.push(rectSeri);

            for(let attr of pic.bg_attr){
                const zdSeri = {$id : this.seq++, $emptyable : false, $currPrd : null, type : 'zd', zindex : attr.zindex, products : []};
                const zdPrd = {
                    $seri : zdSeri,
                    id: attr.part_pic_id,
                    is_default: '0',
                    url: attr.url,
                    width : Number(attr.width),
                    height : Number(attr.height),
                    attr : attr.attr
                };

                for(let attItem of attr.attr){
                    attItem.$prd = zdPrd;
                }

                zdSeri.$currPrd = zdPrd;
                zdSeri.products.push(zdPrd);
                series.push(zdSeri);
            }

            this.series = series;
            this.$options.playground.init(null, null, series, this);

        },

        rectAdd(){
            if(this.series[1].$currPrd){
                this.$Message.warning('矩形框已经添加');
                return;
            }
            const pic = this.pic;
            const rectSeri = this.series[1];
            const rectPrd = {
                isRect : true,
                $seri : rectSeri,
                id: this.seq++,
                is_default: '0',
                width : 100,
                height : 100,
                attr : [{
                    x : 100,
                    y : 100,
                    width : 100,
                    height : 100
                }]
            };
            rectSeri.products.push(rectPrd);
            rectPrd.attr[0].$prd = rectPrd;

            this.$options.playground.changePrd(rectSeri, rectPrd);
        },

        // 添加遮挡
        addPrds(prds){
            this.prdSelectVisible = false;
            let index = 0;
            for(let prd of prds){
                const zdSeri = {$id : this.seq++, $emptyable : false, $currPrd : null, type : 'zd', zindex : this.series.length, products : []};
                const prdWidth = Number(prd.width);
                const prdHeight = Number(prd.height);
                const zdPrd = {
                    $seri : zdSeri,
                    id: prd.id,
                    is_default: '0',
                    url: prd.url,
                    width : prdWidth,
                    height : prdHeight,
                    attr : [{
                        x : prdWidth + (index * 5),
                        y : 100 + (index * 5),
                        width : prdWidth,
                        height : prdHeight,
                        matrix : null
                    }]
                };

                zdPrd.attr[0].$prd = zdPrd;
                zdSeri.products.push(zdPrd);
                this.series.push(zdSeri);
                this.$options.playground.changePrd(zdSeri, zdPrd);
            }
        },

        next(id){
            console.log('go...');
            this.go({name: '背景图库', query: {id: id, page: 'back-detail'}});
        },

        saveAndBack(){
            this.save(true);
        },

        async save(back){
            if(this.ajaxing){
                return ;
            }

            if(!this.series[1].$currPrd){
                this.panel.$Message.warning('请添加矩形框');
                return;
            }

            const rectAttr = this.series[1].$currPrd.attr[0];
            const params = {
                id: this.$route.query.id,
                attr: {
                    sizew: rectAttr.sizew || 1024,
                    sizeh: rectAttr.sizeh || 768,
                    width: rectAttr.width,
                    height: rectAttr.height,
                    x: rectAttr.x,
                    y: rectAttr.y
                }
            };

            this.ajaxing = true;
            let { data } = await this.http("/picApi/modifyPic", {
                data: params,
                method: "POST"
            });
            if(data.code){
                this.ajaxing = false;
                this.$Message.info(data.msg.zh);
            }else{
                this.saveZd(back);
            }
        },

        async saveZd(back){
            const parts = [];
            for(let seri of this.series){
                if(seri.isBg || seri.isRect){
                    continue;
                }

                if(!seri.$currPrd){
                    continue;
                }
                const prd = seri.$currPrd
                const obj = {
                    pic_id : prd.id,
                    zindex : seri.zindex,
                    attr : []
                };

                for(let attr of prd.attr){
                    obj.attr.push({
                        x : attr.x,
                        y : attr.y,
                        width : attr.width,
                        height : attr.height,
                        matrix : attr.matrix
                    });
                }
                parts.push(obj);
            }

            let { data } = await this.http('/productApi/bgPartModify', {
                data: {
                    id: this.$route.query.id,
                    parts : parts
                },
                method: "POST"
            });

            this.ajaxing = false;
            if(data.code){
                this.$Message.info(data.msg.zh);
            }else{
                this.$Message.success(data.msg.zh);
                if(back === true){
                    this.$router.go(-1);
                }
            }
        }
    }
};

export default Component;
