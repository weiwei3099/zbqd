<template>
  <div class="flex center" :style="'width:' + drawer.size.width + '; height:' + drawer.size.height + ';'">
    <div id="drawing"></div>
  </div>
</template>

<script>
import SVG from "svg.js";
import select from "svg.select.js";
import resize from "svg.resize.js";
import draggable from "svg.draggable.js";
export default {
  data: function() {
    return {
      drawer: {
        draw: "",
        size: {
          width: $(window).width() - 280,
          height: $(window).height() - 40
        },
        set: ""
      },
      scene: {},
      elements: {},
      // tempUrl: ""
    };
  },
  methods: {
    addElement({ pic, categoryName }, attr = {}, isMain = false) {
      let width = attr.width || pic.width
      let height = attr.height || pic.height
      let x = attr.x || 0
      let y = attr.y || 0
      if (!this.elements[categoryName]) {
        this.elements[categoryName] = {
          is_main: isMain,
          draw: this.drawer.draw.image(this.server + pic.url).size(width, height).move(x, y)
        }
      }else {
        this.elements[categoryName].draw.load(this.server + pic.url);
      }
      this.$store.commit('DEFAULT_OTHER_PRODUCT', {
        is_main: isMain || false,
        title: categoryName,
        product: {
          id: pic.id,
          is_default: 1,
          attr: {
            width,
            height,
            x,
            y
          }
        }
      })

      this.elements[categoryName].draw.click(() => {
        if (this.$store.state.design.tool == '选择') {
          if (this.elements[categoryName].draw.selected) {
            this.elements[categoryName].draw.selected = false
            this.elements[categoryName].draw.selectize(false)
            this.elements[categoryName].draw.draggable(false);
            this.elements[categoryName].draw.resize('stop');
          } else {
            this.elements[categoryName].draw.selected = true
            this.elements[categoryName].draw.selectize(true)
            this.elements[categoryName].draw.draggable(true);
            this.elements[categoryName].draw.resize();
          }
        }
        this.elements[categoryName].draw.on('resizedone', (e) => {
          this.design_default_other(categoryName, this.elements[categoryName].is_main, pic, e)
        })
        this.elements[categoryName].draw.on('dragend', (e) => {
          this.design_default_other(categoryName, this.elements[categoryName].is_main, pic, e)
        })
      });
    },
    design_default_other(categoryName, is_main, product, t) {
      this.$store.commit('DEFAULT_OTHER_PRODUCT', {
        is_main,
        title: categoryName,
        product: {
          id: product.id,
          is_default: 1,
          attr: {
            width: t.target.width.animVal.value,
            height: t.target.height.animVal.value,
            x: t.target.x.animVal.value,
            y: t.target.y.animVal.value
          }
        }
      })
    }
  },
  mounted() {
    const width = this.drawer.size.width;
    const height = this.drawer.size.height;
    this.drawer.draw = SVG("drawing").size(width, height);
    this.set = this.drawer.draw.set();

    this.$bus.on('INIT_PLAYGROUND_OTHER', (others) => {
      for(let other_product of others) {
        for (let product of other_product.products) {
          if(product.is_default == "1") {
            this.addElement({
              pic: product,
              categoryName: other_product.title
            }, product.attr)
          }
        }
      }
    })

  },
  destroyed() {
    this.$bus.off("designPic");
  },
  created() {

  }
};
</script>

<style scoped>

</style>
