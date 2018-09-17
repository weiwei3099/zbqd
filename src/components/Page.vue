<template>
    <div class="layout-content-main">
        <div class="content-main">
            <!-- <div class="content-bar">
                <div class="layout-breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb-item :href="item.path" v-for="(item, index) in $route.matched" :key="index">{{item.name}}</Breadcrumb-item>
                    </Breadcrumb>
                </div>
            </div> -->
            <slot name="page-content"></slot>
        </div>

        <div class="content-aside" v-if="tpl != '1'">
            <slot name="page-aside"></slot>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        tpl: {
            type: String,
            default: '2'
        }
    }
}
</script>
