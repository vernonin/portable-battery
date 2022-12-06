<template>
  <a-drawer
      :title="type === 'PLUS' ? $t('createStore') : type === 'EDIT' ? $t('editStore') : ''"
      width="60vw"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-form :form="form" layout="vertical" hide-required-mark>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="$t('storeCode')">
              <a-input
                v-decorator="[
                  'storeCode',
                  {
                    rules: [{ required: true, message: $t('storeCodepl') }],
                  },
                ]"
                :placeholder="$t('storeCodepl')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('storeName')">
              <a-input
                v-decorator="[
                  'storeName',
                  {
                    rules: [{ required: true, message: $t('storeNamepl') }],
                  },
                ]"
                :placeholder="$t('storeNamepl')"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="$t('contact')">
              <a-input
                v-decorator="[
                  'contact',
                  {
                    rules: [{ required: true, message: $t('contactpl') }],
                  },
                ]"
                :placeholder="$t('contactpl')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('bonus')">
              <a-select
                v-decorator="[
                  'commissionRate',
                  { rules: [{ required: true, message: $t('bonuspl') }] },
                ]"
                :placeholder="$t('bonuspl')"
              >
                <a-select-option :value="(i / 10)" :key="i" v-for="i in 10">{{(i / 10)}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="$t('storeImage')">
              <a-upload
                v-decorator="[
                  'storeImageUrl',
                  {
                    getValueFromEvent: normFile,
                  },
                ]"
                :headers="header"
                name="img"
                action="/api/system-server/upload/upload"
                list-type="picture"
              >
                <a-button :block="true" style="width: 100%;"> <a-icon type="upload" />{{$t('clickUpload')}}</a-button>
              </a-upload>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('address')">
              <a-textarea
                v-decorator="[
                  'address',
                  {
                    rules: [{ required: true, message: $t('addresspl') }],
                  },
                ]"
                :rows="2"
                :placeholder="$t('addresspl')"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="$t('longitude')">
              <a-input v-decorator="['eastLongitude']" :placeholder="$t('latitudepl')" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('latitude')">
              <a-input v-decorator="['northLatitude']" :placeholder="$t('latitudepl')" />
            </a-form-item>
          </a-col>
        </a-row>
        <Map :center="mapCenter" :on-click="onMap"/>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="onClose">
          {{$t('cancel')}}
        </a-button>
        <a-button type="primary" :loading="confirmLoading" @click="onConfirm">
          {{$t('confirm')}}
        </a-button>
      </div>
    </a-drawer>
</template>

<script>
  import Map from '@/components/map/Map.vue'

  import { GET_AUTH } from '@/utils/auth'
  import { CreateStore, UpdateStore, GetStore } from '@/services/store'

  export default {
    name: 'EditStore',
    i18n: require('../i18n'),
    components: { Map },
    props: {
      visible: { type: Boolean, default: false },
      type: { type: String, default: 'PLUS' },
      id: { type: String, default: '' },
      succeed: { type: Function }
    },
    data() {
      return {
        header: {
          Authorization: 'Bearer ' + GET_AUTH(),
        },
        mapCenter: [113.350658, 23.129519],
        confirmLoading: false,
        form: this.$form.createForm(this),
      }
    },
    watch: {
      visible(newVal) {
        if (newVal) {
          this.clearForm()
          if (this.type === 'EDIT') {
            this.getDetails()
          }
        }
      }
    },
    methods: {
      showDrawer() {
        this.visible = true;
      },
      onClose() {
        this.$emit('close')
      },
      normFile(e) {
        if (Array.isArray(e)) {
          return e[0].response?.data;
        }
        return e && e.fileList[0].response?.data
      },
      onMap(position) {
        this.form.setFieldsValue({
          eastLongitude: position[0],
          northLatitude: position[1]
        })
      },
      async getDetails() {
        let result = await GetStore(this.id)
        let { eastLongitude, northLatitude} = result.data

        this.form.setFieldsValue(result.data)
        this.mapCenter = [eastLongitude, northLatitude]
      },
      clearForm() {
        this.form.setFieldsValue({
          storeCode: '',
          storeName: '',
          contact: '',
          commissionRate: '',
          storeImageUrl: '',
          address: '',
          eastLongitude: '',
          northLatitude: '',
        })
      },
      onConfirm() {
        this.form.validateFields((err, values) => {
          this.confirmLoading = true
          if (!err) {
            switch(this.type) {
              case 'PLUS':
                this.plusStore(values)
                break;
              case 'EDIT':
                this.editStore(values)
                break;
            }
          }
        });
      },
      async plusStore(data) {
        try {
          await CreateStore(data)

          this.$emit('close')
          this.succeed()
          this.$message.success(this.$t('afterCreateStore'))
        }
        catch {
          // 
        }
        this.confirmLoading = false
      },
      async editStore(data) {
        try {
          await UpdateStore({...data, id: this.id})

          this.$emit('close')
          this.succeed()
          this.$message.success(this.$t('afterUpdateStore'))
        }
        catch {
          // 
        }
        this.confirmLoading = false
      }
    }
  }
</script>

<style scoped>
</style>