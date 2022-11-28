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
      :data-source="roles"
    >
      <div slot="status" slot-scope="status">
        <a-badge status="success" v-if="status"/>
        <a-badge status="default" v-else />
        {{status ? '生效' : '失效'}}
      </div>

      <div slot="action">
        <a @click="onEdit">{{$t('edit')}}</a>
        <a-divider type="vertical" />
        <a @click="onPermiss">{{$t('permiss')}}</a>
        <a-divider type="vertical" />
        <a>{{$t('invalid')}}</a>
      </div>
    </a-table>
    <EditRole :visible="openEditRole" :type="TYPE" @cancel="openEditRole = false" />
    <PermissRole :visible="openPermissRole" @cancel="openPermissRole = false" />
  </div>
</template>

<script>
  import SearchForm from './components/SearchForm.vue';
  import SelectAlert from './components/SelectAlert.vue';
  import ButtonBar from '@/components/tool/ButtonBar.vue';
  import EditRole from './components/EditRole.vue';
  import PermissRole from './components/PermissRole.vue';
  import { GetRoles } from '@/services/role'

  // 二维数组：第一层代表列，第二层代表每列的Form.Item
  const searchFormData = [
    [
      {
        label: 'roleNumber',
        type: 'input',
        name: 'roleNumber',
        placeholder: '请输入角色编号'
      },
      {
        label: 'roleName',
        type: 'input',
        name: 'roleName',
        placeholder: '请输入角色名称'
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
    { title: '角色编号', dataIndex: 'roleCode', key: 'roleCode', width: 150  },
    { title: '角色名称', dataIndex: 'roleName', key: 'roleName', width: 150 },
    { title: '角色描述', dataIndex: 'roleDescribe', key: 'roleDescribe' },
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
        openEditRole: false,
        openPermissRole: false,
        selectedRowKeys: [],
      }
    },
    created() {
      this.getPageRole()
    },
    methods: {
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      async getPageRole() {
        try {
          let result = await GetRoles()

          if (result.code === 200) {
            console.log(result)
            this.roles = result.data.records
          }
        }
        catch {
          this.roles = []
        }
      },
      clearSelected() {
        this.selectedRowKeys = [];
      },
      onPlus() {
        console.log('onPlus');
        this.TYPE = 'PLUS'
        this.openEditRole = true;
      },
      onEdit() {
        this.TYPE = 'EDIT'
        this.openEditRole = true;
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
