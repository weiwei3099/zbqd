const mixinsProduct = {
    data(){
        return {
            prdCreateWinVisible : false,
            pic_category : null,
            prdList : [],
            categorys : [],
            currCategory : null,
            page : 1,
            pageSize : 10,
            paginate : {
                cur_page: 1,
                total_page: 0,
                total_record: 0
            }
        };
    },

    methods: {
        showPrdCreateWin(){
            this.prdCreateWinVisible = true;

            if(this.currSeri.$id === 0){
                this.categorys = [{
                    text : '产品图片',
                    type : 1,
                    categorys : []
                }];
            }else if(this.currSeri.$id === 1){
                this.categorys = [{
                    text : '背景图片',
                    type : 2,
                    categorys : []
                }];
            }else{
                this.categorys = [{
                    text : '产品图片',
                    type : 1,
                    categorys : []
                },{
                    text : '默认图片',
                    type : 3,
                    categorys : []
                }];
            }

            this.page = 1;

            let count = 0;
            for(let category of this.categorys){
                this.loadPicCategorys(category, category.categorys);
                count++;
                if(count === this.categorys.length){
                    this.$nextTick(()=>{
                        for(let cmp of this.$refs.collapse){
                            cmp.toggle();
                        }
                    });
                }
            }
        },

        hidePrdCreateWin(){
            this.prdCreateWinVisible = false;
            this.categorys = [];
            this.currCategory = null;
            this.prdList = [];
            this.page = 1;
        },

        addPrd(){
            const prds = [];
            for(let prd of this.prdList){
                if(prd.checked){
                    prds.push(prd);
                }
            }
            if(prds.length === 0){
                this.$Message.warning('请选择产品图片');
                return ;
            }

            // 默认产品
            let defaultPrd = null;
            for(let tmp of this.currSeri.products){
                if(tmp.is_default == '1'){
                    defaultPrd = tmp;
                    break;
                }
            }

            // 添加产品
            for(let prd of prds){
                let same = false;
                for(let tmp of this.currSeri.products){
                    if(tmp.id === prd.id){
                        same = true;
                        break;
                    }
                }

                if(same){
                    continue;
                }

                const prdObj = {
                    $seri : this.currSeri,
                    id: prd.id,
                    url: prd.url,
                    selected: false,
                    isOthers: true,
                    same_by: '',
                    sameByTxt: '',
                    is_visible: '1',
                    is_default: '0',
                    is_special : '0',
                    width : Number(prd.width),
                    height : Number(prd.height),
                    category_id : this.currCategory.id,
                    attr : []
                };

                // 从默认的那张中拷贝属性
                if(defaultPrd){
                    for(let attr of defaultPrd.attr){
                        const attrCloned = {
                            $prd : prdObj
                        };
                        for(let f in attr){
                            if(/$\$/.test(f)){
                                continue;
                            }

                            attrCloned[f] = attr[f];
                        }

                        prdObj.attr.push(attrCloned);
                    }
                }else{
                    prdObj.attr.push({$prd: prdObj, x:0, y:0, width:Number(prd.width), height:Number(prd.height)});
                }

                this.currSeri.products.push(prdObj);
            }
            this.hidePrdCreateWin();
            this.resetImgList();
        },

        prdClick(item){
            for(let categroup of this.categorys){
                for(let cate of categroup.categorys){
                    cate.checked = false;
                }
            }
            item.checked = true;
            this.currCategory = item;
            this.loadPrds(1);
        },

        pageSizeChange(size){
            this.pageSize = size;
            this.loadPrds(1);
        },

        toPage(num){
            this.loadPrds(num);
        },

        async loadPrds(page){
            if(page !== undefined){
                this.page = page;
            }
            let { data } = await this.http("/picApi/getPicList", {
                data: {
                    pic_category_id: this.currCategory.id,
                    cur_page : this.page,
                    page_size : this.pageSize
                },
                method: "POST"
            });

            this.prdList = [];
            for(let f in data.result.paginate){
                data.result.paginate[f] = Number(data.result.paginate[f]);
            }
            this.paginate = data.result.paginate;
            for(let item of data.result.pics){
                item.checked = false;
                this.prdList.push(item);
            }
        },

        selectPrd(prd){
            prd.checked = !prd.checked;
        },

        selectAllPrd(){
            for(let prd of this.prdList){
                prd.checked = true;
            }
        },

        async loadPicCategorys(category, categorys){
            let toggled = false;
            let { data } = await this.http("/picApi/getPicCategory", {
                data: {
                    page_size: 99999,
                    type: category.type
                },
                method: "POST"
            });

            if(data.result.data){
                for(let item of data.result.data){
                    item.checked = false;
                    categorys.push(item);
                }
            }
        }
    }
};

export default mixinsProduct;
