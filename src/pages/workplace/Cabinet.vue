<template>
  <div style="background-color: #fff;padding: 12px;">
    <SearchForm :form-data="searchFormData" :on-search="getPageCabinet" />
    <ButtonBar :btns="barbtns" @plus="onPlus" />
    <SelectAlert :num="selectedRowKeys.length" @clear="selectedRowKeys = []" />
    <a-table
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data-source="cabinets"
      :loading="tableLoading"
      :pagination="pagination"
      @change="tableChange"
    >
      <div slot="generateQR" slot-scope="cabinet">
        <a @click="onGenerateQR(cabinet)">生成二维码</a>
      </div>
      
      <div slot="status" slot-scope="status">
        <a-badge :status="status === 'ONLINE' ? 'processing' : status === 'OFF_LINE' ? 'default' : ''" />
        {{status === 'ONLINE' ? '在线' : status === 'OFF_LINE' ? '离线' : ''}}
      </div>

      <div slot="action" slot-scope="cabinet">
        <a @click="onEdit(cabinet)">{{$t('edit')}}</a>
        <a-divider type="vertical" />
        <a @click="showInfo(cabinet)">{{$t('info')}}</a>
        <a-divider type="vertical" />
        <a-popconfirm
          :title="$t('sureDelTitle')"
          ok-text="Yes"
          cancel-text="No"
          @confirm="onDelete(cabinet)"
        >
          <a style="color: #FF4D52;">{{$t('delete')}}</a>
        </a-popconfirm>
      </div>
    </a-table>
    <CabinetDetail :id="currentId" :visible="openDetail" @close="openDetail = false" />
    <EditCabinet :visible="openEditCabinet" :type="TYPE" :cabinetId="currentId" :succeed="getPageCabinet" @cancel="openEditCabinet = false" />
  </div>
</template>

<script>
  import EditCabinet from './components/EditCabinet.vue';
  import ButtonBar from '@/components/tool/ButtonBar.vue';
  import SearchForm from '@/components/tool/SearchForm.vue';
  import CabinetDetail from './components/CabinetDetail.vue';
  import SelectAlert from '@/components/tool/SelectAlert.vue';

  import { GetCabinets, DeleteCabinet } from '@/services/cabinet'

  const columns = [
    { title: '机柜编号', dataIndex: 'chassisNumber', key: 'chassisNumber' },
    { title: '所在商户', dataIndex: 'storeName', key: 'storeName' },
    { title: '可借', dataIndex: 'borrowableNumber', key: 'borrowableNumber', width: 80, align: 'center' },
    { title: '可还', dataIndex: 'returnNumber', key: 'returnNumber', width: 80, align: 'center' },
    { title: '充电宝槽数', dataIndex: 'totalNumber', key: 'totalNumber', width: 120, align: 'center' },
    { title: '生成二维码', dataIndex: 'generateQR', key: 'generateQR', width: 120, scopedSlots: { customRender: 'generateQR' }  },
    { title: '状态', dataIndex: 'chassisStatus', key: 'chassisStatus', width: 100, align: 'center', scopedSlots: { customRender: 'status' } },
    { title: '操作', dataIndex: '', key: 'active', width: 180, align: 'center', scopedSlots: { customRender: 'action' } },
  ];


  // 二维数组：第一层代表列，第二层代表每列的Form.Item
  const searchFormData = [
    [
      {
        label: 'chassisNumber',
        type: 'input',
        name: 'chassisNumber',
        placeholder: 'chassisNumberpl'
      },
      {
        label: 'merchant',
        type: 'input',
        name: 'storeName',
        placeholder: 'merchantpl'
      }
    ],
    [
      {
        label: 'status',
        type: 'select',
        name: 'chassisStatus',
        placeholder: 'statuspl',
        options: [
          { label: 'ONLINE', value: 'ONLINE' },
          { label: 'OFF_LINE', value: 'OFF_LINE' }
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
    name: 'Cabinet',
    i18n: require('./i18n'),
    components: { SearchForm, ButtonBar, SelectAlert, CabinetDetail, EditCabinet },
    data() {
      return {
        barbtns,
        columns,
        searchFormData,
        TYPE: 'PLUS',
        cabinets: [],
        selectedRowKeys: [],
        openDetail: false,
        tableLoading: false,
        openEditCabinet: false,
        currentId: '',
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10
        }
      }
    },
    created() {
      this.getPageCabinet()
    },
    methods: {
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      tableChange({ current }) {
        this.pagination.current = current

        this.getPageCabinet()
      },
      async getPageCabinet(query = {}) {
        this.tableLoading = true
        try {
          let result = await GetCabinets({...query, ...this.pagination, size: this.pagination.pageSize})

          this.pagination.total = result.data.total
          this.cabinets = result.data.records.map(c => ({...c, key: c.id}))
        }
        catch {
          this.cabinets = []
        }
        
        this.tableLoading = false
      },
      onGenerateQR(cabinet) {
        console.log(cabinet);
      },
      onPlus() {
        this.TYPE = 'PLUS'
        this.openEditCabinet = true
      },
      onEdit({ id }) {
        this.TYPE = 'EDIT'
        this.currentId = id
        this.openEditCabinet = true
      },
      showInfo({ id }) {
        this.currentId = id
        this.openDetail = true
      },
      async onDelete({ id }) {
        await DeleteCabinet(id)

        this.$message.success(this.$t('afterDelete'))
        this.getPageCabinet()
      }
    }
  }
</script>