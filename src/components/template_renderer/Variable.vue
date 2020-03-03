<template>
  <div class="form-group">
    <label>{{ variable.description || variable.name }}</label>
    <d-textarea v-if="variable.type === 'TEXT'" v-model="displayValue" />
    <d-form-input v-else-if="variable.type === 'number'" v-model="displayValue" />
    <d-input v-else v-model="displayValue" type="text" />
  </div>
</template>
<script>
export default {
  name: 'Variable',
  props: {
    variable: { required: true, type: Object },
  },
  data () {
    return {
      displayValue: null,
      ready: false,
    }
  },
  created () {
    this.displayValue = this.$props.variable.content === '________' ? '' : this.$props.variable.content
    this.id = `input-${this.$props.variable.name}`
    this.ready = true
  },
  watch: {
    displayValue (newVal) {
      this.$emit('input', newVal === '' ? '________' : newVal)
    },
  },
}
</script>
