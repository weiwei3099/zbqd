<template>
    <div class="zd">
        <div class="zd-ct">
            <div class="zd-main">
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

            <div class="zd-sbar">
                <div class="zd-sbar-main">
                    <div v-for="cate in cates" :key="cate.$id" class="zd-cate">
                        <div class="zd-cate-txt" @click="cate.expand = !cate.expand">
                            <Icon :type="cate.expand ? 'minus' : 'plus'"></Icon> {{cate.title}}
                        </div>
                        <div class="zd-lv2" v-for="seri in cate.lv2" v-show="cate.expand">
                            <div class="zd-lv2-txt" :class="{'zd-lv2-checked' : seri.checked}" @click="changeSeri(seri)">{{seri.title}}</div>
                        </div>
                    </div>
                </div>

                <div class="zd-sbar-bbar flex flex-center">
                    <Button type="primary" size="large" @click="addPrd">确定</Button>
                    <Button type="ghost" size="large" @click="selectAllPrd">全选</Button>
                    <Button type="ghost" size="large" @click="hide">取消</Button>
                </div>

            </div>
        </div>
    </div>
</template>

<script src="./select.js"></script>
<style src="./select.less" scoped></style>
