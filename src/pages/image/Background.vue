<template>
  <div class="layout-content-main">
    <i-header>
      <div slot="toolbar">
        <a href="javascript:void(0)" @click="goback">返回列表</a>
        <a href="javascript:void(0)" @click="save">保存</a>
      </div>
    </i-header>

    <div class="layout-menu-left t-c" style="position: fixed; z-index: 10; top: 40px;">
      <div class="menu-items t-c">
        <div class="menu rect">
          <Tooltip content="添加矩形" placement="right">
            <div class="navbar-icon" @click="addRect"></div>
          </Tooltip>
        </div>
        <div class="menu cursor">
          <Tooltip content="变形" placement="right">
            <div class="navbar-icon" @click="dragRect"></div>
          </Tooltip>
        </div>
      </div>
    </div>
    <div class="content-main flex center">
      <div class="prev" v-if="item.last_id" @click="go({name: '背景图库', query: {id: item.last_id, page: 'back-detail'}})"><Icon type="ios-arrow-left" size="32"></Icon></div>
      <div class="next" v-if="item.next_id" @click="go({name: '背景图库', query: {id: item.next_id, page: 'back-detail'}})"><Icon type="ios-arrow-right" size="32"></Icon></div>
      <div class="drawing" id="drawing"></div>
      <img-info :detail="item" @on-modifypic="get"></img-info>
    </div>
    <!-- <div class="content-aside">
      <div class="page-aside">
        <div class="aside">
          <Upload :on-success="uploadProduct" :before-upload="handleUpload" :show-upload-list="false" name="fileData" :action="api+ '/picApi/addPic'" multiple type="drag">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或将文件拖拽到这里上传</p>
            </div>
          </Upload>
        </div>
        <div class="flex flex-around aside-bottom-bar">
          <Button @click="uploadProduct">修改图片</Button>
          <Button type="primary" @click="save">保存边框</Button>
        </div>

      </div>
    </div> -->

  </div>
</template>

<script>
import ImgInfo from './components/img-info'
import SVG from "svg.js";
import select from "svg.select.js";
import resize from "svg.resize.js";
import draggable from "svg.draggable.js";
import axios from 'axios'
export default {
  props: {
    backgroundImg: "",
    categoryId: ""
  },
  components:{
    IHeader: () => import('../../components/layout/header'),
    ImgInfo
  },
  data() {
    return {
      item: {},
      menus: [
        { name: "矩形", icon: "rect", size: 22, route: "/ucenter" },
        { name: "指针", icon: "cursor", size: 22, route: "/cursor" }
      ],
      drawer: {
        draw: "",
        size: {
          width: $(window).width() - 320,
          height: $(window).height() - 45
        },
        set: "",
        rect: ""
      },
      attr: {
        width: 200, height:200, x: 100, y:100
      },
      file: {}
    };
  },
  computed:{
    detail() {
      return this.$store.state.images.detail
    }
  },
  methods: {
    goback() {
      history.go(-1)
    },
    async uploadProduct() {
      let param = new FormData();
      param.append("fileData", this.file);
      param.append('attr', this.attr)
      // for (let f of this.$refs.file.files) {
      //   param.append("fileData", f);
      // }
      param.append("userToken", this.$store.state.user.userInfo.userToken);
      param.append("id", this.$route.query.id);
      let { data } = await axios.post(
        "/picApi/modifyPic",
        param,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )
      if (!data.code) {
        this.$Message.success(data.msg.zh)
        window.location.reload()
      }
    },
    handleUpload(file) {
      this.file = file
      console.log(file);
      return false;
    },
    getAttr() {
      return this.attr;
    },
    addRect() {

      this.drawer.rect = this.drawer.draw
        .rect(this.attr.width, this.attr.height).move(this.attr.x, this.attr.y)
        .fill({ color: "#33ccff", opacity: 0.6 });
      this.drawer.set.add(this.drawer.rect);

      this.drawer.rect.selectize({ deepSelect: true });
      this.drawer.rect.draggable()
      this.drawer.rect.selectize().resize();
      this.dragRect()
    },
    dragRect() {
      this.drawer.rect.on("resizedone", e => {
        this.attr = {
          sizew: 1024,
          sizeh: 768,
          width: e.target.width.animVal.value,
          height: e.target.height.animVal.value,
          x: e.target.x.animVal.value,
          y: e.target.y.animVal.value
        };
        console.log(this.attr)
        //console.log(e.target.width.animVal.value, e.target.height.animVal.value, e.target.x.animVal.value, e.target.y.animVal.value)
      });
      this.drawer.rect.on("dragend", e => {
        this.attr = {
          sizew: 1024,
          sizeh: 768,
          width: e.target.width.animVal.value,
          height: e.target.height.animVal.value,
          x: e.target.x.animVal.value,
          y: e.target.y.animVal.value
        };
        console.log(this.attr)
        // console.log(this.file, this.categoryId)
        //console.log(e.target.width.animVal.value, e.target.height.animVal.value, e.target.x.animVal.value, e.target.y.animVal.value)
      });
    },
    async get() {
      let { data } = await this.http("/picApi/getPic", {
        data: {
          id: this.$route.query.id
        },
        method: "POST"
      });
      this.item = data.result.pic;
      this.drawer.draw.clear()
      const image = new Image()
      image.src = this.server + this.item.url
      // const x = (this.drawer.size.width - 1024) /2
      // const y = (this.drawer.size.height - 768) /2
      this.drawer.draw.image(image.src).size(1024, 768)
      if (this.item.show_attr.width) {
        this.attr = this.item.show_attr
        this.addRect()
      }
      //.move(x, y)
    },
    async save() {
     let { data } = await this.http("/picApi/modifyPic", {
        data: {
          id: this.$route.query.id,
          attr: this.attr
        },
        method: "POST"
      });
      if (!data.code) {
        this.$Message.success(data.msg.zh)
        window.location.reload()
      }
    }
  },
  mounted() {
    // const width = this.drawer.size.width;
    // const height = this.drawer.size.height;
    this.drawer.draw = SVG("drawing").size(1024, 768);
    this.drawer.set = this.drawer.draw.set();
  },
  created() {
    this.get()
  },
  watch: {
    '$route': 'get'
  }
};
</script>

<style lang="less" scoped>
.menu-items {
  &.bottom {
    position: absolute;
    bottom: 0px;
  }
  .navbar-icon {
    width: 40px;
    height: 32px;
    background-size: 20px 20px;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .rect {
    .navbar-icon {
      background-image: url("/static/icon2/Symbol 53 250C 17@3x.png");
    }
    &:hover .navbar-icon,
    &.on .navbar-icon {
      background-image: url("/static/icon2/Symbol 166 250C 1@3x.png");
    }
  }
  .cursor {
    .navbar-icon {
      background-image: url("/static/icon2/Symbol 162 250C 1@3x.png");
    }
    &:hover .navbar-icon,
    &.on .navbar-icon {
      background-image: url("/static/icon2/Symbol 52 250C 32@3x.png");
    }
  }
}

.drawing {
  width: 1024px; height: 768px; margin: 0 auto;
}
</style>
