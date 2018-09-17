<template>
<i-page :aside="false" class="xusr">
	<div slot="header-handler"><a href="javascript:void(0)" @click="logout">退出</a></div>
	<div slot="page-content" class="iflex iflex-col" style="height:100%;width:100%;padding:10px;">
        <div class="iflex iflex-row iflex-full wfull">
            <div class="hfull box" style="background:#fff;padding:20px;">
                <div class="flex m-b-30 cursor" style="height: 100px; position: relative;">
                    <span class="edit-user-icon" @click="editUserName">
                    <Icon type="compose" size="16"></Icon>
                  </span>
                    <Upload :data="uploader" name="Filedata" :action="api + '/uploadFile'" :on-success="uploadComplete">
                        <img v-if="formData.icon" :src="server + formData.icon" class="avatar" />
                        <img v-if="!formData.icon" src="static/icon-nav/Group 1112@3x.png" class="avatar" />
                    </Upload>
                    <div style="padding:0 15px;">
                        <p style="font-size: 18px; margin-bottom: 5px; height: 32px; overflow: hidden; text-overflow:ellipsis;white-space:nowrap;">
                            {{formData.company_name}}
                        </p>
                    </div>
                </div>
                <div class="m-b-30 f16">
                    <Form :model="formData" class="edit-user-info" label-position="left" :label-width="66">
                        <FormItem label="地址">
                            <Input v-model="formData.company_address">
                            <Icon type="compose" slot="append"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem label="网址">
                            <Input v-model="formData.website">
                            <Icon type="compose" slot="append"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem label="mail">
                            <Input v-model="formData.email">
                            <Icon type="compose" slot="append"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem label="电话">
                            <Input v-model="formData.phone">
                            <Icon type="compose" slot="append"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem label="传真">
                            <Input v-model="formData.fax">
                            <Icon type="compose" slot="append"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="updateFactoryInfo">修改</Button>
                        </FormItem>
                    </Form>
                </div>

                <div style="margin-top: 20px;">
                    <div style="padding: 20px 0">二维码</div>
                    <div>
                        <Row guitter="20">
                            <Col :span="12" class="flex center">
                            <div style="width: 100px;">
                                <img :src="server + item.info.qrcode" width="100%" alt="">
                                <p class="flex center">
                                    安装包二维码
                                </p>
                            </div>
                            </Col>
                            <Col :span="12" class="flex center">
                            <div style="width: 100px;">
                                <img :src="server + item.info.wx_qrcode" width="100%" alt="">
                                <p class="flex center">
                                    <span>微信二维码</span>
                                    <span style="padding: 5px 0 0 5px;">

                                        <Upload :show-upload-list="false" :data="uploader" name="Filedata" :action="api + '/uploadFile'" :on-success="uploadWechat">
                                          <Icon type="ios-cloud-upload-outline" size="16"></Icon>
                                        </Upload>
                                        </span>
                                </p>
                            </div>
                            </Col>
                        </Row>

                    </div>
                </div>
            </div>

            <div class="hfull iflex-full box">
                <div class="section box-shadow" style="display: flex; margin-top:0;">
                    <div style="flex:1; height: 32px;">
                        <Row :gutter="24">
                            <Col span="3">
                                <div class="flex center" style="height:32px;">重置密码</div>
                            </Col>
                            <Col span="5">
                            <Input v-model="formReset.mobile" placeholder="手机号"></Input>
                            </Col>
                            <Col span="2">
                            <Button @click="send">验证码</Button>
                            </Col>
                            <Col span="3">
                            <Input v-model="formReset.code" placeholder="请输入验证码"></Input>
                            </Col>
                            <Col span="5">
                            <Input v-model="formReset.oldPassword" placeholder="请输入旧密码"></Input>
                            </Col>
                            <Col span="5">
                            <Input v-model="formReset.password" placeholder="请输入新密码"></Input>
                            </Col>
                        </Row>
                    </div>
                    <div style="width: 66px; justify-content: flex-end; display: flex">
                        <Button type="primary" @click="resetPassword">修改</Button>
                    </div>
                </div>

                <div class="section box-shadow iflex iflex-row card" style="padding:10px;">
                    <!--汇总信息-->
                    <div class="card-sum iflex iflex-col card-bd">
                        <div class="iflex iflex-row iflex-bt card-sum-item">
                            <img class="ximg-large" src="/static/icon-card/icon-usr.png"/>
                            <span class="iflex-full itxt itxt-large">{{card.name}}</span>
                            <span class="ibtn" @click="showEdit('name')"><Icon type="compose" size="16"></Icon></span>
                        </div>

                        <div class="iflex iflex-row iflex-bt card-sum-item">
                            <img class="ximg" src="/static/icon-card/icon-dept.png"/>
                            <span class="iflex-full itxt">{{card.dept}}</span>
                            <span class="ibtn" @click="showEdit('dept')"><Icon type="compose" size="16"></Icon></span>
                        </div>

                        <div class="card-sbtn" @click="showCards">查看业务员</div>
                    </div>

                    <!--详细表单-->
                    <div class="iflex-full card-detail">

                        <div class="iflex iflex-row card-detail-item">
                            <img class="ximg ximg-mr" src="/static/icon-card/icon-mobile.png"/>
                            <span  class="iflex-full itxt itxt-left"  v-if='mflag' @click="dbedit('mobile')">{{card.mobile}}</span>
							<span  class="iflex-full itxt itxt-left"  v-if='inmflag' ><input type='text' v-model="mobile" v-on:blur="msgupdate('mobile')"></span>
                            <span class="ibtn" @click="showEdit('mobile')"><Icon type="compose" size="16"></Icon></span>
                        </div>

                        <div class="iflex iflex-row card-detail-item">
                            <img class="ximg ximg-mr" src="/static/icon-card/icon-wechat.png"/>
                            <span class="iflex-full itxt itxt-left"  v-if='wflag' @click="dbedit('wx_name')">{{card.wx_name}}</span>
							<span  class="iflex-full itxt itxt-left"  v-if='inwflag' ><input type='text' v-model="wx_name" v-on:blur="msgupdate('wx_name')"></span>
                            <span class="ibtn" @click="showEdit('wx_name')"><Icon type="compose" size="16"></Icon></span>
                        </div>

                        <div class="iflex iflex-row card-detail-item">
                            <img class="ximg ximg-mr" src="/static/icon-card/icon-tel.png"/>
                            <span class="iflex-full itxt itxt-left" v-if='pflag' @click="dbedit('phone')">{{card.phone}}</span>
							<span  class="iflex-full itxt itxt-left"  v-if='inpflag' ><input type='text' v-model="phone" v-on:blur="msgupdate('mobile')"></span>
                            <span class="ibtn" @click="showEdit('phone')"><Icon type="compose" size="16"></Icon></span>
                        </div>

                        <div class="iflex iflex-row card-detail-item">
                            <img class="ximg ximg-mr" src="/static/icon-card/icon-email.png"/>
                            <span class="iflex-full itxt itxt-left" v-if='eflag' @click="dbedit('email')">{{card.email}}</span>
							<span  class="iflex-full itxt itxt-left"  v-if='ineflag' ><input type='text' v-model="email" v-on:blur="msgupdate('email')"></span>
                            <span class="ibtn" @click="showEdit('email')"><Icon type="compose" size="16"></Icon></span>
                        </div>

                        <div class="iflex iflex-row card-detail-item">
                            <img class="ximg ximg-mr" src="/static/icon-card/icon-remark.png"/>
                            <span class="iflex-full itxt itxt-left"  v-if='rflag' @click="dbedit('remark')">{{card.remark}}</span>
							<span  class="iflex-full itxt itxt-left"  v-if='inrflag' ><input type='text' v-model="remark" v-on:blur="msgupdate('remark')"></span>
                            <span class="ibtn" @click="showEdit('remark')"><Icon type="compose" size="16"></Icon></span>
                        </div>

                        <div class="iflex iflex-row card-detail-item">
                            <img class="ximg ximg-mr" src="/static/icon-card/icon-addr.png"/>
                            <span class="iflex-full itxt itxt-left" v-if='aflag' @click="dbedit('address')">{{card.address}}</span>
							<span  class="iflex-full itxt itxt-left"  v-if='inaflag' ><input type='text' v-model="address" v-on:blur="msgupdate('address')"></span>
                            <span class="ibtn" @click="showEdit('address')"><Icon type="compose" size="16"></Icon></span>
                        </div>
                    </div>

                    <div class="card-img iflex iflex-center iflex-col" :style="style">
                        <Upload :data="uploader" name="Filedata" :action="api + '/uploadFile'" :on-success="uploadCardPicComplete" accept="image/*" :show-upload-list="false" style="cursor:pointer;">
                            点击上传图片
                        </Upload>
                        <!-- <div class="card-img-btn">点击上传图片</div> -->
                    </div>

                </div>

                <div class="section box-shadow" style="display: flex;">
                    <div style="flex:1; height: 32px;">
                        <Form :model="formLeft" label-position="left" :label-width="100">
                            <FormItem label="新闻推送" width="100%">
                                <Input v-model="formLeft.input1" placeholder="请输入文字内容（50字以内）"></Input>
                            </FormItem>
                        </Form>
                    </div>
                    <div style="width: 66px; justify-content: flex-end; display: flex">
                        <Button type="primary" @click="handleSubmit('formInline')">发布</Button>
                    </div>
                </div>

                <div class="section box-shadow" style="position:relative;">
                    <span class="edit-user-icon" @click="editFactory" style="top: 15px; right: 15px; cursor: pointer">
                      <Icon type="compose" size="16"></Icon>
                    </span>
				
                    <div style="height: 30px; margin-bottom: 20px; padding-top: 10px;">
                        <span class="ucenter-title cursor" @click="show('background')">首页图片</span>
                        <span class="ucenter-title cursor" @click="show('introduction')">公司介绍</span>
				
					
				
						   <span class="ucenter-title" v-for="(item, i) in articlelist" :key="item.id" @click="show(i)">
						    {{item.title}}
						  </span>
						  
						  
					<div  class="menu icon-zoom-del"><div class="ivu-tooltip"><div class="ivu-tooltip-rel"><i class="navbar-icon"></i></div></div></div>
					<div  class="menu icon-zoom-add"><div class="ivu-tooltip"><div class="ivu-tooltip-rel"><i class="navbar-icon"></i></div></div></div>
					<div  class="menu icon-zoom-word"  @click="tedit()"><div class="ivu-tooltip"><div class="ivu-tooltip-rel"><i class="navbar-icon"></i></div></div></div>		
					<div  class="menu icon-zoom-pic"><div class="ivu-tooltip"><div class="ivu-tooltip-rel"><i class="navbar-icon"></i></div></div></div>
					<div  class="menu icon-zoom-music"><div class="ivu-tooltip"><div class="ivu-tooltip-rel"><i class="navbar-icon"></i></div></div></div>
					<div  class="menu icon-zoom-links"><div class="ivu-tooltip"><div class="ivu-tooltip-rel"><i class="navbar-icon"></i></div></div></div>
	
				
                    </div>
                    <div style="height: 300px; overflow: auto;">
					
					   <div class="syl-editor-editarea" v-show="!sourceView">
							<div class="edit-area" id="syl-editor-body" contenteditable="true">44444
							</div>
						  </div>
                        <div v-if="showType=='background'">
                            <img :src="server+item.info.background" alt="" width="100%">
							
			
                        </div>
                        <div v-if="showType=='introduction'">
                            {{item.info.introduction}}
                        </div>
						 <div v-if="showType=='info'">
						 
						   <div class="syl-editor-editarea" v-show="!sourceView">
							<div class="edit-area" id="syl-editor-body" contenteditable="true">44444
							</div>
						  </div>
             
                        </div>
						
                    </div>
                </div>

            </div>
        </div>

        <Modal :title="edit.title" width="600" v-model="edit.visible" @on-ok="modifyFeild">
            <Form ref="formInline" :label-width="80" :model="edit.form">
                <FormItem label="简介">
                    <Input type="text" v-model="edit.value" :placeholder="edit.placeholder" ref="input" :maxlength="edit.maxlength"></Input>
                </FormItem>
            </Form>
        </Modal>


        <Modal title="用户编辑" width="600" v-model="canEditUserName" @on-ok="editUserHandler">
            <modal-edit-user @success="updateIcon" :info="formData" ref="editUser" />
        </Modal>
        <Modal title="公司信息编辑" width="600" v-model="canEditFactory" @on-ok="editFactoryHandler">
            <modal-edit-factory @edited-factory-info="get" :info="formData" ref="editFactory" />
        </Modal>

        <Modal title="业务员列表" width="1000" v-model="cards.visible">
            <div class="cards">
                <div class="section box-shadow iflex iflex-row card" style="padding:10px;" v-for="card in cards.list">
                    <!--汇总信息-->
                    <div class="card-sum iflex iflex-col card-bd">
                        <div class="iflex iflex-row iflex-bt card-sum-item">
                            <img class="ximg-large" src="/static/icon-card/icon-usr.png"/>
                            <span class="iflex-full itxt itxt-large">{{card.name}}</span>
                            <span></span>
                        </div>

                        <div class="iflex iflex-row iflex-bt card-sum-item">
                            <img class="ximg" src="/static/icon-card/icon-dept.png"/>
                            <span class="iflex-full itxt">{{card.dept}}</span>
                            <span></span>
                        </div>

                        <div class="cards-bar iflex iflex-row" v-if="card.agent_status == 0">
                            <div class="iflex-full center iblue" @click="changeStatus(1, card.id)">
                                同意加入
                            </div>

                            <div class="iflex-full center igrey" @click="changeStatus(2, card.id)">
                                拒绝加入
                            </div>
                        </div>

						<div class="cards-bar iflex iflex-row" v-else-if="card.agent_status == 1">
                            <div class="iflex-full center igrey">
                                同意加入
                            </div>

                            <div class="iflex-full center iblue" @click="changeStatus(3, card.id)">
                                取消加入
                            </div>
                        </div>

						<div class="cards-bar iflex iflex-row" v-else>

						</div>

                    </div>

                    <!--详细表单-->
                    <div class="iflex-full card-detail">

                        <div class="iflex iflex-row card-detail-item">
                            <img class="ximg ximg-mr" src="/static/icon-card/icon-mobile.png"/>
                            <span class="iflex-full itxt itxt-left">{{card.mobile}}</span>
                            <span></span>
                        </div>

                        <div class="iflex iflex-row card-detail-item">
                            <img class="ximg ximg-mr" src="/static/icon-card/icon-wechat.png"/>
                            <span class="iflex-full itxt itxt-left">{{card.wx_name}}</span>
                            <span></span>
                        </div>

                        <div class="iflex iflex-row card-detail-item">
                            <img class="ximg ximg-mr" src="/static/icon-card/icon-tel.png"/>
                            <span class="iflex-full itxt itxt-left">{{card.phone}}</span>
                            <span></span>
                        </div>

                        <div class="iflex iflex-row card-detail-item">
                            <img class="ximg ximg-mr" src="/static/icon-card/icon-email.png"/>
                            <span class="iflex-full itxt itxt-left">{{card.email}}</span>
                            <span></span>
                        </div>

                        <div class="iflex iflex-row card-detail-item">
                            <img class="ximg ximg-mr" src="/static/icon-card/icon-remark.png"/>
                            <span class="iflex-full itxt itxt-left">{{card.remark}}</span>
                            <span></span>
                        </div>

                        <div class="iflex iflex-row card-detail-item">
                            <img class="ximg ximg-mr" src="/static/icon-card/icon-addr.png"/>
                            <span class="iflex-full itxt itxt-left">{{card.address}}</span>
                            <span></span>
                        </div>
                    </div>

                    <div class="card-img iflex iflex-center iflex-col" v-if="card.pic" :style="{backgroundImage: `url(${server}${card.pic})`}"></div>
                    <div class="card-img iflex iflex-center iflex-col" v-if="!card.pic"></div>

                </div>
            </div>

            <div slot="footer"></div>
        </Modal>
	</div>
