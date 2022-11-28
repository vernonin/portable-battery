<template>
  <div class="outer-container" :style="visible ? {display: 'flex'} : {display: 'none'}">
    <div class="content">
      <div>
        <div class="content-title">
          <span class="title-text">{{title}}</span>
          <a-icon class="title-icon" type="close" @click="onClose" />
        </div>
        <div class="content-main">
          <slot>
            <span class="default-text">{{content}}</span>
          </slot>
        </div>
      </div>
      <slot name="footer">
        <div class="content-footer">
          <a-button style="margin-right: 8px;" @click="onClose">{{closeText}}</a-button>
          <a-button type="primary" @click="onConfirm">{{confirmText}}</a-button>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MessageBox',
    props: {
      title: {type: String, default: 'TITLE'},
      visible: {type: Boolean, default: true},
      content: {type: String, default: 'This is a message'},
      closeText: {type: String, default: '取消'},
      confirmText: {type: String, default: '确定'},
    },
    methods: {
      onClose() {
        this.$emit('close')
      },
      onConfirm() {
        this.$emit('confirm')
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "index";
</style>