<template>
  <d-container fluid class="main-content-container px-4">
    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <h1 class="page-title">
          Help on creating templates
        </h1>
      </d-col>
    </d-row>

    <p>For now, we only support Markdown files as templates, which get rendered as HTML or Markdown.</p>

    <section>
      <h5 class="card-title">
        Blocks
      </h5>

      <p>
        Blocks can be seen as sections of your document. Any portion defined as <em>block</em> will be toggleable in
        the side panel.
      </p>
      <p>They have this format:</p>

      <!-- eslint-disable vue/no-v-html -->
      <pre class="language-html" v-html="codeBlock('NAME', 'Description', 'Content')" />
      <!-- eslint-enable vue/no-v-html -->
      <ul>
        <li><code class="language-html">NAME</code> must be capitalized letters and use underscores.</li>
        <li>
          <code>Description</code> can be anything but <code>]</code>. It will appear in the edition panel to
          describe the block.
        </li>
        <li><code>Content</code> is basically the block content. It can include other blocks too.</li>
      </ul>

      <d-alert theme="secondary" show>
        Even if indenting your template inside blocks is tempting, it is not a good idea as the
        generated code is parsed as-is.
      </d-alert>

      <d-alert theme="warning" show>
        If a block is missing an end, it will be transformed into something like <code>[[ERROR: BLOCK_NAME has no
          end]]</code>.
      </d-alert>

      <h5 class="card-title">
        Numbering sections
      </h5>

      <p>
        To have a dynamic sections numbering, use this format:
      </p>

      <!-- eslint-disable vue/no-v-html -->
      <pre
        v-html="`${codeNumber('[#]')} ${codeContent('Rendering as 1')}\n\n${codeNumber('[##]')} ${codeContent('Rendering as 1.1')}\n\n${codeNumber('[#]')} ${codeContent('Rendering as 2')}\n\n...`" />
      <!-- eslint-enable vue/no-v-html -->

      <d-alert theme="warning" show>
        Every time you use the number code, it will increment the counter; doing <code>[#] - This is section
          [#]</code> will render as <code>1 - This is section 2</code>
      </d-alert>
    </section>

    <section>
      <h5 class="card-title">
        Variables
      </h5>

      <p>
        Variables are small portions of text that needs customization. You can define a variable and use it multiple
        times in your document; they will appear in the edition panel
      </p>

      <p>To define a variable, use this format:</p>

      <!-- eslint-disable vue/no-v-html -->
      <pre v-html="codeVar('NAME', 'Description', 'TYPE')" />
      <!-- eslint-enable vue/no-v-html -->

      <ul>
        <li>
          <code>TYPE</code> is optional. It can be either <code>STRING</code>,
          <code>TEXT</code> or <code>NUMBER</code>, and defaults to <code>STRING</code>.
          The type defines the widget used in the side panel (text input, textarea or number input).
        </li>
        <li><code>NAME</code> must be capitalized letters and use underscores.</li>
        <li>
          <code>Description</code> can be anything but <code>]</code>. It will appear in the edition panel to
          describe the variable. If you don't provide a description, the variable name will be used in edition panel.
        </li>
      </ul>

      <p>
        By default, variables are shown in the edition panel in the same order as they are defined. Sometimes, you will
        need them variables to be ordered in a custom order; you can achieve this by prefixing them with a number. Note
        that if you prefix one variable, they all will be displayed sorted:
      </p>

      <!-- eslint-disable vue/no-v-html -->
      <pre v-html="`${codeVar('02_A_VAR', 'The second var in the list')} ${codeVar('01_MY_FIRST_VAR', 'The first var in the list')}`" />
      <!-- eslint-enable vue/no-v-html -->

      <d-alert theme="info" show>
        If you define the same variable multiple times, they will be overridden only if there is no description.
      </d-alert>

      <d-alert theme="info" show>
        If you don't like defining variable in the template flow, you can add an HTML comment at the beginning of
        it with all the definitions:
        <pre>&lt;!-- Variables used:
[TEXT FIRST_VAR The first var]
[OTHER_VAR An other var]
--&gt;
<span class="code-content">Template content that uses</span> [FIRST_VAR] <span class="code-content">and</span> [OTHER_VAR]
      </pre>
      </d-alert>
      <d-alert theme="info" show>
        Due to how the renderer works, you can also use <code>[~MY_VAR]</code> format to display a variable. Be aware
        that it will not define it.
      </d-alert>
    </section>

    <section>
      <h5 class="card-title">
        Conditional rendering
      </h5>
      <p>You can display things given the state of blocks.</p>
      <!-- eslint-disable vue/no-v-html -->
      <pre
        v-html="codeCondition('IF', 'SOME_BLOCK', 'This will be displayed if <code>SOME_BLOCK</code> is enabled</span>')" />
      <pre
        v-html="codeCondition('UNLESS', 'SOME_BLOCK', 'This will be displayed unless <code>SOME_BLOCK</code> is enabled</span>')" />
      <!-- eslint-enable vue/no-v-html -->
      <p>You can nest conditional blocks.</p>
      <!-- eslint-disable vue/no-v-html -->
      <pre
        v-html="codeCondition('IF', 'SOME_BLOCK', `Some content${codeCondition('IF', 'OTHER_BLOCK', 'Some other content')}`)" />
      <!-- eslint-enable vue/no-v-html -->
    </section>

    <section>
      <h5 class="card-title">
        Sortcodes
      </h5>
      <p>We have a small collection of shortcodes that can help in your journey into making templates:</p>
      <ul>
        <li><code>DATE_YEAR</code>: Current year</li>
        <li><code>DATE_MONTH</code>: Current month</li>
        <li><code>DATE_DAY</code>: Current day of the month</li>
      </ul>

      <p>To use shortcodes, use this format:</p>

      <!-- eslint-disable vue/no-v-html -->
      <pre v-html="codeShortCode('DATE_YEAR')" />
      <!-- eslint-enable vue/no-v-html -->
    </section>
  </d-container>
</template>

<script>
export default {
  name: 'HelpView',
  methods: {
    // Methods used to generate colored code for examples.
    codeElement (type, content) { return `<span class="code-${type}">${content}</span>` },
    codeContent (content) { return this.codeElement('content', content) },
    codeBlockName (name) { return this.codeElement('block-name', name) },
    codeBlockDesc (description) { return this.codeElement('block-description', description) },
    codeBlock (name, description, content) {
      const nameTag = this.codeBlockName(name)
      const descriptionTag = this.codeBlockDesc(description)
      const contentTag = this.codeContent(content)

      return this.codeElement('block', `[[BLOCK ${nameTag}] ${descriptionTag}]${contentTag}[[BLOCK ${nameTag}]]`)
    },
    codeVarName (name) { return this.codeElement('var-name', name) },
    codeVarDescription (description) { return description.length > 0 ? this.codeElement('var-description', ` ${description}`) : '' },
    codeVarType (type) { return type.length > 0 ? this.codeElement('var-type', `${type} `) : '' },
    codeVar (name, description = '', type = '') {
      const nameTag = this.codeVarName(name)
      const descriptionTag = this.codeVarDescription(description)
      const typeTag = this.codeVarType(type)

      return this.codeElement('var', `[${typeTag}${nameTag}${descriptionTag}]`)
    },
    codeConditionType (name) { return this.codeElement('condition-type', name) },
    codeConditionBlock (type) { return type.length > 0 ? this.codeElement('condition-block', `${type} `) : '' },
    codeCondition (type = '', blockName, content) {
      const typeTag = this.codeConditionType(type)
      const endTypeTag = this.codeConditionType(`END${type}`)
      const blockNameTag = this.codeConditionBlock(blockName)
      const contentTag = this.codeContent(content)

      return this.codeElement('condition', `[[${typeTag} ${blockNameTag}]]${contentTag}[[${endTypeTag} ${blockNameTag}]]`)
    },
    codeNumber (code) { return this.codeElement('number', code) },
    codeShortCodeName (name) { return this.codeElement('shortcode-name', name) },
    codeShortCode (name) { return this.codeElement('shortcode', `[~~${this.codeShortCodeName(name)}]`) },
  },
}
</script>
