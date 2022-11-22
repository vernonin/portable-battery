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
      :data-source="data"
    >
      <div slot="status" slot-scope="status">
        <a-badge status="success" v-if="status === '生效'"/>
        <a-badge status="default" v-else />
        {{status}}
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
  import SearchForm from './components/SearchForm.vue';
  import SelectAlert from './components/SelectAlert.vue';
  import ButtonBar from '@/components/tool/ButtonBar.vue';
  import PlusMenu from './components/PlusMenu.vue';

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
    { title: '菜单编号', dataIndex: 'menuNumber', key: 'roleNumber', width: 150  },
    { title: '菜单名称', dataIndex: 'menuName', key: 'roleName', width: 150 },
    { title: '菜单图标', dataIndex: 'mneuIcon', key: 'mneuIcon' },
    { title: '路由地址', dataIndex: 'routePath', key: 'routePath' },
    { title: '菜单排序', dataIndex: 'menuSort', key: 'menuSort' },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120, scopedSlots: { customRender: 'status' } },
    { title: '操作', dataIndex: '', key: 'active', width: 200, align: 'center', scopedSlots: { customRender: 'action' } },
  ];

  const data = [
    {
      key: '1',
      menuNumber: 1001,
      menuMame: '管理员',
      menuIcon: '',
      routePath: '/ltc/customer',
      menuSort: 1,
      status: '生效',
    },
    {
      key: '3',
      menuNumber: 1002,
      menuMame: '店长菜单',
      menuIcon: '',
      routePath: '/ltc/customer1',
      menuSort: 2,
      status: '失效',
    },
    {
      key: '55',
      menuNumber: 1003,
      menuName: '收银员菜单',
      menuIcon: '',
      routePath: '/ltc/customer2',
      menuSort: 3,
      status: '生效',
    },
  ]

  export default {
    name: 'Menu',
    i18n: require('./i18n'),
    components: { SearchForm, SelectAlert, ButtonBar, PlusMenu },
    data() {
      return {
        data,
        columns,
        barbtns,
        searchFormData,
        
        TYPE: 'PLUS',
        openPlusMenu: false,
        selectedRowKeys: [],
      }
    },
    methods: {
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
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