</i-page>
</template>

<script>
import {
	xxtea,
	base64
} from '../../util'
import {
	hex_md5
} from '../../util/md5'
import ModalEditUser from './modal-edit-user'
import ModalEditFactory from './modal-edit-factory'
const timestamp = Date.now()

export default {
	data() {
		return {
			showType: 'background',
			uploader: {
				timestamp: timestamp,
				token: hex_md5('fitment_' + timestamp),
				type: 'images'
			},
			fileList: [],
			editInfo: false,
			item: {
				info: '',
				user: ''
			},
			formLeft: {
				input1: '',
				input2: '',
				input3: ''
			},
			formData: {
				company_address: '',
				website: '',
				icon: '/uploads/pic/2017/09/17/20170919144810.png',
				email: '',
				phone: '',
				fax: '',
			},
			formReset: {
				type: 1,
				is_web: 1,
				msg_id: '',
				mobile: '',
				code: '',
				oldPassword: '',
				password: ''
			},
			canEditUserName: false,
			canEditFactory: false,
			username: this.$store.state.user.userInfo.username,
            edit: {
                visible: false,
                form: {
                    value: ''
                },
                placeholder: '',
                title: '',
				maxlength: 20
            },
            cards: {
                visible: false,
                list: []
            },
            card: {
                pic: '',
                name: '',
                dept: '',
                mobile: '',
                wx_name: '',
                phone: '',
                email: '',
                remark: '',
                address: '',
			
            },
			
            style: {},
            token: '',
			mflag:true,
			inmflag:false,
			wflag:true,
			inwflag:false,
			pflag:true,
			inpflag:false,
			eflag:true,
			ineflag:false,
			rflag:true,
			inrflag:false,
			aflag:true,
			inaflag:false,
			pic: '',
			name: '',
			dept: '',
			mobile: '555',
			wx_name: '',
			phone: '',
			email: '',
			remark: '',
			address: '',
			cinfo:'',
			articlelist:[],
			info:'',
			editorBody: '',
			currentRange: null,
			isInit: false,
			rangeFocus: false
		}
	},
	components: {
		ModalEditUser,
		ModalEditFactory
	},

    mounted(){
        this.token = JSON.parse(localStorage.getItem('userInfo')).agent_token;
        this.loadCard();
    },
	methods: {
        async changeStatus(state, id){
            let { data } = await this.http("/userApi/checkAgentStatus", {
                data: {
                    agent_status: state,
                    id: id
                },
                method: "POST"
            });

            if(data.code === 0){
                this.showCards();
            }else{
                this.$Message.warning(data.msg.zh)
            }
        },

        async showCards(){
            this.cards.visible = true;
            let { data } = await this.http("/userApi/getApplyAgentList", {
                data: {
                    token: this.token
                },
                method: "POST"
            });

            this.cards.list = data.result.data;
        },

        async uploadCardPicComplete(res, file) {
            if(res.code === 0){
                this.card.pic = res.result.file;

                const params  = $.extend({}, this.card);

                let { data } = await this.http("/userApi/updateVisitingCard", {
                    data: params,
                    method: "POST"
                });

                if(data.code === 0 ){
                    this.$Message.success(data.msg.zh)
                }else{
                    this.$Message.warning(data.msg.zh)
                }

            }else {
                this.$Message.warning(data.msg.zh)
            }
		},

        async loadCard(){
            let { data } = await this.http("/userApi/getVisitingCard", {
                data: {
                    token: this.token
                },
                method: "POST"
            });

            if(data.code === 0 && data.result.user){
                $.extend(this.card, data.result.user);
            }
        },
		init(){
		
		
       this.editorBody = document.getElementById('syl-editor-body');

        this.addListener();
        this.initEditBody();
		 this.editorBody.focus();
		  this.isInit = true
        /* this.initMenus();
		
        this.editorBody.focus();
        this.isInit = true*/
      },
	  addListener() {

        let that = this
        this.editorBody.addEventListener('keydown', function(event){
	          if(event.keyCode == '8') {
            if(that.checkBodyEmpty()) {
              event.preventDefault()
              that.initEditBody()
            }
          }
        })
        document.addEventListener('selectionchange', function()
		{	 
		
         if(that.sourceView) {
            return
          }
          /*clearTimeout(timer)
           let timer = setTimeout(function () {
            that.updateMenuState()
          },100)*/
          that.setRange()
        })
      },
	  initEditBody() {
        if(this.checkBodyEmpty()) {
          if (!this.isInit) {
            this.editorBody.innerHTML = this.content
          } else {
            this.editorBody.innerHTML = '<p><br></p>'
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
          document.execCommand(name, false, value)
          this.restoreRange()
        }
      },
	 tedit()
	 {
	 
	  this.exec('FontSize','38px')
	 },
	 dbedit(feild){

			 switch (feild) {
                case 'name':
                   	this.nflag=false;
					this.innflag =true;
					this.name = this.card[feild];
                    break;
               
                case 'mobile':
                    this.mflag=false;
					this.inmflag =true;
					this.mobile = this.card[feild];
                    break;
                case 'wx_name':
                   	this.wflag=false;
					this.inwflag =true;
					this.wx_name = this.card[feild];
                    break;
                case 'phone':
                  	this.pflag=false;
					this.inpflag =true;
					this.phone = this.card[feild];
                    break;
                case 'email':
                    this.eflag=false;
					this.ineflag =true;
					this.email = this.card[feild];
                    break;
                case 'remark':
                    this.rflag=false;
					this.inrflag =true;
					this.remark = this.card[feild];
                    break;
                case 'address':
					this.aflag=false;
					this.inaflag =true;
					this.address = this.card[feild];
                    break;
                default:
            }
			
/*			var oldHtml  = this.card[feild];
          	var newInput = document.createElement('input');
		  	newInput.type = "text";
			newInput.value = oldHtml;
			var oldHtml = ele.innerHTML;
			alert(oldHtml);*/
					  		  
        },
		async msgupdate(feild)
		{

		   switch (feild) {
			  case 'name':
				  this.nflag=true;
				  this.innflag =false;
				  this.card[feild] = this.name;
				  break;
			 
			  case 'mobile':
				  this.mflag=true;
				  this.inmflag =false;
				  this.card[feild]  = this.mobile;
				  		
				  break;
			  case 'wx_name':
				  this.wflag=true;
				  this.inwflag =false;
				  this.card[feild] = this.wx_name;
				  break;
			  case 'phone':
				  this.pflag=true;
				  this.inpflag =false;
				  this.card[feild]  = this.phone;
				  break;
			  case 'email':
				  this.eflag=true;
				  this.ineflag =false;
				  this.card[feild]  = this.email;
				  break;
			  case 'remark':
				  this.rflag=true;
				  this.inrflag =false;
				  this.card[feild]  = this.remark;
				  break;
			  case 'address':
				  this.aflag=true;
				  this.inaflag =false;
				  this.card[feild]  = this.address;
				  break;
			  default:
			  
	
			  

			  
		  	}
			 const params  = $.extend({}, this.card);
            let { data } = await this.http("/userApi/updateVisitingCard", {
                data: params,
                method: "POST"
            });

            if(data.code === 0 ){

                this.$Message.success(data.msg.zh)
            }else{
                this.$Message.warning(data.msg.zh)
            }
		
		},
        showEdit(feild){
            this.edit.feild = feild;
            this.edit.value = this.card[feild];
			this.edit.maxlength = 20;
            switch (feild) {
                case 'name':
                    this.edit.title = '编辑名称';
                    this.edit.placeholder = '请输入名称';
                    break;
                case 'dept':
                    this.edit.title = '编辑部门';
                    this.edit.placeholder = '请输入部门';
                    break;
                case 'mobile':
                    this.edit.title = '编辑手机';
                    this.edit.placeholder = '请输入手机';
					this.edit.maxlength = 11;
                    break;
                case 'wx_name':
                    this.edit.title = '编辑微信号';
                    this.edit.placeholder = '请输入微信号';
                    break;
                case 'phone':
                    this.edit.title = '编辑电话';
                    this.edit.placeholder = '请输入电话';
                    break;
                case 'email':
                    this.edit.title = '编辑邮件';
                    this.edit.placeholder = '请输入邮件';
                    break;
                case 'remark':
                    this.edit.title = '编辑备注';
                    this.edit.placeholder = '请输入备注';
                    break;
                case 'address':
                    this.edit.title = '编辑地址';
                    this.edit.placeholder = '请输入地址';
                    break;
                default:
            }
            this.edit.visible = true;
			this.$nextTick(()=>{
				this.$refs.input.focus();
			})
        },

        async modifyFeild(){
            this.edit.visible = false;
            this.card[this.edit.feild] = this.edit.value;
            const params  = $.extend({}, this.card);
            let { data } = await this.http("/userApi/updateVisitingCard", {
                data: params,
                method: "POST"
            });

            if(data.code === 0 ){

                this.$Message.success(data.msg.zh)
            }else{
                this.$Message.warning(data.msg.zh)
            }
        },

		updateIcon(file) {
			this.formData.icon = file
		},
		editUserHandler() {
			this.$refs.editUser.handleSubmit()
		},
		editUserName() {
			this.canEditUserName = !this.canEditUserName
		},
		editFactoryHandler() {
			this.$refs.editFactory.handleSubmit()
		},
		editFactory() {
			this.canEditFactory = !this.canEditFactory
		},
		async uploadWechat(res, file) {
			let form = {
				wx_qrcode: res.result.file
			}

			let {
				data
			} = await this.http('/userApi/factoryInfoUpdate', {
				data: form,
				method: 'POST'
			})

			if (!data.code) {
				this.item.info.wx_qrcode = res.result.file
				this.$Message.success(data.msg.zh)
			}
		},
		uploadComplete(res, file) {
			this.fileList.push(res.result.file)
		},
		editUserInfo() {
			this.editInfo = !this.editInfo
		},
		async send() {
			let {
				data
			} = await this.http('/smsApi/getCode', {
				data: {
					mobile: this.formReset.mobile
				},
				method: 'POST'
			})
			this.formReset.msg_id = data.result.msg_id
		},
		async resetPassword() {
			if (this.formReset.password) {
				this.formReset.password = base64.encode(this.formReset.password)
			}
			let {
				data
			} = await this.http('/userApi/findPassword', {
				data: this.formReset,
				method: 'POST'
			})
			if (!data.code) {
				this.$Message.success(data.msg.zh)
			}
		},
		show(type) {

	
			if(type=='background'||type=='introduction')
			{
				this.showType = type
			}
			else
			{
			
				this.showType = 'info'
				this.cinfo = this.item.info.module[0].content;
				this.init();
			
			}
			
		},
		async get() {
			let {
				data: data1
			} = await this.http('/userApi/userInfo', {
				method: 'POST'
			})
			this.item.user = data1.result.user
			let {
				data: data2
			} = await this.http('/userApi/getFactoryInfo', {
				method: 'POST'
			})
			this.formData = data2.result.info
			this.item.info = data2.result.info
			this.articlelist =  data2.result.info.module
		},
		async updateUserInfo() {
			let arr = []
			arr.push(this.formData.address)
			let address = base64.encode(JSON.stringify(arr))
			let password = this.formData.password

			let form = {
				username: this.username,
				icon: this.fileList[0],
				address: address,
				signature: this.formData.signature,
				mobile: this.formData.mobile
			}
			if (password) {
				form.password = base64.encode('123')
			}

			let {
				data
			} = await this.http('/userApi/userUpdate', {
				data: form,
				method: 'POST'
			})
			if (!data.cdoe) {
				data.result.user.address = data.result.user.address
				this.$store.dispatch('SIGNIN', data.result.user)
				this.editInfo = false
			}
		},
		edittext(ev)
		{
	/*		event = event || window.event;
        	var keyCode = event.keyCode || event.which; */
			
			 var userSelection;
			if(window.getSelection) 
			{
				userSelection = window.getSelection();
			} 
			else if (document.selection)
			{ 
				userSelection = document.selection.createRange();
			}

			 var rangeIndex = this.getRangeIndex(userSelection,ev);
       		 selectionStart = rangeIndex[0];
			
       		 selectionEnd   = rangeIndex[1];
	
		},
		
		   getRangeIndex(selectionObject,ev) 
		   {
		       var selectionStart, selectionEnd;
		 
				if (window.getSelection)
				{
						
							
                	return [this.selectionStart, textarea.selectionEnd];
            	}
				else 
				{ 
                	var range               = document.selection.createRange();             //对选择的文字create Range
                               
               	 	var selectTextLength    = range.text.length;                            //选中文字长度
               	 	textarea.select();                                                      //textarea全选
                	//StartToStart、StartToEnd、EndToStart、EndToEnd
                	range.setEndPoint("StartToStart", document.selection.createRange());    //指针移动到选中文字开始
                	var selectTextPosition  = range.text.length;                            //选中文字的结束位置
                	range.collapse(false);                                                  //将插入点移动到当前范围的开始
                	range.moveEnd("character", -selectTextLength);   //更改范围的结束位置，减去长度，字符开始位置，character不能改
                	range.moveEnd("character", selectTextLength);   //再更改范围的结束位置，到字符结束位置
                	range.select();                                                         //然后选中字符

               		 return [selectTextPosition - selectTextLength, selectTextPosition];	
				}		
		  },
		async updateFactoryInfo() {

			let form = {
				company_address: this.formData.company_address,
				website: this.formData.website,
				email: this.formData.email,
				phone: this.formData.phone,
				fax: this.formData.fax
			}

			let {
				data
			} = await this.http('/userApi/factoryInfoUpdate', {
				data: form,
				method: 'POST'
			})
			if (!data.cdoe) {
				// data.result.user.address = data.result.user.address
				// this.$store.dispatch('SIGNIN', data.result.user)
				// this.editInfo = false
			}
		}
	},
	created() {
		this.get()
	},
	
    watch: {
        'card.pic'(val){
            if(val){
                this.style = {
                    backgroundImage: `url(${this.server}${val})`
                };
            }else{
                this.style = {};
            }
        }
    }
	,
    mounted() {
      this.init()
    }
}
</script>

<style>
.xusr .content-main{
    margin:0;
}

</style>
<style lang="less" scoped>
    .iblue, .igrey{
        font-size:16px;
        cursor:pointer;
    }
    .iblue{
        color:#82b4cf;
    }
    .igrey{
        color:#c3c3c3;
    }
    .cards-bar{
        position:absolute;
        bottom:0;
        left:0;
        right:0;
    }
    .card-sbtn{
        margin-top:60px;
        font-size:20px;
        color:#0e88c7;
        text-align:center;
        cursor:pointer;
    }
    .ibtn{
        cursor:pointer;
    }
    .itxt{
        font-size:12px;
        color:#898989;
        text-align:center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:nowrap;

        &-large{
            font-size:20px;
            color:#606060;
        }

        &-left{
            text-align:left;
        }
    }
    .ximg{
        width:16px;
        height:16px;

        &-large{
            width:24px;
            height:24px;
        }

        &-mr{
            margin-right:12px;
        }
    }

    .cards{
        max-height:500px;
        overflow-y:auto;
    }

    .card{
        padding:10px;

        &-img{
            width:360px;
            height:180px;
            background:#e4e4e4;
            background-size:contain;
            background-repeat:no-repeat;
            background-position:center;
            position:relative;

            &-btn{
                color:#868686;
                text-align:center;
                font-size:16px;
                cursor:pointer;
            }
        }

        &-sum{
            position:relative;
            padding:0 24px;

            &-item{
                width:150px;
                padding:4px 0;
            }
        }

        &-detail{
            padding:12px 24px;
            height:180px;

            &-item{
                padding:2px 0;
            }
        }

        &-bd{
            border-right:1px solid #707070;
            height:160px;
        }
    }
    .center{
        text-align:center;
    }
    .box{
        width:25%;margin:0 5px;overflow-x:hidden;overflow-y:auto;
    }
    .iflex{
        display:flex;
        align-items:center;

        &-row{
            flex-flow:row;
        }

        &-col{
            flex-flow:column;
        }

        &-full{
            flex:1;
        }

        &-center{
            justify-content:center;
        }

        &-bt{
            justify-content:space-between;
        }
    }

    .wfull{
        width:100%;
    }

    .hfull{
        height:100%;
        overflow-y:auto;
    }
</style>

<style lang="less" scoped>
.section {
    background: #fff;
    margin: 20px;
    box-sizing: border-box;
    padding: 20px;
}
.avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
}
.m-b-30 {
    margin-bottom: 30px;
}
.ucenter-app-icon {
    width: 120px;
    height: 120px;
    border-radius: 10px;
    border: solid 1px #e2e2e2;
    background: #f0f0f0;
}
.ucenter-title {
    background: #1E8CF3;
    color: #fff;
    padding: 10px 20px;
    margin-right: 10px;
}
.box-shadow {
    box-shadow: 0 0 10px #ddd;
}
.edit-user-icon {
    position: absolute;
    top: 0;
    right: 0;
}
.ivu-tooltip-rel {
    display: inline-block;
    position: relative;
}

