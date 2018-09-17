<template>
  <ul class="top-bar">
    <li @click="selectTool(item)" :class="item.icon" v-for="(item, i) in topBars" :key="i">
      <Tooltip :content="item.name" placement="bottom"><i class="navbar-icon"></i></Tooltip>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'name',
  data: function() {
    return {
      topBars: [
        // { icon: 'save', name: '保存'},
        { icon: 'turn-x', name: '水平翻转'},
        { icon: 'turn-y', name: '垂直翻转'},
        { icon: 'copy', name: '复制'},
        { icon: 'turn-up', name: '上移一层'},
        { icon: 'turn-down', name: '下移一层'},
        // { icon: 'delete', name: '删除'},
      ]
    }
  },
  methods: {
    selectTool(menu) {
      for(let m of this.topBars) {
        if(m.icon.substr(m.icon.length - 3) == ' on') {
          m.icon = m.icon.substr(0, m.icon.length - 3)
        }
      }

      const i = this.topBars.findIndex(item => {
        return item.name == menu.name
      })

      this.topBars[i].icon = this.topBars[i].icon + ' on'
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
      if (menu.name == '水平翻转') {
        this.$emit('flip', 'x')
      }
      if (menu.name == '垂直翻转') {
        this.$emit('flip', 'y')
      }
      if (menu.name == '向上翻转') {
        this.$bus.emit('rotate', 'up')
      }
      if (menu.name == '向下翻转') {
        this.$bus.emit('rotate', 'down')
      }
    },
    clearStatus() {
      for(let m of this.topBars) {
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
  .top-bar {
    display: inline; padding: 0 20px;
    li {
      display: inline; cursor: pointer;
    }
  }
  .navbar-icon {
     vertical-align: middle;  display: inline-block; width: 36px; height: 20px; background-size: 20px 20px; background-repeat: no-repeat; background-position: center center;
  }
  .save {
    .navbar-icon {
      background-image: url('/static/icon2/Symbol 155 250C 2@3x.png');
    }
    &:hover .navbar-icon,
    &.on .navbar-icon {
      background-image: url('/static/icon2/Symbol 168 250C 1@3x.png');
    }
  }
  .copy {
    .navbar-icon {
      background-image: url('/static/icon2/Symbol 159 250C 2@3x.png');
    }
    &:hover .navbar-icon,
    &.on .navbar-icon {
      background-image: url('/static/icon2/Symbol 172 250C 1@3x.png');
    }
  }
  .turn-x {
    .navbar-icon{
        background-image: url('/static/icon2/flip-x.png');
    }
    &:hover .navbar-icon, &.on .navbar-icon{
        background-image: url('/static/icon2/flip-x-on.png');
    }
  }
  .turn-y {
    .navbar-icon{
        background-image: url('/static/icon2/flip-y.png');
    }
    &:hover .navbar-icon, &.on .navbar-icon{
        background-image: url('/static/icon2/flip-y-on.png');
    }
  }
  .turn-up {
    .navbar-icon {
      background-image: url('/static/icon2/turn-up.png');
    }
    &:hover .navbar-icon,
    &.on .navbar-icon {
      background-image: url('/static/icon2/turn-up-on.png');
    }
  }
  .turn-down {
    .navbar-icon {
      background-image: url('/static/icon2/turn-down.png');
    }
    &:hover .navbar-icon,
    &.on .navbar-icon {
      background-image: url('/static/icon2/turn-down-on.png');
    }
  }
  .delete {
    .navbar-icon {
      background-image: url('/static/icon2/Symbol 53 250C 17@3x.png');
    }
    &:hover .navbar-icon,
    &.on .navbar-icon {
      background-image: url('/static/icon2/Symbol 166 250C 1@3x.png');
    }
  }
</style>
