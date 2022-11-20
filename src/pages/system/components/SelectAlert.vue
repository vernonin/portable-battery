<template>
  <div>
    <a-alert type="info" show-icon>
      <div class="message" slot="message">
        {{$t('selected')}}&nbsp;{{num}}&nbsp;{{$t('item')}}
        <a class="clear" @click="onClear">{{$t('clear')}}</a>
      </div>
    </a-alert>
  </div>
</template>

<script>
export default {
  name: 'SelectAlert',
  i18n: require('../i18n'),
  props: {
    num: {
      type: Number,
      default: 0
    }
  },
  methods: {
    onClear() {
      this.$emit('clear')
    }
  }
}
</script>

<style scoped>
.message {
  font-weight: bold;
}
.clear {
  padding-left: 10px;
}
</style>