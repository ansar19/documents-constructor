<template>
  <d-list-group size="sm">
    <d-list-group-item>
      <d-button-group size="sm">
        <d-button v-for="locale in locales"
                  :key="locale"
                  outline
                  squared
                  :active="activeTab === locale"
                  @click="activeTab = locale">
          {{ locale === 'none' ? $t('template_list.unlocalized') : $t(`locales.${locale}`) }}
          <d-badge theme="secondary" size="sm">
            {{ list[locale] | count }}
          </d-badge>
        </d-button>
      </d-button-group>
    </d-list-group-item>

    <template-list-item v-for="(template, filename) in list[activeTab]"
                        :key="filename"
                        :file="filename"
                        :locale="activeTab"
                        :template="template" />
  </d-list-group>
</template>
<script>
import list from '../templates'
import TemplateListItem from './TemplateListItem'

export default {
  name: 'TemplateList',
  components: { TemplateListItem },
  data () {
    return {
      list,
      locales: Object.keys(list).sort(),
      activeTab: list.hasOwnProperty(this.$root.$i18n.locale) ? this.$root.$i18n.locale : 'ru',
    }
  },
  computed: {},
  methods: {},
  filters: {
    count: list => Object.keys(list).length,
  },
}
</script>
