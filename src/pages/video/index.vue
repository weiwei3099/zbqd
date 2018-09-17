<template>
    <i-page>
        <div class="page-content videos-list" slot="page-content" v-if="!sumView">
            <list :videos="videos" :cate="lv2" @refresh="loadList" @visible="changeVisible"></list>
        </div>

        <!--系列大图-->
        <div class="page-content no-padding" slot="page-content" v-if="sumView" style="height:100%;">
            <sum :lv1s="lv1s" @lv1clk="lv1clk"></sum>
        </div>

        <div class="page-aside" slot="page-aside">
            <div class="aside-tbar" @click="expandAll">
                显示全部
            </div>
            <div class="aside flex-full">
                <div class="ser" v-for="(lv1, lv1Index) in lv1s">
                    <!--一级分类-->
                    <div class="ser-lv1 flex flex-between">
                        <!--一级分类名称-->
                        <div class="flex flex-full">
                            <div @click="expand(lv1)">
                                <Icon :type="lv1.expand ? 'minus-round' : 'plus-round'" class="xicon"></Icon>
                            </div>
                            <div class="ser-lv1-txt" :class="{active: lv1.active}" v-show="!lv1.editing" @click="expand(lv1)">{{lv1.title}}</div>
                            <Input class="inner-input" size="small" placeholder="系列名称" v-if="lv1.editing" v-model="lv1.value" :ref="'input'+lv1.id" @on-enter="updateTitle(lv1)"></Input>
                        </div>

                        <!--一级分类右边的小按钮-->
                        <div class="ser-sbar flex">
                            <Upload :data="uploadForm" :show-upload-list="false" multiple name="Filedata" :action="api + '/uploadFile'" :before-upload="beforeUpload(lv1)" :on-success="uploadIconSuccess">
                                <Icon type="image" size="12" class="xicon active"></Icon>
                            </Upload>
                            <div @click="showTitleEdit(lv1)">
                                <Icon type="compose" size="12" class="xicon active"></Icon>
                            </div>
                            <div @click="showForm(lv1)">
                                <Icon type="plus-round" size="12" class="xicon red"></Icon>
                            </div>
                            <div @click="del(lv1Index, null)">
                                <Icon type="minus-round" size="12" class="xicon red"></Icon>
                            </div>

                        </div>
                    </div>

                    <!--二级分类-->
                    <div class="ser-lv2-wrapper">
                        <div class="ser-lv2 flex flex-between" v-show="lv1.expand" v-for="(lv2, lv2Index) in lv1.lv2s" :class="{xactive: lv2.active}">
                            <!--二级分类标题-->
                            <div class="flex-full ser-lv2-txt" v-show="!lv2.editing" @click="active(lv2Index, lv1Index)">{{lv2.title}}</div>
                            <Input class="inner-input" size="small" placeholder="系列名称" v-if="lv2.editing" v-model="lv2.value" :ref="'input'+lv2.id" @on-enter="updateTitle(lv2)"></Input>

                            <!--二级分类小按钮-->
                            <div class="ser-sbar flex">
                                <div @click="showTitleEdit(lv2)">
                                    <Icon type="compose" size="12" class="xicon active"></Icon>
                                </div>
                                <div @click="del(lv1Index, lv2Index)">
                                    <Icon type="minus-round" size="12" class="xicon red"></Icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="aside-btn img-info-box">
                <Button @click="showForm()" type="text" size="large" class="ser-bbar-txt active">新建视频系列</Button>
            </div>

            <!--弹出表单-->
            <div v-if="form.visible">
                <xform v-model="form.visible" :parent="form.parent"></xform>
            </div>

            <!--删除提示-->
            <div v-if="delConfirm.visible">
                <Modal v-model="delConfirm.visible" width="360">
                    <p slot="header">
                        提示
                    </p>
                    <div>
                        <p>{{delConfirm.title}}</p>
                    </div>
                    <div slot="footer">
                        <Button type="default" size="large" @click="delConfirm.visible = false">取消</Button>
                        <Button type="info" size="large" @click="doDel" ref="cfbtn">确定</Button>
                    </div>
                </Modal>
            </div>

            <div style="position: fixed; bottom: 20px; right: 300px;" v-if="!sumView" v-show="!selectionVisible">
                <Page :total="paginate.total_record" @on-page-size-change="pageSizeChange" show-total placement="top" :page-size="paginate.page_size" :page-size-opts="[10, 20, 30, 40]" @on-change="toPage" :current="paginate.cur_page" size="small" show-elevator show-sizer></Page>
            </div>
        </div>


    </i-page>
