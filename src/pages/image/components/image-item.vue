<template>
<li class="cursor" @click="select">
	<div class="box-mask flex center" v-if="selected">
		<div>
			<img class="share-wechat" :data-id="item.id" src="/static/icon/Symbol 37 – 1@3x.png" width="50" alt="">
		</div>
	</div>
	<div class="img-box" :style="'background-image:url(' + server + item.url +')'"></div>
	<div class="flex space-between p-t-10">
		<span>{{item.pic_title}}</span>
		<div>
			<span class="cursor sbtn" @click.stop="showEdit()">
            <Icon type="edit" size="14"></Icon>
          </span>
			<span class="cursor" @click.stop="delPic(item.id)">
            <Icon type="ios-trash" size="14"></Icon>
          </span>
		</div>

	</div>

	<Modal v-model="editForm.visible" width="600" @on-ok="saveTitle">
		<p slot="header" style="color:#2d8cf0; text-align:center">
			<Icon type="compose"></Icon>
			<span>修改名称</span>
		</p>
		<div style="padding-right: 20px;">
			<Form ref="editForm" :model="editForm.form" :rules="editForm.rules" :label-width="80">
				<Form-item label="名称" prop="title">
					<Input v-model="editForm.form.title" placeholder="名称" @on-enter="saveTitle"></Input>
				</Form-item>
			</Form>
		</div>
	</Modal>
</li>
</template>

<script>
export default {
	props: {
		item: "",
		type: ""
	},
	data: function() {
		return {
			status: "",
			selected: false,
			editForm: {
				visible: false,
				form: {
					id: '',
					title: ''
				},
				rules: {
					title: [{
						required: true,
						message: '名称不能为空',
						trigger: 'blur'
					}]
				}
			},
		};
	},
	methods: {
        showEdit(){
            this.editForm.form.id = this.item.id;
            this.editForm.form.title = this.item.pic_title;
            this.editForm.visible = true;
        },

        saveTitle(){
            const form = {
				id: this.editForm.form.id,
				pic_title: this.editForm.form.title
			};
			this.$refs['editForm'].validate(async(valid) => {
				if (valid) {
					let {
						data
					} = await this.http('/picApi/modifyPicTitle', {
						data: form,
						method: 'POST'
					})
					this.$Message.success(data.msg.zh);
					if (!data.code) {
                        this.item.pic_title = form.pic_title;
					}
                    this.editForm.visible = false;
				} else {
					this.$Message.error('表单验证失败!');
				}
			})
        },

		delPic(id) {
			this.$emit("del", id);
		},
		select() {
			if (this.status === "select") {
				this.selected = !this.selected;
				if (this.selected) {
					this.$store.commit("IMAGE_ADD", this.item);
				} else {
					this.$store.commit("IMAGE_REMOVE", this.item);
				}
			} else {
				this.$store.commit('IMAGE_DETAIL', this.item)
				if (this.type == "background") {
					this.$router.push({
						name: "背景图库",
						query: {
							id: this.item.id,
							page: 'back-detail'
						}
					});
				} else if (this.type == "360") {
					this.$router.push({
						name: "360图库详情",
						query: {
							id: this.item.id,
							page: '360-detail'
						}
					});
					// } else if (this.type == "product") {
				} else {
					this.$router.push({
						name: "产品图库详情",
						query: {
							id: this.item.id,
							page: 'pro-detail',
							type: this.$route.query.type
						}
					});
				}
			}
		},
		changeStatus() {
			this.status = this.$route.params.status;
		}
	},
	created() {
		this.status = this.$route.params.status;
		this.$bus.on("clearImageSelect", aa => {
			this.selected = false;
		});
	},
	watch: {
		'$route': 'changeStatus'
	}
};
</script>

<style scoped>
.sbtn {
	margin-right: 5px;
}
</style>
