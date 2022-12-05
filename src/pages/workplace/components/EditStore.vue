<template>
  <a-drawer
      :title="$t('createStore')"
      :width="720"
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
              <a-input
                v-decorator="[
                  'bonus',
                  {
                    rules: [{ required: true, message: $t('bonuspl') }],
                  },
                ]"
                placeholder="请输入1-100"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="$t('location')">
              <a-input
                v-decorator="[
                  'location',
                ]"
                :placeholder="$t('locationpl')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('storeImage')">
              <a-upload
                v-decorator="[
                  'storeImageUrl',
                  {
                    valuePropName: 'fileList',
                    getValueFromEvent: normFile,
                  },
                ]"
                name="logo"
                action="/upload.do"
                list-type="picture"
              >
                <a-button :block="true" style="width: 100%;"> <a-icon type="upload" />{{$t('clickUpload')}}</a-button>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
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
              <a-input v-decorator="['longitude']" :placeholder="$t('latitudepl')" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('latitude')">
              <a-input v-decorator="['latitude']" :placeholder="$t('latitudepl')" />
            </a-form-item>
          </a-col>
        </a-row>
        <Map :on-click="onMap"/>
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
        <a-button type="primary" @click="onClose">
          {{$t('confirm')}}
        </a-button>
      </div>
    </a-drawer>
</template>

<script>
  import Map from '@/components/map/Map.vue'

  export default {
    name: 'EditStore',
    i18n: require('../i18n'),
    components: { Map },
    props: {
      visible: { type: Boolean, default: false }
    },
    data() {
      return {
        form: this.$form.createForm(this),
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
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
      },
      onMap(position) {
        this.form.setFieldsValue({
          longitude: position[0],
          latitude: position[1]
        })
      }
    }
  }
</script>

<style scoped>
</style>