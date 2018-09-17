<template>
    <div style="padding:10px;">
      <div class="flex" style="margin-bottom: 20px; padding-bottom:20px; border-bottom:solid 1px #e2e2e2;">
            <div>
                <h1 style="font-size: 30px; font-weight: normal">下载申请</h1>
            </div>
        </div>
        <div class="download-apply">
          <div v-if="!data1.length" class="flex flex-center">
            暂无下载。
          </div>
          <ul v-if="data1.length">
            <li v-for="(item, i) in data1" :key="i">
              <div class="name"> {{item.package_title}}</div>
              <div class="action">
                <a @click="action(item.id, 1)" class="valid" href="javascript:void(0)">通过</a>
                <a @click="action(item.id, 0)" class="invalid" href="javascript:void(0)">拒绝</a>
              </div>
            </li>
          </ul>
        </div>
    </div>
</template>

<script>
export default {
  name: 'name',
  data: function() {
    return {
      modal: false,
      data1: [
        // {
        //   id: 1,
        //   package_title: '标题矢量的附件是领导附加',
        //   status: '0'
        // },
        // {
        //   id: 2,
        //   package_title: '标题矢量的附件是领导附加',
        //   status: '1'
        // },
      ]
    }
  },
  methods: {
    async get() {
      let { data } = await this.http('/packageApi/getApplicationList');
      if (!data.code) {
        if (data.result.info) {
          this.data1 = data.result.info
        }
      }
    },
    async action(id, is_valid) {
      let { data } = await this.http('/packageApi/applicationInfoUpdate', {
        data: {
          id,
          is_valid
        },
        method: 'POST'
      });
      if (data.code) {
        this.$Message.error(data.msg.zh)
      } else {
        this.$Message.success(data.msg.zh)
      }
      // this.data1 = data.result.info
    }
  }
}
</script>

<style lang="less" scoped>
  .download-apply {
    li {
      display: flex; justify-content: space-between; padding: 15px 0; border-bottom: solid 1px #f2f2f2; align-items: center;
      .name { font-size: 16px;}
      .action {
        a {
          display:inline-block; padding: 6px 20px; box-shadow: 0px 3px 6px #ccc; margin-left: 8px;
          &.valid{ background:#ff0000; color:#fff;}
          &.invalid{ background:#eee; color:#666;}
        }
      }
    }
  }
</style>
