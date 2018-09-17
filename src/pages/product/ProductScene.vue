<template>
<design-page>
  <div slot="header-toolbar">
    <a href="javascript:void(0)" @click="saveDesign">保存装配</a>
    <top-bar @flip="flip"></top-bar>
    <Button @click="playScene" type="text" style="position: fixed; right: 250px; top: 2px;">
        <Icon type="play" size="18"></Icon>
      </Button>
  </div>
  <div slot="design-playground">
    <design ref="design"></design>
  </div>
  <div slot="right-aside" class="right-aside">
    <div class="select-lines flex space-between">
      <Button icon="chevron-left" type="dashed" size="small" @click="prevLine"></Button>
      <div class="lines-container">
        <div class="lines-row" :style="'left:' + left + 'px'">
          <span @click="selectList({title:'产品颜色'})">
              产品颜色
            </span>
          <span @click="selectList({title:'背景'})">
              背景
            </span>
          <span @click="selectList(item)" v-for="(item, i) in $store.state.design.products.other_product" :key="i">
              {{item.title}}
            </span>
        </div>
      </div>
      <Button icon="chevron-right" type="dashed" size="small" @click="nextLine()"></Button>
      <Button icon="ios-plus-empty" type="dashed" size="small" @click="getCategory()"></Button>
    </div>
    <div class="select-products">
      <ul class="product-imgs">
        <selected-pic v-for="(pic, i) in pics.list" :category="pics.title" :pic="pic" :key="i" @design="design"></selected-pic>
        <li class="cursor flex center" v-if="pics.title != '产品颜色'" @click="goSelectImages">
          <div class="flex center">
            <Icon type="plus"></Icon>
            <p>添加图片</p>
          </div>
        </li>
      </ul>
    </div>
    <Modal v-model="modalSelectCategory" title="选择配件系列" width="600px">
      <modal-select-category ref="selectCategory"></modal-select-category>
    </Modal>
    <Modal v-model="showSelectImage" title="选择配件" width="1200px">
      <modal-select-image ref="selectImage"></modal-select-image>
    </Modal>
    <Modal v-model="showSelectBg" title="选择背景" width="1200px">
      <modal-select-bg ref="selectBg"></modal-select-bg>
    </Modal>
  </div>

</design-page>
</template>

<script>
import DesignPage from "./components/design-page";
import Design from "./components/scene";
import ModalSelectCategory from "./components/modal-select-category";
import ModalSelectImage from "./components/modal-select-image";
import ModalSelectBg from "./components/modal-select-bg";
import TopBar from "./components/top-bar";
import SelectedPic from "./components/selected-pic";

