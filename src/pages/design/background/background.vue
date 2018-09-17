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

    <div style="width:100%;height:100%;position:relative;" ref="pannel" class="svg-box">
        <Button type="text" class="cengdie" @click="showPrdSelect">
            <div class="icon-cengdie"></div>
            <div class="cengdie-text">叠层</div>
        </Button>

        <div class="prev" v-if="last_id" @click="next(last_id)"><Icon type="ios-arrow-left" size="32"></Icon></div>
        <div class="next" v-if="next_id" @click="next(next_id)" style="right:10px;"><Icon type="ios-arrow-right" size="32"></Icon></div>
    </div>

    <prd-select v-show="prdSelectVisible" ref="prdSelect" @hide="hidePrdSelect" @finish="addPrds"></prd-select>
</div>
</template>

<script src="./background.js"></script>
<style lang="less" src="./background.less" scoped></style>
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
