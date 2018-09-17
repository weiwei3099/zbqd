import SVG from "svg.js";
import panzoom from 'svg.panzoom.js';

export default {
    data(){
        return {
            series : [],
            seq : 0,
            zoom : 1,
            // 左边按钮条
            lbar : [
                {id : 'zoomout', name : '放大(z)', icon : 'icon-zoom-out'},
                {id : 'zoomin', name : '缩小(x)', icon : 'icon-zoom-in'},
            ],

            keys : [
                {code : 90, ctrlKey : false, fn : 'zoomin'},
                {code : 88, ctrlKey : false, fn : 'zoomout'}
            ],

            // 用于右上角的系列李彪
            serieNames : [
                {$id : 0, title: '产品颜色', checked: false},
                {$id : 1, title: '背景系列', checked: false},
            ],

            currSeri : null,
            seriesScroll : 0,
            seriesStyles : {
                transform : 'translateX(0)',
                '-webkit-transform' : 'translateX(0)',
            },
            // 图片列表
            imgList : [],

            bgSeri : null,
            mainSeri: null
        };
    },

    mounted(){
        this.$canvas = $(this.$refs.canvas);
        this.draw = SVG(this.$refs.canvas);
        this.draw.panZoom({zoomMin: 0.25, zoomMax: 10});
        this.getMainProduct();
    },

    beforeDestroy(){
        $(window).off('keydown');
        if(this.timer){
            clearInterval(this.timer)
        }
        document.oncontextmenu = null;
    },

    methods: {
        /**
         * 加载主产品信息
         */
        async getMainProduct() {
            const id = this.$route.params.id;
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
            const id = this.$route.params.id;
            let { data } = await this.http("/productApi/getSceneInfo", {
                data: {
                    main_product: id
                },
                method: "POST"
            });

            this.initScene(product, data.result.scene);
        },

        // 初始化场景
        initScene(product, scene){
            this.product = product;
            this.scene = scene;
            // 主产品颜色
            const mainSeri = {$id : this.seq++, $currPrd : null, title : '产品颜色', zindex : scene.zindex, checked : false, products : [], isMain: true};
            let defaultMainPrd = null;
            const exsitsPrds = {};
            for(let prd of scene.products){
                prd.selected = false;
                prd.$seri = mainSeri;
                prd.isMainProduct = true;
                prd.id = prd.pic_id;
                prd.hidden = false;
                prd.is_default = prd.is_default === undefined ? '1' : prd.is_default;
                prd.is_special = prd.is_special === undefined ? '0' : prd.is_special;

                for(let color of product.attr){
                    if(prd.id === color.id){
                        prd.pic_title = color.pic_title;
                        prd.price = color.price;
                        break;
                    }
                }

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
            this.mainSeri = mainSeri;
            this.series.push(mainSeri);

            // 背景
            const bgSeri = {$id : this.seq++, $currPrd : null, title : '背景系列', zindex : -1, checked : false, products : [], isBg : true};
            for(let prd of scene.bg_info){
                prd.attr = [{
                    x : 0,
                    y : 0,
                    width : 1024,
                    height : 768
                }];
                bgSeri.products.push(prd);
            }
            this.series.push(bgSeri);
            this.findDefaultPrd(bgSeri);
            this.bgSeri = bgSeri;

            // 其他的系列
            for(let seri of scene.other_product){
                seri.$id = this.seq++;
                for(let prd of seri.products){
                    if(prd.is_default === '1'){
                        seri.$currPrd = prd;
                        break;
                    }
                }
                if(!seri.$currPrd){
                    seri.$currPrd = seri.products[0];
                }
                this.series.push(seri);
                this.serieNames.push({
                    $id : seri.$id,
                    title : seri.title,
                    checked : false
                });
            }

            this.sortSeries();
            this.changeVisble();
            this.renderSVG();
            this.initEvent();
            this.switchImgList(this.serieNames[0]);
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

        initEvent(){
            // 初始化键盘事件监听
            $(window).on('keydown', (evt)=>{
                for(let key of this.keys){
                    if(evt.keyCode === key.code && evt.ctrlKey === key.ctrlKey){
                        for(let btn of this.lbar){
                            if(btn.id === key.fn){
                                this.btnClick(btn);
                                event.preventDefault();
                                return;
                            }
                        }
                        return ;
                    }
                }
            });

            document.oncontextmenu = function(){
                return false;
            };
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

        // 包装滚动样式
        wrapSeriesStyles(){
            this.seriesStyles['-webkit-transform'] = this.seriesStyles.transform = `translateX(${this.seriesScroll}px)`;
        },

        // 渲染
        renderSVG(){
            this.draw.clear();

            // 画背景图片
            const bgSeri = this.bgSeri;
            this.drawimg(this.draw, bgSeri.$currPrd, bgSeri.$currPrd.attr[0]);

            // 画门
            const group = this.draw.nested();
            for(let seri of this.series){
                if(seri.isBg){
                    bgPrd = seri.$currPrd;
                    continue;
                }

                const prd = seri.$currPrd;
                if(!prd || !prd.attr){
                    continue;
                }

                for(let img of prd.attr){
                    this.drawimg(group, prd, img)
                }
            }

            let bgPrd = bgSeri.$currPrd;

            group.size(bgPrd.show_attr.width, bgPrd.show_attr.height)
            group.move(bgPrd.show_attr.x, bgPrd.show_attr.y);

            const rectRadio = bgPrd.show_attr.height/bgPrd.show_attr.width;
            const bbox = group.bbox();
            const ratioHeight = bbox.width * rectRadio;
            bbox.height = ratioHeight;

            group.viewbox(bbox);

            // 画遮挡
            if(bgPrd.parts){
                for(let part of bgPrd.parts){
                    for(let img of part.attr){
                        this.drawimg(this.draw, part, img);
                    }
                }
            }
        },

        // 根据zindex排序序列
        sortSeries(){
            this.series.sort((a, b)=>{
                return a.zindex - b.zindex;
            });
        },

        drawimg(draw, prd, attr){
            const img = draw.image(this.server + prd.url, attr.width, attr.height);
            if(attr.matrix){
                const matrix = new SVG.Matrix(attr.matrix);
                img.transform(matrix);
            }
            img.move(attr.x, attr.y);
            return img;
        },

        findDefaultPrd(seri){
            for(let prd of seri.products){
                if(prd.is_default == '1'){
                    seri.$currPrd = prd;
                    break;
                }
            }
            if(!seri.$currPrd){
                seri.$currPrd = seri.products[0];
            }
        },

        scaling(val, p){
            if(val < 0.25){
                val = 0.25;
            }else if(val > 10){
                val = 10;
            }
            this.zoom = val;
            this.drawer.zoom(this.zoom, p);
        },

        /**
         * 获取容器的大小
         * @return {Object}
         */
        containerSize(){
            return {
                width : this.$canvas.width(),
                height : this.$canvas.height(),
            };
        },

        /**
         * 切换图片列表
         */
        switchImgList(item){
            if(item.checked){
                return ;
            }

            const mainId = this.mainSeri.$currPrd.id;

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
                prd.hidden = prd.is_visible == '0' && prd.same_by !== mainId; // 隐藏
                if(!prd.seq){
                    prd.seq = this.seq++;
                }
            }
            this.imgList = seri.products;
        },

        changePrd(prd){
            if(this.currSeri.$currPrd === prd){
                return ;
            }

            this.currSeri.$currPrd = prd;
            if(prd.isMainProduct){
                this.changeVisble();
            }
            this.renderSVG();
        },

        // changeVisble
        changeVisble(){
            const mainId = this.mainSeri.$currPrd.id;

            for(let serie of this.series){
                if(serie.isMain || serie.isBg){
                    continue;
                }

                // 这个系列下没有东西， 继续
                let curr = serie.$currPrd;
                if(!curr){
                    continue;
                }

                // 现在已经是同色的了，继续
                if(curr.same_by === mainId){
                    continue;
                }

                let found = false;
                for(let prd of serie.products){
                    if(prd.same_by === mainId){
                        found = true;
                        serie.$currPrd = prd;
                        break;
                    }
                }

                if(!found){
                    serie.$currPrd = serie.products[0];
                }
            }
        },

        btnClick(btn){
            switch (btn.id) {
                case 'zoomin':
                    this.scaling(this.zoom - 0.25);
                    break;
                case 'zoomout':
                    this.scaling(this.zoom + 0.25);
                    break;
                default:

            }
        },

        back(){
            window.close();
        }
    }
};
