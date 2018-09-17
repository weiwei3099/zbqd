<template>
    <div class="layout zhuangpei">
        <!-- 顶部按钮条 -->
        <div class="layout-header">
            <div class="flex">
                <a href="javascript:void(0)" class="abtn xloading icon-loading"></a>
                <a href="javascript:void(0)" class="abtn" @click="back">退出</a>
            </div>
        </div>

        <!-- 左侧按钮条 -->
        <div class="layout-menu-left t-c">
            <div class="menu-items">
                <div class="menu" :class="[item.icon, item.checked && 'on']" v-for="(item, i) in lbar" :key="i"  @click="btnClick(item)">
                    <Tooltip :content="item.name" placement="right"><i class="navbar-icon"></i></Tooltip>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="layout-content">
                <div class="layout-content-main">
                    <div class="content-main">
                        <div ref="canvas" class="pd-ground svg-box">

                        </div>
                    </div>

                    <!-- 右边的系列条 -->
                    <div class="content-aside series-container">
                        <div class="series-bar flex">
                            <Button icon="chevron-left" type="text" shape="circle" class="b7" size="small" @click="scrollSeries(1)"></Button>
                            <div class="series-list" ref="seriesList">
                                <div class="series-wrapper" ref="seriesWrapper" :style="seriesStyles">
                                    <span class="serie-item" v-for="(item, i) in serieNames" :class="{checked : item.checked}" :key="item.$id" @click="switchImgList(item)">{{item.title}}</span>
                                </div>
                            </div>
                            <Button icon="chevron-right" type="text" shape="circle" class="b7" size="small" @click="scrollSeries(-1)"></Button>
                        </div>

                        <div class="series-content">
                            <div v-for="(img, i) in imgList" :key="img.seq" class="serie-prd" v-show="!img.hidden">
                                <div class="serie-img" @click="changePrd(img)">
                                    <img :src="server + img.url"/>
                                    <div class="img-title">{{img.pic_title}}</div>
                                    <div v-if="img.isMainProduct" class="price">￥：{{img.price}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script src="./play.js"></script>
<style lang="less" src="./play.less"></style>
<style>
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
</style>
