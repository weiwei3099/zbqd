<template>
  <div style="height: 100%" class="flex center">
    <div style="padding: 60px; min-width: 500px; background:#fff">

      <!-- <div v-if="!items.length">暂无</div> -->
      <div>
        <div class="user-info">
          <img :src="server + $store.state.user.userInfo.icon" width="50" height="50" />
          <h1>{{$store.state.user.userInfo.username}}</h1>
          <p>{{$store.state.user.userInfo.signature}}</p>
        </div>
        <img width="100%" :src='server + $store.state.user.userInfo.icon' alt="">
        <div class="p-10" v-if="items.length">
          {{items[0].title}}
        </div>
      </div>

      <div class="flex center">
        <Button v-if="items.length" @click="package(items[0].id)" class="btn" type="primary">更新</Button>
        <Button v-if="!items.length" @click="package()" class="btn" type="primary">发布</Button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'name',
  data() {
    return {
      items: []
    }
  },
  methods: {
    async package(id) {
      let { data } = await this.http('/packageApi/package', {
        data: {
          version: id,
          id,
          title: '打包',
        },
        method: 'POST'
      })

      if (!data.code) {
        this.$Message.success(data.msg.zh)
      } else {
        this.$Message.error(data.msg.zh)
      }

      this.get()
    },
    async get() {
      let { data } = await this.http('/packageApi/getPackageList', {
        data: {
          apk_version:1,
          only_mine: 1,
          // factory_name: '2',
          package_title: '打包'
        },
        method: 'POST'
      })

      if (data.result.packages) {
        this.items = data.result.packages
      }

    }
  },
  created() {
    this.get()
  }
}
</script>

<style lang="less" scoped>
.user-info {
  border-bottom: solid 2px #333; margin-bottom: 25px; padding: 0 0 20px 0; height: 68px;
  img {
    float: left; margin-right: 10px;
  }
  h1 {
    font-weight: bold;
  }
  p { font-weight: normal;}
}
 .btn {
   display:inline-block; padding: 6px 20px; box-shadow: 0px 3px 6px #ccc; margin-left: 8px;
   background:#ff0000; color:#fff; border: none; border-radius: 0;
 }
</style>
