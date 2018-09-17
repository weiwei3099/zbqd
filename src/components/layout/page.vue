<template>
  <div class="layout-content-main">
    <i-header>
      <div slot="toolbar">
        <slot name="header-handler"></slot>
      </div>
      <div slot="rightbar">
          <slot name="header-rightbar"></slot>
      </div>
    </i-header>

    <navbar v-if="navbar"></navbar>

    <div class="content-main">
      <slot name="page-content"></slot>
    </div>
    <div class="content-aside" v-if="aside">
      <slot name="page-aside"></slot>
    </div>
  </div>
</template>

<script>
import IHeader from './header'
import navbar from './navbar'
export default {
  props: {
    navbar: {
      type: Boolean,
      default: false
    },
    aside: {
      type: Boolean,
      default: true
    }
  },
  components: {
    IHeader, navbar
  },
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
