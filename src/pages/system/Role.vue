<template>
  <div style="background-color: #fff;padding: 12px;">
    <SearchForm :form-data="searchFormData" :on-search="getPageRole" />
    <!-- 按钮 -->
    <ButtonBar :btns="barbtns" @plus="onPlus" @batch="onBatch" />
    <SelectAlert :num="selectedRowKeys.length" @clear="clearSelected" />
    <!-- 表格 -->
    <a-table
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data-source="roles"
      :loading="tableLoading"
      :pagination="pagination"
      @change="tableChange"
    >
      <div slot="status" slot-scope="status">
        <a-badge status="success" v-if="status"/>
        <a-badge status="default" v-else />
        {{status ? '生效' : '失效'}}
      </div>

      <div slot="action" slot-scope="role">
        <a @click="onEdit(role)">{{$t('edit')}}</a>
        <a-divider type="vertical" />
        <a @click="onPermiss">{{$t('permiss')}}</a>
        <a-divider type="vertical" />
        <a @click="changeStatus(role)">{{role.status ? $t('invalid') : $t('valid')}}</a>
      </div>
    </a-table>
    <EditRole :visible="openEditRole" :type="TYPE" :role-id="currentRoleId" :succeed="getPageRole" @cancel="openEditRole = false" />
    <PermissRole :visible="openPermissRole" @cancel="openPermissRole = false" />
  </div>
</template>

<script>
  import SearchForm from '@/components/tool/SearchForm.vue';
  import SelectAlert from '@/components/tool/SelectAlert.vue';
  import ButtonBar from '@/components/tool/ButtonBar.vue';
  import EditRole from './components/EditRole.vue';
  import PermissRole from './components/PermissRole.vue';
  import { GetRoles, UpdateRoleStatus } from '@/services/role';

  const updateStatusKey = 'updateStatus';

  // 二维数组：第一层代表列，第二层代表每列的Form.Item
  const searchFormData = [
    [
      {
        label: 'roleCode',
        type: 'input',
        name: 'roleCode',
        placeholder: 'roleCodepl'
      },
      {
        label: 'roleName',
        type: 'input',
        name: 'roleName',
        placeholder: 'roleNamepl'
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
    { title: '角色编号', dataIndex: 'roleCode', key: 'roleCode'  },
    { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120, scopedSlots: { customRender: 'status' } },
    { title: '操作', dataIndex: '', key: 'active', width: 180, align: 'center', scopedSlots: { customRender: 'action' } },
  ];

  export default {
    name: 'Role',
    i18n: require('./i18n'),
    components: { SearchForm, SelectAlert, ButtonBar, EditRole, PermissRole },
    data() {
      return {
        columns,
        barbtns,
        searchFormData,
        
        roles: [],
        TYPE: 'PLUS',
        currentRoleId: '',
        selectedRowKeys: [],
        tableLoading: false,
        openEditRole: false,
        openPermissRole: false,
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10
        }
      }
    },
    created() {
      this.getPageRole()
    },
    methods: {
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      tableChange({ current }) {
        this.pagination.current = current

        this.getPageUser()
      },
      async getPageRole(query = {}) {
        this.tableLoading = true
        try {
          let result = await GetRoles({...query, ...this.pagination, size: this.pagination.pageSize})

          if (result.code === 200) {
            this.roles = result.data.records.map(r => ({...r, key: r.id}))
          }
        }
        catch {
          this.roles = []
        }
        this.tableLoading = false
      },
      async changeStatus({ id, roleCode }) {
        if (roleCode === 'admin') {
          this.$message.warning('超级管理员不可失效！')
          return
        }

        this.$message.loading({ content: this.$t('updatingStatus'), key: updateStatusKey });

        try {
          let result = await UpdateRoleStatus(id)

          if (result.code === 200) {
            this.getPageRole()
            this.$message.success({ content: this.$t('afterStatusUpdate'), key: updateStatusKey });
          } else {
            this.$message.error(result.msg)
          }
        }
        catch(error) {
          this.$message.success({ content: error.$message, key: updateStatusKey });
        }
      },
      clearSelected() {
        this.selectedRowKeys = [];
      },
      onPlus() {
        this.TYPE = 'PLUS'
        this.openEditRole = true;
      },
      onEdit({ id }) {
        this.TYPE = 'EDIT'
        this.currentRoleId = id
        this.openEditRole = true
      },
      onBatch() {
        console.log('onBatch');
      },
      onPermiss() {
        this.openPermissRole = true;
      },
    }
  }
</script>

<style scoped>

</style>
