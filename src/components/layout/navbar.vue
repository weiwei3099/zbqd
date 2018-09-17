<template>
    <div class="layout-menu-left t-c" v-navbar="$route.meta.nav">
        <div class="menu-items t-c">
            <slot name="menus">
                <div class="menu" :class="menu.icon" v-for="(menu, i) in menus" :key="i">
                    <router-link :to="menu.route">
                        <Tooltip :content="menu.name" placement="right">
                            <div class="navbar-icon"></div>
                        </Tooltip>
                    </router-link>
                </div>
            </slot>
        </div>
        <div class="menu-items t-c bottom">
            <slot name="menus">

                <div class="menu apply">
                  <a href="javascript:void(0)" @click="showApply()" target="_blank">
                    <Tooltip content="申请" placement="right">
                        <div class="navbar-icon"></div>
                    </Tooltip>
                  </a>
                </div>

                <div class="menu contact">
                  <a href="http://www.chenyoujiu.com/webim.html" target="_blank">
                    <Tooltip content="交流" placement="right">
                        <div class="navbar-icon"></div>
                    </Tooltip>
                  </a>
                </div>
            </slot>
        </div>
        <Modal v-model="applyShow" width="800">
          <apply ref="apply"></apply>
        </Modal>
    </div>
</template>

<script>
import '@/directive'
import Apply from '../../pages/apply/index'
export default {
    name: 'name',
    props: {
        menus: {
            type: Array,
            required: false,
            default() {
                return [
                    { name: '用户中心', icon: 'ucenter', size: 22, route: '/ucenter' },
                    { name: '首页', icon: 'home on', size: 22, route: '/home' },
                    { name: '产品', icon: 'product', size: 18, route: '/product' },
                    { name: '视频', icon: 'video', size: 18, route: '/video' },
                    { name: '画册', icon: 'gallery', size: 18, route: '/gallery' },
                    { name: '360', icon: 'show360', size: 20, route: '/360' },
                    { name: '发布', icon: 'publish', size: 18, route: '/publish' },
                    { name: '订单', icon: 'order', size: 18, route: '/order' },
                    { name: '图库', icon: 'image', size: 18, route: '/image/list/items?type=product' },
                    { name: '介绍', icon: 'introduce', size: 18, route: '/' }
                ]
            }
        }
    },
    data() {
        return {
          applyShow: false,
            bottomMenus: [
                { name: '申请', icon: 'apply', size: 22, route: '/apply' },
                // { name: '交流', icon: 'contact', size: 22, route: '/contact' }
            ]
        }
    },
    computed: {
        menuItems() {
            return this.menus
        }
    },
    components: {
      Apply
    },
    methods: {
      showApply() {
        this.applyShow = !this.applyShow
        this.$refs.apply.get()
      },
        route() {
        //     let nav = this.$route.meta.nav
        //     this.menuItems.map(menu => {
        //         if(menu.icon.substring(menu.icon.length - 3) == ' on') {
        //             menu.icon = menu.icon.substring(0, menu.icon.length - 3)
        //         }
        //         menu.icon = menu.icon
        //         if (menu.icon === nav) {
        //             menu.icon = nav +" on"
        //         }
        //     })
        }
    },
    // watch: {
    //     '$route': 'route'
    // }
}
</script>

<style lang="less">
    .menu-items {
        &.bottom{
            position: absolute; bottom: 0px;
        }
        .navbar-icon {
            width: 40px; height: 32px; background-size: 20px 20px; background-repeat: no-repeat; background-position: center center;
        }
        .ucenter {
            .navbar-icon{
                background-image: url('/static/icon-nav/Group 1112@3x.png');
            }
            &:hover .navbar-icon, &.on .navbar-icon{
                background-image: url('/static/icon-nav/Group 1111@3x.png');
            }
        }
        .home {
            .navbar-icon {
                background-image: url('/static/icon-nav/Group 1119@3x.png');
            }
            &:hover .navbar-icon, &.on .navbar-icon{
                background-image: url('/static/icon-nav/Group 1120@3x.png');
            }
        }
        .product {
            .navbar-icon {
                background-image: url('/static/icon-nav/Group 1123@3x.png');
            }
            &:hover .navbar-icon, &.on .navbar-icon{
                background-image: url('/static/icon-nav/Group 1124@3x.png');
            }
        }
        .video{
            .navbar-icon {
                background-image: url('/static/icon-nav/Group 2217@3x.png');
            }
            &:hover .navbar-icon, &.on .navbar-icon{
                background-image: url('/static/icon-nav/Group 2216@3x.png');
            }
        }
        .gallery {
            .navbar-icon {
                background-image: url('/static/icon-nav/Group 1122@3x.png');
            }
            &:hover .navbar-icon, &.on .navbar-icon{
                background-image: url('/static/icon-nav/Group 1121@3x.png');
            }
        }
        .show360 {
            .navbar-icon {
                background-image: url('/static/icon-nav/Group 1127@3x.png');
            }
            &:hover .navbar-icon, &.on .navbar-icon{
                background-image: url('/static/icon-nav/Group 1128@3x.png');
            }
        }
        .publish {
            .navbar-icon {
                background-image: url('/static/icon-nav/Group 1126@3x.png');
            }
            &:hover .navbar-icon, &.on .navbar-icon{
                background-image: url('/static/icon-nav/Group 1125@3x.png');
            }
        }
        .order {
            .navbar-icon {
                background-image: url('/static/icon-nav/Group 1116@3x.png');
            }
            &:hover .navbar-icon, &.on .navbar-icon{
                background-image: url('/static/icon-nav/Group 1115@3x.png');
            }
        }
        .image {
            .navbar-icon {
                background-image: url('/static/icon-nav/Group 1118@3x.png');
            }
            &:hover .navbar-icon, &.on .navbar-icon{
                background-image: url('/static/icon-nav/Group 1117@3x.png');
            }
        }
        .introduce {
            .navbar-icon {
                background-image: url('/static/icon2/add0.png');
            }
            &:hover .navbar-icon, &.on .navbar-icon{
                background-image: url('/static/icon2/add.png');
            }
        }

        .apply {
            .navbar-icon {
                background-image: url('/static/icon-nav/Group-1132@3x.png');
            }
            &:hover .navbar-icon, &.on .navbar-icon{
                background-image: url('/static/icon-nav/Group 1131@3x.png');
            }
        }

        .contact {
            .navbar-icon {
                background-image: url('/static/icon-nav/Group 1129@3x.png');
            }
            &:hover .navbar-icon, &.on .navbar-icon{
                background-image: url('/static/icon-nav/Group 1130@3x.png');
            }
        }



        .hot-link0  {
            .navbar-icon {
                background-image: url('/static/icon/Symbol 58 – 10@3x.png');
            }
            &:hover .navbar-icon{
                background-image: url('/static/icon/Symbol 58 – 10@3x.png');
            }
        }
        .hot-link1  {
            .navbar-icon {
                background-image: url('/static/icon/Symbol 58 – 10@3x.png');
            }
            &:hover .navbar-icon{
                background-image: url('/static/icon/Symbol 58 – 10@3x.png');
            }
        }
        .hot-move  {
            .navbar-icon {
                background-image: url('/static/icon/Symbol 52 – 10@3x.png');
            }
            &:hover .navbar-icon{
                background-image: url('/static/icon/Symbol 52 – 10@3x.png');
            }
        }
        .hot-product  {
            .navbar-icon {
                background-image: url('/static/icon/Symbol 59 – 1@3x.png');
            }
            &:hover .navbar-icon{
                background-image: url('/static/icon/Symbol 59 – 1@3x.png');
            }
        }


    }
</style>