</template>

<script>
import list from './list'
import sum from './sum'
import xform from './form'
import { hex_md5 } from '@/util/md5'
const timestamp = Date.now()
export default {
    components: {
        xform, list, sum
    },
    data: function() {
        return {
            selectionVisible: false,
            sumView: true,

            form: {
                visible: false,
                parent: null
            },

            uploadForm: {
                timestamp: timestamp,
                token: hex_md5('fitment_' + timestamp),
                type: 'images',
                userToken: this.$store.state.user.userInfo.userToken,
            },

            modifyForm: {
                id: null,
                title: null
            },

            delConfirm: {
                title: '确定要删除吗?',
                visible: false,
                lv1: null,
                lv2: null
            },

            paginate : {
                page_size: 10,
                cur_page: 1,
                total_record: 0
            },

            lv1s: [],

            videos: [],
            lv2: null
        }
    },

    mounted(){
        this.$bus.on('video.seri.added', ()=>{
            this.addFinish();
        });
        this.$bus.on('video.seri.reload', ()=>{
            this.loadList(true);
        });
        this.reload();
    },

    destroyed() {
      this.$bus.off('video.seri.added');
      this.$bus.off('video.seri.reload');
    },

    methods: {
        beforeUpload(lv1){
            return ()=>{
                this.modifyForm.id = lv1.id;
                this.modifyForm.title = lv1.title;
            };
        },
        async uploadIconSuccess(resp){
            if(!resp.code){
                let {data} = await this.http('/videoApi/modifyCategory', {
                    method: 'POST',
                    data: {
                        id: this.modifyForm.id,
                        title: this.modifyForm.title,
                        pic: resp.result.file
                    }
                });
                if(!data.code){
                    this.$Message.success(resp.msg.zh);
                    this.reload();
                }else{
                    this.$Message.error(resp.msg.zh);
                }

            }else{
                this.$Message.error(resp.msg.zh);
            }

        },
        showForm(lv1) {
            this.form.visible = true;
            this.form.parent = lv1 || null;
        },

        changeVisible(visible){
            this.selectionVisible = visible;
        },

        // reload
        async reload(){
            let {data} = await this.http('/videoApi/getCategory', {
                method: 'POST',
                data: {
                    page_size: 9999,
                    // cid: 0
                }
            });

            const lv1s = [];
            for(let item of data.result.data){
                item.expand = this.lv1s.filter(tmp=>tmp.id === item.id).map(tmp=>tmp.expand)[0] || false;
                item.lv2s = [];
                item.editing = false;
                item.value = '';
                item.active = false;
                lv1s.push(item);

                this.loadLv2Seri(item);
            }

            this.lv1s = lv1s;
            // setTimeout(()=>{
            //     this.lv1clk(0,0);
            // }, 3000);
        },

        //
        async loadLv2Seri(lv1, expand){
            let {data} = await this.http('/videoApi/getCategory', {
                method: 'POST',
                data: {
                    parent_id: lv1.id,
                    page_size: 9999
                }
            });

            if(!data.code){
                const lv2s = [];
                for(let item of data.result.data){
                    item.editing = false;
                    item.value = '';
                    item.active = lv1.lv2s.filter(tmp=>tmp.id === item.id).map(tmp=>tmp.active)[0] || false;
                    lv2s.push(item);
                }
                lv1.lv2s = lv2s;

                if(expand){
                    lv1.expand = true;
                }
            }

        },

        // 加载列表
        async loadList(reset){
            if(!this.lv2){
                this.noData();
                return ;
            }
            if(reset){
                this.paginate.cur_page = 1;
            }
            let {data} = await this.http('/videoApi/getVideoCategoryInfo', {
                method: 'POST',
                data: {
                    cid: this.lv2.id,
                    page_size: this.paginate.page_size,
                    cur_page: this.paginate.cur_page
                }
            });

            if(data.code){
                this.noData();
                return ;
            }else{
                for(let item of data.result.data){
                    item.editing = false;
                    item.value = '';
                    item.playing = false;
                    item.menu = false;
                    item.time = '';
                    item.share_icon = item.share_icon || '/static/albums/album-icon.png';
                    item.share_content = item.share_content || '新款发布';
                }
                this.videos = data.result.data;
                data.result.paginate.cur_page = Number(data.result.paginate.cur_page);
                this.paginate = data.result.paginate;
            }

        },

        noData(){
            this.paginate.cur_page = 1;
            this.paginate.total_record = 0;
            this.videos = [];
        },

        // 展开/收起
        expand(lv1){
            lv1.expand = !lv1.expand;
        },

        // 展开全部
        expandAll(){
            let expand = false;
            for(let lv1 of this.lv1s){
                if(!lv1.expand){
                    expand = true;
                    break;
                }
            }
            for(let lv1 of this.lv1s){
                lv1.expand = expand;
            }
        },

        // 显示编辑框
        showTitleEdit(item){
            item.editing = true;
            item.value = item.title;
            this.$nextTick(()=>{
                this.$refs[`input${item.id}`][0].focus();
            });
        },

        // 更新标题
        async updateTitle(item){
            if(!item.value){
                return ;
            }
            if(item.value === item.title){
                item.editing = false;
                return ;
            }

            let {data} = await this.http('/videoApi/modifyCategory', {
                method: 'POST',
                data: {
                    id: item.id,
                    title: item.value
                }
            });

            if(!data.code) {
                item.editing = false;
                item.title = item.value;
            }
            this.$Message.success(data.msg.zh);
        },

        // 删除
        del(lv1Index, lv2Index){
            this.delConfirm.visible = true;
            this.delConfirm.lv1 = lv1Index;
            this.delConfirm.lv2 = lv2Index;
        },

        // 确认删除
        async doDel(){
            this.delConfirm.visible = false;
            const lv1  = this.lv1s[this.delConfirm.lv1];
            const lv2 = this.delConfirm.lv2 === null ? null : lv1.lv2s[this.delConfirm.lv2];

            const item = lv2 || lv1;
            let {data} = await this.http('/videoApi/delCategory', {
                method: 'POST',
                data: {
                    id: item.id
                }
            });

            if(!data.code){
                if(lv2){
                    lv1.lv2s.splice(this.delConfirm.lv2, 1);
                    if(lv2.active){
                        this.empty();
                    }
                }else{
                    this.lv1s.splice(this.delConfirm.lv1, 1);
                    if(lv1.active){
                        this.empty();
                    }
                }
            }

            this.$Message.success(data.msg.zh);
        },

        // 激活二级分类
        active(lv2Index, lv1Index){
            const lv1 = this.lv1s[lv1Index];
            const lv2 = lv1.lv2s[lv2Index];
            lv1.expand = true;

            if(lv2 && lv2.active){
                return ;
            }

            // active状态
            for(let tmp of this.lv1s){
                tmp.active = lv1 === tmp;
                for(let sub of tmp.lv2s){
                    sub.active = lv2 === sub;
                }
            }

            this.sumView = false;
            this.lv2 = lv2;
            this.paginate.cur_page = 1;
            this.loadList();
        },

        empty(){
            this.lv2 = null;
            this.noData();
        },

        addFinish(){
            if(this.form.parent){
                this.loadLv2Seri(this.form.parent, true);
            }else{
                this.reload();
            }
        },

        // page size changed
        pageSizeChange(size){
            this.paginate.cur_page = 1,
            this.paginate.page_size = size;
            this.loadList();
        },

        // 跳转到指定页
        toPage(page){
            this.paginate.cur_page = page;
            this.loadList();
        },

        lv1clk(index){
            this.active(0, index);
        }
    }
}
</script>

<style scoped>
.page-aside{
    color:#666666;
}
.aside-tbar{
    cursor:pointer;
    text-align:center;
    font-size:12px;
    line-height:50px;
    border-bottom:solid 3px #f0f0f0;
}

.ser{
    padding:4px 8px;
    border-bottom:1px solid #dddee1;
}

.ser-lv1-txt{
    font-size:13px;
    font-weight:bold;
    line-height:38px;
}

.ser-lv2{
    font-size:12px;
    padding-left:12px;
    line-height:28px;
}

.xicon{
    margin:0 3px;
    cursor:pointer;
}

.active{
    color:#008eea;
}

.red{
    color:#fd0303;
}

.flex-full{
    flex:1;
}

.xactive{
    border:1px solid #ececec;
}

.xactive .ser-lv2-txt{
    color:#b7b7b7;
}

.ser-lv1-txt, .ser-lv2-txt{
    cursor:pointer;
}

.ser-lv2-txt{
    cursor:pointer;
}

.inner-input{
    width:150px;
    padding:3px 0;
}

.ser-bbar-txt{
    font-size:16px;
}

.videos-list{
    padding-bottom:50px;
}

.no-padding{
    padding:0!important;
}
</style>
