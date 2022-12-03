<template>
  <a-modal
    :title="$t('createMenu')"
    width="700px"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row>
        <a-col :span="12">
          <a-form-item :label="$t('menuNumber')">
            <a-input
              v-decorator="['menuNumber', { rules: [{ required: true, message: $t('menuNumberpl') }] }]"
              :placeholder="$t('menuNumberpl')"
            />
          </a-form-item>
          <a-form-item :label="$t('parentMenu')">
            <treeselect
              :multiple="false"
              :options="parentMenus"
              placeholder="Select your favourite(s)..."
              v-model="parentMenu"
            />
            <!-- <a-select
              v-decorator="['parentMenu']"
              :placeholder="$t('parentMenupl')"
            >
              <a-select-option value="male">{{$t('male')}}</a-select-option>
              <a-select-option value="female">{{$t('female')}}</a-select-option>
            </a-select> -->
          </a-form-item>
          <a-form-item :label="$t('menuSort')">
            <a-input
              v-decorator="['menuSort']"
              :placeholder="$t('menuSortpl')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('menuName')">
            <a-input
              v-decorator="['menuName', { rules: [{ required: true, message: $t('menuNamepl') }] }]"
              :placeholder="`${$t('menuNamepl')}`"
            />
          </a-form-item>
          <a-form-item :label="$t('routePath')">
            <a-input
              v-decorator="['routePath']"
              :placeholder="`${$t('routePathpl')}`"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>

  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { GetMenuTree } from '@/services/menu'

  export default {
    name: 'PlusUser',
    i18n: require('../i18n'),
    components: { Treeselect },
    props: {
      visible: { type: Boolean, default: false },
      type: { type: String, default: 'PLUS'}
    },
    data() {
      return {
        newMenu: [],
        parentMenu: [],
        parentMenus: [],
        form: this.$form.createForm(this, { name: 'coordinated' }),
      }
    },
    created() {
      
    },
    watch: {
      visible(newVal) {
        if (newVal) {
          this.getParentTree()
        }
      }
    },
    methods: {
      async getParentTree() {
        let result = await GetMenuTree()
        console.log(result.data.records);
        console.log('f:', this.filterMenu(result.data.records))
        this.parentMenus = result.data.records.map(m => ({
          id: m.id,
          label: m.menuName,
          children: m.children
        }))
      },
      filterMenu(menuTree) {
        // 
        return menuTree
      },
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
    }
  }
</script>

<style scoped>
</style>