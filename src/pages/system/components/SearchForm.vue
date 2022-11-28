<template>
  <div>
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" @submit="handleSubmit">
      <a-row>
        <a-col :span="8" :key="index" v-for="(r, index) in formData">
          <a-form-item :label="$t(item.label)" :key="item.name" v-for="item in r">
            <a-input v-if="item.type === 'input'" v-decorator="[item.name]" :placeholder="item.placeholder" />

            <a-select
              v-if="item.type === 'select'"
              v-decorator="[item.name]"
              :placeholder="item.placeholder"
            >
              <a-select-option :key="s.value" v-for="s in item.options" :value="s.value">{{s.label}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="8">
          <a-form-item>
            <a-button type="primary" html-type="submit">
              {{$t('search')}}
            </a-button>
            <a-button style="margin-left: 8px;" @click="handleReset">
              {{$t('reset')}}
            </a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
  export default {
    name: 'SearchForm',
    i18n: require('../i18n'),
    props: {
      formData: {
        type: Array,
        default: () => []
      },
      onSearch: {
        type: Function
      }
    },
    data() {
      return {
        formLayout: 'horizontal',
        form: this.$form.createForm(this, { name: 'coordinated' })
      }
    },
    methods: {
      handleReset() {
        console.log(this.form);
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
