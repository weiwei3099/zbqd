<template>
  <div style="padding-left: 15px;">
    <div v-for="(line1, i) in lines" v-menu-children :key="i">
      <item :item="line1" @edited-category="get" @del-product-category="get"></item>
    </div>
    <div>
      <Input class="shadow" v-show="add" size="small" @on-enter="addNewLine" v-model="value" placeholder="请输入系列"></Input>
    </div>
  </div>
</template>

<script>
import item from './category-item'
export default {
  props: {
    parent: {},
    lines: ''
  },
  data() {
    return {
      add: false,
      value: ''
    }
  },
  components: {
    item
  },
  methods: {
    showAdd() {
      this.add = true
    },
    get() {
      this.$emit('on-get')
    },
    async addNewLine() {
      let { data } = await this.http('/productApi/addFullSceneCategory', {
        data: {
          parent_id: this.parent.id,
          title: this.value,
        },
        method: 'POST'
      })
      if (!data.code) {
        this.add = false
        this.value = ''
        this.$emit('on-get')
      }
      this.$Message.info(data.msg.zh);
    }
  },
  created() {

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


