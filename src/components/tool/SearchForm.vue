<template>
  <div>
    <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" @submit="handleSubmit">
      <a-row>
        <a-col :span="9" :key="index" v-for="(r, index) in formData">
          <a-form-item :label="$t(item.label)" :key="item.name" v-for="item in r">
            <a-input v-if="item.type === 'input'" v-decorator="[item.name]" :placeholder="$t(item.placeholder)" />

            <a-select
              v-if="item.type === 'select'"
              v-decorator="[item.name]"
              :placeholder="$t(item.placeholder)"
            >
              <a-select-option :key="s.value" v-for="s in item.options" :value="s.value">{{$t(s.label)}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="6" style="text-align: right;">
          <a-button type="primary" html-type="submit">
            {{$t('search')}}
          </a-button>
          <a-button style="margin-left: 8px;" @click="handleReset">
            {{$t('reset')}}
          </a-button>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
  const systemI18n = require('@/pages/system/i18n')
  const workplaceI18n = require('@/pages/workplace/i18n')
  export default {
    name: 'SearchForm',
    i18n: {
      messages: {
        CN: {...systemI18n.messages.CN, ...workplaceI18n.messages.CN },
        HK: {...systemI18n.messages.HK, ...workplaceI18n.messages.HK },
        US: {...systemI18n.messages.US, ...workplaceI18n.messages.US },
      }
    },
    props: {
      formData: { type: Array, default: () => [] },
      onSearch: { type: Function }
    },
    data() {
      return {
        formLayout: 'horizontal',
        form: this.$form.createForm(this, { name: 'coordinated' })
      }
    },
    methods: {
      handleReset() {
        this.form.resetFields();
      },
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            let { status, userSex } = values
            
            status = status === 'valid' ? true : status === 'invalid' ? false : null
            userSex = userSex === 'male' ? true : userSex === 'female' ? false : null

            this.onSearch({...values, status, userSex })
          }
        });
      },
    },
  }
</script>

<style scoped>

</style>
