<template>
    <li class="cursor" @click="select">
      <div class="box-mask flex center" v-if="selected">
          <div>
              <img class="share-wechat" :data-id="item.pid" src="/static/icon/Symbol 37 – 1@3x.png" width="50" alt="">
          </div>
      </div>

        <div class="img-box" :style="'background-image:url(' + server + item.attr.attr_pic[0].url +')'"></div>
        <div class="flex space-between p-t-10">
            <span>{{item.product_title}}</span>
        </div>
        <div class="flex space-between p-t-5 info">
            <span>¥{{item.attr.attr_pic[0].price}}</span>
            <div class="info-handler">
                <span class="cursor" @click.stop="productFavorite(item.pid)"><Icon type="android-favorite-outline" size="14"></Icon></span>
                <span class="cursor" @click.stop="productBuy(item.pid)"><Icon type="ios-cart" size="14"></Icon></span>
                <span class="cursor" @click.stop="productDel(item.pid)"><Icon type="ios-trash" size="14"></Icon></span>
            </div>
        </div>
    </li>
</template>

<script>
export default {
    props: {
        item: {}
    },
    data: function() {
        return {
          selected: 0
        }
    },
    methods: {
        select() {
            this.selected = !this.selected
            if (this.selected) {
              this.$store.commit('SET_FULL_HOT_PRODUCT_ID', this.item.pid)
            }
        },
        productDel(id) {
            this.$Modal.confirm({
                title: '提示框',
                content: '<p>确认删除本产品吗？</p>',
                loading: true,
                onOk: async () => {
                    let { data } = await this.http('/productApi/productDel', {
                        data: {
                            ids: [id]
                        },
                        method: 'POST'
                    })
                    if( !data.code ) {
                        this.$Modal.remove();
                        this.$parent.getProductList()
                    }
                    this.$Message.info(data.msg.zh);

                }
            });
        },
    }
}
</script>

<style scoped>

</style>
