<template>
  <!-- <keep-alive> -->
    <router-view></router-view>
  <!-- </keep-alive> -->
</template>
<script>
export default {
  data() {
    return {
      asideToggle: 1,
    };
  },
  computed: {
    iconSize() {
      return this.spanLeft === 5 ? 14 : 24;
    }
  },
  mounted() {

  },
  beforeDestroy() {

  },
  methods: {
    toggleClick() {
      this.asideToggle = !this.asideToggle
    }
  },
  created() {
    //console.log(this.$route.meta)
  }
};
</script>
