<template>
  <a-breadcrumb  >
     
  </a-breadcrumb>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      breadList: []
    }
  },
  created () {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb () {
      this.breadList = []
      // this.breadList.push({name: 'index', path: '/dashboard/', meta: {title: '首页'}})

      this.name = this.$route.name
      this.$route.matched.forEach(item => {
        // item.name !== 'index' && this.breadList.push(item)
        this.breadList.push(item)
      })
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  }
}
</script>

<style scoped>
</style>
