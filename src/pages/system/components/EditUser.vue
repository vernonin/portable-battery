<template>
  <a-modal
    :title="$t('editUserTitle')"
    width="700px"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button @click="handleCancel">
        {{$t('cancel')}}
      </a-button>
      <a-button icon="setting" @click="handleResetPsw">
        {{$t('resetPsw')}}
      </a-button>
      <a-button key="submit" :loading="confirmLoading" type="primary" @click="handleOk">
        {{$t('confirm')}}
      </a-button>
    </template>
    <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
      <a-row>
        <a-col :span="12">
          <a-form-item :label="$t('userAccount')">
            <a-input
              v-decorator="['userAccount', { rules: [{ required: true, message: $t('userAccountpl') }] }]"
              :placeholder="$t('userAccountpl')"
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
          <a-form-item :label="$t('userPhone')">
            <a-input
              v-decorator="['userPhone', { rules: [{ required: true, message: $t('userPhonepl') }] }]"
              :placeholder="$t('userPhonepl')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('userName')">
            <a-input
              v-decorator="['userName', { rules: [{ required: true, message: $t('userNamepl') }] }]"
              :placeholder="$t('userNamepl')"
            />
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

    <MessageBox
      :visible="openResetPwd"
      title="重置密码"
      confirmText="确定重置"
      content="即将为用户重置密码为初始化状态"
      @close="openResetPwd = false"
      @confirm="confirmReset"
    />
  </a-modal>
</template>

<script>
  import MessageBox from '@/components/message-box/MessageBox'
  import { GetUserInfo, UpdateUser, ResetPassword } from '@/services/user'

  export default {
    name: 'PlusUser',
    i18n: require('../i18n'),
    components: { MessageBox },
    props: {
      visible: { type: Boolean, default: false },
      userId: { type: String, default: '' },
      created: { type: Function }
    },
    data() {
      return {
        openResetPwd: false,
        confirmLoading: false,
        form: this.$form.createForm(this, { name: 'coordinated' }),
      }
    },
    watch: {
      visible(newVal) {
        if (newVal) {
          this.getUserInfo()
        }
      }
    },
    methods: {
      handleOk() {
        this.form.validateFields(async (err, values) => {
          if (!err) {
            this.confirmLoading = true

            try {
              let { userSex } = values
              userSex = userSex === 'male' ? true : userSex === 'female' ? false : null

              await UpdateUser({...values, userSex, id: this.userId})

              this.$emit('cancel')
              this.created()
              this.$message.success(this.$t('afterEditUser'))
            }
            catch {
              // 
            }

            this.confirmLoading = false
          }
        });
      },
      async getUserInfo() {
        let res = await GetUserInfo(this.userId)
        
        let {
          userAccount,
          userEmail,
          userName,
          userPhone, 
          userSex
         } = res.data

        this.$nextTick(() => {
          this.form.setFieldsValue({userPhone, userName, userAccount, userEmail, userSex: userSex ? 'male' : 'female'});
        })
      },
      handleCancel() {
        this.$emit('cancel')
      },
      handleResetPsw() {
        this.openResetPwd = true
      },
      async confirmReset() {
        await ResetPassword(this.userId)

        this.openResetPwd = false
        this.$message.success(this.$t('afterResetPwd'))
      }
    }
  }
</script>
