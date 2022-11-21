<template>
  <a-modal
    :title="$t('editUserTitle')"
    width="700px"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">
        {{$t('cancel')}}
      </a-button>
      <a-button key="back" icon="setting" @click="handleResetPsw">
        {{$t('resetPsw')}}
      </a-button>
      <a-button key="submit" type="primary" @click="handleOk">
        {{$t('confirm')}}
      </a-button>
    </template>
    <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" @submit="handleSubmit">
      <a-row>
        <a-col :span="12">
          <a-form-item :label="$t('username')">
            <a-input
              v-decorator="['userName', { rules: [{ required: true, message: $t('usernamepl') }] }]"
              :placeholder="$t('usernamepl')"
            />
          </a-form-item>
          <a-form-item :label="$t('gender')">
            <a-select
              v-decorator="[
                'gender',
                { rules: [{ required: true, message: $t('genderpl') }] },
              ]"
              :placeholder="$t('genderpl')"
              @change="handleSelectChange"
            >
              <a-select-option value="male">{{$t('male')}}</a-select-option>
              <a-select-option value="female">{{$t('female')}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('name')">
            <a-input
              v-decorator="['name', { rules: [{ required: true, message: $t('namepl') }] }]"
              :placeholder="$t('namepl')"
            />
          </a-form-item>
          <a-form-item :label="$t('status')">
            <a-select
              v-decorator="[
                'status',
                { rules: [{ required: true, message: $t('statuspl') }] },
              ]"
              :placeholder="$t('statuspl')"
              @change="handleSelectChange"
            >
              <a-select-option value="valid">{{$t('valid')}}</a-select-option>
              <a-select-option value="invalid">{{$t('invalid')}}</a-select-option>
            </a-select>
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
      visible: { type: Boolean, default: false }
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
      handleResetPsw() {
        
      },
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
      },
      handleSelectChange(value) {
        this.form.setFieldsValue({
          note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
        });
      },
    }
  }
</script>

<style scoped>
</style>