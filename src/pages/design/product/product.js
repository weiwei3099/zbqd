import Vue from 'vue';

import mixinsSeriesAdd from '../components/mixins.series.add';
import mixinsPrdsAdd from '../components/mixins.prd.add';
import designPanel from '../components/design/panel.vue';

Vue.filter('percentage', function(num){
    if(!num){
        return '0%';
    }
    num = 1/num;
    num = Math.round(num*10000)/100;
    return `${num}%`;
});

/**
 * 产品装配主页面
 */
const Component = {
    mixins : [mixinsSeriesAdd, mixinsPrdsAdd],
    components : {
        designPanel
    },
    data(){
        return {
            ajaxing : true,

            seq : 10,
            inputVisible : false,
            inputVal : '',
            nextId : null, // 下一个产品的id
            lastId : null, // 上一个产品的id

            // 顶部按钮条
            tbar : [
                {id : 'save', name : '保存(ctrl+s)', icon : 'icon-save', event : false},
                {id : 'copy', name : '复制(ctrl+c)', icon : 'icon-copy'},
                {id : 'top', name : '顶层(ctrl+1)', icon : 'icon-top'},
                {id : 'bottom', name : '底层(ctrl+2)', icon : 'icon-bottom'},
                {id : 'up', name : '上一层(ctrl+3)', icon : 'icon-up'},
                {id : 'down', name : '下一层(ctrl+4)', icon : 'icon-down'},
                {id : 'trunlf', name : '左翻转90度', icon : 'icon-trun-left'},
                {id : 'trunrt', name : '右翻转90度', icon : 'icon-trun-right'},
                {id : 'flipx', name : '水平翻转', icon : 'icon-flip-x'},
                {id : 'flipy', name : '垂直翻转', icon : 'icon-flip-y'},
                {id : 'remove', name : '删除', icon : 'icon-remove'}
            ],

            // 左边按钮条
            lbar : [
                {id : 'xselect', name : '选择/移动', icon : 'icon-select', checked : true},
                {id : 'zoomout', name : '放大(z)', icon : 'icon-zoom-out'},
                {id : 'zoomin', name : '缩小(x)', icon : 'icon-zoom-in'},
            ],

            zooms : [3, 2, 1, 0.75, 0.5, 0.25],

            zoom : 1,

            // 配件系列 - 用于画布中系列的管理
            series : [],

            // 用于右上角的系列李彪
            serieNames : [],

            // 同色的选项
            colors: [],

            currSeri : null,
            seriesScroll : 0,
            seriesStyles : {
                transform : 'translateX(0)',
                '-webkit-transform' : 'translateX(0)',
            },

            // 图片列表
            imgList : [],

            mainSeriChecked : false,
            bgSeriChecked : false,

            keys : [
                {code : 83, ctrlKey : true, fn : 'save'},
                {code : 67, ctrlKey : true, fn : 'copy'},
                {code : 49, ctrlKey : true, fn : 'top'},
                {code : 50, ctrlKey : true, fn : 'bottom'},
                {code : 51, ctrlKey : true, fn : 'up'},
                {code : 52, ctrlKey : true, fn : 'down'},
                {code : 8,  ctrlKey : false, fn : 'remove'},
                {code : 90, ctrlKey : false, fn : 'zoomin'},
                {code : 88, ctrlKey : false, fn : 'zoomout'},
                {code : 37, ctrlKey : false, fn : 'lxmove'},
                {code : 38, ctrlKey : false, fn : 'tymove'},
                {code : 39, ctrlKey : false, fn : 'rxmove'},
                {code : 40, ctrlKey : false, fn : 'bymove'}
            ],



        };
    },

    mounted(){
        this.getMainProduct();
    },

    beforeDestroy(){
        $(window).off('keydown');
        if(this.timer){
            clearInterval(this.timer)
        }
        document.oncontextmenu = null;
    },

    watch: {
        '$route'(){
            this.reload();
        }
    },

    methods: {
        /**
         * 加载主产品信息
         */
        async getMainProduct() {
            const id = this.$route.params.productId;
            let { data } = await this.http("/productApi/getProductInfo", {
                data: {
                    id: id
                },
                method: "POST"
            });

            this.getSceneInfo(data.result.product);
        },

        /**
         * 加载装配场景信息
         */
        async getSceneInfo(product) {
            const id = this.$route.params.productId;
            let { data } = await this.http("/productApi/getSceneInfo", {
                data: {
                    main_product: id
                },
                method: "POST"
            });

            this.initScene(product, data.result.scene);
            this.ajaxing = false;
        },

        newScene(product){
            const scene = {
                products : [],
                zindex : 0,
                bg_info : [],
                other_product : []
            };

            for(let color of product.attr){
                scene.products.push({
                    pic_id : color.id,
                    pic_title : color.pic_title,
                    url : color.url,
                    width : Number(color.width),
                    height : Number(color.height),
                    price : color.price,
                    is_default : '1',
                    is_special : '0',
                    attr : [{
                        x : 0,
                        y : 0,
                        width : Number(color.width),
                        height : Number(color.height)
                    }]
                });
            }

            return scene;
        },

        findNewColor(product, mainSeri, sceneProducts, defaultMainPrd, exsitsPrds){
            for(let color of product.attr){
                if(exsitsPrds[color.id]){
                    continue;
                }
                const prdItem = {
                    pic_id : color.id,
                    pic_title : color.pic_title,
                    url : color.url,
                    width : Number(color.width),
                    height : Number(color.height),
                    price : color.price,
                    is_default : '1',
                    is_special : '0',
                    attr : [{
                        x : 0,
                        y : 0,
                        width : Number(color.width),
                        height : Number(color.height)
                    }]
                };

                prdItem.selected = false;
                prdItem.$seri = mainSeri;
                prdItem.isMainProduct = true;

                if(defaultMainPrd){
                    prdItem.attr = [];

                    for(let attr of defaultMainPrd.attr){
                        const cloneAttr = this.props(attr);
                        cloneAttr.$prd = prdItem;
                        prdItem.attr.push(cloneAttr);
                    }
                }
                sceneProducts.push(prdItem);
            }
        },

        /**
         * 初始化装配场景
         */
        initScene(product, scene){
            this.product = product;
            this.nextId = product.next_id;
            this.lastId = product.last_id;

            this.series = [
                {$id : 0, $currPrd : null, type : 'main', title : '产品颜色', zindex : 0, checked : false, products : [], isMainProduct : true},
                {$id : 1, $currPrd : null, type : 'bg', title : '背景系列', zindex : -2, checked : false, products : [], isBg : true}
            ];

            this.serieNames = [
                {$id : 0, title: '产品颜色', checked: false},
                {$id : 1, title: '背景系列', checked: false},
            ];

            this.currSeri = null;
            this.seriesScroll = 0;
            this.seriesStyles = {
                transform : 'translateX(0)',
                '-webkit-transform' : 'translateX(0)',
            };

            // 图片列表
            this.imgList = [];

            if(!scene){
                scene = this.newScene(product);
            }

            // 主产品
            const mainSeri = this.series[0];
            let defaultMainPrd = null;
            const exsitsPrds = {};
            let i=1;
            for(let prd of scene.products){
                prd.selected = false;
                prd.$seri = mainSeri;
                prd.isMainProduct = true;
                prd.id = prd.pic_id;
                prd.is_default = prd.is_default === undefined ? '1' : prd.is_default;
                prd.is_special = prd.is_special === undefined ? '0' : prd.is_special;

                for(let color of product.attr){
                    if(prd.id === color.id){
                        prd.pic_title = color.pic_title;
                        prd.price = color.price;
                        break;
                    }
                }

                this.colors.push({
                    txt: prd.pic_title,
                    id: prd.id
                });

                for(let attr of prd.attr){
                    attr.$prd = prd;
                }
                mainSeri.products.push(prd);

                if(!defaultMainPrd && prd.is_special !== '1'){
                    defaultMainPrd = prd;
                }
                exsitsPrds[prd.id] = true;
            }

            if(!defaultMainPrd && mainSeri.products.length > 0){
                defaultMainPrd = mainSeri.products[0];
            }
            this.findNewColor(product, mainSeri, mainSeri.products, defaultMainPrd, exsitsPrds);

            mainSeri.$currPrd = mainSeri.products[0];
            mainSeri.zindex = scene.zindex;

            // 背景列表
            for(let bgPrd of scene.bg_info){
                bgPrd.$seri = this.series[1];
            }
            for(let prd of scene.bg_info){
                prd.selected = false;
            }
            this.series[1].products = scene.bg_info;


            // 添加系列产品
            for(let seri of scene.other_product){
                seri.$id = this.seq++;
                for(let prd of seri.products){
                    prd.selected = false;
                    prd.isOthers = true;
                    prd.is_visible = prd.is_visible != '0' ? '1' : '0';
                    prd.same_by = prd.same_by !== undefined ? prd.same_by : '';
                    prd.sameByTxt = this.findSameByTxt(prd.same_by);
                    prd.$seri = seri;
                    if(prd.is_default === '1'){
                        seri.$currPrd = prd;
                    }

                    for(let attr of prd.attr){
                        attr.$prd = prd;
                    }
                }

                this.series.push(seri);
                this.serieNames.push({
                    $id : seri.$id,
                    title : seri.title,
                    checked : false
                });
            }

            // 把后台传的字符串转成数字
            for(let seri of this.series){
                for(let prd of seri.products){
                    if(prd.attr){
                        for(let attr of prd.attr){
                            attr.x = Number(attr.x);
                            attr.y = Number(attr.y);
                            attr.width = Number(attr.width);
                            attr.height = Number(attr.height);
                            if(attr.rotation !== undefined){
                                attr.rotation = Number(attr.rotation);
                            }
                        }
                    }

                }
            }

            // 从新排序zindex
            // this.sortSeries();
            this.$refs.designPanel.init(product, scene, this.series);
            this.switchImgList(this.series[0]);
            this.initEvent();

            for(let seri of this.series){
                if(seri.$currPrd && seri.$currPrd.is_special != '1'){
                    this.$refs.designPanel.$options.playground.syncByPrd(seri.$currPrd, seri);
                }
            }
        },

        findSameByTxt(id){
            if(id === undefined || id === ''){
                return '';
            }
            let i=0;
            for(let prd of this.series[0].products){
                i++;
                if(prd.id === id){
                    return prd.pic_title;
                }
            }
            return '';
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
                if(this.ajaxing || this.prdCreateWinVisible || this.serieCreateWinVisible){
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

        showInputEdit(){
            if(this.currSeri.isMainProduct || this.currSeri.isBg){
                return ;
            }
            this.inputVisible = !this.inputVisible;
            this.inputVal = this.currSeri.title;
        },

        editSerie(){
            if(!this.inputVal){
                this.$Message.warning('请输入系列名称');
                return ;
            }

            this.currSeri.title = this.inputVal;

            for(let i=0;i<this.serieNames.length;i++){
                if(this.serieNames[i].$id === this.currSeri.$id){
                    this.serieNames[i].title = this.inputVal;
                    break;
                }
            }

            this.inputVisible = false;
        },

        removeSerie(){
            if(this.currSeri.$currPrd){
                this.$refs.designPanel.$options.playground.delPrd(this.currSeri.$currPrd);
            }

            for(let i=0;i<this.series.length;i++){
                if(this.series[i] === this.currSeri){
                    this.series.splice(i, 1);
                    break;
                }
            }

            for(let i=0;i<this.serieNames.length;i++){
                if(this.serieNames[i].$id === this.currSeri.$id){
                    this.serieNames.splice(i, 1);
                    break;
                }
            }

            this.switchImgList(this.serieNames[0]);
            this.scrollSeries2head();
        },

        resetZoom(zoom){
            this.zoom = zoom;
        },

        changeZoom(zoom){
            this.zoom = zoom;
            this.$refs.designPanel.$options.playground.scaling(zoom);
        },

        // 获取系列中最大的zindex
        maxZindex(){
            let zindex = 0;
            for(let seri of this.series){
                zindex = Math.max(seri.zindex, zindex);
            }
            return zindex;
        },

        // 根据zindex排序序列
        sortSeries(){
            this.series.sort((a, b)=>{
                return a.zindex - b.zindex;
            });

            let zindex = 0;
            for(let seri of this.series){
                seri.zindex = ++zindex;
            }
        },

        /**
         * 滚动系列
         */
        scrollSeries(direction){
            const containerWidth = $(this.$refs.seriesList).width();
            const listWith = $(this.$refs.seriesWrapper).width();

            if(containerWidth > listWith){
                if(this.seriesScroll !== 0){
                    this.seriesScroll = 0;
                    this.wrapSeriesStyles();
                }
                return ;
            }

            this.seriesScroll = this.seriesScroll + direction * 70;
            if(direction > 0 && this.seriesScroll > 0){
                this.seriesScroll = 0;
            }else if(direction < 0 && this.seriesScroll < (containerWidth - listWith)){
                this.seriesScroll = containerWidth - listWith;
            }
            this.wrapSeriesStyles();
        },

        // 右上角的系列标签，滚动到最右边
        scrollSeries2end(){
            const containerWidth = $(this.$refs.seriesList).width();
            const listWith = $(this.$refs.seriesWrapper).width();

            if(containerWidth > listWith){
                if(this.seriesScroll !== 0){
                    this.seriesScroll = 0;
                    this.wrapSeriesStyles();
                }
                return ;
            }

            this.seriesScroll = containerWidth - listWith;
            this.wrapSeriesStyles();
        },

        scrollSeries2head(){
            this.seriesScroll = 0;
            this.wrapSeriesStyles();
        },

        // 包装滚动样式
        wrapSeriesStyles(){
            this.seriesStyles['-webkit-transform'] = this.seriesStyles.transform = `translateX(${this.seriesScroll}px)`;
        },

        /**
         * 切换图片列表
         */
        switchImgList(item){
            if(item.checked){
                return ;
            }

            this.inputVisible = false;
            for(let tmp of this.serieNames){
                if(tmp.checked){
                    tmp.checked = false;
                }
            }
            item.checked = true;

            let seri = null;
            for(let tmp of this.series){
                if(tmp.$id === item.$id){
                    seri = tmp;
                    break;
                }
            }
            this.currSeri = seri;

            this.imgList = [];
            for(let prd of seri.products){
                if(!prd.seq){
                    prd.seq = this.seq++;
                }
            }
            this.imgList = seri.products;
            this.mainSeriChecked = seri.$id === 0;
            this.bgSeriChecked = seri.$id === 1;
        },

        // 重置系列下的产品图片的列表
        resetImgList(){
            this.inputVisible = false;
            this.imgList = [];
            if(this.currSeri){
                for(let prd of this.currSeri.products){
                    if(!prd.seq){
                        prd.seq = this.seq++;
                    }
                    this.imgList.push(prd);
                }
            }
        },

        // 克隆元素
        clone(src, target){
            if(!target){
                target = {};
            }
            for(let p in src){
                target[p] = src[p];
            }

            return target;
        },

        /**
         * 点击了按钮
         */
        btnClick(btn, shiftKey){
            if(btn.event !== false){
                this.$refs.designPanel.$emit('action', btn.id, shiftKey);
            }else{
                this[btn.id] && this[btn.id]();
            }
        },

        /**
         * 修改图上的产品
         */
        changePrd(prd){
            this.$refs.designPanel.$emit('notice', 'changePrd', [this.currSeri, prd]);
        },

        findSeri($id){
            for(let seri of this.series){
                if(seri.$id === $id){
                    return seri;
                }
            }
        },

        // 获取非 $开头的属性
        props(attr){
            const obj = {};
            for(let f in attr){
                if(/^\$/.test(f) || f === 'is_default' || f === 'is_special'){
                    continue;
                }
                obj[f] = attr[f];
            }
            return obj;
        },

        // 删除产品
        delPrd(prd){
            this.$refs.designPanel.$options.playground.delPrd(prd);
            this.resetImgList();
        },

        // 播放
        play(){
            window.open(process.env.URL_PRE + "/#/product/show_design/" + this.$route.params.productId, "_blank");
        },

        // 设置为默认
        toSpe(prd){
            prd.is_special = prd.is_special == '1' ? '0' : '1';
            // 变成不是特殊了，就拷贝一个默认的属性给它
            if(!prd.is_special){
                for(let tmp of prd.$seri.products){
                    if(tmp.is_special != '1'){
                        this.$refs.designPanel.$options.playground.syncPrdByTarget(prd, tmp);
                        break;
                    }
                }
            }

            this.changePrd(prd);
        },

        // 设置隐藏显示
        toVisible(prd){
            prd.is_visible = prd.is_visible != '0' ? '0' : '1';
        },

        // 设置同色
        selectSameBy(prd, color){
            prd.same_by = color.id;
            prd.sameByTxt = color.txt;
        },

        toPre(){
            this.toId(this.product.last_id);
        },

        toNext(){
            this.toId(this.product.next_id);
        },

        toId(id){
            if(this.ajaxing){
                return ;
            }

            if(this.$refs.designPanel.$options.playground.dirty){
                this.save(id + '');
            }else{
                this.$router.replace({ name: '编辑装配', params: { productId: id } })
            }
        },

        reload(){
            this.getMainProduct();
        },

        toList(){
            this.$router.push({ name: '产品系列详细', params: { lineId: this.product.category_id } })
        },

        saveAndBack(){
            this.save(true);
        },

        async save(back, fn){
            if(this.ajaxing){
                return ;
            }

            // 重新按照zindex排序
            this.$refs.designPanel.$options.playground.sort(true);

            // 保证zindex都是连续的
            const zindes = {};
            let zindex = 0;
            for(let seri of this.series){
                if(seri.isBg){
                    continue;
                }

                zindes[seri.$id] = ++zindex;
            }

            const scene = {};

            // 主产品信息
            const mainSeri = this.findSeri(0);
            const mainProduct = [];
            const mainItem = {
                pid : this.$route.params.productId,
                main_zindex : zindes[mainSeri.$id]
            };

            for(let prd of mainSeri.products){
                const prdItem = {
                    pic_id : prd.pic_id,
                    is_default : prd === mainSeri.$currPrd ? '1' : '0',
                    group: '0',
                    attr : []
                };

                for(let attr of prd.attr){
                    prdItem.attr.push(this.props(attr));
                }

                mainProduct.push(prdItem);
            }
            mainItem.main_product = JSON.stringify(mainProduct);
            $.extend(scene, mainItem);


            // 背景和其他系列
            const products = {};

            // 背景信息
            const bgSeri = this.findSeri(1);
            products.bg_info = {id : []};
            for(let bg of bgSeri.products){
                products.bg_info.id.push(bg.id);
            }

            // 其他产品信息
            products.other_product = [];
            for(let seri of this.series){
                if(seri.$id === 0 || seri.$id === 1){
                    continue;
                }

                let item = {
                    title : seri.title,
                    type : seri.type,
                    zindex : zindes[seri.$id],
                    products : []
                };
                products.other_product.push(item);

                for(let prd of seri.products){
                    let prdItem = {
                        id : prd.id,
                        is_default : prd === seri.$currPrd ? '1' : '0',
                        is_special : prd.is_special,
                        is_visible : prd.is_visible,
                        same_by : prd.same_by,
                        attr : []
                    };
                    item.products.push(prdItem);

                    for(let attr of prd.attr){
                        prdItem.attr.push(this.props(attr));
                    }
                }
            }


            scene.products = JSON.stringify(products);
            if(!scene.main_product){
                this.$Message.warning('请选择主产品颜色');
                return ;
            }

            this.ajaxing = true;
            let { data } = await this.http("/productApi/sceneModify", {
                data: scene,
                method: "POST"
            });
            this.ajaxing = false;
            if(data.code){
                this.$Message.info(data.msg.zh);
            }else{
                this.$Message.success(data.msg.zh);
                if(back === true){
                    this.$router.go(-1);
                }else if(typeof back === 'string'){
                    this.$router.replace({ name: '编辑装配', params: { productId: back } });
                }
            }
        }
    }
};

export default Component;
