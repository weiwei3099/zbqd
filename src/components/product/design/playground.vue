<template>
  <div :style="'width:' + drawer.size.width + '; height:' + drawer.size.height + ';background:url(' + background + ') center top'">
    <div id="drawing">

    </div>
    <img ref="tempUrl" style="display:none" :src="tempUrl" />
  </div>
</template>

<script>
import SVG from 'svg.js'
import select from 'svg.select.js'
import resize from 'svg.resize.js'
import draggable from 'svg.draggable.js'
export default {
  data: function() {
    return {
      drawer: {
        draw: '',
        size: {
          width: $(window).width() - 280,
          height: $(window).height() - 40,
        },
        set: '',
      },
      scene: {},
      background: '',
      product: {
        // kuang: {},
        // lashou: {},
        // suo: {},
      },
      mainProduct: '',
      elements: {},
      tempUrl: ''
    }
  },
  methods: {
    saveDesign() {
      return this.elements
    },
    add(name) {
      switch (name) {
        case 'kuang':
          this.product[name] = this.drawer.draw.image('https://fitment.chenyoujiu.com//uploads/images/2016/11/22/14798167554956.png').size(470, 580);
          break;
        case 'lashou':
          this.product[name] = this.drawer.draw.image('https://fitment.chenyoujiu.com//uploads/images/2016/11/22/147981672473834.png').size(23, 115);
          break;
        case 'suo':
          this.product[name] = this.drawer.draw.image('https://fitment.chenyoujiu.com//uploads/images/2016/11/22/14798167373419.png').size(14, 115);
          break;
      }
      this.set.add(this.product[name])
      this.product[name].click(() => {
        this.product[name].selectize({ deepSelect: true });
        this.product[name].draggable()
        this.product[name].selectize().resize();
      })

      this.product[name].on('resizedone', (e) => {
        console.log(e.target.x.animVal.value)
      })
      this.product[name].on('dragend', (e) => {
        console.log(e.target.x.animVal.value)
      })
    },
    designPic({ pic, line }) {
      if (line.line == '背景系列') {
        this.background = this.server + pic.url
      } else {
        // this.tempUrl = this.server + pic.url
        // var rw = this.$refs.tempUrl.naturalWidth
        let image = new Image()
        image.src = this.server + pic.url
        this.product[pic.id] = this.drawer.draw.image(this.server + pic.url).size(image.width, image.height);

        this.product[pic.id].click(() => {
          this.product[pic.id].selectize({ deepSelect: true });
          this.product[pic.id].draggable()
          this.product[pic.id].selectize().resize();
        })
        console.log('dddddd', pic, line)
        this.elements[pic.id] = {
          pid: line.product.id,
          pcid: line.lineId,
          is_default: 1,
          pic: pic,
          attr: {}
        }

        this.product[pic.id].on('resizedone', (e) => {
          //console.log(e.target.width.animVal.value, e.target.height.animVal.value, e.target.x.animVal.value, e.target.y.animVal.value)
        })
        this.product[pic.id].on('dragend', (e) => {
          this.elements[pic.id].attr = {
            zindex: 1,
            width: e.target.width.animVal.value,
            height: e.target.height.animVal.value,
            left: e.target.x.animVal.value,
            top: e.target.y.animVal.value,
            rotate: 0,
            scaleX: 1,
            scaleY: 1,
            zone: {
              width: e.target.width.animVal.value,
              height: e.target.height.animVal.value,
            }
          }
          //console.log(e.target.width.animVal.value, e.target.height.animVal.value, e.target.x.animVal.value, e.target.y.animVal.value)
        })

      }

      //console.log(pic, line)
    },
    addMainProduct({ pic, line }) {
      let image = new Image()
      image.src = this.server + pic.url
      if (!this.mainProduct) {
        this.mainProduct = this.drawer.draw.image(this.server + pic.url).size(image.width, image.height);
      } else {
        this.mainProduct.load(this.server + pic.url)
      }
    }
  },
  mounted() {
    const width = this.drawer.size.width
    const height = this.drawer.size.height
    this.drawer.draw = SVG('drawing').size(width, height)
    this.set = this.drawer.draw.set()



    // var rect = this.drawer.draw.rect(100, 100).fill({color:'#33ccff', opacity: 0.6})
    // this.set.add(rect)

    // rect.selectize({ deepSelect: true });
    // rect.draggable()
    // rect.selectize().resize();

    // rect.on('resizedone', (e) => {
    //     // $(this.$refs.saveBtn).fadeIn()
    //     // this.hotAttr = {
    //     //     style: `width: ${e.target.width.animVal.value}px; height: ${e.target.height.animVal.value}px; left: ${e.target.x.animVal.value + 20}px; top: ${e.target.y.animVal.value + 20}px`,
    //     //     width: e.target.width.animVal.value,
    //     //     height: e.target.height.animVal.value
    //     // }
    // })
    // rect.on('dragend', (e) => {
    //     // $(this.$refs.saveBtn).fadeIn()
    //     // this.hotAttr = {
    //     //     style: `width: ${e.target.width.animVal.value}px; height: ${e.target.height.animVal.value}px; left: ${e.target.x.animVal.value + 20}px; top: ${e.target.y.animVal.value + 20}px`,
    //     //     width: e.target.width.animVal.value,
    //     //     height: e.target.height.animVal.value
    //     // }
    // })
    // this.add('kuang')
    // this.add('lashou')
    // this.add('suo')
  },
  destroyed() {
    this.$bus.off('designPic')
  },
  created() {
    // if (Object.keys(this.$store.state.design.elements).length > 0) {
    //     for (let v in this.$store.state.design.elements) {
    //         this.designPic(this.$store.state.design.elements[v])
    //     }
    // }
    this.$bus.on('designPic', (args) => {
      this.$store.commit('ADD_ELEMENT', args)
      // this.designPic(args)
      this.addMainProduct(args)
    })
  }
}
</script>

<style scoped>

</style>
