<template>
  <d-form-group class="block">
    <d-checkbox v-model="show">
      {{ block.description || block.name }}
    </d-checkbox>
    <aside-block v-for="sub in block.blocks" :key="sub.name" :block="sub" @update="updateBlock" />
  </d-form-group>
</template>
<script>
export default {
  name: 'AsideBlock',
  props: { block: { required: true, type: Object } },
  data () {
    return {
      show: true,
    }
  },
  methods: {
    setValue () {
      this.show = this.$props.block.show
    },
    updateBlock ({ name, value }) {
      this.$emit('update', { name, value })
    },
  },
  created () {
    this.setValue()
  },
  watch: {
    block () {
      this.setValue()
    },
    show (newVal) {
      this.updateBlock({ name: this.block.name, value: newVal })
    },
  },
}
</script>
