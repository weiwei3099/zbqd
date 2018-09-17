<template>
  <i-page>
    <div slot="header-handler">
      <a href="javascript:void(0)" @click="goback">返回列表</a>
    </div>
    <div slot="header-rightbar">
        <Button type="text" size="large" @click="play" icon="play"></Button>
    </div>
    <div class="page-content" slot="page-content">
      <div class="prev" v-if="item.last_id" @click="go({name: '产品详细', params: {productId: item.last_id}})"><Icon type="ios-arrow-left" size="32"></Icon></div>
      <div class="next" v-if="item.next_id" @click="go({name: '产品详细', params: {productId: item.next_id}})"><Icon type="ios-arrow-right" size="32"></Icon></div>
      <div class="pic-show" :style="'background-image:url('+ server + current.url +')'"></div>
      <div class="pic-title flex center" v-if="pics.length">
        <div class="">
          <span class="p-10 flex center color-light">{{index}} / {{pics.length}}</span>
          <h1>{{item.title}}</h1>
        </div>
      </div>
    </div>
    <div class="page-aside" slot="page-aside">
      <div class="aside aside-list">

        <div class="serie-prd" v-for="(pic, index) in pics" :key="pic.id" v-if="item.attr.length">
            <div class="serie-img" @click="selectImg(index, pic)">
                <img :src="server + pic.url"/>
            </div>
            <div class="serie-prd-bar flex space-between">
              {{pic.pic_title}}
                <div>
                    <span @click="setAsIndex(index, pic)"><Icon :type="index === 0 ? 'eye' : 'eye-disabled'" size="16" class="xbtn"></Icon></span>
                    <span @click="delColor(index, pic)"><Icon type="ios-trash-outline" size="16" class="xbtn"></Icon></span>
                </div>
            </div>
        </div>
        <div class="serie-img serie-add flex flex-center" @click="showPrdSelect">
            <i class="ivu-icon ivu-icon-plus"></i>
        </div>
      </div>
      <div class="aside-btn" style="justify-content: space-around; height:60px;">
        <a class="alink" href="javascript:" @click="goDesign">装配场景</a>
        <a class="alink" href="javascript:">产品详情</a>
      </div>
      <prd-select v-show="prdSelectVisible" ref="prdSelect"  @hide="hidePrdSelect" @finish="addColors"></prd-select>
    </div>
  </i-page>
</template>

<script>
import prdSelect from '../design/components/select/select.vue';
export default {
  components:{
      prdSelect
  },
  data() {
    return {
      prdSelectVisible : false,
      current: '',
      pics: [],
      title : '',
      item: {},
      index: 1,
    }
  },
  methods: {
    goback() {
      history.go(-1)
    },
    goDesign() {
      this.$router.push({ name: '编辑装配', params: { productId: this.$route.params.productId } })
    },
    // 播放
    play(){
        window.open(process.env.URL_PRE + "/#/product/show_design/" + this.$route.params.productId, "_blank");
    },
    async getProductDetail() {
      this.$store.commit('CLEAR_DESIGN')
      this.pics = []
      const id = this.$route.params.productId
      let { data } = await this.http('/productApi/getProductInfo', {
        data: {
          id: id
        },
        method: 'POST'
      })
      this.pics = data.result.product.attr
      this.current = this.pics[0]
      this.title = data.result.product.title
      this.item = data.result.product
    },
    selectImg(index, img) {
      this.index = index + 1
      this.current = img
    },
    showPrdSelect(){

        this.prdSelectVisible = true;

        const cates = [
            {type: '1', title: '产品图片'}
        ];
        console.log(this.$refs);
        this.$refs.prdSelect.init(cates);
    },
    hidePrdSelect(){
        this.prdSelectVisible = false;
    },
    addColors(attrs){
        this.prdSelectVisible = false;
        let hasNew = false;
        for(let attr of attrs){
            let found = false;
            for(let tmp of this.pics){
                if(tmp.id === attr.id){
                    found = true;
                    break;
                }
            }
            if(found){
                continue;
            }
            hasNew = true;
            this.pics.push(attr);
        }

        if(hasNew){
            this.save();
        }
    },

    async setAsIndex(index, pic){
        let {data} = await this.http('/productApi/setProductMainPic', {
            method: 'POST',
            data: {
                main_pic_id: pic.id,
                pid: this.$route.params.productId
            }
        });

        if(data.code){
            this.$Message.error(data.msg.zh);
        }else{
            this.$Message.info(data.msg.zh);
            this.getProductDetail();
        }
    },

    delColor(index, item){
        if(this.pics.length === 1){
            this.$Message.warning('一个产品下至少要有一个颜色');
            return ;
        }
        if(this.current === item){
            if(index > 0){
                this.selectImg(index - 1, this.pics[index - 1]);
            }else if(this.pics.length > 1){
                this.selectImg(index - 1, this.pics[1]);
            }
        }
        this.pics.splice(index, 1);
        this.save();
    },
    async save(){
        const params = {
            id : this.$route.params.productId,
            title : this.title,
            pic_id : []
        };

        for(let pic of this.pics){
            params.pic_id.push(pic.id);
        }

        let { data } = await this.http('/productApi/productModify', {
          data: params,
          method: 'POST'
       });
       if(data.code){
           this.$Message.info(data.msg.zh);
       }else{
           this.$Message.success(data.msg.zh);
       }
    }
  },
  created() {
    this.getProductDetail()
  },
  watch: {
    '$route': 'getProductDetail'
  }
}
</script>

<style lang="less" scoped>
.pic-title {
  height: 15%;
  h1 {
    color: #2d8cf0;
  }
}

.page-content {
  height: 100%;
}

.product-imgs {
  li {
    width: 200px;
    height: 260px;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center center;
    margin: 20px;
    border: solid 1px #ccc;
  }
}

.pic-show {
  height: 85%;
  width: 100%;
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: center center;
}

.page-aside {
  overflow: auto;
  padding-bottom: 63px;
}

.aside-btn {
  position: fixed;
  bottom: 0;
  right: 0px;
  width: 240px;
  border-top: solid 3px #f5f7f9;
}

.serie-add{
    height:200px;

    >.ivu-icon{
        color:#2d8cf0;
        font-size:20px;
    }
}

.serie-item{
    display: inline-block;
    background: #f0f0f0;
    padding: 2px 5px;
    border-radius: 2px;
    cursor: pointer;
    margin:1px 3px;

    &.checked{
        color:#2d8cf0;
    }
}

.serie-prd{
    border-bottom:3px solid #f5f7f9;
}

.serie-img{
    margin:10px 0px;
    padding:5px;
    text-align:center;
    cursor:pointer;

    > img{
        max-width:100%;
        max-height:200px;
    }
}
.aside-list{
    padding:0 20px;
}
.serie-prd-bar{
    text-align:right;
    > *{
        margin-left:5px;
    }
}
.serie-prd-btn{
    display:inline-block;
    width:26px;
    height:26px;
    cursor:pointer;
}

.btn-remove{
    background-size:contain;
    background-repeat:no-repeat;
    background-image:url('/static/icons/icon-remove.png')
}

.btn-remove:hover{
    background-image:url('/static/icons/icon-remove-on.png')
}

.zd{
    position:fixed;
    top:35px;
    left:40px;
    bottom:0px;
    right:0px;
    background:#f0f0f0;
    z-index:9999;
}
.alink{
    font-size:14px;
}

.xbtn{
    margin-left:5px;
    cursor:pointer;
}
</style>
