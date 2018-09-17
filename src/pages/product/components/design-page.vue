<template>
  <div class="layout">
    <div class="layout-header">
      <div style="margin: 0px 0 0 30px" class="flex">
        <slot name="header-toolbar"></slot>
      </div>
    </div>
    <div class="layout-menu-left t-c">
      <div class="menu-items t-c">
        <div @click="selectTool(menu)" class="menu" :class="menu.icon" v-for="(menu, i) in menus" :key="i">
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

    <slot name="select-image"></slot>

  </div>
</template>

<script>
export default {
  data() {
    return {
      menus: [
        // { name: '门框', icon: 'size', selected: false, size: 22, route: '/size' },
        { name: '选择', icon: 'select on', selected: true, size: 22, route: '/select' },
        { name: '放大', icon: 'plus', selected: true, size: 22, route: '/plus' },
        { name: '缩小', icon: 'min', selected: true, size: 22, route: '/min' },
        // { name: '取消选择', icon: 'reset', selected: false, size: 22, route: '/reset' },
        // { name: '复制', icon: 'turnleft', selected: false, size: 22, route: '/turnleft' },
        // { name: '下移一层', icon: 'turnbottom', selected: false, size: 22, route: '/turntop' },
        // { name: '上移一层', icon: 'turntop', selected: false, size: 22, route: '/turntop' },
        //{ name: '向右翻转', icon: 'turnright', selected: false, size: 22, route: '/turnright' },
      ]
    }
  },
  methods: {
    selectTool(menu) {
      for(let m of this.menus) {
        if(m.icon.substr(m.icon.length - 3) == ' on') {
          m.icon = m.icon.substr(0, m.icon.length - 3)
        }
      }

      const i = this.menus.findIndex(item => {
        return item.name == menu.name
      })

      this.menus[i].icon = this.menus[i].icon + ' on'
      this.$store.commit('SET_DESIGN_TOOL', menu.name)
      this.$bus.emit('SET_DESIGN_TOOL', menu.name)

      if (menu.name == '下移一层') {
        this.$bus.emit('TURN_DOWN_ZINDEX')
      }

      if (menu.name == '上移一层') {
        this.$bus.emit('TURN_UP_ZINDEX')
      }

      if (menu.name == '取消选择') {
        this.$bus.emit('CANCEL_SELECT')
      }
      if (menu.name == '复制') {
        this.$bus.emit('COPY')
      }
      if (menu.name == '放大') {
        this.$bus.emit('PLUS')
      }
      if (menu.name == '缩小') {
        this.$bus.emit('MIN')
      }

    },
    clearStatus() {
      for(let m of this.menus) {
        if(m.icon.substr(m.icon.length - 3) == ' on') {
          m.icon = m.icon.substr(0, m.icon.length - 3)
        }
      }
    }
  },
  created() {
    this.$bus.on('CLEAR_TOOLS', ()=>{
      this.clearStatus()
    })
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
  .turntop {
    .navbar-icon {
      background-image: url('/static/icon2/turn-up.png');
    }
    &:hover .navbar-icon,
    &.on .navbar-icon {
      background-image: url('/static/icon2/turn-up-on.png');
    }
  }
  .turnbottom {
    .navbar-icon {
      background-image: url('/static/icon2/turn-down.png');
    }
    &:hover .navbar-icon,
    &.on .navbar-icon {
      background-image: url('/static/icon2/turn-down-on.png');
    }
  }
  .plus {
    .navbar-icon {
      background-image: url('/static/icon2/group-28@3x.png');
    }
    &:hover .navbar-icon,
    &.on .navbar-icon {
      background-image: url('/static/icon2/Symbol 165 250C 1@3x.png');
    }
  }
  .min {
    .navbar-icon {
      background-image: url('/static/icon2/group-29@3x.png');
    }
    &:hover .navbar-icon,
    &.on .navbar-icon {
      background-image: url('/static/icon2/Symbol 164 250C 1@3x.png');
    }
  }
}
</style>
