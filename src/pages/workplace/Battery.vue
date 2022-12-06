<template>
  <div style="background-color: #fff;padding: 12px;">
    <SearchForm :form-data="searchFormData" :on-search="getPageBattery" />
    <ButtonBar :btns="barbtns" @plus="onPlus" />
    <SelectAlert :num="selectedRowKeys.length" @clear="selectedRowKeys = []" />
    <a-table
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data-source="batterys"
      :loading="tableLoading"
      :pagination="pagination"
      @change="tableChange"
    >
      <div slot="batteryStatus" slot-scope="batteryStatus">
          <a-badge :status="batteryStatus === 'IN_USE' ? 'processing': batteryStatus === 'SOLD' ? 'error' : 'success'" />
          {{batteryStatus === 'IN_USE' ? '使用中' : batteryStatus === 'SOLD' ? '已出售' : '空闲'}}
        </div>
      
      <div slot="status" slot-scope="status">
        <a-badge :status="status === 'ONLINE' ? 'processing' : status === 'OFF_LINE' ? 'default' : ''" />
        {{status === 'ONLINE' ? '在线' : status === 'OFF_LINE' ? '离线' : ''}}
      </div>

      <div slot="power" slot-scope="battey">
        <a-progress
          :percent="(battey.power * 10)"
          :status="battey.batteryStatus === 'FREE' ? 'active' : ''"
          :stroke-color="battey.power <= 3 ? {
            '0%': '#FF4D52',
            '100%': '#FF4D52',
          } : {}"
        />
      </div>

      <div slot="action" slot-scope="battery">
        <a-popconfirm
          :title="$t('sureDelBattTitle')"
          ok-text="Yes"
          cancel-text="No"
          @confirm="onDelete(battery)"
        >
          <a style="color: #FF4D52;">{{$t('delete')}}</a>
        </a-popconfirm>
      </div>
    </a-table>

    <EditBattery :visible="openEditBattery" :type="TYPE" :batteryId="currentBatteryId" :succeed="getPageBattery" @cancel="openEditBattery = false" />
  </div>
</template>

<script>
  import EditBattery from './components/EditBattery.vue';
  import ButtonBar from '@/components/tool/ButtonBar.vue';
  import SearchForm from '@/components/tool/SearchForm.vue';
  import SelectAlert from '@/components/tool/SelectAlert.vue';

  import { GetBatterys, DeleteBattery } from '@/services/battery'

  const columns = [
    { title: '充电宝编号', dataIndex: 'batteryNumber', key: 'batteryNumber', width: 100 },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 120 },
    { title: '更新时间', dataIndex: 'lastSyncTime', key: 'lastSyncTime', width: 120, align: 'center' },
    { title: '使用次数', dataIndex: 'useCount', key: 'useCount', width: 80, align: 'center' },
    { title: '状态', dataIndex: 'batteryStatus', key: 'batteryStatus', width: 100, align: 'center', scopedSlots: { customRender: 'batteryStatus' } },
    { title: '当前电量', dataIndex: '', key: 'power', width: 200, scopedSlots: { customRender: 'power' } },
    { title: '操作', dataIndex: '', key: 'active', width: 100, align: 'center', scopedSlots: { customRender: 'action' } },
  ]


  // 二维数组：第一层代表列，第二层代表每列的Form.Item
  const searchFormData = [
    [
      {
        label: 'batteryNumber',
        type: 'input',
        name: 'batteryNumber',
        placeholder: '请输入'
      }
    ],
    [
      {
        label: 'status',
        type: 'select',
        name: 'batteryStatus',
        placeholder: '请选择状态',
        options: [
          { label: '使用中', value: 'IN_USE' },
          { label: '已出售', value: 'SOLD' },
          { label: '空闲', value: 'FREE' }
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

  export default {
    name: 'Battery',
    i18n: require('./i18n'),
    components: { SearchForm, ButtonBar, SelectAlert, EditBattery },
    data() {
      return {
        barbtns,
        columns,
        searchFormData,
        TYPE: 'PLUS',
        currentBatteryId: '',
        batterys: [],
        selectedRowKeys: [],
        tableLoading: false,
        openEditBattery: false,
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10
        }
      }
    },
    created() {
      this.getPageBattery()
    },
    methods: {
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      tableChange({ current }) {
        this.pagination.current = current

        this.getPageBattery()
      },
      async getPageBattery(query = {}) {
        this.tableLoading = true
        try {
          let result = await GetBatterys({...query, ...this.pagination, size: this.pagination.pageSize})

          this.pagination.total = result.data.total
          this.batterys = result.data.records.map(c => ({...c, key: c.id}))
        }
        catch {
          this.batterys = []
        }
        
        this.tableLoading = false
      },
      onPlus() {
        this.TYPE = 'PLUS'
        this.openEditBattery = true
      },

      async onDelete({ id }) {
        await DeleteBattery(id)
        
        this.$message.success(this.$t('afterDelete'))
        this.getPageBattery()
      }
    }
  }
</script>