<template>
  <a-modal
    :title="type === 'PLUS' ? $t('createRole') : $t('editRole')"
    width="700px"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row>
        <a-col :span="12">
          <a-form-item :label="$t('roleCode')">
            <a-input
              v-decorator="['roleCode', { rules: [{ required: true, message: $t('roleCodepl') }] }]"
              :placeholder="$t('roleCodepl')"
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
  import { CreateRole, UpdateRole, GetRoleInfo } from '@/services/role'
  export default {
    name: 'EditRole',
    i18n: require('../i18n'),
    props: {
      visible: { type: Boolean, default: false },
      type: { type: String, default: 'PLUS'},
      roleId: { type: String, default: ''},
      succeed: { type: Function }
    },
    data() {
      return {
        confirmLoading: false,
        form: this.$form.createForm(this, { name: 'coordinated' }),
      }
    },
    watch: {
      visible(newVal) {
        if (newVal) {
          if (this.type === 'EDIT') {
            this.getRoleInfo()
          } else {
            this.clearForm()
          }
        }
      }
    },
    methods: {
      handleOk() {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true

            switch(this.type) {
              case 'PLUS':
                this.plusRole(values)
                break;
              case 'EDIT':
                this.EditRole(values)
                break;
            }

          }
        });
      },
      async plusRole(data) {
        try {
          await CreateRole(data)

          this.$emit('cancel')
          this.succeed()
          this.$message.success(this.$t('afterCreateRole'))
        }
        catch {
          // 
        }
        this.confirmLoading = false
      },
      async EditRole(data) {
        try {
          await UpdateRole({...data, id: this.roleId})

          this.$emit('cancel')
          this.succeed()
          this.$message.success(this.$t('afterEditeRole'))
        }
        catch {
          // 
        }
        this.confirmLoading = false
      },
      handleCancel() {
        this.$emit('cancel')
      },
      async getRoleInfo() {
        let result = await GetRoleInfo(this.roleId)

        const { roleCode, roleName } = result.data
        this.form.setFieldsValue({ roleCode, roleName })
      },
      clearForm() {
        this.form.setFieldsValue({
          roleCode: '',
          roleName: ''
        })
      }
    }
  }
</script>
