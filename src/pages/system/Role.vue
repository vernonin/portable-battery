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
    { title: '角色编号', dataIndex: 'roleNumber', key: 'roleNumber', width: 150  },
    { title: '角色名称', dataIndex: 'roleName', key: 'roleName', width: 150 },
    { title: '角色描述', dataIndex: 'roleDescribe', key: 'roleDescribe' },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120, scopedSlots: { customRender: 'status' } },
    { title: '操作', dataIndex: '', key: 'active', width: 180, align: 'center', scopedSlots: { customRender: 'action' } },
  ];

  const data = [
    {
      key: '1',
      roleNumber: 1001,
      roleName: '店长',
      roleDescribe: '最佳产品管理书籍在此，获取职场上升秘籍',
      status: '生效',
    },
    {
      key: '2',
      roleNumber: 1002,
      roleName: '店员',
      roleDescribe: '探索了5种改善移动用户体验的绝佳做法，进来学！',
      status: '失效',
    },
    {
      key: '3',
      roleNumber: 1003,
      roleName: '收银员',
      roleDescribe: '面试攻略：超级加分的10个面试满分小技巧',
      status: '生效',
    },
  ]

  export default {
    name: 'Role',
    i18n: require('./i18n'),
    components: { SearchForm, SelectAlert, ButtonBar, EditRole, PermissRole },
    data() {
      return {
        data,
        columns,
        barbtns,
        searchFormData,
        
        TYPE: 'PLUS',
        openEditRole: false,
        openPermissRole: false,
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
