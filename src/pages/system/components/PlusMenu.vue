<template>
  <a-modal
    :title="$t('createMenu')"
    width="700px"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row>
        <a-col :span="12">
          <a-form-item :label="$t('menuNumber')">
            <a-input
              v-decorator="['menuNumber', { rules: [{ required: true, message: $t('menuNumberpl') }] }]"
              :placeholder="$t('menuNumberpl')"
            />
          </a-form-item>
          <a-form-item :label="$t('parentMenu')">
            <a-select
              v-decorator="['parentMenu']"
              :placeholder="$t('parentMenupl')"
            >
              <a-select-option value="male">{{$t('male')}}</a-select-option>
              <a-select-option value="female">{{$t('female')}}</a-select-option>
            </a-select>
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
          <a-form-item :label="$t('menuName')">
            <a-input
              v-decorator="['menuName', { rules: [{ required: true, message: $t('menuNamepl') }] }]"
              :placeholder="`${$t('menuNamepl')}`"
            />
          </a-form-item>
          <a-form-item :label="$t('routePath')">
            <a-input
              v-decorator="['routePath']"
              :placeholder="`${$t('routePathpl')}`"
            />
          </a-form-item>
          <a-form-item :label="$t('menuSort')">
            <a-input
              v-decorator="['menuSort']"
              :placeholder="$t('menuSortpl')"
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