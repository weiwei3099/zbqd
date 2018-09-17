<template>
    <div class="layout" :class="{'layout-hide-text': this.asideToggle, 'aside-toggle': !this.asideToggle}">
        <div class="layout-menu-left t-c">
            <!-- <div class="logo">
                <img class="layout-logo-left" src="https://fitment.chenyoujiu.com//uploads/icon/2016/12/02/148064689916269.png" alt="">
            </div> -->
            <navbar></navbar>
        </div>
        <i-header></i-header>
        <div class="container">
            <!-- <keep-alive> -->
                <router-view></router-view>
            <!-- </keep-alive> -->
        </div>
    </div>
</template>
<script>
import navbar from '@/components/layout/navbar'
import header from '@/components/layout/header'
export default {
    data() {
        return {
            asideToggle: 1,
            menus: [
                    { name: '首页', icon: 'home', size: 22, route: '/home' },
                    { name: '产品', icon: 'ios-folder', size: 18, route: '/product' },
                    { name: '画册', icon: 'ios-book', size: 18, route: '/gallery' },
                    { name: '360', icon: 'android-sync', size: 20, route: '/360' },
                    { name: '发布', icon: 'android-upload', size: 18, route: '/publish' },
                    { name: '订单', icon: 'clipboard', size: 18, route: '/order' },
                    { name: '图库', icon: 'images', size: 18, route: '/images' },
                    { name: '功能', icon: 'plus', size: 18, route: '/' },
            ],
            search: ''
        };
    },
    components:{
        navbar,
        'IHeader': header
    },
    computed: {
        iconSize() {
            return this.spanLeft === 5 ? 14 : 24;
        }
    },
    mounted() {

    },
    beforeDestroy() {

    },
    methods: {
        toggleClick() {
            this.asideToggle = !this.asideToggle
        },
        logout() {
            this.$router.push({ name: 'login' })
        },
        async checkLogin() {
            let { data } = await this.http('/userApi/checkLogin', {
                method: 'POST'
            })
        }
    },
    created() {
        this.checkLogin()
    }
};
</script>

<style lang="less" scoped>
.menu-items li {
    .menu-name {
        transform: translateX(-100px);
        transition: transform 0.5s ease;
    }
    &:hover {
        .menu-name {
            transform: translateX(0);
        }
    }
}
</style>
