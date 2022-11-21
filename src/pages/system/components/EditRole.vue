<template>
  <a-modal
    :title="type === 'PLUS' ? $t('createRole') : $t('editRole')"
    width="700px"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row>
        <a-col :span="12">
          <a-form-item :label="$t('roleNumber')">
            <a-input
              v-decorator="['roleNumber', { rules: [{ required: true, message: $t('roleNumberpl') }] }]"
              :placeholder="$t('roleNumberpl')"
            />
          </a-form-item>
          <a-form-item :label="$t('roleDescribe')">
            <a-textarea
              v-decorator="['roleDescribe']"
              :placeholder="$t('multilineInput')"
              :rows="4"
            />

          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('roleName')">
            <a-input
              v-decorator="['roleName', { rules: [{ required: true, message: $t('roleNamepl') }] }]"
              :placeholder="`${$t('roleNamepl')}`"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
  export default {
    name: 'PlusUser',
    i18n: require('../i18n'),
    props: {
      visible: { type: Boolean, default: false },
      type: { type: String, default: 'PLUS'}
    },
    data() {
      return {
        form: this.$form.createForm(this, { name: 'coordinated' }),
      }
    },
    methods: {
      handleOk() {
        this.form.validateFields((err, values) => {
          if (!err) {
            console.info('success:', values);
          }
        });
      },
      handleCancel() {
        this.$emit('cancel')
      },
    }
  }
</script>

<style scoped>
</style>