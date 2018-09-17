import Editarea from './editarea';
var categorys=[];
export default {
  Edit : null,
  data(){
        return {
            ajaxing : true,
            seq : 10,
            inputVisible : false,
            inputVal : '',
            nextId : null, // 下一个产品的id
            lastId : null, // 上一个产品的id
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

            zooms : [3, 2, 1, 0.75, 0.5, 0.25],

            zoom : 1,

            // 配件系列 - 用于画布中系列的管理
            series : [],

            // 用于右上角的系列李彪
            serieNames : [],

            // 同色的选项
            colors: [],
			categorys:categorys,

            currSeri : null,
            seriesScroll : 0,
            seriesStyles : {
                transform : 'translateX(0)',
                '-webkit-transform' : 'translateX(0)',
            },

            // 图片列表
            imgList : [],
			prdList:[],

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
			fontcolos:false,

        }
	
		
		
    },
	
	methods: {
		 async getMainProduct() {
    

           	 let { data } = await this.http("picApi/getPicCategory", {
                data: {
               
                },
                method: "POST"
            	});
	
			   for(let prd of data.result.data)
			   {
		
			   		this.categorys.push(prd);
			   }
	
	
			 this.images(this.categorys[0].id,1);
			let {
				data: mdata
				} = await this.http('/userApi/getFactoryInfo', {
				method: 'POST'
			})
			
			let mid = this.mid;
			let content = mdata.result.info.module[mid].content;
			this.$refs.editarea.initEditBody(content);
			 
			

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
	  	 saveAndBack(){
		
		},
		

	 
    },
	mounted(){
		this.mid= this.$route.params.mid;
		
		
		this.getMainProduct();
    },

	created()
	{
		    alert(11);
	
			
	},
	 components: {
 		editarea: Editarea
  }

}
