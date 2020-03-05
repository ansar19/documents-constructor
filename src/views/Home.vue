<template>
  <d-container fluid class="main-content-container px-4">
    <!-- Content -->
    <d-row class="mt-5 mb-2">
      <d-col lg="4">
        <!-- Page Header -->
        <d-row no-gutters class="page-header mb-2">
          <h1 class="page-title">
            {{ $t('home.site_description') }}
          </h1>
        </d-row>
        <d-card class="mb-2">
          <d-card-header class="border-bottom">
            Краткая инструкция:
          </d-card-header>
          <d-card-body>
            <div v-for="item in $t('app.site_under_construction')" :key="item.id">
              <i class="material-icons text-success">
                done
              </i> {{ item.text }}
            </div>

            <!-- <p>{{ $t('app.site_under_construction') }}</p> -->
          </d-card-body>
        </d-card>
        <!-- <logo variant="home" /> -->
      </d-col>
      <d-col lg="8">
        <h5 class="card-title">
          {{ $t('home.title') }}
        </h5>
        <template-list />
      </d-col>
    </d-row>
  </d-container>
</template>

<script>
// import Logo from '../components/Logo'
import TemplateList from '../components/TemplateList'

export default {
  name: 'Home',
  components: { TemplateList },
}
</script>
