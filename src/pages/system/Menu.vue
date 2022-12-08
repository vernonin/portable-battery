<template>
  <div style="background-color: #fff;padding: 12px;">
    <SearchForm :form-data="searchFormData" :on-search="getPageMenu" />
    <!-- 按钮 -->
    <ButtonBar :btns="barbtns" @plus="onPlus" @batch="onBatch" />
    <SelectAlert :num="selectedRowKeys.length" @clear="clearSelected" />
    <!-- 表格 -->
    <a-table
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data-source="menus"
      :loading="tableLoading"
      :expanded-row-keys.sync="expandedRowKeys"
      @expandedRowsChange="rowsChange"
    >
      <div slot="status" slot-scope="status">
        <a-badge status="success" v-if="status"/>
        <a-badge status="default" v-else />
        {{status ? '生效' : '失效'}}
      </div>

      <div slot="action" slot-scope="menu">
        <a @click="onEdit(menu.id)">{{$t('edit')}}</a>
        <a-divider type="vertical" />
        <a @click="onAddSub(menu.id)">{{$t('addSubItem')}}</a>
        <a-divider type="vertical" />
        <a>{{$t('invalid')}}</a>
      </div>
    </a-table>
    <PlusMenu :visible="openPlusMenu" :type="TYPE" :id="currentMenuId" :succeed="getPageMenu" @cancel="openPlusMenu = false" />
  </div>
</template>

<script>
  import SearchForm from '@/components/tool/SearchForm.vue';
  import SelectAlert from '@/components/tool/SelectAlert.vue';
  import ButtonBar from '@/components/tool/ButtonBar.vue';
  import PlusMenu from './components/PlusMenu.vue';

  import { GetMenus } from '@/services/menu'

  // 二维数组：第一层代表列，第二层代表每列的Form.Item
  const searchFormData = [
    [
      {
        label: 'menuNumber',
        type: 'input',
        name: 'code',
        placeholder: 'menuNumberpl'
      },
      {
        label: 'menuName',
        type: 'input',
        name: 'menuName',
        placeholder: 'menuNamepl'
      }
    ],
    [
      {
        label: 'status',
        type: 'select',
        name: 'status',
        placeholder: 'statuspl',
        options: [
          { label: 'valid', value: 'valid' },
          { label: 'invalid', value: 'invalid' }
        ]
      }
    ]
  ]

  // 按钮栏
  const barbtns = [
    {
      key: 'plus',
      text: 'plus',
      type: 'primary',
      icon: 'plus'
    },
    {
      key: 'batch',
      text: 'batchActive',
      type: 'default'
    }
  ]

  const columns = [
    { title: '菜单编号', dataIndex: 'code', key: 'code'  },
    { title: '菜单名称', dataIndex: 'menuName', key: 'menuName', width: 120 },
    { title: '菜单图标', dataIndex: 'mneuIcon', key: 'mneuIcon', width: 100 },
    { title: '路由地址', dataIndex: 'path', key: 'path' },
    { title: '菜单排序', dataIndex: 'sort', key: 'sort', align: 'center', width: 100 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120, align: 'center', scopedSlots: { customRender: 'status' } },
    { title: '操作', dataIndex: '', key: 'active', width: 200, align: 'center', scopedSlots: { customRender: 'action' } },
  ];

  export default {
    name: 'Menu',
    i18n: require('./i18n'),
    components: { SearchForm, SelectAlert, ButtonBar, PlusMenu },
    data() {
      return {
        columns,
        barbtns,
        searchFormData,
        
        TYPE: 'PLUS',
        currentMenuId: '',
        openPlusMenu: false,
        tableLoading: false,
        menus: [],
        selectedRowKeys: [],
        expandedRowKeys: [],
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10
        }
      }
    },
    created() {
      this.getPageMenu()
    },
    methods: {
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      rowsChange(keys) {
        this.expandedRowKeys = keys
      },
      async getPageMenu(query = {}) {
        this.tableLoading = true
        try {
          let result = await GetMenus({...query, ...this.pagination, size: this.pagination.pageSize})

          if (result.code === 200) {
            this.pagination.total = result.data.total
            this.menus = this.addKeyToMenus(result.data.records)
          }
        }
        catch {
          this.menus = []
        }

        this.tableLoading = false
      },
      addKeyToMenus(data) {
        let newArr = []

        data.forEach(menu => {
          if (menu.children && menu.children.length > 0) {
            newArr.push({
              ...menu,
              key: menu.id,
              children: this.addKeyToMenus(menu.children)
            })
          } else {
            delete menu.children
            newArr.push({
              ...menu,
              key: menu.id
            })
          }
        })

        return newArr
      },
      clearSelected() {
        this.selectedRowKeys = [];
      },
      onPlus() {
        this.TYPE = 'PLUS'
        this.currentMenuId = ''
        this.openPlusMenu = true
      },
      onEdit(id) {
        this.TYPE = 'EDIT'
        this.currentMenuId = id
        this.openPlusMenu = true
      },
      onBatch() {
        console.log('onBatch')
      },
      onAddSub(id) {
        this.TYPE = 'PLUS'
        this.currentMenuId = id
        this.openPlusMenu = true
      },
    }
  }
</script>
