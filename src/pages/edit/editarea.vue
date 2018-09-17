<template>
  <div class="syl-editor-editarea">
    <div class="edit-area" id="syl-editor-body" contenteditable="true">
    </div>
  </div>
</template>

<script>
import Edit from './edit';
import {mxt} from './mixins';
const Component =  {
 	edit : null,
	name: "editarea",
	mixins:[mxt],
    data() {
      return {
        editorBody: '',
        currentRange: null,
        isInit: false,
        rangeFocus: false,
		module: {
		  id: 0,
		  title: '',
		  content: '',
		  music: '',
		  share_icon: '',
		  share_content: '',
		  sort: '',
		},
      }
    },
	methods: {
	 init(){
	 	this.hello();
       	this.editorBody = document.getElementById('syl-editor-body');
        this.addListener();
		this.editorBody.focus();
		this.isInit = true
        this.editorBody.focus();
        this.isInit = true
		this.$options.edit = new Edit();
      },
	  addListener() {

        let that = this
        this.editorBody.addEventListener('keydown', function(event){
	        if(event.keyCode == '8')
			{
            	if(that.checkBodyEmpty())
				{
              		event.preventDefault()
            	}
          }
        })
        document.addEventListener('selectionchange', function()
		{	 

          that.setRange()
        })
      },
	  initEditBody(msg,mid) {
        if(this.checkBodyEmpty()) {
          if (!this.isInit) {
            this.editorBody.innerHTML = ''
          } else {
		 
		
		 	if(mid=='999')
			{
				this.editorBody.innerHTML = msg.background;
			}
			else if(mid=='888')
			{
				this.editorBody.innerHTML = msg.introduction;
			}
			else
			{
			  let id = mid;
			  let datas = msg.module[id];	
			  this.editorBody.innerHTML = datas.content;
			  this.module.id  			= datas.id;
			  this.module.title  		= datas.title;
			  this.module.content  		= datas.content;
			  this.module.music  		= datas.music;
			  this.module.share_icon  	= datas.share_icon;
			  this.module.sort  		= datas.sort;
				
			}
         
			
			

          }
        }
      },
	  checkBodyEmpty() {
        return this.editorBody.textContent == ''
      },
	  setRange(range) {
       let selection = document.getSelection();
	   if(!selection)
	   {
	   	let selection = window.getSelection()
	   }
	

       if(range && selection) {
         selection.removeAllRanges()
         this.currentRange = range
         selection.addRange(range)
         return
       }
       if(selection.rangeCount == 0) {
         return
       }
       let _range = selection.getRangeAt(0),
        ancestor = _range.commonAncestorContainer,
        parNode = ancestor.nodeType === 1 ? ancestor : ancestor.parentNode;
 		console.log(_range);
       if(!parNode) return
       if(this.editorBody.contains(ancestor)) {
         this.currentRange = _range
         this.rangeFocus = true
       } else {
         this.rangeFocus = false
       }
      },
      restoreRange() {
        if(!this.currentRange) return
        let selection = document.getSelection()
		if(!selection)
		{
		 let selection = window.getSelection()
		}
        if(selection) {
          selection.removeAllRanges()
          selection.addRange(this.currentRange)
        }
      },
	 exec(name, value) {
        if (document.queryCommandSupported('styleWithCSS')) {
          document.execCommand('styleWithCSS', false, false)
        }
        if(!this.rangeFocus) {
          this.restoreRange()
        }
        if(this.currentRange) {
          if(this[name]) {
            this[name](value)
            this.restoreRange()
            return
			
          }
		  
		  console.log(name);
          document.execCommand(name, false, value)
          this.restoreRange()
        }
      },
	  word()
	  {
	   this.exec('createLink','wwww.baidu.com')
	  
	  },
	  zoomout()
	  {
	  
		var w = window.getComputedStyle(this.editorBody).width;
		w = parseInt(w)+100;

		w = w +'px';
		this.editorBody.style.width = w;
	  
	  },
	  zoomin()
	  {
		var w = window.getComputedStyle(this.editorBody).width;
		w = parseInt(w)-100;
		w = w +'px';
		this.editorBody.style.width = w;
	  
	  },
	  async save()
	  {
	
	  		this.module.content =   this.editorBody.innerHTML;
		
			  	
			 const params  = $.extend({}, this.module);
			
			let {
				data
			} = await this.http('/userApi/modifyProducerCustomerModule', {
				 data: params,
				method: 'POST'
			})
			
			if (!data.code) {
			
				this.$Message.success(data.msg.zh)
			}
	  	
			let url =   '/home/';
			this.$router.push({ path:url })
	   },
	  
	  
	},
	
	
	
	
	
	
    mounted() {
 		this.init();

        this.$on('action', (evtId, shiftKey)=>{

			
            this.$options.edit[evtId] && this.$options.edit[evtId](shiftKey);
        });

        this.$on('notice', (name, args)=>{
            this.$options.edit[name] && this.$options.edit[name].apply(this.$options.edit, args);
        });
    }

}

export default Component;
</script>
