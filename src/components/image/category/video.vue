<template>
<div style="padding-left: 15px;">
	<div v-for="(line1, i) in lines" v-menu-children :key="i" :class="{xactive: line1.id === $route.query.cid}">
		<item :item="line1" @del-product-category="delProductCategory"></item>
	</div>
	<Input class="shadow" v-show="add" size="small" @on-enter="addNewLine" v-model="value" placeholder="请输入系列"></Input>
</div>
</template>

<script>
import item from './video-item'
export default {
	props: {
		add: false
	},
	data() {
		return {
			lines: '',
			value: ''
		}
	},
	components: {
		item
	},
	methods: {
		async delProductCategory() {

		},
		async addNewLine() {
            if(!this.value){
                return ;
            }
			let {data} = await this.http('/videoApi/addGalleryCategory', {
				data: {
					title: this.value,
				},
				method: 'POST'
			});

			if (!data.code) {
				this.$Modal.remove();
				this.$bus.emit('addedNewVideoLine')
				this.value = ''
				this.getList()
			}
			this.$Message.info(data.msg.zh);
		},
		async getList() {
			let {
				data
			} = await this.http('/videoApi/getGalleryCategory', {
				data: {
					parent_id: 0,
					page_size: 1000
				},
				method: 'POST'
			})
			this.lines = data.result.data
			// this.series0 = data.result.productCats.filter((item) => {
			//   return item.is_sell == '0'
			// })
			// this.series1 = data.result.productCats.filter((item) => {
			//   return item.is_sell == '1'
			// })
			// let { data: data3 } = await this.http('/productApi/getFullSceneCat', {
			//   method: 'GET'
			// })
			// this.series3 = data3.result.data

			// let { data: data4 } = await this.http('/picApi/factoryAlbumList', {
			//   method: 'GET'
			// })
			// this.series4 = data4.result.albums
			//console.log(line1)
			// console.log(this.items.find(function (x) {
			//   return x.id === '1'
			// }))
		}
	},
	created() {
		this.getList()
		this.$bus.on('getProductLines', () => {
			this.getList()
		})
	}
}
</script>

<style scoped>
.menu-children {
	display: none;
}

.shadow {
	box-shadow: 2px 5px 5px #EEEEEE;
}
</style>
<style>
.xactive .overtext{
	color:#008eea;
}
</style>
