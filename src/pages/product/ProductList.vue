<template>
<div>
    <!--产品首页-->
	<div v-if="!$route.params.lineId">
        <div class="flex sum-list">
            <div class="sum-wrapper" v-for="(cate, index) in cates">
                <div class="sum" :style="{height: height + 'px'}"  @click="toSeri(cate)">
                    <img :src="server + cate.img_url" v-if="cate.img_url"/>
                    <span class="sum-title">{{cate.title}}</span>
                </div>
            </div>
        </div>
	</div>

    <!--子系列产品列表-->
	<ul class="product-list product-list-sortable flex" v-else="$route.params.lineId">
		<item :item="item" v-for="(item, index) in items.product" :key="index"></item>
		<li class="flex center cursor" @click="goSelect()" v-if="$store.state.product.line_id">
			<div>
				<Icon type="plus" size="32"></Icon>
			</div>
		</li>
	</ul>
	<div style="position: fixed; bottom: 20px; right: 300px;"  v-if="$route.params.lineId">
		<Page :total="items.paginate.total_record" @on-page-size-change="pageSizeChange" show-total placement="top" :page-size="items.paginate.page_size" :page-size-opts="[10, 20, 30, 40]" @on-change="getPage" :current="items.paginate.cur_page" size="small" show-elevator
		    show-sizer></Page>
	</div>
</div>
</template>

<script>
import Item from '@/components/product/item'
export default {
	data: function() {
		return {
			items: {
				product: [],
				paginate: {
					cur_page: 1,
					page_size: 40
				}
			},
            cates: [],
            height: 0,
			products: {

			}
		}
	},
	components: {
		Item
	},
	methods: {
		goSelect() {
			this.$store.commit('IMAGE_CLEAR')
			this.go({
				path: '/image/list/select?from=product'
			})
		},
		pageSizeChange(size) {
			this.items.paginate.cur_page = 1
			this.items.paginate.page_size = size
			this.getProductList()
		},
		getPage(p) {
			this.items.paginate.cur_page = p
			this.getProductList()
		},
		format(d) {
			this.products = {}
			if (d.length) {
				for (let product of d) {
					if (!this.products['c' + product.category_id]) {
						this.products['c' + product.category_id] = {
							category_id: product.category_id,
							category: product.category_title,
							items: [product]
						}
					} else {
						this.products['c' + product.category_id]['items'].push(product)
					}
				}
			}
		},
		async getProductList() {
			const id = this.$route.params.lineId
            if(!id){
                return ;
            }
			let {
				data
			} = await this.http('/productApi/getProductCatInfo', {
				data: {
					id: id,
					cur_page: this.items.paginate.cur_page,
					page_size: this.items.paginate.page_size
				},
				method: 'POST'
			})
			data.result.paginate.cur_page = parseInt(data.result.paginate.cur_page)
			data.result.paginate.page_size = this.items.paginate.page_size
			for (let item of data.result.product) {
				item.skip = 1;
			}
			this.items = data.result

			if (!id) {
				this.format(this.items.product)
			}
		},

        refreshHeight(){
            const width = $(this.$el).width()/2 - 20;
            this.height = width / 3 * 2;
        },

        toSeri(cate){
            if(cate.children && cate.children.length > 0){
                const id = cate.children[0].id;
                this.$router.push({
                    name: '产品系列详细', params: { lineId: id, cate:  cate.id}
                })
            }
        }
	},
    mounted(){
        this.$bus.on('cates', (cates)=>{
            this.cates = cates;
        });
        this.refreshHeight();
    },

    destroyed(){
        this.$bus.off('cates');
    },
	created() {
		this.getProductList()
	},
	watch: {
		'$route': 'getProductList'
	}
}
</script>

<style scoped>
.product-list-sortable li {
	height: 280px!important;
}
</style>
<style scoped>
.sum-list{
    flex-wrap:wrap;
}

.sum-wrapper{
    width:50%;
    padding:10px;
}

.sum{
    background-color:#b7b7b7;
    position:relative;
    cursor:pointer;
}

.sum, .sum img{
    width:100%;
    height:100%;
    border-radius:6px;
}

.sum-title{
    position:absolute;
    left:0px;
    top:0px;
    display:inline-block;
    font-size:14px;
    color:#fff;
    margin:10px;
}
</style>
