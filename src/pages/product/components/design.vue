<template>
  <div
    class="flex center"
    :style="'transform: scale(' + scale+')' + ';width:' + drawer.size.width + '; height:' + drawer.size.height + ';'">
    <div id="drawing" />
  </div>
</template>

<script>

function sizeByHeight(w, h) {
  const winWidth = $(window).width() - 280
  const winHeight = $(window).height() - 240
  const width = Math.ceil( w * winHeight / h)
  return {
    width: width,
    height: winHeight
  }
}

import SVG from "svg.js";
import select from "svg.select.js";
import resize from "svg.resize.js";
import draggable from "svg.draggable.js";
export default {
  data() {
    return {
      drawer: {
        draw: "",
        size: {
          width: $(window).width() - 280,
          height: $(window).height() - 40
        },
        set: "",
        zone: {
          width: 0,
          height: 0
        }
      },
      canvas: {
        size: {},
        rect: {}
      },
      elements: {},
      zIndex: 0,
      selected: 0,
      scale: 1,
      selectCopy: ''
    }
  },
  methods: {
    setZone() {
      let width = 0, height = 0, zoneLeft = 0, zoneTop = 0, zoneRight = 0, zoneBottom = 0;
      let leftArr = [], rightArr = [], topArr = [], bottomArr = []
      for (let c in this.elements) {
        console.log('copy', c.copy)
        leftArr.push(parseInt(this.elements[c].attr.x));
        topArr.push(parseInt(this.elements[c].attr.y));
        rightArr.push(parseInt(this.elements[c].attr.x) + parseInt(this.elements[c].attr.width));
        bottomArr.push(parseInt(this.elements[c].attr.y) + parseInt(this.elements[c].attr.height));
      }
      leftArr.sort((a, b) => { return a - b })
      topArr.sort((a, b) => { return a - b })
      rightArr.sort((a, b) => { return b - a })
      bottomArr.sort((a, b) => { return b - a })

      this.$store.commit('SET_ZONE_LT', { left: leftArr[0], top: topArr[0]})
      this.$store.commit('SET_ZONE_RB', { right: rightArr[0], bottom: bottomArr[0]})
      this.$store.commit('SET_ZONE')
    },
    addElement({pic, categoryName}, attr = {} ) {
      this.$store.commit('SET_CURRENT_CATEGORY', categoryName)
      if (categoryName == '背景') {
        return
      }

      this.zIndex ++
      if (attr.zindex) {
        this.zIndex = attr.zindex
      }

      let width = attr.width || pic.width
      let height = attr.height || pic.height
      let x = attr.x || 0
      let y = attr.y || 0
      let flipX = attr.flip_x ? 1: 0
      let flipY = attr.flip_y ? 1: 0
      if (!this.elements[categoryName]) {

        if (categoryName == '产品颜色') {

        } else {
          this.$store.commit('SET_OTHER_ZINDEX', {
            title: categoryName,
            zindex: this.zIndex
          })
        }

        let is_main = categoryName === '产品颜色' ? true : false;
        let draw = {}
        draw = this.drawer.draw.image(this.server + pic.url).size(width, height).move(x, y)

        if (flipX) {
          this.elements[categoryName].copy.flip('x')
        }
        if (flipY) {
          this.elements[categoryName].copy.flip('y')
        }

        this.elements[categoryName] = {
          zIndex: this.zIndex,
          categoryName,
          is_main,
          product: pic,
          attr: {
            width, height, x, y
          },
          draw
        }

        this.setZone()
        // 复制

        this.action(this.elements[categoryName])

      } else {
        this.elements[categoryName].draw.load(this.server + pic.url);
        if (this.elements[categoryName].copy) {
          this.elements[categoryName].copy.load(this.server + pic.url);
        }
      }

    },
    addElement1({ pic, categoryName }, attr = {}) {
      if (categoryName == '背景') {
        return
      }
      this.zIndex = attr.zIndex || this.zIndex ++
      let width = attr.width || pic.width
      let height = attr.height || pic.height
      let x = attr.x || 0
      let y = attr.y || 0
      if (!this.elements[categoryName]) {
        // let is_main = categoryName === '产品颜色' ? true : false;
        // let draw = {}
        // if (categoryName == '产品颜色') {
        //   // 主产品自适应高度，确定有效区域
        //   this.drawer.zone = sizeByHeight(parseInt(pic.width), parseInt(pic.height))
        //   draw = this.drawer.draw.image(this.server + pic.url).size(this.drawer.zone.width, this.drawer.zone.height)
        //     .move(
        //       (this.drawer.size.width - this.drawer.zone.width) / 2, 100
        //     )
        //   this.$store.commit('SET_ZONE', this.drawer.zone)
        //   this.$store.commit('SET_MAIN_ZINDEX', this.zIndex)
        // } else {
        //   draw = this.drawer.draw.image(this.server + pic.url).size(width, height).move(x, y)
        //   this.$store.commit('SET_OTHER_ZINDEX', {title: categoryName, zindex: this.zIndex})
        // }
        this.elements[categoryName] = {
          zIndex: this.zIndex,
          categoryName,
          is_main,
          product: pic,
          attr: attr,
          draw: draw
        }

        this.elements[categoryName].draw.click(() => {
          if (this.selected) {
            if (this.elements[categoryName].product.id !== this.selected)
            return;
          }
          if (this.$store.state.design.tool == '选择') {
            console.log(this.elements[categoryName])
            if (this.elements[categoryName].draw.selected) {
              this.selected = 0
              this.elements[categoryName].draw.selected = false
              this.elements[categoryName].draw.selectize(false)
              this.elements[categoryName].draw.draggable(false);
              this.elements[categoryName].draw.resize('stop');
            } else {
              this.$store.commit('SET_CURRENT_CATEGORY', categoryName)
              this.selected = this.elements[categoryName].product.id
              this.elements[categoryName].draw.selected = true
              this.elements[categoryName].draw.selectize(true)
              this.elements[categoryName].draw.draggable(true);
              this.elements[categoryName].draw.resize();
            }
          }
        });
        this.action(this.elements[categoryName])
      } else {
        this.elements[categoryName].draw.load(this.server + pic.url);
        if (this.elements[categoryName].copy) {
          this.elements[categoryName].copy.load(this.server + pic.url);
        }
      }
    },
    action(target) {
      target.draw.click(() => {
        this.selectCopy = ''
        console.log(target)
        if (this.selected) {
          if (target.product.id !== this.selected)
          return;
        }
        if (this.$store.state.design.tool == '选择') {
          // console.log(target)
          if (target.draw.selected) {
            this.selected = 0
            target.draw.selected = false
            target.draw.selectize(false)
            target.draw.draggable(false);
            target.draw.resize('stop');
          } else {
            // this.$store.commit('SET_CURRENT_CATEGORY', categoryName)
            this.selected = target.product.id
            target.draw.selected = true
            target.draw.selectize(true)
            target.draw.draggable(true);
            target.draw.resize();
          }
        }
      });
      target.draw.on('resizedone', (e) => {
        this.elements[target.categoryName].attr = {
          width: e.target.width.animVal.value,
          height: e.target.height.animVal.value,
          x: e.target.x.animVal.value,
          y: e.target.y.animVal.value
        }
        this.designAttr(target, {
          width: e.target.width.animVal.value,
          height: e.target.height.animVal.value,
          x: e.target.x.animVal.value,
          y: e.target.y.animVal.value
        })
      })
      target.draw.on('dragend', (e) => {
        this.elements[target.categoryName].attr = {
          width: e.target.width.animVal.value,
          height: e.target.height.animVal.value,
          x: e.target.x.animVal.value,
          y: e.target.y.animVal.value
        }
        this.designAttr(target, {
          width: e.target.width.animVal.value,
          height: e.target.height.animVal.value,
          x: e.target.x.animVal.value,
          y: e.target.y.animVal.value
        })
      })
    },
    copy(target) {
      target.copy.click(() => {
        this.selectCopy = target.categoryName
        console.log(target.copy.is_copy)
        if (this.selected) {
          if (target.product.id !== this.selected)
          return;
        }
        if (this.$store.state.design.tool == '选择') {
          if (target.copy.selected) {
            this.selected = 0
            target.copy.selected = false
            target.copy.selectize(false)
            target.copy.draggable(false);
            target.copy.resize('stop');
          } else {
            this.selected = target.product.id
            target.copy.selected = true
            target.copy.selectize(true)
            target.copy.draggable(true);
            target.copy.resize();
            target.copy.product = target.product
            target.copy.zIndex = target.zIndex
          }
        }
      })
      target.copy.on('resizedone', (e) => {
        this.designAttr(target, {
          width: e.target.width.animVal.value,
          height: e.target.height.animVal.value,
          x: e.target.x.animVal.value,
          y: e.target.y.animVal.value
        }, true)
      })
      target.copy.on('dragend', (e) => {
        this.designAttr(target, {
          width: e.target.width.animVal.value,
          height: e.target.height.animVal.value,
          x: e.target.x.animVal.value,
          y: e.target.y.animVal.value
        }, true)
      })

    },
    designAttr(item, attr, copy = false) {
      this.setZone()
      if (item.is_main) {
        if (!item.copy) {
          this.$store.commit('SET_MAIN_PRODUCT_ATTR', attr)
        }
        // this.$store.commit('SET_MAIN_ATTR', attr)
      } else {
        let attr_id = copy == false ? 1 : 2
        this.$store.commit('SET_OTHER_ATTR', {
          title: item.categoryName,
          pid: item.product.id,
          attr: attr,
          attr_id: attr_id
        })
      }
    },
    findSelected() {
      let selected = {}
      return new Promise((resolve, reject) => {
        const l = Object.keys(this.elements).length;
        let i = 0;
        for (let categoryName in this.elements) {
          let element = this.elements[categoryName]
          if (element.draw.selected) {
            selected = element
          }
          i ++
          if (i == l) {
            resolve(selected)
          }
        }
      })
    },
    findIndex(zIndex) {
      let selected = {}
      return new Promise((resolve, reject) => {
        const l = Object.keys(this.elements).length;
        let i = 0;
        for (let categoryName in this.elements) {
          let element = this.elements[categoryName]
          if (element.zIndex == zIndex) {
            selected = element
          }
          i ++
          if (i == l) {
            resolve(selected)
          }
        }
      })
    },
    async turnIndex(direction) {
      this.$bus.emit('CLEAR_TOOLS')
      for (let categoryName in this.elements) {
        let element = this.elements[categoryName]
      }
      const selectedElement = await this.findSelected()
      console.log('选中', selectedElement)
      const top = Object.keys(this.elements).length;
      if (!selectedElement.draw) {
        this.$Message.error('请选择元素')
        return
      } else if (direction == 'down'){
        if (selectedElement.zIndex == 1) {
          this.$Message.warning('已是最底层')
          return
        }
      } else if (direction == 'up') {
        if (selectedElement.zIndex == top) {
          this.$Message.warning('已是最顶层')
          return
        }
      }
      this.sort(selectedElement.zIndex, direction)
      this.$store.commit('SET_DESIGN_TOOL', '选择')
    },
    async sort(z, d) {
      let target={}, targetIndex = 0, el = {}
      el = await this.findIndex(z)
      if (d == 'up') {
        targetIndex = el.zIndex + 1
      } else {
        targetIndex = el.zIndex - 1
      }
      target = await this.findIndex(targetIndex)

      this.elements[el.categoryName].zIndex = targetIndex
      this.elements[target.categoryName].zIndex = z
      console.log(el, target)

      let productCache = []
      for (let categoryName in this.elements) {
        let element = this.elements[categoryName]
        let copy = null
        if (element.copy) {
          copy = element.copy
        }
        productCache.push({
          zIndex: element.zIndex,
          categoryName: categoryName,
          product: element.product,
          attr: element.attr,
          copy
        })
        delete this.elements[categoryName]
        element.draw.remove()

        if (element.copy) {
          element.copy.remove()
        }

        if (element.draw.selected) {
          element.draw.selected = false
          element.draw.selectize(false)
          element.draw.draggable(false);
        }
      }
      productCache.sort((a, b) => {
        if (a.zIndex > b.zIndex) {
          return 1
        } else {
          return -1
        }
      })
      this.zIndex = 0
      this.selected = 0

      for (let categoryName in productCache) {
        let element = productCache[categoryName]

        if (element.categoryName !== '产品颜色') {
          this.$store.commit('SET_OTHER_ZINDEX', {
            title: element.categoryName,
            zindex: element.zIndex
          })
        } else {
          this.$store.commit('SET_MAIN_ZINDEX', element.zIndex)
        }

        this.addElement({
          pic: element.product,
          categoryName: element.categoryName
        }, element.attr)

        if (element.copy) {
          this.copyElement(element.categoryName)
        }
      }
    },
    cancelSelect() {
      for (let categoryName in this.elements) {
        let element = this.elements[categoryName]
        if (element.draw.selected) {
          element.draw.selected = false
          element.draw.selectize(false)
          element.draw.draggable(false);
        }
      }
    },
    async copyElement(categoryName, attr = {}) {
      this.$bus.emit('CLEAR_TOOLS')
      // if (!this.selected) {
      //   this.$Message.error('请选择元素')
      //   return
      // }
      const copyProduct = this.elements[categoryName].product
      let width = attr.width || copyProduct.attr[0].width
      let height = attr.height || copyProduct.attr[0].height
      let x = attr.x || copyProduct.attr[0].x + 100
      let y = attr.y || copyProduct.attr[0].y
      let flipX = attr.flip_x ? 1: 0
      let flipY = attr.flip_y ? 1: 0
      this.elements[categoryName].copy = this.drawer.draw.image(this.server + copyProduct.url).size(width, height).move(x, y)

      if (flipX) {
        this.elements[categoryName].copy.flip('x')
      }
      if (flipY) {
        this.elements[categoryName].copy.flip('y')
      }

      this.elements[categoryName].copy.is_copy = true
      this.designAttr(this.elements[categoryName], {
        width,
        height,
        x,
        y
      }, true)
      this.copy(this.elements[categoryName])
      this.$store.commit('SET_DESIGN_TOOL', '选择')
    },
    plus() {
      this.$bus.emit('CLEAR_TOOLS')
      if (this.scale < 3) {
        this.scale +=0.2
      }
    },
    min() {
      this.$bus.emit('CLEAR_TOOLS')
      if (this.scale > 0.2) {
        this.scale -=0.2
      }
    },
    async flip(direction) {
      this.$bus.emit('CLEAR_TOOLS')

      const selected = await this.findSelected()

      if (!this.selectCopy) {
        if (!selected.is_main) {
          this.$store.commit('SET_OTHER_FLIP', {
            title: selected.categoryName,
            pid: selected.product.id,
            direction,
            attr_id: 1
          })
        }
        if (selected.draw.transform('x') !== 0 || selected.draw.transform('y') !== 0) {
          this.elements[selected.categoryName].draw.remove()
          this.elements[selected.categoryName].draw.selectize(false)
          this.elements[selected.categoryName].draw = this.drawer.draw.image(selected.draw.src).size(selected.draw.width(), selected.draw.height()).move(selected.draw.x(), selected.draw.y())
          this.elements[selected.categoryName].draw.selected = true
          this.elements[selected.categoryName].draw.selectize(true)
          this.action(this.elements[selected.categoryName])
          return
        }
        selected.draw.flip(direction)
      } else {
        if (!this.elements[this.selectCopy].copy.is_main) {
          this.$store.commit('SET_OTHER_FLIP', {
            title: this.elements[this.selectCopy].categoryName,
            pid: this.elements[this.selectCopy].product.id,
            direction,
            attr_id: 2
          })
        }
        if (this.elements[this.selectCopy].copy.transform('x') !== 0 || this.elements[this.selectCopy].copy.transform('y') !== 0) {
          this.elements[this.selectCopy].copy.remove()
          this.elements[this.selectCopy].copy.selectize(false)
          this.elements[this.selectCopy].copy = this.drawer.draw.image(this.elements[this.selectCopy].copy.src)
          .size(this.elements[this.selectCopy].copy.width(), this.elements[this.selectCopy].copy.height())
          .move(this.elements[this.selectCopy].copy.x(), this.elements[this.selectCopy].copy.y())

          this.elements[this.selectCopy].copy.selected = true
          this.elements[this.selectCopy].copy.selectize(true)
          this.copy(this.elements[selected.categoryName])
          return
        }
        this.elements[this.selectCopy].copy.flip(direction)
      }

      this.$store.commit('SET_DESIGN_TOOL', '选择')
    }
  },
  mounted() {
    const width = this.drawer.size.width;
    const height = this.drawer.size.height;
    this.drawer.draw = SVG("drawing").size(width, height);
    this.drawer.set = this.drawer.draw.set()
  },
  created() {
    this.$bus.on('TURN_DOWN_ZINDEX', () => {
      this.turnIndex('down')
    })
    this.$bus.on('TURN_UP_ZINDEX', () => {
      this.turnIndex('up')
    })
    this.$bus.on('CANCEL_SELECT', () => {
      this.cancelSelect()
    })
    this.$bus.on('COPY', () => {
      this.copyElement(this.$store.state.design.currentCategory)
    })
    this.$bus.on('PLUS', () => {
      console.log(33)
      this.plus()
    })
    this.$bus.on('MIN', () => {
      this.min()
    })

    this.$bus.on('flip', (direction) => {
      this.flip(direction)
    })

  }
}
</script>

<style scoped>

</style>
