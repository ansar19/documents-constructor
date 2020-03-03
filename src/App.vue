<template>
  <div id="app" v-bar>
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>
<script>

export default {
  computed: {
    layout () {
      return `${this.$route.meta.layout || 'default'}-layout`
    },
  },
}
</script>

<style lang="scss">
  @import "stylesheets/app";
</style>
