
export default {
  data() {
    return {
      server: 'https://fitment.chenyoujiu.com'
    }
  },
  components: {
  },
  methods: {
    go(url) {
      this.$router.push(url)
    },
    logout() {
      window.localStorage.removeItem('userInfo')
      this.$router.push({name: '登录'})
    },
  }
}
