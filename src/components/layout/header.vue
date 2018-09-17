<template>
    <div class="layout-header">
        <div style="margin: 0px 0 0 30px" class="flex">
            <slot name="toolbar"></slot>
        </div>
        <div class="search" style="padding-right: 40px; position: relative;">
            <!-- <Input v-model="search" size="small" icon="ios-search-strong" placeholder="请输入..." style="width: 200px"></Input> -->
            <slot name="rightbar"></slot>
        </div>
    </div>
</template>

<script>
export default {
  name: "name",
  data() {
    return {
      search: ""
    };
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.search .ivu-input {
  height: 20px !important;
}
</style>
