<template>
  <div style="background-color: #fff;padding: 12px;">
    <SearchForm :form-data="searchFormData" />
    <!-- 按钮 -->
    <ButtonBar :btns="barbtns" @plus="onPlus" @batch="onBatch" />
    <SelectAlert :num="selectedRowKeys.length" @clear="clearSelected" />
    <!-- 表格 -->
    <a-table
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data-source="menus"
    >
      <div slot="status" slot-scope="status">
        <a-badge status="success" v-if="status"/>
        <a-badge status="default" v-else />
        {{status ? '生效' : '失效'}}
      </div>

      <div slot="action">
        <a @click="onEdit">{{$t('edit')}}</a>
        <a-divider type="vertical" />
        <a @click="onAddSub">{{$t('addSubItem')}}</a>
        <a-divider type="vertical" />
        <a>{{$t('invalid')}}</a>
      </div>
    </a-table>
    <PlusMenu :visible="openPlusMenu" :type="TYPE" @cancel="openPlusMenu = false" />
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
        name: 'menuNumber',
        placeholder: '请输入菜单编号'
      },
      {
        label: 'menuName',
        type: 'input',
        name: 'menuName',
        placeholder: '请输入菜单名称'
      }
    ],
    [
      {
        label: 'status',
        type: 'select',
        name: 'status',
        placeholder: '请选择状态',
        options: [
          { label: '生效', value: 'shengxiao' },
          { label: '失效', value: 'shixiao' }
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
    { title: '菜单编号', dataIndex: 'code', key: 'code', width: 150  },
    { title: '菜单名称', dataIndex: 'menuName', key: 'menuName', width: 150 },
    { title: '菜单图标', dataIndex: 'mneuIcon', key: 'mneuIcon' },
    { title: '路由地址', dataIndex: 'path', key: 'path' },
    { title: '菜单排序', dataIndex: 'sort', key: 'sort', align: 'center' },
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
        openPlusMenu: false,
        menus: [],
        selectedRowKeys: [],

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
      async getPageMenu(query = {}) {
        try {
          let result = await GetMenus({...query, ...this.pagination, size: this.pagination.pageSize})

          if (result.code === 200) {
            this.pagination.total = result.data.total
            this.menus = result.data.records.map(m => ({...m, key: m.id}))
          }
        }
        catch {
          this.menus = []
        }


      },
      clearSelected() {
        this.selectedRowKeys = [];
      },
      onPlus() {
        console.log('onPlus');
        this.TYPE = 'PLUS'
        this.openPlusMenu = true;
      },
      onEdit() {
        this.TYPE = 'EDIT'
        this.openPlusMenu = true;
      },
      onBatch() {
        console.log('onBatch');
      },
      onAddSub() {
        this.openPlusMenu = true;
      },
    }
  }
</script>

<style scoped>

</style>
