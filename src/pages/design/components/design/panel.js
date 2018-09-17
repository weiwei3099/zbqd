
import Playground from './playground';

const Component = {
    playground : null,
    data(){
        return {};
    },

    mounted(){
		
        this.$on('action', (evtId, shiftKey)=>{
			
		
            this.$options.playground[evtId] && this.$options.playground[evtId](shiftKey);
        });

        this.$on('notice', (name, args)=>{
            this.$options.playground[name] && this.$options.playground[name].apply(this.$options.playground, args);
        });
    },

    methods: {
        // 初始化
        init(product, scene, series){
            if(this.$options.playground){
                $(this.$refs.panel).children().remove();
            }
            this.$options.playground = new Playground(this.$refs.panel, this.server);
            this.$options.playground.init(product, scene, series, this);
        },

        getSceneInfo(){
            const scene = {};
            const playground = this.$options.playground;

            // 主产品信息
            const mainPrdGroup = playground.findGroup('$id', 0);
            const mainPrdEl = mainPrdGroup.els[0];
            if(mainPrdEl){
                $.extend(scene, {
                    main_product : mainPrdGroup.prdid,
                    main_zindex : mainPrdGroup.zindex,
                    main_attr : {
                        self : $.extend({}, mainPrdEl.attr),
                        zoon : $.extend({}, playground.scene.main_attr.zone),
                    }
                });
            }
            const products = {};

            // 背景信息
            products.bg_info = {id : []};
            for(let bg of playground.scene.bg_info){
                products.bg_info.id.push(bg.id);
            }

            // 其他产品信息
            products.other_product = [];
            for(let seri of playground.scene.other_product){
                let group = playground.findGroup('$id', seri.$id);
                let item = {
                    title : seri.title,
                    type : seri.type,
                    zindex : group.zindex,
                    products : []
                };
                products.other_product.push(item);

                for(let prd of seri.products){
                    let prdItem = {
                        id : prd.id,
                        is_default : prd.is_default,
                        is_special : prd.is_special,
                        attr : []
                    };
                    item.products.push(prdItem);

                    for(let attr of prd.attr){
                        prdItem.attr.push($.extend({}, attr));
                    }
                }
            }

            scene.products = JSON.stringify(products);
            return scene;
        }
    }
};

export default Component;
