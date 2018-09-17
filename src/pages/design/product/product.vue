<template>
    <div class="layout zhuangpei">
        <!-- 顶部按钮条 -->
        <div class="layout-header">
            <div class="flex">
                <a href="javascript:void(0)" class="abtn xloading icon-loading">
                    <i class="navbar-icon icon-spinner" v-show="ajaxing"></i>
                </a>
                <a href="javascript:void(0)" class="abtn" @click="saveAndBack">保存返回</a>
                <ul class="top-bar">
                    <li :class="item.icon" v-for="(item, i) in tbar" :key="item.id" @click="btnClick(item)">
                        <Tooltip :content="item.name" placement="bottom"><i class="navbar-icon"></i></Tooltip>
                    </li>
                </ul>
            </div>
            <span class="tbar-right">
                <Dropdown trigger="click">
                    <a href="javascript:void(0)" class="zoom">
                        {{zoom | percentage}}
                        <Icon type="arrow-down-b"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem v-for="item of zooms" :key="item">
                            <div @click="changeZoom(item)">
                                {{item | percentage}}
                            </div>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button type="text" size="large" @click="play" icon="play"></Button>
            </span>
        </div>

        <!-- 左侧按钮条 -->
        <div class="layout-menu-left t-c">
            <div class="menu-items">
                <div class="menu" :class="[item.icon, item.checked && 'on']" v-for="(item, i) in lbar" :key="i"  @click="btnClick(item)">
                    <Tooltip :content="item.name" placement="right"><i class="navbar-icon"></i></Tooltip>
                </div>
            </div>
        </div>

        <div class="container" v-show="!prdCreateWinVisible">
            <div class="layout-content">
                <div class="layout-content-main">
                    <div class="content-main">
                        <design-panel ref="designPanel" @zoom="resetZoom"></design-panel>
                    </div>

                    <!-- 右边的系列条 -->
                    <div class="content-aside series-container">
                        <div class="series-bar flex">
                            <Button icon="chevron-left" type="text" shape="circle" class="b7" size="small" @click="scrollSeries(1)"></Button>
                            <div class="series-list" ref="seriesList">
                                <div class="series-wrapper" ref="seriesWrapper" :style="seriesStyles">
                                    <span class="serie-item" v-for="(item, i) in serieNames" :class="{checked : item.checked}" :key="item.$id" @click="switchImgList(item)" @dblclick="showInputEdit">{{item.title}}</span>
                                </div>
                            </div>
                            <Button icon="chevron-right" type="text" shape="circle" class="b7" size="small" @click="scrollSeries(-1)"></Button>
                            <Button icon="plus" type="text" shape="circle" class="b7" size="small" @click="showSerieCreateWin"></Button>
                        </div>
                        <div class="series-content">
                            <div v-show="inputVisible" class="serie-prd serie-input">
                                <Input v-model="inputVal">
                                    <span slot="append">
                                        <a href="javascript:" @click="editSerie">修改</a>
                                        <span class="serie-input-split">|</span>
                                        <a href="javascript:" class="serie-input-remove" @click="removeSerie">删除</a>
                                    </span>
                                </Input>
                            </div>
                            <div v-for="(img, i) in imgList" :key="img.seq" class="serie-prd">
                                <div :class="{'img-checked' : img.selected}">
                                    <div class="serie-img" @click="changePrd(img)">
                                        <img :src="server + img.url"/>
                                        <div class="img-title">{{img.pic_title}}</div>
                                        <div class="index-thb" v-if="mainSeriChecked">{{i+1}}</div>
                                    </div>

                                    <div class="serie-prd-bar" style="margin:0 -10px;">
                                        <div v-if="img.isMainProduct" class="price">￥：{{img.price}}</div>
                                        <div style="margin-bottom:5px;" v-if="img.isOthers" >
                                            <ButtonGroup>
                                                <Dropdown v-if="img.isOthers" trigger="click" style="float:left;">
                                                    <Button  type="ghost" size="small">
                                                        同色-{{img.sameByTxt}}
                                                        <Icon type="arrow-down-b"></Icon>
                                                    </Button>
                                                    <DropdownMenu slot="list" style="text-align:center;">
                                                        <DropdownItem v-for="color in colors" style="padding:0;">
                                                            <div @click="selectSameBy(img, color)" style="padding:7px 16px;">
                                                                {{color.txt}}
                                                            </div>
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </ButtonGroup>
                                        </div>
                                        <div>
                                            <ButtonGroup>
                                                <Button v-if="img.isOthers" type="ghost" size="small" @click="toVisible(img)">
                                                    <Icon :type="img.is_visible != '0' ? 'ios-circle-filled' : 'ios-circle-outline'" :color="img.is_visible !== '0' ? '#57a3f3' : ''"></Icon>
                                                    {{img.is_visible != '0' ? '显示' : '隐藏'}}
                                                </Button>
                                                <Button v-if="!bgSeriChecked" type="ghost" size="small" @click="toSpe(img)" :icon="img.is_special === '1' ? 'ios-circle-filled' : 'ios-circle-outline'">特殊</Button>
                                                <Button  v-if="!mainSeriChecked" type="ghost" size="small" @click="delPrd(img)" icon="trash-a"></Button>
                                            </ButtonGroup>
                                        </div>


                                    </div>
                                </div>
                            </div>
                            <div class="serie-img serie-add flex flex-center" @click="showPrdCreateWin" v-show="!mainSeriChecked">
                                <i class="ivu-icon ivu-icon-plus"></i>
                            </div>
                        </div>
                        <div class="series-bbar flex flex-center">
                            <span class="series-bbar-btn icon-pre" >
                                <i class="navbar-icon" v-show="lastId" @click="toPre"></i>
                            </span>
                            <span class="series-bbar-btn icon-list" @click="toList">
                                <i class="navbar-icon"></i>
                            </span>
                            <span class="series-bbar-btn icon-next" >
                                <i class="navbar-icon" v-show="nextId" @click="toNext"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 产品添加框 -->
        <div class="container" v-show="prdCreateWinVisible">
            <div class="layout-content">
                <div class="layout-content-main">
                    <div class="content-main">
                        <!-- 图片列表 -->
                        <ul class="product-list flex" style="padding-bottom: 50px;">
                            <li v-for="item in prdList" class="cursor" @click="selectPrd(item)" :key="item.id">
                                <div class="box-mask flex center" v-if="item.checked">
                                    <div>
                                        <img class="share-wechat" :data-id="item.id" src="/static/icon/Symbol 37 – 1@3x.png" width="50" alt="">
                                    </div>
                                </div>
                                <div class="img-box" :style="'background-image:url(' + server + item.url +')'"></div>
                                <div class="flex space-between p-t-10">
                                    <span>{{item.pic_title}}</span>
                                </div>
                            </li>
                        </ul>
                        <div style="position: fixed; bottom: 20px; right: 300px;">
                            <Page :total="paginate.total_record" @on-page-size-change="pageSizeChange" show-total placement="top" :page-size="pageSize" :page-size-opts="[10, 20, 30, 40]" @on-change="toPage" :current="paginate.cur_page" size="small" show-elevator show-sizer></Page>
                        </div>
                    </div>

                    <!-- 图片分类列表 -->
                    <div class="content-aside series-container ">
                        <div class="series-content2">
                            <div class="series-categorys">
                                <Collapse v-if="prdCreateWinVisible">
                                    <Panel v-for="cate of categorys" :key="cate.id" ref="collapse">
                                        <span class="line-title-bar">
                                            {{cate.text}}
                                        </span>

                                        <div style="padding-left: 15px;" slot="content">
                                            <div v-for="item in cate.categorys" :key="item.id" class="series-category" :class="{checked : item.checked}" @click="prdClick(item)">
                                                {{item.title}}
                                            </div>
                                        </div>
                                    </Panel>

                                </Collapse>
                            </div>

                        </div>

                        <div class="series-bbar flex flex-center">
                            <Button type="primary" size="large" @click="addPrd">确定</Button>
                            <Button type="ghost" size="large" @click="selectAllPrd">全选</Button>
                            <Button type="ghost" size="large" @click="hidePrdCreateWin">取消</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--新建系列-->
        <Modal v-model="serieCreateWinVisible" title="新建系列" width="300px">
            <Input v-model="newSerieVal" placeholder="请输入系列名称" style="width:100%;" :maxlength="20"></Input>
            <div slot="footer">
                <Button type="text" size="large" @click="hideSerieCreateWin">取消</Button>
                <Button type="primary" size="large" @click="addNewSerie">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script src="./product.js"></script>
