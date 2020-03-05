<template>
  <d-container fluid class="main-content-container px-4">
    <d-row class="mt-4">
      <d-col cols="12" md="6" lg="4">
        <d-container v-if="ready">
          <d-card>
            <d-card-header class="border-bottom">
              <d-list-group>
                <d-list-group-item>
                  <strong>{{ $t('renderer.name') }}</strong> {{ templateMeta.name }}
                </d-list-group-item>
                <d-list-group-item>
                  <div>
                    <d-btn v-d-toggle.my-collapse outline size="sm">
                      См. описание
                    </d-btn>
                    <d-collapse id="my-collapse">
                      <div class="p-3 mt-3 border rounded">
                        <strong>{{ $t('renderer.description') }}</strong> {{ templateMeta.description }}
                      </div>
                    </d-collapse>
                  </div>
                </d-list-group-item>
              </d-list-group>
            </d-card-header>
            <d-card-body>
              <section>
                <d-alert show theme="info" dismissible>
                  <small>
                    {{ $t('renderer.help.line1') }}
                    {{ $t('renderer.help.line2') }}
                  </small>
                </d-alert>
              </section>

              <d-form size="sm">
                <section v-if="variables.length > 0">
                  <h5 class="card-title">
                    {{ $t('renderer.variables') }}
                  </h5>
                  <variable v-for="variable in variables"
                            :key="variable.name"
                            v-model="variable.content"
                            :variable="variable" />
                </section>
                <!--          <section v-if="blocks.length > 0">-->
                <!--            <h2 class="h3 _margin-y-0">-->
                <!--              {{ $t('renderer.sections') }}-->
                <!--            </h2>-->
                <!--            <block v-for="block in blocks" :key="block.name" :block="block" @update="updateBlock" />-->
                <!--          </section>-->
              </d-form>
            </d-card-body>
          </d-card>
        </d-container>
      </d-col>
      <d-col cols="12" md="6" lg="8">
        <d-container class="dr-example-container">
          <d-container fluid>
            <d-button-toolbar class="mb-2 mt-2">
              <d-button-group size="small" class="mr-3">
                <d-button :active="displayTab === 'render'"
                          :variant="displayTab === 'render' ? 'primary' : ''"
                          @click.prevent="displayTab = 'render'">
                  {{ $t('renderer.buttons.render') }}
                </d-button>
                <!-- <d-button :active="displayTab === 'html'"
                          :variant="displayTab === 'html' ? 'primary' : ''"
                          @click.prevent="displayTab = 'html'">
                  HTML
                </d-button>
                <d-button :active="displayTab === 'md'"
                          :variant="displayTab === 'md' ? 'primary' : ''"
                          @click.prevent="displayTab = 'md'">
                  Markdown
                </d-button>
                <d-button :active="displayTab === 'source'"
                          :variant="displayTab === 'source' ? 'primary' : ''"
                          @click.prevent="displayTab = 'source'">
                  {{ $t('renderer.buttons.source') }}
                </d-button> -->
              </d-button-group>
            </d-button-toolbar>
            <div class="render-page__main-content mb-2"
                 :class="displayTab === 'render' ? 'render-page__render' : 'render-page__raw'">
              <!-- <pre v-show="displayTab === 'source'">{{ source }}</pre>
              <pre v-if="ready" v-show="displayTab === 'md'">{{ renderedMd }}</pre> -->
              <pre v-if="ready" v-show="displayTab === 'html'">{{ renderedText }}</pre>
              <!-- eslint-disable vue/no-v-html -->
              <div v-if="ready" v-show="displayTab === 'render'" id="exportContent" v-html="renderedText" />
              <div>
                <d-button outline size="sm" @click="export2Doc('exportContent');">
                  Сохранить как .doc
                </d-button>
              </div>
              <!-- eslint-enable vue/no-v-html -->
            </div>
          </d-container>
        </d-container>
      </d-col>
    </d-row>

    <d-container v-if="blocks.length > 0" class="dr-example-container">
      <d-card v-if="ready" class="ml-2 mt-2 mb-2">
        <form size="sm" class="ml-2 mt-2 mb-2">
          <section>
            <h5 class="card-title">
              {{ $t('renderer.sections') }}
            </h5>
            <block v-for="block in blocks" :key="block.name" :block="block" @update="updateBlock" />
          </section>
        </form>
      </d-card>
    </d-container>
  </d-container>
</template>

<script>
import ParserMixin from '../mixins/parser'
import MarkdownIt from 'markdown-it'
import Block from '../components/template_renderer/Block'
import Variable from '../components/template_renderer/Variable'
import templates from '../templates'

export default {
  name: 'Renderer',
  components: { Variable, Block },
  mixins: [ParserMixin],
  data () {
    return {
      ready: false,
      displayTab: 'render',
      templateMeta: null,
    }
  },
  computed: {
    renderedText () {
      return this.renderText()
    },
    renderedMd () {
      return this.render()
    },
    renderDocBtn () {
      return this.export2Doc()
    },
  },
  methods: {
    // Section selection
    updateBlock ({ name, value }) {
      let block = this.findBlock(this.blocks, name)
      if (block) {
        block.show = value
      } else {
        console.warn(`updateBlock: Block "${name}"not found`)
      }
    },
    renderText () {
      const md = new MarkdownIt(this.templateMeta.mdFlavor || null)
      return md.render(this.renderedMd)
    },
    export2Doc (element, filename = '') {
      var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>"
      var postHtml = '</body></html>'
      var html = preHtml + document.getElementById(element).innerHTML + postHtml

      var blob = new Blob(['\ufeff', html], {
        type: 'application/msword',
      })

      // Specify link url
      var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html)

      // Specify file name
      filename = filename ? filename + '.doc' : 'document.doc'

      // Create download link element
      var downloadLink = document.createElement('a')

      document.body.appendChild(downloadLink)

      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename)
      } else {
        // Create a link to the file
        downloadLink.href = url

        // Setting the file name
        downloadLink.download = filename

        // triggering the function
        downloadLink.click()
      }

      document.body.removeChild(downloadLink)
    },
  },
  created () {
    const locale = this.$route.params.locale
    const file = this.$route.params.file
    if (templates[locale] && templates[locale][file]) {
      this.templateMeta = templates[locale][file]
      fetch(`/templates/${locale}/${file}`)
        .then((response) => {
          return response.blob()
            .then(async (blob) => {
              this.source = await (new Response(blob)).text()
              this.parse(this.source)
              this.ready = true
            })
        })
        .catch((error) => { console.log('error', error) })
    } else {
      this.$router.push({ name: '404' })
    }
  },
}
</script>
