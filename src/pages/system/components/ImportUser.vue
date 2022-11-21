<template>
  <a-modal
    :title="$t('importUserTitle')"
    :visible="visible"
    width="420px"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-upload-dragger
      name="file"
      :multiple="true"
      action=""
      @change="handleChange"
    >
      <p class="ant-upload-drag-icon">
        <a-icon type="folder" />
      </p>
      <p class="ant-upload-text">{{$t('importPromptText')}}</p>
      <p class="ant-upload-hint">
        {{$t('supportFiles')}} .rar .zip .doc .docx .pdf .jpg...
      </p>
    </a-upload-dragger>
  </a-modal>
</template>

<script>
  export default {
    name: 'PlusUser',
    i18n: require('../i18n'),
    props: {
      visible: { type: Boolean, default: false }
    },
    data() {
      return {
        
      }
    },
    methods: {
      handleOk() {
      
      },
      handleCancel() {
        this.$emit('cancel')
      },
      handleChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          this.$message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`);
        }
      },
    }
  }
</script>

<style scoped>
</style>