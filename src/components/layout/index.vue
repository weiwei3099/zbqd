<template>
<div class="layout" :class="{'layout-hide-text': this.asideToggle, 'aside-toggle': !this.asideToggle}">
    <slot name="navbar"></slot>
    <slot name="header"></slot>
    <div class="container">
        <router-view></router-view>
    </div>
</div>
</template>

<script>
export default {
    name: 'name',
    data() {
        return {
            asideToggle: true
        }
    },
    methods: {}
}
</script>

<style scoped>

</style>
