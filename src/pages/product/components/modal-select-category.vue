<template>
<div class="flex center">
    <Transfer
        :data="data1"
        :target-keys="targetKeys1"
        :render-format="render1"
        @on-change="handleChange1"></Transfer>
</div>
</template>
<script>
export default {
  data() {
    return {
      data1: [],
      targetKeys1: []
    };
  },
  methods: {
    async getParts() {
      let { data } = await this.http("/picApi/getPicCategory", {
        data: {
          type: 3,
          page_size: 1000
        },
        method: "POST"
      });

      let categories = []
      for (let v of data.result.data) {
        const cat = {
          id: v.id,
          key: v.id,
          label: v.title,
          title: v.title,
          description: v.title,
          disabled: false
        };
        categories.push(cat);
      }
      this.data1 = categories
      // this.$store.commit("OTHER", categories);
      // this.getSceneInfo()
    },
    getMockData() {
      let mockData = [];
      for (let i = 1; i <= 20; i++) {
        mockData.push({
          key: i.toString(),
          label: "内容" + i,
          description: "内容" + i + "的描述信息",
          disabled: Math.random() * 3 < 1
        });
      }
      return mockData;
    },
    getTargetKeys() {
      return this.getMockData()
        .filter(() => Math.random() * 2 > 1)
        .map(item => item.key);
    },
    render1(item) {
      return item.label;
    },
    findCategoryById(id) {
      return this.data1.find(item => {
        return item.id == id;
      });
    },
    handleChange1(newTargetKeys, direction, moveKeys) {
      // console.log(newTargetKeys);
      // console.log(direction);
      // console.log(moveKeys);
      this.targetKeys1 = newTargetKeys;
      if (direction == "right") {
        for (let i in moveKeys) {
          let category = this.findCategoryById(moveKeys[i]);
          this.$store.commit("ADD_OTHER_PRODUCT", {title: category.title, cid: category.id, type: 3, product: []});
        }
      } else {
        for (let v of moveKeys) {
          // let category = this.findCategoryById(v);
          this.$store.commit("REMOVE_OTHER", v);
        }
      }
    },
    async getSceneInfo() {
      const id = this.$route.params.productId
      let { data } = await this.http('/productApi/getSceneInfo', {
        data: {
          main_product: id
        },
        method: 'POST'
      })
      if (!data.code) {
        this.initScene(data.result.scene)
      }
    },
    initScene(scene) {
      for (let other_product of scene.other_product) {
        this.$store.commit('INIT_OTHER', other_product)
      }

      this.$bus.emit('INIT_PLAYGROUND_OTHER', scene.other_product)

      // this.data1 = this.$store.state.design.other_product.filter((item) => {
      //   return typeof item.status == 'undefined'
      // })
      // console.log(this.data1)

      this.$store.state.design.other_product.forEach((item) => {
        if(item.status) {
          this.targetKeys1.push(item.id)
        }
      })
    }
  },
  created() {
    // this.getParts();
  }
};
</script>
