<template>
  <a-modal
    :title="type === 'PLUS' ? $t('createMenu') : type === 'EDIT' ? $t('editMenu') : ''"
    width="700px"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-row>
        <a-col :span="12">
          <a-form-item :label="$t('menuNumber')">
            <a-input
              v-decorator="['code', { rules: [{ required: true, message: $t('menuNumberpl') }] }]"
              :placeholder="$t('menuNumberpl')"
            />
          </a-form-item>
          <a-form-item :label="$t('parentMenu')">
            <treeselect
              :multiple="false"
              style="height: 32px;"
              :options="parentMenus"
              :placeholder="$t('parentMenupl')"
              v-model="parentMenu"
            />
          </a-form-item>
          <a-form-item :label="$t('menuSort')">
            <a-input
              v-decorator="['sort']"
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
              v-decorator="['path']"
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
  import { GetMenuTree, GetMenu, CreateMenu, UpdateMenu } from '@/services/menu'

  export default {
    name: 'PlusUser',
    i18n: require('../i18n'),
    components: { Treeselect },
    props: {
      visible: { type: Boolean, default: false },
      type: { type: String, default: 'PLUS'},
      id: { type: String, default: ''},
      succeed: { type: Function }
    },
    data() {
      return {
        newMenu: [],
        parentMenu: null,
        parentMenus: [],
        confirmLoading: false,
  
        form: this.$form.createForm(this, { name: 'coordinated' }),
      }
    },
    watch: {
      visible(newVal) {
        if (newVal) {
          this.getParentTree()
        }
      }
    },
    methods: {
      async getMenuDetail() {
        const result = await GetMenu(this.id)
        const parnetId = result.data.parentIds

        if (parnetId) {
          this.parentMenu = parnetId
        }
        this.form.setFieldsValue(result.data)
      },
      async getParentTree() {
        let result = await GetMenuTree()
        this.parentMenus = this.filterMenu(result.data.records)

        if (this.type === 'EDIT') {
          this.getMenuDetail()
        }

        // 如果是添加子项按钮，则回显改项菜单在上级菜单
        if (this.type === 'PLUS' && this.id !== '') {
          this.parentMenu = this.id
        }
      },
      filterMenu(menuTree) {
        let newArr = []

        menuTree.forEach(menu => {
          if (menu.children && menu.children.length > 0) {
            newArr.push({
              id: menu.id,
              label: menu.menuName,
              children: this.filterMenu(menu.children)
            })
          } else {
            newArr.push({
              id: menu.id,
              label: menu.menuName
            })
          }
        })

        return newArr
      },
      handleOk() {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true

            switch(this.type) {
              case 'PLUS':
                this.plusMenu({...values, parentId: this.parentMenu || ''})
                break;
              case 'EDIT':
                this.updateMenu({...values, id: this.id, parentId: this.parentMenu || ''})
                break;
            }
          }
        });
      },
      handleCancel() {
        this.$emit('cancel')
      },
      async plusMenu(data) {
        try {
          await CreateMenu(data)

          this.succeed()
          this.$emit('cancel')
          this.$message.success(this.$t('afterCreateMenu'))
        }
        catch {
          // 
        }

        this.confirmLoading = false
      },
      async updateMenu(data) {
        try {
          await UpdateMenu(data)

          this.succeed()
          this.$emit('cancel')
          this.$message.success(this.$t('afterUpdateMenu'))
        }
        catch {
          // 
        }

        this.confirmLoading = false
      }
    }
  }
</script>
