export default {
	data() {
		return {
			lastCates: null,
			cates: [],
			seq: 0,
            prdList : [],
            currCategory : null,
            page : 1,
            pageSize : 10,
            paginate : {
                cur_page: 1,
                total_page: 0,
                total_record: 0
            }
		}
	},

	methods: {
		init(cates) {
            this.resetCates(cates);
		},

        // 重置分类列表
		resetCates(cates) {
			if (JSON.stringify(cates) === this.lastCates) {
				return;
			}
			this.lastCates = JSON.stringify(cates);
			this.cates = cates.map((item) => {
				return {
					title: item.title,
					$id: this.seq++,
					type: item.type,
					isFull: item.isFull,
                    expand : false,
                    lv2 : []
				}
			});

            for(let cate of this.cates){
                this.loadCate(cate);
            }
		},

        // 加载分类
		async loadCate(cate) {

            const path = cate.isFull ? '/productApi/getFullScenePicCat' : '/picApi/getPicCategory';

			let {data} = await this.http(path, {
				data: {
					type: cate.type,
					page_size: 9999,
				},
				method: 'POST'
			});

            const lv2cates = data.result.data;
            cate.lv2 = lv2cates || [];
            if(cate.lv2.length > 0){
                cate.expand = true;
            }
		},

        changeSeri(seri){
            if(this.currCategory && this.currCategory !== seri){
                this.currCategory.checked = false;
            }
            seri.checked = true;
            this.currCategory = seri;
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
					show_type: 1,
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

        addPrd(){
            const checkeds = this.prdList.filter((item)=>{
                return item.checked;
            });
            this.$emit('finish', checkeds);
        },

        hide(){
            this.$emit('hide');
        }
	}
};
