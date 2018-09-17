<template>
<i-page>
	<div slot="header-handler">
		<a @click="add360Product" v-if="$route.query.from=='360'">保存</a>
		<a @click="addDesign" v-if="$route.query.from=='design'">选择返回</a>
	</div>
	<div style="height: 100%; margin: -5px;" slot="page-content">
		<router-view></router-view>
	</div>

	<div class="page-aside" slot="page-aside">
		<div class="aside line-collapse collapse">
			<div class="cursor flex center" @click="open" style="height: 50px; border-bottom: solid 2px #f2f2f2;">
				显示全部
			</div>
			<Collapse @on-change="changeImagePanel" :style="'height: ' + asideOverflow +'px; overflow: auto;'">
				<Panel ref="col2" name="2">
					<span class="line-title-bar">
              <span style="width:170px; display:inline-block">
                产品图片
              </span>
					<span class="btn" @click.stop="showAddInput('AddProductLine')">
                <Icon type="plus" size="8"></Icon>
              </span>
					</span>
					<category-product :add="AddProductLine" slot="content"></category-product>
				</Panel>
				<Panel ref="col1" name="1" v-if="$route.query.from!='product'">
					<span class="line-title-bar">
              <span style="width:170px; display:inline-block">
                背景图片
              </span>
					<span class="btn" @click.stop="showAddInput('AddBackgroundLine')">
                <Icon type="plus" size="8"></Icon>
              </span>
					</span>
					<category-background :add="AddBackgroundLine" slot="content"></category-background>
				</Panel>
				<Panel ref="col3" name="3" v-if="$route.query.from!='product'">
					<span class="line-title-bar">
              <span style="width:170px; display:inline-block">
                360图片
              </span>
					<span class="btn" @click.stop="showAddInput('Add360Line')">
                <Icon type="plus" size="8"></Icon>
              </span>
					</span>
					<category-360 :add="Add360Line" slot="content"></category-360>
				</Panel>
				<Panel ref="col4" name="4" v-if="$route.query.from!='product'">
					<span class="line-title-bar">
              <span style="width:170px; display:inline-block">
                默认图片
              </span>
					<span class="btn" @click.stop="showAddInput('AddDefaultLine')">
                <Icon type="plus" size="8"></Icon>
              </span>
					</span>
					<category-default :add="AddDefaultLine" slot="content"></category-default>
				</Panel>
				<Panel ref="col5" name="5" v-if="$route.query.from!='product'">
					<span class="line-title-bar">
              <span style="width:170px; display:inline-block">
                视频素材
              </span>
					<span class="btn" @click.stop="showAddInput('AddVideoLine')">
                <Icon type="plus" size="8"></Icon>
              </span>
					</span>
					<category-video :add="AddVideoLine" slot="content"></category-video>
				</Panel>
			</Collapse>
		</div>
		<div v-if="type==='video' && $route.name == '图库列表' && status != 'select'">
			<Upload :on-success="videoUploaded" :before-upload="handleUpload" :on-progress="updateProgress" :show-upload-list="false" :data="form" name="fileData" :action="api+ '/videoApi/addVideoGallery'" multiple type="drag" accept="video/*">
				<div style="padding: 20px 0">
					<Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
					<p>点击上传视频</p>
				</div>
			</Upload>
		</div>
		<div v-else-if="type!='360' && $route.name == '图库列表' && status != 'select'">
			<Upload :on-success="uploadProduct" :before-upload="handleUpload" :on-progress="updateProgress" :show-upload-list="false" :data="form" name="fileData" :action="api+ '/picApi/addPic'" multiple type="drag">
				<div style="padding: 20px 0">
					<Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
					<p>点击或将文件拖拽到这里上传</p>
				</div>
			</Upload>
		</div>

		<div v-if="type=='360' && $route.name == '图库列表'" class="upload-360-pic cursor ivu-upload-drag" style="padding: 20px 0; text-align:center; cursor: pointer;">
			<input class="cursor" ref="file" type="file" name="pic[]" @change="upload360Pic" multiple="multiple">
			<Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
			<p>上传360图片</p>
		</div>

		<div class="img-info-box" v-if="status == 'select'" style="padding: 20px 0 25px 0;">
			<Row type="flex" justify="space-around">
				<Col>
				<Button type="primary" @click="addProduct(true)">添加</Button>
				</Col>
				<Col>
				<Button type="primary" @click="addProduct">确定</Button>
				</Col>
				<Col>
				<Button @click="selectAllProduct">全选</Button>
				</Col>
				<Col>
				<Button @click="cancelAllProduct">取消</Button>
				</Col>
			</Row>
		</div>
		<div v-if="videoThumb.visible">
			<videoThumb v-model="videoThumb.visible" :video="videoThumb.video"></videoThumb>
		</div>
        <xprogress v-model="progress.visible" :files="progress.files" ref="progress" @ok="progressFinish"></xprogress>
	</div>

