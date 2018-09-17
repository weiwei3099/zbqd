<template>
  <div style="padding:5px 0;" class="cursor flex space-between" :class="{'on': show}" @mouseenter="showHandler" @mouseleave="hideHandler">
    <div v-if="!editing" @click="selectLine">{{item.title}}</div>
    <div class="handler" v-show="show &&!editing">
      <span @click="editProductCat">
        <Icon type="edit" size="12"></Icon>
      </span>
      <span @click="delProductCat">
        <Icon type="ios-trash" size="12"></Icon>
      </span>
    </div>
    <Input class="shadow" v-show="editing" size="small" @on-enter="edit" v-model="value" :placeholder="item.title"></Input>
  </div>
</template>

<script>
export default {
  props: {
    item: {},
  },
  data: function() {
    return {
      show: false,
      editing: false,
      value: this.item.title
    }
  },
  methods: {
    selectLine() {
      this.$bus.emit('onSelect360Category', this.item)
    },
    editProductCat() {
      this.editing = true
    },
    showHandler() {
      this.show = true
    },
    hideHandler() {
      this.show = false
    },
    async edit() {
      let { data } = await this.http('/productApi/modifyFullSceneCategory', {
        data: {
          id: this.item.id,
          title: this.value,
        },
        method: 'POST'
      })
      if (!data.code) {
        this.$Modal.remove();
        this.$emit('edited-category')
        this.editing = false
      }
      this.$Message.info(data.msg.zh);
    },
    async delProductCat() {
      this.$Modal.confirm({
        title: '提示框',
        content: '<p>确认删除本系列吗？</p>',
        loading: true,
        onOk: async () => {
          let { data } = await this.http('/productApi/delFullSceneCategory', {
            data: {
              id: this.item.id
            },
            method: 'POST'
          })
          if (!data.code) {
            this.$Modal.remove();
            this.$emit('del-product-category')
          }
          this.$Message.info(data.msg.zh);

        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.on {
  color: #ff0000
}

.handler {
  padding: 0 0 0 10px;
  span {
    padding: 0 5px;
  }
}

.shadow {
  box-shadow: 2px 5px 5px #EEEEEE;
}
</style>
