<template>
  <div style="background-color: #fff;padding: 12px;">
    <SearchForm :form-data="searchFormData" :on-search="getPageStore" />
    <ButtonBar :btns="barbtns" @plus="onPlus" />
    <SelectAlert :num="selectedRowKeys.length" @clear="selectedRowKeys = []" />
    <a-table
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data-source="stores"
      :loading="tableLoading"
      :pagination="pagination"
      @change="tableChange"
    >
      <div slot="storeImageUrl" slot-scope="storeImageUrl">
        <a @click="showImage(storeImageUrl)">查看图片</a>
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
    <EditStore :visible="openEditStore" :type="TYPE" :id="currentStoreId" :succeed="getPageStore" @close="openEditStore = false" />

    <viewer :images="storeImageUrl" style="display: none;">
      <img id="viewer" :src="storeImageUrl[0]">
    </viewer>
  </div>
</template>

<script>
  import EditStore from './components/EditStore.vue';
  import ButtonBar from '@/components/tool/ButtonBar.vue';
  import SearchForm from '@/components/tool/SearchForm.vue';
  import SelectAlert from '@/components/tool/SelectAlert.vue';

  import { GetStores } from '@/services/store'

  const columns = [
    { title: '商户编号', dataIndex: 'storeCode', key: 'storeCode' },
    { title: '商户名称', dataIndex: 'storeName', key: 'storeName' },
    { title: '联系方式', dataIndex: 'contact', key: 'contact', width: 120, align: 'center' },
    { title: '商户地址', dataIndex: 'address', key: 'address', align: 'center' },
    { title: '商户图片', dataIndex: 'storeImageUrl', key: 'storeImageUrl', width: 100, align: 'center', scopedSlots: { customRender: 'storeImageUrl' } },
    { title: '分成比例', dataIndex: 'commissionRate', key: 'commissionRate', width: 100, align: 'center', },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, align: 'center', scopedSlots: { customRender: 'status' } },
    { title: '操作', dataIndex: '', key: 'active', width: 120, align: 'center', scopedSlots: { customRender: 'action' } },
  ]

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
    components: { SearchForm, ButtonBar, SelectAlert, EditStore },
    data() {
      return {
        barbtns,
        columns,
        searchFormData,
        
        stores: [],
        selectedRowKeys: [],
        storeImageUrl: [],
        imgs: [],
        TYPE: 'PLUS',
        currentStoreId: '',
        openEditStore: false,
        tableLoading: false,
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
          this.stores = result.data.records.map(c => ({...c, key: c.id}))
        }
        catch {
          this.stores = []
        }
        
        this.tableLoading = false
      },
      onPlus() {
        this.TYPE = 'PLUS'
        this.openEditStore = true
      },
      showImage(url) {
        console.log(url)
        this.storeImageUrl = [url]
        setTimeout(() => {
          document.getElementById('viewer').click()
        }, 100)
      },
      onEdit({ id }) {
        this.TYPE = 'EDIT'
        this.currentStoreId = id
        this.openEditStore = true
      },
    }
  }
</script>