.tzooz{

    background-image: url("/static/icons/icon-select-on.png");
}
.menu-items {
    width: 40px;
    height: 32px;
    background-size: 24px 24px;
}
.icon-zoom-word{
    background-image: url("/static/icons/t.png");
    width: 40px;
    height: 32px;
    background-size: 24px 24px;
    background-repeat: no-repeat;
    background-position: center center;
	float:right;
}
.icon-zoom-pic{
    background-image: url("/static/icons/pic.png");
    width: 40px;
    height: 32px;
    background-size: 24px 24px;
    background-repeat: no-repeat;
    background-position: center center;
	float:right;
}
.icon-zoom-music{
    background-image: url("/static/icons/music.png");
    width: 40px;
    height: 32px;
    background-size: 24px 24px;
    background-repeat: no-repeat;
    background-position: center center;
	float:right;
}

.icon-zoom-add{
    background-image: url("/static/icons/add.png");
    width: 40px;
    height: 32px;
    background-size: 24px 24px;
    background-repeat: no-repeat;
    background-position: center center;
	float:right;
}
.icon-zoom-del{
    background-image: url("/static/icons/del.png");
    width: 40px;
    height: 32px;
    background-size: 24px 24px;
    background-repeat: no-repeat;
    background-position: center center;
	float:right;
}
.icon-zoom-links{
    background-image: url("/static/icons/links.png");
    width: 40px;
    height: 32px;
    background-size: 24px 24px;
    background-repeat: no-repeat;
  
	float:right;
}
.cinfo{ width:100%; height:300px;}

  .syl-editor-editarea {
    height: 458px;
    min-height: 458px;
    border: 1px solid #666;
    text-align: left;
    padding: 10px 15px;
    overflow-y: auto;
    .edit-area {
      height: 95%;
      outline: none;
      &:active {
        outline: none;
      }
    }
  }
</style>
