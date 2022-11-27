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
      :data-source="users"
    >
      <div slot="userSex" slot-scope="userSex">
        {{userSex ? '男' : '女'}}
      </div>
      
      <div slot="status" slot-scope="status">
        <a-badge status="success" v-if="status"/>
        <a-badge status="default" v-else />
        {{status ? '生效' : '失效'}}
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
  import { GetUsers } from '@/services/user'

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
    { title: '用户名', dataIndex: 'userAccount', key: 'userAccount' },
    { title: '姓名', dataIndex: 'userName', key: 'userName' },
    { title: '性别', dataIndex: 'userSex', key: 'userSex', width: 80, align: 'center', scopedSlots: { customRender: 'userSex' } },
    { title: '手机号码', dataIndex: 'userPhone', key: 'userPhone' },
    { title: '邮箱', dataIndex: 'userEmail', key: 'userEmail' },
    { title: '绑定角色', dataIndex: 'roleNames', key: 'roleNames', width: 120 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, align: 'center', scopedSlots: { customRender: 'status' } },
    { title: '操作', dataIndex: '', key: 'active', width: 120, align: 'center', scopedSlots: { customRender: 'action' } },
  ];


  export default {
    name: 'User',
    i18n: require('./i18n'),
    components: { SearchForm, SelectAlert, ButtonBar, PlusUser, EditUser, ImportUser },
    data() {
      return {
        users: [],
        columns,
        barbtns,
        searchFormData,

        openPlusUser: false,
        openEditUser: false,
        openImportUser: false,
        selectedRowKeys: [],
      }
    },
    created() {
      this.getPageUser()
    },
    methods: {
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      async getPageUser() {
        try {
          let result = await GetUsers()
          
          if (result.code === 200) {
            this.users = result.data.records.map(u => ({...u, key: u.id}))
          }
        }
        catch {
          this.users = []
        }
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
