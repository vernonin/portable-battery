<template>
  <div class="button-bar">
    <a-button 
      :type="b.type"
      :key="b.key"
      :icon="b.icon"
      :style="b.style"
      :class="index !== 0 ? 'ml-8' : ''"
      @click="handleEmit(b.key)"
      v-for="(b, index) in btns"
    >
      {{$t(b.text)}}
    </a-button>
  </div>
</template>

<script>
  export default {
    name: 'ButtonBar',
    i18n: require('./i18n'),
    props: {
      btns: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      handleEmit(key) {
        this.$emit(key)
      }
    }
  }
</script>

<style scoped>
.button-bar {
  margin-bottom: 12px;
}
.ml-8 {
  margin-left: 8px;
}
</style>