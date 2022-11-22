<template>
  <div style="background-color: #fff;padding: 12px;">
    <SearchForm :form-data="searchFormData" />
    <!-- 按钮 -->
    <ButtonBar :btns="barbtns" @plus="onPlus" @batch="onBatch" @import="onImport" @export="onExport" />
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
        <a>{{$t('invalid')}}</a>
      </div>
    </a-table>
    <PlusUser :visible="openPlusUser" @cancel="openPlusUser = false" />
    <EditUser :visible="openEditUser" @cancel="openEditUser = false" />
    <ImportUser :visible="openImportUser" @cancel="openImportUser = false" />
  </div>
</template>

<script>
  import SearchForm from './components/SearchForm.vue';
  import SelectAlert from './components/SelectAlert.vue';
  import ButtonBar from '@/components/tool/ButtonBar.vue';
  import PlusUser from './components/PlusUser.vue';
  import EditUser from './components/EditUser.vue';
  import ImportUser from './components/ImportUser.vue';

  // 二维数组：第一层代表列，第二层代表每列的Form.Item
  const searchFormData = [
    [
      {
        label: 'username',
        type: 'input',
        name: 'username',
        placeholder: '请输入用户名'
      },
      {
        label: 'name',
        type: 'input',
        name: 'name',
        placeholder: '请输入姓名'
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
      },
      {
        label: 'gender',
        type: 'select',
        name: 'gender',
        placeholder: '请选择性别',
        options: [
          { label: '男', value: 'nan' },
          { label: '女', value: 'nv' }
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
    },
    {
      key: 'import',
      text: 'import',
      type: 'primary',
      icon: 'import',
      style: {backgroundColor: '#52C41A'}
    },
    {
      key: 'export',
      text: 'export',
      type: 'danger',
      icon: 'export'
    }
  ]

  const columns = [
    { title: '用户名', dataIndex: 'userName', key: 'userName' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '性别', dataIndex: 'gender', key: 'gender', width: 120 },
    { title: '手机号码', dataIndex: 'userPhone', key: 'userPhone' },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120, scopedSlots: { customRender: 'status' } },
    { title: '操作', dataIndex: '', key: 'active', width: 120, align: 'center', scopedSlots: { customRender: 'action' } },
  ];

  const data = [
    {
      key: '1',
      userName: 'John Brown',
      userPhone: '13318480733',
      name: '孙忆枫',
      gender: '男',
      status: '生效',
    },
    {
      key: '2',
      userName: 'user002',
      userPhone: '13318480733',
      name: '纪广',
      gender: '男',
      status: '生效'
    },
    {
      key: '13',
      userName: 'user003',
      userPhone: '13318480733',
      name: '王笑天',
      gender: '女',
      status: '失效'
    },
  ]

  export default {
    name: 'User',
    i18n: require('./i18n'),
    components: { SearchForm, SelectAlert, ButtonBar, PlusUser, EditUser, ImportUser },
    data() {
      return {
        data,
        columns,
        barbtns,
        searchFormData,

        openPlusUser: false,
        openEditUser: false,
        openImportUser: false,
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
        this.openPlusUser = true;
      },
      onEdit() {
        this.openEditUser = true;
      },
      onBatch() {
        console.log('onBatch');
      },
      onImport() {
        this.openImportUser = true;
      },
      onExport() {
        console.log('onExport');
      }
    }
  }
</script>

<style scoped>

</style>