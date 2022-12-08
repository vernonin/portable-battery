<template>
  <a-modal
    :title="type === 'PLUS' ? $t('createBattery') : $t('editBattery')"
    width="700px"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row>
        <a-col :span="12">
          <a-form-item :label="$t('chassisNumber')">
            <a-input
              v-decorator="['chassisNumber', { rules: [{ required: true, message: $t('chassisNumberpl') }] }]"
              :placeholder="$t('chassisNumberpl')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('merchant')">
            <a-select
              v-decorator="['storeName', { rules: [{ required: true, message: $t('chassisNumberpl') }] }]"
              show-search
              placeholder="请选择所在商户"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @search="handleSearch"
              @change="handleChange"
            >
              <a-select-option v-for="s in stores" :key="s.storeName">
                {{ s.storeName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
  import { GetStores } from '@/services/store'
  // eslint-disable-next-line no-unused-vars
  import { CreateCabinet, UpdateCabinet, GetCabinetInfo } from '@/services/cabinet'

  export default {
    name: 'EditCabinet',
    i18n: require('../i18n'),
    props: {
      visible: { type: Boolean, default: false },
      type: { type: String, default: 'PLUS'},
      cabinetId: { type: String, default: ''},
      succeed: { type: Function }
    },
    data() {
      return {
        storeName: '',
        stores: [],
        init: true,
        confirmLoading: false,
        form: this.$form.createForm(this, { name: 'coordinated' }),
      }
    },
    watch: {
      visible(newVal) {
        if (newVal) {
          this.init = true
          this.getQueryStores()
          
        }
      }
    },
    methods: {
      handleSearch(value) {
        this.init = false
        this.storeName = value

        this.getQueryStores()
      },
      handleChange() {
        // pass
      },
      handleOk() {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true

            switch(this.type) {
              case 'PLUS':
                this.plusCabinet(values)
                break;
              case 'EDIT':
                this.editCabinet(values)
                break;
            }
          }
          this.confirmLoading = false
        });
      },
      async getQueryStores() {
        try {
          let result = await GetStores({ current: 1, size: 100, storeName: this.storeName })

          this.stores = result.data.records

          // 获取所有商户（门店）后查询机箱信息
          if (this.init && this.type === 'EDIT') {
            this.getCabinetInfo()
          }
        }
        catch {
          this.stores = []
        }
      },
      async plusCabinet(data) {
        try {
          const { id } = this.stores.find(s => s.storeName === data.storeName)

          await CreateCabinet({storeId: id, chassisNumber: data.chassisNumber})

          this.$emit('cancel')
          this.succeed()
          this.$message.success(this.$t('afterCreateCabinet'))
        }
        catch {
          // 
        }

        this.confirmLoading = false
      },
      async editCabinet(data) {
        try {
          const { id } = this.stores.find(s => s.storeName === data.storeName)
        
          await UpdateCabinet({storeId: id, id: this.cabinetId})

          this.$emit('cancel')
          this.succeed()
          this.$message.success(this.$t('afterEditCabinet'))
        }
        catch {
          // 
        }

        this.confirmLoading = false
      },
      handleCancel() {
        this.$emit('cancel')
      },
      async getCabinetInfo() {
        try {
          let result = await GetCabinetInfo(this.cabinetId)

          const { chassisNumber, storeId } = result.data
          const { storeName } = this.stores.find(s => s.id === storeId)

          this.form.setFieldsValue({ chassisNumber, storeName })
        }
        catch {
          this.$emit('cancel')
          this.$message.error('查询机柜信息失败，请稍后重试！')
          this.form.setFieldsValue({ chassisNumber: '', storeName: '' })
        }
      },
    }
  }
</script>
