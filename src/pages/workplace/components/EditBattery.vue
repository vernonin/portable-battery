<template>
  <a-modal
    :title="type === 'PLUS' ? $t('createBattery') : $t('editBattery')"
    width="700px"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row>
        <a-col :span="12">
          <a-form-item :label="$t('batteryNumber')">
            <a-input
              v-decorator="['batteryNumber', { rules: [{ required: true, message: $t('batteryNumberpl') }] }]"
              :placeholder="$t('batteryNumberpl')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('status')">
            <a-input
              v-decorator="['batteryStatus']"
              :placeholder="`${$t('roleNamepl')}`"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
	import { CreateBattery } from '@/services/battery'

  export default {
    name: 'EditBattery',
    i18n: require('../i18n'),
    props: {
      visible: { type: Boolean, default: false },
      type: { type: String, default: 'PLUS'},
      batteryId: { type: String, default: ''},
      succeed: { type: Function }
    },
    data() {
      return {
        form: this.$form.createForm(this, { name: 'coordinated' }),
      }
    },
    watch: {
      visible(newVal) {
        if (newVal && this.type === 'EDIT') {
          this.getRoleInfo()
        }
      }
    },
    methods: {
      handleOk() {
        this.form.validateFields((err, values) => {
          if (!err) {

            switch(this.type) {
              case 'PLUS':
                this.plusBattery(values)
                break;
              case 'EDIT':
                this.EditRole(values)
                break;
            }

          }
        });
      },
      async plusBattery(data) {
				console.log(data);
        await CreateBattery(data)

        this.$emit('cancel')
        this.succeed()
        this.$message.success(this.$t('afterCreateBattery'))
      },
      async EditRole() {
        // await UpdateRole({...data, id: this.roleId})

        // this.$emit('cancel')
        // this.succeed()
        // this.$message.success(this.$t('afterEditeRole'))
      },
      handleCancel() {
        this.$emit('cancel')
      },
      async getRoleInfo() {
        // let result = await GetRoleInfo(this.batteryId)

        // const { roleCode, roleName } = result.data
        // this.form.setFieldsValue({ roleCode, roleName })
      },
    }
  }
</script>
