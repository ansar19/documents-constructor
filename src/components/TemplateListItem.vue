<template>
  <d-list-group-item>
    <h5 class="card-title">
      <router-link :to="{ name: 'renderer', params: { locale, file } }">
        {{ template.name }}
      </router-link>
    </h5>
    <dl class="infos infos--inline">
      <div v-if="showLanguage">
        <dt>{{ $t('template_list.item.language') }}</dt>
        <dd>{{ locale !== 'none' ? $t(`locales.${locale}`) : '-' }}</dd>
      </div>
    </dl>
    <div><small>{{ template.description }}</small></div>
  </d-list-group-item>
</template>
<script>
export default {
  name: 'TemplateListItem',
  props: {
    file: { required: true, type: String },
    locale: { required: false, type: String, default: 'none' },
    template: { required: true, type: Object },
    showLanguage: { required: false, type: Boolean, default: true },
  },
}
</script>
