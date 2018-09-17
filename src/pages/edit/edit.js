import SVG from "svg.js";
import select from "svg.select.js";
import resize from "svg.resize.js";
import draggable from "svg.draggable.js";
import panzoom from 'svg.panzoom.js';
class Edit{
    constructor(el, server){


	  
    }

	init()
	{
		
     	this.editorBody =  this.$el
        this.addListener();
        this.initEditBody();
		this.editorBody.focus();
		this.isInit = true
		this.info = null;
		this.editorBody= null;
		this.currentRange= null;

     }
	 

	 
	 
	
  
};

export default Edit;
