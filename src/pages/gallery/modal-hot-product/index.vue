<template>
  <div class="modal-full-container" v-if="show">
    <i-header>
      <div slot="toolbar">
        <Button @click="save" type="text">保存</Button>
      </div>
    </i-header>
    <navbar></navbar>
      <div class="container">
      <div class="layout-content-main">

        <div class="content-main">
          <product-list></product-list>
        </div>

          <div class="page-aside" slot="page-aside" style="background:#fff">
              <div class="aside">
                <product-line ref="productLine"></product-line>
              </div>
          </div>
        </div>

    </div>
  </div>
</template>

<script>
import header from '@/components/layout/header'
import ProductLine from './lines'
import ProductList from './products'
export default {
  props: {
    show: 0
  },
  data: function() {
    return {
    }
  },
  components: {
    'IHeader': header,
    ProductLine,
    ProductList
  },
  methods: {
    save() {
      this.$emit('save')
    }
  }
}
</script>

<style lang="less" scoped>
  .modal-full-container {
    position: fixed; top: 0; right: 0; bottom: 0; left: 0; width: 100%; height: 100%; z-index: 999; background: #f2f2f2;
  }
</style>