</i-page>
</template>

<script>
import CategoryProduct from "../../components/image/category/product";
import CategoryBackground from "../../components/image/category/background";
import CategoryDefault from "../../components/image/category/default";
import CategoryVideo from "../../components/image/category/video";
import Category360 from "../../components/image/category/360";
import ImageList from "./components/image-list";
import Background from "./Background";
import List360 from "./components/list-360";
import videoThumb from "./components/videoThumb";
import axios from "axios";
import xprogress from './progress'

export default {
	data() {
		return {
			progress: {
				visible: false,
                files: []
			},
			page: '',
			fileList: [],
			form: {
				userToken: this.$store.state.user.userInfo.userToken,
				pic_category_id: 0,
				price: 0,
				cid: 0
			},
			form360: {
				userToken: this.$store.state.user.userInfo.userToken,
				cid: 0
			},
			status: "",
			show: 1,
			selectLineName: "",
			AddProductLine: false,
			AddBackgroundLine: false,
			Add360Line: false,
			AddDefaultLine: false,
			AddVideoLine: false,
			pageType: "",
			file: "",
			uploadBackground: false,
			backgroundImg: "",
			type: "",
			file_count: 0,
			asideOverflow: $(window).height - 160,
			allSelected: 0,
			videoThumb: {
				visible: false,
				video: null
			}
		};
	},
	components: {
		CategoryProduct,
		CategoryBackground,
		CategoryDefault,
		CategoryVideo,
		Category360,
		ImageList,
		Background,
		List360,
		videoThumb,
        xprogress
	},

	mounted(){
		$(document).on('keydown', (event)=>{
			if(event.keyCode == 13){
				this.addProduct();
			}
		});
	},

	beforeDestroy(){
		$(document).off('keydown');
	},

	methods: {
        // 进度完成
        progressFinish(){
            this.progress.files = [];
        },

        // 展示进度条
        showProgress(file){
            this.progress.files.push({
                name: file.name,
                pro: 0
            });

            this.progress.visible = true;
        },

        // 更新进度条
        updateProgress(event, file){
            this.$refs.progress.update(file, event.percent);
        },

		selectAllProduct() {
			//if (!this.allSelected) {
			this.$bus.emit('SelectAllProduct')
			//  this.allSelected = 1
			//}
		},
		cancelAllProduct() {
			this.go({
				name: '产品系列'
			})
		},
		async add360Product() {
			let image = {}
			for (let img of this.$store.state.images.img_for_360_product.values()) {
				image = img
			}
			let {
				data
			} = await this.http('/productApi/addFullSceneProduct', {
				data: {
					cid: this.$route.query.cid,
					pp_id: image.id
				},
				method: 'POST'
			})
			this.$router.push({
				name: "360列表"
			});
		},
		async upload360Pic() {
			let param = new FormData();

            const names = [];
			for (let f of this.$refs.file.files) {
                names.push(f.name);
				param.append("pic[]", f);
			}
            const file = {
                name: names.join(',')
            }

			param.append("userToken", this.$store.state.user.userInfo.userToken);
			param.append("cid", this.form360.cid);

            this.showProgress(file);
			let {data} = await axios.post("/productApi/addFullScenePicProduct", param, {
					headers: {
						"Content-Type": "multipart/form-data"
					},

                    onUploadProgress: progressEvent => {
                        this.updateProgress(progressEvent, file);
                    }
				}
			);
			this.$refs.progress.finish(file);
			this.$bus.emit('GET_IMAGE_360', this.form360.cid)
			this.productList = data.result.pics;

			if(data.code){
				this.$Message.error(data.msg.zh);
			}else{
				this.$Message.success(data.msg.zh);
			}
		},
		handleUpload(file) {
            this.showProgress(file);
			if (this.AddBackgroundLine) {
				const that = this;
				const reader = new FileReader();
				this.file = file;
				reader.readAsDataURL(file);
				reader.onload = function(e) {
					that.uploadBackground = true;
					that.backgroundImg = this.result;
					console.log(this.result); //就是base64
				};
				return false;
			}
		},
		open() {
			this.$refs.col1.toggle();
			this.$refs.col2.toggle();
			this.$refs.col3.toggle();
			this.$refs.col4.toggle();
			this.$refs.col5.toggle();
		},
		showAddInput(type) {
			this[type] = true;
		},
		changeImagePanel() {},
		uploadProduct(response, file, fileList) {
			// console.log('response', response);
			// console.log('file', file);
			// console.log('fileList', fileList);
			// console.log(this.file_count, fileList.length)
			if (this.$refs.progress.finish(file)){
				this.$bus.emit('GET_IMAGE_LIST', {
					id: this.form.pic_category_id,
					type: this.type
				})
				// window.location.reload()
			}

			if(response.code){
				this.$Message.error(response.msg.zh);
			}else{
				this.$Message.success(response.msg.zh);
			}
			// this.$refs.productList.getProductList();
		},
		videoUploaded(response, file, fileList) {
			if (this.$refs.progress.finish(file)){
				this.$bus.emit('GET_IMAGE_LIST', {
					id: this.form.pic_category_id,
					type: this.type
				})
				// window.location.reload()
			}

			if(response.code){
				this.$Message.error(response.msg.zh);
			}else{
				this.$Message.success(response.msg.zh);
			}

		},
		async addProduct(isContinue) {
			let pic = [];
			for (let p of this.$store.state.images.selection) {
				pic.push(p.id);
			}
			const title = Array.from(this.$store.state.images.selection)[0].pic_title
			var attr = [{
				pic: pic,
				title: "默认产品"
			}];
			let {
				data
			} = await this.http("/productApi/productNew", {
				data: {
					category_id: this.$store.state.product.line_id,
					title,
					price: "0",
					pic_id: pic
				},
				method: "POST"
			});
			if (isContinue !== true) {
				this.$router.push({
					name: "产品系列"
				});
			} else {
				this.$store.state.images.selection.clear();
				this.$bus.emit('GET_IMAGE_LIST', {
					id: this.form.pic_category_id,
					type: this.type
				})
			}
		},
		addDesign() {
			this.$bus.emit("designSelectImage", {
				lineId: this.form.pc_id,
				pics: this.$store.state.images.selection,
				line: this.selectLineName
			});
			this.$router.push({
				name: "编辑装配",
				params: {
					productId: this.$route.query.productId
				}
			});
		},
		changeStatus() {
			this.status = this.$route.params.status;
			this.page = this.$route.query.page
			this.fixHeight()
		},
		fixHeight() {
			if (this.$route.name == '360图库详情') {
				this.asideOverflow = $(window).height() - 210
			} else if (this.$route.name == '产品图库详情') {
				this.asideOverflow = $(window).height() - 310
			} else {
				this.asideOverflow = $(window).height() - 160
			}
		}
	},
	created() {
		this.fixHeight()
		// this.page = this.$route.query.page
		this.status = this.$route.params.status;
		this.type = window.localStorage.getItem('imageType')
        this.form.pic_category_id = this.form.cid = this.$route.query.cid;
		this.$bus.on("ImageSelectChildLine", arg => {
			this.form.pic_category_id = arg.id;
			this.form.cid = arg.id;
			this.selectLineName = arg.title;
			this.type = arg.type;
			window.localStorage.setItem('imageType', this.type);
			if (this.type == "360") {
				this.form360.cid = arg.id;
			} else if (this.type == 'background') {
				if (this.form.price) {
					delete this.form.price
				}
				this.form.attr = JSON.stringify({
					width: 100,
					height: 100,
					x: 100,
					y: 100
				})
			} else if (this.type == 'product') {
				if (this.form.attr) {
					delete this.form.attr
				}

				this.form.price = 0
			}
		});
	},
	watch: {
		$route: "changeStatus"
	}
};
</script>

<style lang="less">
.line-collapse {
    .ivu-collapse {
        background: none;
        border: none;
        .ivu-icon-arrow-right-b {
            font-size: 12px;
            font-weight: normal;
        }
        .ivu-icon-arrow-right-b:before {
            content: "\F218";
        }
        .ivu-collapse-header {
            padding-left: 16px;
            font-size: 14px;
            font-weight: bold;
        }
        .ivu-collapse-content {
            background: none;
        }
        .ivu-collapse-content-box {
            padding-top: 0;
        }
        li {
            padding: 5px 12px;
            &.on {
                color: #2d8cf0;
            }
        }
        .btn {
            color: #ff0000;
        }
    }
}
</style>
