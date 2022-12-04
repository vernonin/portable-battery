<template>
  <div style="background-color: #fff;padding: 12px;">
    <SearchForm :form-data="searchFormData" :on-search="getPageStore" />
    <ButtonBar :btns="barbtns" />
    <SelectAlert :num="selectedRowKeys.length" @clear="selectedRowKeys = []" />
    <a-table
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data-source="cabinets"
      :loading="tableLoading"
      :pagination="pagination"
      @change="tableChange"
    >
      <div slot="storeImageUrl" slot-scope="cabinet">
        <a @click="showImage(cabinet)">查看图片</a>
      </div>
      <div slot="generateQR" slot-scope="cabinet">
        <a @click="onGenerateQR(cabinet)">生成二维码</a>
      </div>

      <div slot="status" slot-scope="status">
        <a-badge :status="status ? 'success' : 'default'"/>
        {{status ? '生效' : '失效'}}
      </div>
    

      <div slot="action" slot-scope="cabinet">
        <a @click="onEdit(cabinet)">{{$t('edit')}}</a>
        <a-divider type="vertical" />
        <a>{{cabinet.status ? $t('invalid') : $t('valid')}}</a>
      </div>
    </a-table>
    <CabinetDetail :id="currentId" :visible="openDetail" @close="openDetail = false" />
  </div>
</template>

<script>
  import ButtonBar from '@/components/tool/ButtonBar.vue';
  import SearchForm from '@/components/tool/SearchForm.vue';
  import SelectAlert from '@/components/tool/SelectAlert.vue';
  import CabinetDetail from './components/CabinetDetail.vue';

  import { GetStores } from '@/services/store'

  const columns = [
    { title: '商户编号', dataIndex: 'storeCode', key: 'storeCode' },
    { title: '商户名称', dataIndex: 'storeName', key: 'storeName' },
    { title: '联系方式', dataIndex: 'contact	', key: 'contact	', width: 120, align: 'center' },
    { title: '商户地址', dataIndex: 'address', key: 'address', align: 'center' },
    { title: '商户图片', dataIndex: 'storeImageUrl', key: 'storeImageUrl', width: 100, align: 'center', scopedSlots: { customRender: 'storeImageUrl' } },
    { title: '分成比例', dataIndex: 'generateQR', key: 'generateQR', width: 120, scopedSlots: { customRender: 'generateQR' }  },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, align: 'center', scopedSlots: { customRender: 'status' } },
    { title: '操作', dataIndex: '', key: 'active', width: 120, align: 'center', scopedSlots: { customRender: 'action' } },
  ];


  // 二维数组：第一层代表列，第二层代表每列的Form.Item
  const searchFormData = [
    [
      {
        label: 'storeCode',
        type: 'input',
        name: 'storeCode',
        placeholder: '请输入'
      },
      {
        label: 'contact',
        type: 'input',
        name: 'contact',
        placeholder: '请输入'
      }
    ],
    [
      {
        label: 'storeName',
        type: 'input',
        name: 'storeName',
        placeholder: '请输入'
      },
      {
        label: 'status',
        type: 'select',
        name: 'status',
        placeholder: '请选择状态',
        options: [
          { label: '生效', value: 'valid' },
          { label: '失效', value: 'invalid' }
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
    name: 'Store',
    i18n: require('./i18n'),
    components: { SearchForm, ButtonBar, SelectAlert, CabinetDetail },
    data() {
      return {
        barbtns,
        columns,
        searchFormData,
        
        cabinets: [],
        selectedRowKeys: [],
        openDetail: false,
        tableLoading: false,
        currentId: '',
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10
        }
      }
    },
    created() {
      this.getPageStore()
    },
    methods: {
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      tableChange({ current }) {
        this.pagination.current = current

        this.getPageStore()
      },
      async getPageStore(query = {}) {
        this.tableLoading = true
        try {
          let result = await GetStores({...query, ...this.pagination, size: this.pagination.pageSize})

          this.pagination.total = result.data.total
          this.cabinets = result.data.records.map(c => ({...c, key: c.id}))
        }
        catch {
          this.cabinets = []
        }
        
        this.tableLoading = false
      },
      showImage(url) {
        console.log(url)
      },
      onGenerateQR(cabinet) {
        console.log(cabinet);
      },
      onEdit(cabinet) {
        console.log(cabinet)
      },
      showInfo({ id }) {
        this.currentId = id
        this.openDetail = true
      }
    }
  }
</script>