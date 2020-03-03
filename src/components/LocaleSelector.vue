<template>
  <d-dropdown>
    <d-button class="primary">
      {{ $t(`locales.${$root.$i18n.locale}`) }}
    </d-button>
    <d-dropdown>
      <d-dropdown-item v-for="(locale, i) in locales"
                       :key="`Lang${i}`"
                       href="#"
                       @click.native.prevent="$root.$i18n.locale = locale">
        {{ $t(`locales.${locale}`) }}
      </d-dropdown-item>
    </d-dropdown>
  </d-dropdown>
</template>
<script>
export default {
  name: 'LocaleSelector',
  data () {
    return {
      // eslint-disable-next-line standard/array-bracket-even-spacing
      locales: ['ru', 'en', 'fr' ],
    }
  },
}
</script>
