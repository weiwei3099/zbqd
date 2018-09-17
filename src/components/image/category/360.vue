<template>
  <div style="padding-left: 15px;">
    <div v-for="(line1, i) in lines" v-menu-children :key="i">
      <item :item="line1" @del-product-category="delProductCategory"></item>
    </div>
    <Input class="shadow" v-show="add" size="small" @on-enter="addNewLine" v-model="value" placeholder="请输入系列"></Input>
  </div>
</template>

<script>
import item from './360-item'
export default {
  props: {
    add: false
  },
  data() {
    return {
      lines: '',
      value: ''
    }
  },
  components: {
    item
  },
  methods: {
    async delProductCategory() {

    },
    async addNewLine() {
      let { data } = await this.http('/productApi/addFullScenePicCategory', {
        data: {
          title: this.value,
        },
        method: 'POST'
      })
      if (!data.code) {
        this.$Modal.remove();
        this.$bus.emit('addedNew360Line')
        this.value = ''
        this.getList()
      }
      this.$Message.info(data.msg.zh);
    },
    async getList() {
      let { data } = await this.http('/productApi/getFullScenePicCat', {
        method: 'POST'
      })
      this.lines = data.result.data
     }
  },
  created() {
    this.getList()
    this.$bus.on('get360Lines', () => {
      this.getList()
    })
  }
}
</script>

<style scoped>
.menu-children {
  display: none;
}
.shadow {
  box-shadow: 2px 5px 5px #EEEEEE;
}
</style>