export default {
  data() {
    return {
      sceneInfo: {},
      left: 0,
      category: {
        title: "",
        id: 0
      },
      list: {},
      main_product: "",
      products: [],
      modalSelectCategory: false,
      showSelectImage: false,
      showSelectBg: false,
      play: false,
      pics: {
        title: "产品颜色",
        list: []
      },
      elements: []
    };
  },
  computed: {
    zIndex() {},
    productPics() {
      return this.$store.state.design.main_product.attr;
    },
    bgPics() {
      return this.$store.state.design.bgs;
    }
  },
  components: {
    DesignPage,
    ModalSelectCategory,
    ModalSelectImage,
    ModalSelectBg,
    Design,
    TopBar,
    SelectedPic
  },
  methods: {
    playScene() {
      if (process.env.NODE_ENV != "production") {
        window.open(
          "/#/product/show_design/" + this.$route.params.productId,
          "_blank"
        );
      } else {
        window.open(
          "/jiuyang/#/product/show_design/" + this.$route.params.productId,
          "_blank"
        );
      }
    },
    saveDesign() {
      this.scene();
    },
    async scene() {
      let products = {
        bg_info: {
          id: [
            // 3, 4
          ]
        },
        other_product: [
          {
            title: "产品",
            type: 1,
            zindex: 3,
            products: [
              {
                id: 26,
                is_default: 1,
                attr: [
                  {
                    width: 500,
                    height: 800,
                    x: 200,
                    y: 100
                  }
                ]
              }
            ]
          },
          {
            title: "配件",
            zindex: 5,
            type: 3,
            products: [
              {
                id: 58,
                is_default: 1,
                attr: [
                  {
                    width: 20,
                    height: 99,
                    x: 300,
                    y: 300
                  }
                ]
              },
              {
                id: 59,
                is_default: 0,
                attr: [
                  {
                    width: 20,
                    height: 90
                  }
                ]
              }
            ]
          }
        ]
      };
      let { data } = await this.http("/productApi/sceneModify", {
        data: {
          main_product: this.$store.state.design.main_product.id,
          main_zindex: this.$store.state.design.main_zindex,
          main_attr: this.$store.state.design.main_attr,
          products: JSON.stringify(this.$store.state.design.products)
        },
        method: "POST"
      });
      if (data.code) {
        this.$Message.info(data.msg.zh);
      } else {
        this.play = true;
        this.$Message.success(data.msg.zh);
      }
    },
    design(pic) {
      this.$refs.design.addElement({
        pic: pic,
        categoryName: this.pics.title
      });
    },
    goSelectImages() {
      if (this.pics.title == "产品颜色") {
        this.showSelectImage = true;
        this.$refs.selectImage.get(this.list);
      } else if (this.pics.title == "背景") {
        this.showSelectBg = true;
        this.$refs.selectBg.getList();
      } else {
        this.showSelectImage = true;
        this.$refs.selectImage.get(this.category);
      }
    },
    selectList(category) {
      this.category = category;
      this.$store.commit("SET_CURRENT_CATEGORY", this.category.title);
      this.pics.title = category.title;
      if (category.title == "产品颜色") {
        this.pics.title = "产品颜色";
        this.pics.list = this.productPics;
      } else if (category.title == "背景") {
        this.pics.title = "背景";
        this.pics.list = this.bgPics;
      } else {
        const other_product = this.$store.state.design.products.other_product.find(
          item => {
            return item.title == category.title;
          }
        );
        this.pics.list = other_product.products;
      }
    },
    prevLine() {
      if (this.left < -70) {
        this.left += 70;
      }
    },
    nextLine() {
      this.left -= 80;
    },
    showModel(modal) {
      this[modal] = true;
    },
    getCategory() {
      this.showModel("modalSelectCategory");
      this.$refs.selectCategory.getParts();
    },
    async getMainProduct() {
      const id = this.$route.params.productId;
      let { data } = await this.http("/productApi/getProductInfo", {
        data: {
          id: id
        },
        method: "POST"
      });
      this.$store.commit("SET_MAIN_PRODUCT", data.result.product);
      this.getSceneInfo();
    },
    async getSceneInfo() {
      const id = this.$route.params.productId;
      let { data } = await this.http("/productApi/getSceneInfo", {
        data: {
          main_product: id
        },
        method: "POST"
      });
      if (data.result.scene) {
        this.initScene(data.result.scene);
      }
    },
    flip(d) {
      this.$refs.design.flip(d);
    },
    async initScene(scene) {
      let zIndex = [];
      const sceneSize = {
        width: $(window).width() - 280,
        height: $(window).height() - 40
      };
      this.$store.dispatch("SET_MAIN_ATTR", scene.main_attr);
      this.$store.dispatch("SET_MAIN_ZINDEX", scene.main_zindex);
      this.elements.push({
        is_main: true,
        title: "产品颜色",
        zindex: this.$store.state.design.main_zindex,
        value: this.$store.state.design.main_product
      });

      for (let bg of scene.bg_info) {
        this.$store.dispatch('ADD_BG_INFO', bg.id)
        this.$store.dispatch('ADD_BGS', {
          id: bg.id,
          url: bg.url
        })
      }

      this.$store.dispatch("SET_OTHER_PRODUCT", scene.other_product);

      await new Promise((reslove, reject) => {
        let i = 0;
        for (let other_product of scene.other_product) {
          this.elements.push({
            is_main: false,
            title: other_product.title,
            zindex: other_product.zindex,
            products: other_product.products
          });
          i++;
          if (i == scene.other_product.length) {
            reslove();
          }
        }
      });
      this.elements.sort((a, b) => {
        if (a.zindex > b.zindex) {
          return 1;
        } else {
          return -1;
        }
      });
      for (let element of this.elements) {
        if (element.is_main) {
          this.$refs.design.addElement(
            {
              pic: this.$store.state.design.main_product.attr[0],
              categoryName: element.title
            },
            this.$store.state.design.main_attr.self
          );
        } else {
          const product = element.products.find(item => {
            return item.is_default === "1";
          });

          let attr = product.attr[0];
          this.$refs.design.addElement(
            {
              pic: product,
              categoryName: element.title
            },
            attr
          );
          if (product.attr.length > 1) {
            let copyAttr = product.attr[1];
            this.$refs.design.copyElement(element.title, copyAttr);
          }
        }
      }
    }
  },
  created() {
    this.getMainProduct();
  },
  watch: {
    $route: "getMainProduct"
  }
};
</script>

<style lang="less" scoped>
.product-imgs {
  li {
    width: 200px;
    height: 260px;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center center;
    margin: 20px;
    border: solid 1px #ccc;
    text-align: center;
    position: relative;
    &:hover {
      border: solid 1px #2d8cf0;
    }
  }
}

.right-aside {
  height: 100%;
  padding-top: 50px;
  box-sizing: border-box;
  overflow: auto;
}

.select-lines {
  position: fixed;
  top: 40px;
  right: 0px;
  width: 240px;
  height: 50px;
  background: #fff;
  box-sizing: border-box;
  padding: 0 10px;
  border-bottom: solid 3px #f5f7f9;
  .left-arraw {
    width: 24px;
    height: 24px;
  }
  .lines-container {
    width: 168px;
    overflow: hidden;
    position: relative;
    height: 24px;
  }
  .lines-row {
    width: 2000px;
    position: absolute;
    span {
      display: inline-block;
      background: #f0f0f0;
      padding: 2px 5px;
      border-radius: 2px;
      cursor: pointer;
      margin: 1px;
    }
  }
  .ivu-tag {
    width: 66px;
  }
}

.steps {
  position: absolute;
  right: 250px;
  top: 50px;
}
</style>
