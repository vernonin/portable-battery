<template>
  <div style="background-color: #fff;padding: 12px;">
    <SearchForm :form-data="searchFormData" :on-search="getPageUser" />
    <!-- 按钮 -->
    <ButtonBar :btns="barbtns" @plus="onPlus" @batch="onBatch" @import="onImport" @export="onExport" />
    <SelectAlert :num="selectedRowKeys.length" @clear="clearSelected" />
    <!-- 表格 -->
    <a-table
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data-source="users"
      :loading="tableLoading"
      :pagination="pagination"
      @change="tableChange"
    >
      <div slot="userSex" slot-scope="userSex">
        {{userSex ? '男' : '女'}}
      </div>
      
      <div slot="status" slot-scope="status">
        <a-badge status="success" v-if="status"/>
        <a-badge status="default" v-else />
        {{status ? '生效' : '失效'}}
      </div>

      <div slot="action" slot-scope="user">
        <a @click="onEdit(user)" :style="user.status ? {} : {color: '#999', cursor: 'not-allowed'}">{{$t('edit')}}</a>
        <a-divider type="vertical" />
        <a @click="changeStatus(user)">{{user.status ? $t('invalid') : $t('valid')}}</a>
      </div>
    </a-table>
    <PlusUser :visible="openPlusUser" :created="getPageUser" @cancel="openPlusUser = false" />
    <EditUser :visible="openEditUser" :user-id="currentUserId" :created="getPageUser" @cancel="openEditUser = false" />
    <ImportUser :visible="openImportUser" @cancel="openImportUser = false" />
  </div>
</template>

<script>
  import SearchForm from '@/components/tool/SearchForm.vue';
  import SelectAlert from '@/components/tool/SelectAlert.vue';
  import ButtonBar from '@/components/tool/ButtonBar.vue';
  import PlusUser from './components/PlusUser.vue';
  import EditUser from './components/EditUser.vue';
  import ImportUser from './components/ImportUser.vue';
  import { GetUsers, UpdateUserStatus } from '@/services/user';

  const updateStatusKey = 'updateStatus';

  // 二维数组：第一层代表列，第二层代表每列的Form.Item
  const searchFormData = [
    [
      {
        label: 'userAccount',
        type: 'input',
        name: 'userAccount',
        placeholder: '请输入用户名'
      },
      {
        label: 'userName',
        type: 'input',
        name: 'userName',
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
          { label: '生效', value: 'valid' },
          { label: '失效', value: 'invalid' }
        ]
      },
      {
        label: 'gender',
        type: 'select',
        name: 'userSex',
        placeholder: '请选择性别',
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' }
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
        
        currentUserId: '',
        tableLoading: false,
        openPlusUser: false,
        openEditUser: false,
        openImportUser: false,
        selectedRowKeys: [],
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10
        }
      }
    },
    created() {
      this.getPageUser()
    },
    methods: {
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      tableChange({ current }) {
        this.pagination.current = current

        this.getPageUser()
      },
      async getPageUser(query = {}) {
        this.tableLoading = true
        try {
          let result = await GetUsers({...query, ...this.pagination, size: this.pagination.pageSize})
          
          if (result.code === 200) {
            this.pagination.total = result.data.total
            this.users = result.data.records.map(u => ({...u, key: u.id}))
          }
        }
        catch {
          this.users = []
        }
        this.tableLoading = false
      },
      clearSelected() {
        this.selectedRowKeys = []
      },
      onPlus() {
        this.openPlusUser = true
      },
      onEdit({ id, status }) {
        if (status) {
          this.currentUserId = id
          this.openEditUser = true
        }
      },
      async changeStatus({ id }) {
        this.$message.loading({ content: this.$t('updatingStatus'), key: updateStatusKey });

        try {
          const result = await UpdateUserStatus(id)

          if (result.code === 200) {
            this.getPageUser()
            this.$message.success({ content: this.$t('afterStatusUpdate'), key: updateStatusKey })
          }
        }
        catch (error) {
          this.$message.success({ content: error.$message, key: updateStatusKey })
        }
        
      },
      onBatch() {
        console.log('onBatch')
      },
      onImport() {
        this.openImportUser = true
      },
      onExport() {
        console.log('onExport')
      }
    }
  }
</script>
