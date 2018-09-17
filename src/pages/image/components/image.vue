<template>
  <i-page>
    <div slot="header-handler">
      <a @click="addProduct" v-if="$route.query.from=='product'">保存</a>
      <a @click="add360Product" v-if="$route.query.from=='360'">保存</a>
      <a @click="addDesign" v-if="$route.query.from=='design'">选择返回</a>
    </div>
    <div class="" slot="page-content">
      <router-view></router-view>
      <!-- <image-list v-show="type!='360'" :type="type" ref="productList"></image-list>
      <list-360 v-show="type=='360'"></list-360> -->
    </div>

    <div class="page-aside" slot="page-aside">
      <div class="aside line-collapse collapse">
        <div class="cursor flex center" @click="open" style="height: 50px; border-bottom: solid 2px #f2f2f2;">
          显示全部
        </div>
        <Collapse @on-change="changeImagePanel">
          <Panel ref="col2" name="2">
            <span class="line-title-bar">
              <span style="width:180px; display:inline-block">
                产品图片
              </span>
              <span class="btn" @click.stop="showAddInput('AddProductLine')">
                <Icon type="plus" size="8"></Icon>
              </span>
            </span>
            <category-product :add="AddProductLine" slot="content"></category-product>
          </Panel>
          <Panel ref="col1" name="1">
            <span class="line-title-bar">
              <span style="width:180px; display:inline-block">
                背景图片
              </span>
              <span class="btn" @click.stop="showAddInput('AddBackgroundLine')">
                <Icon type="plus" size="8"></Icon>
              </span>
            </span>
            <category-background :add="AddBackgroundLine" slot="content"></category-background>
          </Panel>
          <Panel ref="col3" name="3">
            <span class="line-title-bar">
              <span style="width:180px; display:inline-block">
                360图片
              </span>
              <span class="btn" @click.stop="showAddInput('Add360Line')">
                <Icon type="plus" size="8"></Icon>
              </span>
            </span>
            <category-360 :add="Add360Line" slot="content"></category-360>
          </Panel>
          <Panel ref="col4" name="4">
            <span class="line-title-bar">
              <span style="width:180px; display:inline-block">
                默认图片
              </span>
              <span class="btn" @click.stop="showAddInput('AddDefaultLine')">
                <Icon type="plus" size="8"></Icon>
              </span>
            </span>
            <category-default :add="AddDefaultLine" slot="content"></category-default>
          </Panel>
        </Collapse>
      </div>
      <div v-if="type!='360'">
        <Upload :on-success="uploadProduct" :before-upload="handleUpload" :show-upload-list="false" :data="form" name="fileData" :action="api+ '/picApi/addPic'" multiple type="drag">
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或将文件拖拽到这里上传</p>
          </div>
        </Upload>
      </div>

       <div v-if="type=='360'">
         <input ref="file" type="file" name="pic[]" @change="upload360Pic" multiple="multiple">
        </div>
    </div>

  </i-page>
</template>

<script>
import CategoryProduct from "../../components/image/category/product";
import CategoryBackground from "../../components/image/category/background";
import CategoryDefault from "../../components/image/category/default";
import Category360 from "../../components/image/category/360";
import ImageList from "./components/image-list";
import Background from "./Background";
import List360 from "./components/list-360";
import axios from "axios";

export default {
  data() {
    return {
      fileList: [],
      form: {
        userToken: this.$store.state.user.userInfo.userToken,
        pic_category_id: 0
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
      pageType: "",
      file: "",
      uploadBackground: false,
      backgroundImg: "",
      type: "",
    };
  },
  components: {
    CategoryProduct,
    CategoryBackground,
    CategoryDefault,
    Category360,
    ImageList,
    Background,
    List360
  },
  methods: {
    async add360Product () {
      let image = {}
      for (let img of this.$store.state.images.img_for_360_product.values()) {
        image = img
      }
      let { data } = await this.http('/productApi/addFullSceneProduct', {
        data: {
          cid: this.$route.query.cid,
          pp_id: image.id
        },
        method: 'POST'
      })
      this.$router.push({ name: "360列表" });
    },
    async upload360Pic() {
      let param = new FormData();

      for (let f of this.$refs.file.files) {
        param.append("pic[]", f);
      }
      param.append("userToken", this.$store.state.user.userInfo.userToken);
      param.append("cid", this.form360.cid);
      let { data } = await axios.post(
        "/productApi/addFullScenePicProduct",
        param,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      this.productList = data.result.pics;
    },
    // async uploadBackgroundImg() {
    //   let { data } = await this.http("/picApi/addPic", {
    //     data: this.params,
    //     method: "POST"
    //   });
    //   console.log(this.file);
    // },
    handleUpload(file) {
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
    },
    showAddInput(type) {
      this[type] = true;
    },
    changeImagePanel() {},
    uploadProduct(response, file, fileList) {
      console.log(response, file, fileList);
      this.$refs.productList.getProductList();
    },
    async addProduct() {
      let pic = [];
      for (let p of this.$store.state.images.selection) {
        pic.push(p.id);
      }
      var attr = [{ pic: pic, title: "默认产品" }];
      let { data } = await this.http("/productApi/productNew", {
        data: {
          category_id: this.$store.state.product.line_id,
          title: this.$store.state.images.selection[0].pic_title,
          price: "0",
          pic_id: pic
        },
        method: "POST"
      });
      this.$router.push({ name: "产品系列" });
    },
    addDesign() {
      this.$bus.emit("designSelectImage", {
        lineId: this.form.pc_id,
        pics: this.$store.state.images.selection,
        line: this.selectLineName
      });
      this.$router.push({
        name: "编辑装配",
        params: { productId: this.$route.query.productId }
      });
    },
    changeStatus() {
      this.status = this.$route.params.status;
    }
  },
  created() {
    this.status = this.$route.params.status;
    this.$bus.on("ImageSelectChildLine", arg => {
      this.form.pic_category_id = arg.id;
      this.selectLineName = arg.title;
      this.type = arg.type;
      if (this.type == "360") {
        this.form360.cid = arg.id;
      } else if (this.type == 'background') {
        if(this.form.price) {
          delete this.form.price
        }
        this.form.attr = JSON.stringify({width: 100, height: 100, x: 100, y: 100})
      } else if (this.type == 'product') {
        if(this.form.attr) {
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