<style lang="less" src="./product.less" scoped></style>
<style lang="less">
.svg_select_points_rot{
    transform:translateY(100%);
}
.series-categorys{
    .ivu-collapse{
        background:none;
        border:none;
    }

    .ivu-icon-arrow-right-b:before{
        content: "\F218";
    }

    .ivu-collapse-header{
        padding-left:10px !important;
        font-size: 14px;
        font-weight: bold;
        height:26px !important;
        line-height:26px !important;
    }

    .ivu-collapse-content>.ivu-collapse-content-box{
        padding-top:0;
        padding-bottom:0;
    }

    .series-category{
        cursor:pointer;
        line-height:26px;
    }

    .checked{
        color:#2d8cf0;
    }
}

.price{
    font-size:14px;
    color:red;
    text-align:left;
}

.img-title{
    text-align:left;
    font-size:14px;
}
.svg-box{
    cursor:move;

    image{
        cursor:default;
    }
}
.svg_select_points{
    stroke-width:1;
    stroke:black;
    fill: #F9FFED;
}
.ivu-collapse-content{
    background:none;
}

.content-aside{
    background-color:#f7f7f7;

}

.serie-prd{
    border-bottom: 1px solid #e4e4e4;
}

.series-bar, .series-bbar{
    border-color:#e4e4e4;
}

.serie-item{
    background-color:#b7b7b7;
}

.img-checked{
    border:1px solid #b7b7b7;
    padding:2px;
}
</style>
