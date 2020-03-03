<template>
  <d-container fluid class="main-content-container px-4 pb-4">
    <!-- Error -->
    <div class="error">
      <div class="error__content">
        <h1>{{ $t('404.title') }}</h1>
        <!-- <h3>Something went wrong!</h3>
        <p>There was a problem on our end. Please try again later.</p> -->
        <d-button pill @click="goBack">
          &larr; Вернутся назад
        </d-button>
      </div>
    </div>
  </d-container>
</template>
<script>

export default {

  methods: {
    goBack () {
      this.$router.go(-1)
    },
  },
}
</script>
