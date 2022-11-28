<template>
  <a-modal
    :title="$t('plusUserTitle')"
    width="700px"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
      <a-row>
        <a-col :span="12">
          <a-form-item :label="$t('userAccount')">
            <a-input
              v-decorator="['userAccount', { rules: [{ required: true, message: $t('userAccountpl') }] }]"
              :placeholder="$t('userAccountpl')"
            />
          </a-form-item>
          <a-form-item :label="$t('userName')">
            <a-input
              v-decorator="['userName', { rules: [{ required: true, message: $t('userNamepl') }] }]"
              :placeholder="$t('userNamepl')"
            />
          </a-form-item>
          <a-form-item :label="$t('userPhone')">
            <a-input
              v-decorator="['userPhone', { rules: [{ required: true, message: $t('userPhonepl') }] }]"
              :placeholder="$t('userPhonepl')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('loginPsw')">
            <a-input
              v-decorator="['userPassword']"
              :placeholder="`${$t('defaultIs')}123456`"
            />
          </a-form-item>
          <a-form-item :label="$t('gender')">
            <a-select
              v-decorator="[
                'userSex',
                { rules: [{ required: true, message: $t('genderpl') }] },
              ]"
              :placeholder="$t('genderpl')"
            >
              <a-select-option value="male">{{$t('male')}}</a-select-option>
              <a-select-option value="female">{{$t('female')}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$t('userEmail')">
            <a-input
              v-decorator="['userEmail', { rules: [{ required: true, message: $t('userEmailpl') }] }]"
              :placeholder="$t('userEmailpl')"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
  import { CreateUser } from '@/services/user';
  export default {
    name: 'PlusUser',
    i18n: require('../i18n'),
    props: {
      visible: { type: Boolean, default: false },
      created: { type: Function }
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
            let { userSex, userPassword } = values

            userSex = userSex === 'male' ? true : userSex === 'female' ? false : null
            userPassword = userPassword ? userPassword : '123456'

            CreateUser({...values, userSex, userPassword}).then((result) => {
              if(result.code === 200) {
                this.$message.success('新建用户成功！');

                this.$emit('cancel');
                this.created();
              }
            }).catch((err) => {
              this.$message.error(err);
            });
          }
        });
      },
      handleCancel() {
        this.$emit('cancel');
      },
    }
  }
</script>

<style scoped>
</style>