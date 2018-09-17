<template>
  <div class="layout">
    <div class="layout-header">
      <div style="margin: 0px 0 0 30px" class="flex">
        <slot name="header-toolbar"></slot>
      </div>
    </div>
    <div class="layout-menu-left t-c">
      <div class="menu-items t-c">
        <div class="menu" :class="menu.icon" v-for="(menu, i) in menus" :key="i">
          <Tooltip :content="menu.name" placement="right">
            <div class="navbar-icon"></div>
          </Tooltip>
        </div>
        <!-- <slot name="left-aside-toolbar"></slot> -->
      </div>
    </div>
    <div class="container">
      <div class="layout-content">
        <div class="layout-content-main">
          <div class="content-main">
            <slot name="design-playground"></slot>
          </div>
          <div class="content-aside">
            <slot name="right-aside"></slot>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      menus: [
        { name: '选择', icon: 'select', size: 22, route: '/select' },
        { name: '大小', icon: 'size', size: 22, route: '/size' },
        { name: '重置', icon: 'reset', size: 22, route: '/reset' },
        { name: '向左翻转', icon: 'turnleft', size: 22, route: '/turnleft' },
        { name: '向右翻转', icon: 'turnright', size: 22, route: '/turnright' },
      ]
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.menu-items {
  &.bottom {
    position: absolute;
    bottom: 0px;
  }
  .navbar-icon {
    width: 40px;
    height: 32px;
    background-size: 24px 24px;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .select {
    .navbar-icon {
      background-image: url('/static/icon2/Symbol 162 250C 1@3x.png');
    }
    &:hover .navbar-icon,
    &.on .navbar-icon {
      background-image: url('/static/icon2/Symbol 52 250C 32@3x.png');
    }
  }
  .size {
    .navbar-icon {
      background-image: url('/static/icon2/Symbol 53 250C 17@3x.png');
    }
    &:hover .navbar-icon,
    &.on .navbar-icon {
      background-image: url('/static/icon2/Symbol 166 250C 1@3x.png');
    }
  }
  .reset {
    .navbar-icon {
      background-image: url('/static/icon2/Symbol 58 250C 33@3x.png');
    }
    &:hover .navbar-icon,
    &.on .navbar-icon {
      background-image: url('/static/icon2/Symbol 163 250C 1@3x.png');
    }
  }
  .turnleft {
    .navbar-icon {
      background-image: url('/static/icon2/Symbol 159 250C 2@3x.png');
    }
    &:hover .navbar-icon,
    &.on .navbar-icon {
      background-image: url('/static/icon2/Symbol 172 250C 1@3x.png');
    }
  }
  .turnright {
    .navbar-icon {
      background-image: url('/static/icon2/Symbol 160 250C 2@3x.png');
    }
    &:hover .navbar-icon,
    &.on .navbar-icon {
      background-image: url('/static/icon2/Group 1460@3x.png');
    }
  }
}
</style>
