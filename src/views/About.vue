<template>
  <d-container fluid class="main-content-container px-4">
    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <h1 class="page-title">
          {{ $t('about.title') }}
        </h1>
      </d-col>
    </d-row>

    <div class="shards-component-doc">
      <h5 class="card-title">
        {{ $t('about.contribute_header') }}
      </h5>
      <p>{{ $t('about.contribute_content') }}</p>

      <h5 class="card-title">
        {{ $t('about.tos_header') }}
      </h5>
      <p>{{ $t('about.tos_content') }}</p>

      <h5 class="card-title">
        {{ $t('about.privacy_header') }}
      </h5>
      <p>{{ $t('about.privacy_content') }}</p>
    </div>
  </d-container>
</template>
