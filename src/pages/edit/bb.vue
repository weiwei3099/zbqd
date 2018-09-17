<template id="contact">
  <div class="layout zhuangpei"> 
    <!-- 顶部导航 -->
    <div class="layout-header">
      <div class="flex"> <a href="javascript:void(0)" class="abtn xloading icon-loading"> <i class="navbar-icon icon-spinner"></i> </a> <a href="javascript:void(0)" class="abtn" >保存返回</a>
        <ul class="top-bar">
          <li :class="item.icon" v-for="(item, i) in tbar" :key="item.id">
            <Tooltip :content="item.name" placement="bottom"><i class="navbar-icon"></i></Tooltip>
          </li>
        </ul>
      </div>
      <!-- 左侧导航 -->
      <div class="layout-menu-left t-c">
        <div class="menu-items">
          <div class="menu" :class="[item.icon, item.checked && 'on']" v-for="(item, i) in lbar" :key="i"  @click="btnClick(item)" >
            <Tooltip :content="item.name" placement="right"><i class="navbar-icon"></i></Tooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="container" v-show="prdCreateWinVisible">
      <div class="layout-content">
        <div class="layout-content-main">
          <div class="content-main">
            <editarea ref="editarea"></editarea>
          </div>
          
          <!-- 图片分类列表 -->
          <div class="content-aside series-container ">
            <div class="series-content2">
              <div class="series-categorys">
                <div  class="series-bar flex">
                  <div  class="series-list">
                    <div  class="series-wrapper" style="transform: translateX(0px);"> <span class="serie-item"> 产品图库 </span> <span class="serie-item"> 背景图库 </span> <span class="serie-item"> 默认图库 </span> <span class="serie-item"> 视频图库 </span> </div>
                  </div>
                </div>
                <div  class="series-content">
                  <Collapse class="xrel" v-model="opened">
                    <Panel :ref="'line'+line1.id" :name="line1.id" v-for="(line1, i) in lines" :key="line1.id" class="seri-panel" :class="{moving: line1.moving}" :style="line1.style"> 
                    <span class="line-title-bar flex-full flex-row"> <span style="display:inline-block;padding-left:5px;" class="flex-full"> {{line1.title}} </span> </span>
                       <ul slot="content" :class="{noselect: moving}">
                          <li class="cursor" v-for="(line2, x) in line1.children" :key="line2.id" :ref="'line' + line2.id" :class="{'moving-wrapper': line2.moving}" style="height:25px;">
                             {{line2.title}}
                          </li>
                          <line-input v-if="showAdd" :id="line.id" @add-ok="getList"></line-input>
                      </ul>
                    </Panel>
                  </Collapse>
                  <div  class="serie-prd" v-for="item in prdList" >
                    <div class="">
                      <div class="serie-img"> <img :src="server + item.url"/>
                        <div class="img-title">{{item.pic_title}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal :title="edit.title" width="600" v-model="edit.visible" @on-ok="links">
      <Form ref="formInline" :label-width="80" :model="edit.form">
        <FormItem label="网址">
          <Input type="text" v-model="edit.value" :placeholder="edit.placeholder" ref="input" :maxlength="edit.maxlength">
          </Input>
        </FormItem>
      </Form>
    </Modal>
    <div class="qmpanel_shadow rounded5" style="z-index: 1121; position: absolute; left:40px; top:100px;" v-show="fontcolos" >
      <div style="margin:0pt;">
        <div class="menu_base">
          <div class="menu_bd">
            <div  style="overflow-y: auto; width: 144px; height: auto;" class="txtflow">
              <div istyle="height:auto;line-height:auto;padding:0;">
                <div class="unselect" unselectable="on">
                  <div class="qmEditorMenuItem"  style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#000000;"  @click="setfontcolor('#000000')"></div>
                  </div>
                  <div class="qmEditorMenuItem" style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#993300;" @click="setfontcolor('#993300')"></div>
                  </div>
                  <div class="qmEditorMenuItem"  style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#333300;" @click="setfontcolor('#333300')"></div>
                  </div>
                  <div class="qmEditorMenuItem" style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#003300;" @click="setfontcolor('#003300')"></div>
                  </div>
                  <div class="qmEditorMenuItem" style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#003366;" @click="setfontcolor('#003366')"></div>
                  </div>
                  <div class="qmEditorMenuItem" style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#000080;" @click="setfontcolor('#000080')"></div>
                  </div>
                  <div class="qmEditorMenuItem" title="#333399" style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#333399;" @click="setfontcolor('#333399')"></div>
                  </div>
                  <div class="qmEditorMenuItem" title="#333333" style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#333333;" @click="setfontcolor('#333333')"></div>
                  </div>
                  <br style="clear:both;">
                  <div class="qmEditorMenuItem" style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#800000;" @click="setfontcolor('#800000')"></div>
                  </div>
                  <div class="qmEditorMenuItem" style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#FF6600;" @click="setfontcolor('#FF6600')"></div>
                  </div>
                  <div class="qmEditorMenuItem" style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#808000;" @click="setfontcolor('#808000')"></div>
                  </div>
                  <div class="qmEditorMenuItem"  style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#008000;" @click="setfontcolor('#008000')"></div>
                  </div>
                  <div class="qmEditorMenuItem"   style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor"  style="background:#008080;" @click="setfontcolor('#008080')"></div>
                  </div>
                  <div class="qmEditorMenuItem"   style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#0000FF;" @click="setfontcolor('#0000FF')"></div>
                  </div>
                  <div class="qmEditorMenuItem"   style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#666699;" @click="setfontcolor('#666699')"></div>
                  </div>
                  <div class="qmEditorMenuItem" style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#808080;" @click="setfontcolor('#808080')"></div>
                  </div>
                  <br style="clear:both;">
                  <div class="qmEditorMenuItemCheck"  style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#FF0000;" @click="setfontcolor('#FF0000')"></div>
                  </div>
                  <div class="qmEditorMenuItem"   style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#FF9900;" @click="setfontcolor('#FF9900')"></div>
                  </div>
                  <div class="qmEditorMenuItem"   style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#99CC00;" @click="setfontcolor('#99CC00')"></div>
                  </div>
                  <div class="qmEditorMenuItem" i  style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#339966;" @click="setfontcolor('#339966')"></div>
                  </div>
                  <div class="qmEditorMenuItem"  style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#33CCCC;" @click="setfontcolor('#33CCCC')"></div>
                  </div>
                  <div class="qmEditorMenuItem" style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#3366FF;" @click="setfontcolor('#3366FF')"></div>
                  </div>
                  <div class="qmEditorMenuItem"  style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#800080;" @click="setfontcolor('#800080')"></div>
                  </div>
                  <div class="qmEditorMenuItem" style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#999999;" @click="setfontcolor('#999999')"></div>
                  </div>
                  <br style="clear:both;">
                  <div class="qmEditorMenuItem"  style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#FF00FF;" @click="setfontcolor('#FF00FF')"></div>
                  </div>
                  <div class="qmEditorMenuItem"  style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#FFCC00;" @click="setfontcolor('#FFCC00')"></div>
                  </div>
                  <div class="qmEditorMenuItem"  style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#FFFF00;" @click="setfontcolor('#FFFF00')"></div>
                  </div>
                  <div class="qmEditorMenuItem" style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#00FF00;" @click="setfontcolor('#00FF00')"></div>
                  </div>
                  <div class="qmEditorMenuItem" style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#00FFFF;" @click="setfontcolor('#00FFFF')"></div>
                  </div>
                  <div class="qmEditorMenuItem"  style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#00CCFF;" @click="setfontcolor('#00CCFF')"></div>
                  </div>
                  <div class="qmEditorMenuItem"  style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor"style="background:#993366;" @click="setfontcolor('#993366')"></div>
                  </div>
                  <div class="qmEditorMenuItem"   style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#C0C0C0;" @click="setfontcolor('#C0C0C0')"></div>
                  </div>
                  <br style="clear:both;">
                  <div class="qmEditorMenuItem"  style="float:left;width:auto;height:auto;" >
                    <div class="qmEditorMenuColor" style="background:#FF99CC;" @click="setfontcolor('#FF99CC')"></div>
                  </div>
                  <div class="qmEditorMenuItem"  style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#FFCC99;" @click="setfontcolor('#FFCC99')"></div>
                  </div>
                  <div class="qmEditorMenuItem" style="float:left;width:auto;height:auto;" >
                    <div class="qmEditorMenuColor" style="background:#FFFF99;" @click="setfontcolor('#FFFF99')"></div>
                  </div>
                  <div class="qmEditorMenuItem"  style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#CCFFCC;" @click="setfontcolor('#CCFFCC')"></div>
                  </div>
                  <div class="qmEditorMenuItem"   style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#CCFFFF;" @click="setfontcolor('#CCFFFF')"></div>
                  </div>
                  <div class="qmEditorMenuItem"  style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#99CCFF;" @click="setfontcolor('#99CCFF')"></div>
                  </div>
                  <div class="qmEditorMenuItem" style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#CC99FF;" @click="setfontcolor('#CC99FF')"></div>
                  </div>
                  <div class="qmEditorMenuItem" style="float:left;width:auto;height:auto;">
                    <div class="qmEditorMenuColor" style="background:#FFFFFF;" @click="setfontcolor('#FFFFFF;')"></div>
                  </div>
                  <br style="clear:both;">
                </div>
              </div>
            </div>
            <div style="overflow-y: auto; width: 134px; padding-top: 3px; border-top: 1px solid rgb(204, 204, 204);  height: auto; padding-left:10px;font-size:12px;"> 字体大小:
              <select name="fontsize" @change="setfontsize($event)">
                <option value="12px">12px</option>
                <option value="16px">16px</option>
                <option value="20px">20px</option>
                <option value="25px">25px</option>
                <option value="30px">30px</option>
                <option value="40px">40px</option>
                <option value="50px">50px</option>
                <option value="60px">60px</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" src="./minfo.less" >
</style>
<script>
import Editarea from './editarea';
var categorys=[];
export default {

  data(){
        return {
            ajaxing : true,
            seq : 10,
            inputVisible : false,
            inputVal : '',

			mid:'',

            // 顶部按钮条
            tbar : [
                {id : 'save', name : '保存(ctrl+s)', icon : 'icon-save', event : false},
                {id : 'copy', name : '复制(ctrl+c)', icon : 'icon-copy'},
                {id : 'top', name : '顶层(ctrl+1)', icon : 'icon-top'},
                {id : 'bottom', name : '底层(ctrl+2)', icon : 'icon-bottom'},
                {id : 'up', name : '上一层(ctrl+3)', icon : 'icon-up'},
                {id : 'down', name : '下一层(ctrl+4)', icon : 'icon-down'},
                {id : 'trunlf', name : '左翻转90度', icon : 'icon-trun-left'},
                {id : 'trunrt', name : '右翻转90度', icon : 'icon-trun-right'},
                {id : 'flipx', name : '水平翻转', icon : 'icon-flip-x'},
                {id : 'flipy', name : '垂直翻转', icon : 'icon-flip-y'},
                {id : 'remove', name : '删除', icon : 'icon-remove'}
            ],

            // 左边按钮条
            lbar : [
                {id : 'xselect', name : '选择/移动', icon : 'icon-select', checked : true},
			    {id : 'setfont', name : '文字', icon : 'icon-zoom-word'},
				{id : 'setlinks', name : '热点链接', icon : 'icon-zoom-links'},
                {id : 'zoomout', name : '放大(z)', icon : 'icon-zoom-out'},
                {id : 'zoomin', name : '缩小(x)', icon : 'icon-zoom-in'},
            ],



            currSeri : null,
            seriesScroll : 0,
            seriesStyles : {
                transform : 'translateX(0)',
                '-webkit-transform' : 'translateX(0)',
            },

            // 图片列表
            imgList : [],
			prdList:[],
			categorys:categorys,

            mainSeriChecked : false,
            prdCreateWinVisible : true,

            keys : [
                {code : 83, ctrlKey : true, fn : 'save'},
                {code : 67, ctrlKey : true, fn : 'copy'},
                {code : 49, ctrlKey : true, fn : 'top'},
                {code : 50, ctrlKey : true, fn : 'bottom'},
                {code : 51, ctrlKey : true, fn : 'up'},
                {code : 52, ctrlKey : true, fn : 'down'},
                {code : 8,  ctrlKey : false, fn : 'remove'},
                {code : 90, ctrlKey : false, fn : 'zoomin'},
                {code : 88, ctrlKey : false, fn : 'zoomout'},
                {code : 37, ctrlKey : false, fn : 'lxmove'},
                {code : 38, ctrlKey : false, fn : 'tymove'},
                {code : 39, ctrlKey : false, fn : 'rxmove'},
                {code : 40, ctrlKey : false, fn : 'bymove'},
				{code : 20, ctrlKey : false, fn : 'tooltext'},
				
				
            ],
			edit: {
                visible: false,
                form: {
                    value: ''
                },
                placeholder: '',
                title: '',
				maxlength: 20
            },
			font: {
                visible: false,
                form: {
                    value: ''
                },
                placeholder: '',
                title: '',
				maxlength: 20
            },
			lines:[],
			fontcolos:false,

        }
	
		
		
    },
	
	methods: {
		 async getMainProduct() {
    	/*
           	 let { data } = await this.http("picApi/getPicCategory", {
                data: {
               
                },
                method: "POST"
            	});
	
			   for(let prd of data.result.data)
			   {
		
			   		this.categorys.push(prd);
			   }
	

			 this.images(this.categorys[0].id,1);*/
			 
			 this.getgallery();
			 this.getproduct();

			let {
				data: mdata
				} = await this.http('/userApi/getFactoryInfo', {
				method: 'POST'
			})
			
			let mid = this.mid;
			
			let msg = mdata.result.info;
			this.$refs.editarea.initEditBody(msg,mid);

			
			 
			

        },

       async images(id,cur_page)
	   {
	   
	   		let { data } = await this.http("picApi/getPicList", {
                data: {
               		pic_category_id:id,
					cur_page:cur_page
                },
                method: "POST"
            	});
	
			   for(let prd of data.result.pics)
			   {
		
			   		this.prdList.push(prd);
			   }
	   },
	    btnClick(btn, shiftKey){
		
		 	 this[btn.id] && this[btn.id]();
            /*if(btn.event !== false){
                this.$refs.editarea.$emit('action', btn.id, shiftKey);
            }else{
			
              
            }*/
        },
		links()
		{
			this.edit.visible = false;
    		var links = this.edit.value;
			this.$refs.editarea.exec('createLink',links);
			
			
		},
		zoomout()
		{

			this.$refs.editarea.zoomout();
		},
		zoomin()
		{
			this.$refs.editarea.zoomin();
		},
		setlinks()
		{

			this.edit.value = '';
			this.edit.maxlength = 20;
            this.edit.title = '热点链接';
            this.edit.placeholder = '请输入网址';
            this.edit.visible = true;
			this.$nextTick(()=>{
				this.$refs.input.focus();
			})
		
		
		},
		setfont()
		{
		
			this.fontcolos = true;
    
		
		},
		setfontcolor(color)
		{
			
			this.$refs.editarea.exec('ForeColor',color);
			this.fontcolos = false;
		},
		setfontsize(event)
		{
		
			this.$refs.editarea.exec('FontSize',event.target.value);
			this.fontcolos = false;
			
		},
	  	 saveAndBack()
		{
		
		},
		async getgallery()
		{

			let { data } = await this.http('/picApi/factoryAlbumList')
            let prds = data.result.albums;
		
			for(let prd of prds)
			{
				let  pic = []; 
				pic['url'] = prd.pic.url;
				pic['pic_title'] = prd.title;
				//this.prdList.push(pic);
			
			}
		}
		,
		async getproduct()
		{
			let {
				data
			} = await this.http('/productApi/getProductCatList', {
				method: 'POST'
			})
     
			this.lines = data.result.productCats
			
		
		}

	 
    },
	mounted(){
		this.mid= this.$route.params.mid;
		this.getMainProduct();
    },

	created()
	{
		  
	
			
	},
	components:{
 		editarea: Editarea
  	}

}
</script>