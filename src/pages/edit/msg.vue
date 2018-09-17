<template id="contact">
<div class="layout zhuangpei">
  <div class="layout-header">
            <div class="flex">
                <a href="javascript:void(0)" class="abtn xloading icon-loading">
                    <i class="navbar-icon icon-spinner" v-show="ajaxing"></i>
                </a>
                <a href="javascript:void(0)" class="abtn"  @click="saveAndBack">保存返回</a>
                <ul class="top-bar">
                    <li :class="item.icon" v-for="(item, i) in tbar" :key="item.id"  @click="btnClick(item)">
                        <Tooltip :content="item.name" placement="bottom"><i class="navbar-icon"></i></Tooltip>
                    </li>
                </ul>
            </div>
            <span class="tbar-right">
                <Dropdown trigger="click">
                    <a href="javascript:void(0)" class="zoom">
                        {{zoom }}
                        <Icon type="arrow-down-b"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem v-for="item of zooms" :key="item">
                            <div >
                                {{item}}
                            </div>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button type="text" size="large"  icon="play"></Button>
            </span>
        </div>
         
		   <div class="layout-menu-left t-c">
            <div class="menu-items">
                <div class="menu" :class="[item.icon, item.checked && 'on']" v-for="(item, i) in lbar" :key="i"  @click="btnClick(item)" >
                    <Tooltip :content="item.name" placement="right"><i class="navbar-icon"></i></Tooltip>
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
								  <div  class="series-wrapper" style="transform: translateX(0px);">
								 
								   <span class="serie-item">
                                    产品图库
                                   </span>
								   
								   <span class="serie-item">
                                    背景图库
                                   </span>
								   
								   <span class="serie-item">
                                    默认图库
                                   </span>
								   
								   <span class="serie-item">
                                    视频图库
                                   </span>
								  </div>
								</div>
						
							  </div>
							  
							  
							  
							<div  class="series-content">
						  <div  class="serie-prd serie-input" style="display: none;">
							<div  class="ivu-input-wrapper ivu-input-type ivu-input-group ivu-input-group-with-append ivu-input-hide-icon"><i class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
							  <input autocomplete="off" spellcheck="false" placeholder="" class="ivu-input" type="text">
							  <div class="ivu-input-group-append" style=""><span><a href="javascript:">修改</a> <span class="serie-input-split">|</span> <a href="javascript:" class="serie-input-remove">删除</a></span></div>
							</div>
						  </div>
						  
						  
					  <div  class="serie-prd" v-for="item in prdList" >
						  <div class="">
							<div class="serie-img">
						 
							  <img :src="server + item.url"/>
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
                    <Input type="text" v-model="edit.value" :placeholder="edit.placeholder" ref="input" :maxlength="edit.maxlength"></Input>
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
        <div style="overflow-y: auto; width: 134px; padding-top: 3px; border-top: 1px solid rgb(204, 204, 204);  height: auto; padding-left:10px;font-size:12px;">
		
		字体大小:<select name="fontsize" @change="setfontsize($event)">
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

<style lang="less" src="./msg.less" ></style>
<script src="./msg.js"></script>