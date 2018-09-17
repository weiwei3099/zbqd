<template>
  <i-page>
    <div class="page-content" slot="page-content">
      <Table :columns="columns8" :data="items" size="small" ref="table"></Table>

      <!-- <div class="flex center" style="padding:20px">
        <Page show-total :total="0" show-elevator></Page>
      </div> -->

    </div>
  </i-page>
</template>

<script>
export default {
  name: "name",
  data() {
    return {
      columns8: [
        {
          title: "订单号",
          key: "order_id"
          //"fixed": "left",
        },
        {
          title: "用户名",
          key: "username"
        },
        {
          title: "联系电话",
          key: "mobile",
          width: 150
        },
        {
          title: "金额",
          key: "price",
          width: 150,
          sortable: true
        },
        {
          title: "支付类型",
          key: "payment_type",
          width: 150
        },
        {
          title: "支付状态",
          key: "payment_status",
          width: 150
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.show(params.index);
                    }
                  }
                },
                "查看"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                "发货"
              )
            ]);
          }
        }
      ],
      items: []
    };
  },
  methods: {
    async getOrderList() {
      let { data } = await this.http("/orderApi/getOrderList", {
        method: "POST"
      });
      if (!data.code) {
        if (data.result.orders) {
          this.items = data.result.orders
        }
      }

      // this.items = [
      //   {
      //     username: "15921477397",
      //     mobile: "15921477397",
      //     order_id: "20161129221834656699",
      //     price: "0.00",
      //     payment_type: "1",
      //     payment_status: "1"
      //   },
      //   {
      //     username: "佛山市久仰科技有限公司",
      //     mobile: "13726648009",
      //     order_id: "20170625213559489685",
      //     price: "0.00",
      //     payment_type: "1",
      //     payment_status: "1"
      //   }
      // ];
    }
  },
  created() {
    this.getOrderList();
  }
};
</script>

<style scoped>

</style>
