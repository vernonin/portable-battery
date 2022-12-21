<template>
  <div style="background-color: #fff;padding: 12px;">
    <SearchForm :form-data="searchFormData" :on-search="getPageOrder" />
    <SelectAlert :num="selectedRowKeys.length" @clear="selectedRowKeys = []" />
    <a-table
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data-source="oders"
      :loading="tableLoading"
      :pagination="pagination"
      @change="tableChange"
    >
      <div slot="deviceInfo" slot-scope="order">
        <p class="item-info">机柜编号：{{order.borrowChassisNumber}}</p>
        <p class="item-info">充电宝编号：{{order.batteryNumber}}</p>
      </div>

      <div slot="orderInfo" slot-scope="order">
        <p class="item-info">开始时间：{{order.borrowTime}}</p>
        <p class="item-info">结束时间：{{order.returnTime}}</p>
        <p class="item-info">应付款：{{order.payable}}</p>
        <p class="item-info">实付款：{{order.paidIn}}</p>
        <p class="item-info">商家抽成：{{order.commissionRate}}</p>
      </div>

      <div slot="orderType" slot-scope="orderType">
        <a-tag :color="orderType === 'BORROW' ? 'blue' : orderType === 'BUY' ? 'red' : ''" v-show="orderType">
          {{orderType === 'BORROW' ? '租借' : orderType === 'BUY' ? '买断' : ''}}
        </a-tag>
      </div>

      <div slot="orderStatus" slot-scope="orderStatus">
        <a-badge :status="orderStatus === 'RUNNING' ? 'processing' : orderStatus === 'NEED_PAY' ? 'error' : 'default'" v-show="orderStatus"/>
        {{orderStatus === 'RUNNING' ? '进行中' : orderStatus === 'END' ? '结束' : orderStatus === 'NEED_PAY' ? '待支付' : ''}}
      </div>
    </a-table>

  </div>
</template>

<script>
  import SearchForm from '@/components/tool/SearchForm.vue';
  import SelectAlert from '@/components/tool/SelectAlert.vue';

  import { GetOrders } from '@/services/order'

  const columns = [
    { title: '订单编号', dataIndex: 'orderNumber', key: 'orderNumber', width: 160 },
    { title: '所属商户', dataIndex: 'borrowStoreName', key: 'borrowStoreName', width: 130 },
    { title: '客户名称', dataIndex: 'customerName', key: 'customerName', width: 120, align: 'center' },
    { title: '设备信息', dataIndex: '', key: 'deviceInfo', width: 210, scopedSlots: { customRender: 'deviceInfo' } },
    { title: '订单类型', dataIndex: 'orderType', key: 'orderType', width: 100, scopedSlots: { customRender: 'orderType' } },
    { title: '订单信息', dataIndex: '', key: 'orderInfo', scopedSlots: { customRender: 'orderInfo' } },
    { title: '订单状态', dataIndex: 'orderStatus', key: 'orderStatus', width: 100, align: 'center', scopedSlots: { customRender: 'orderStatus' } },
  ]

  // 二维数组：第一层代表列，第二层代表每列的Form.Item
  const searchFormData = [
    [
      {
        label: 'orderNumber',
        type: 'input',
        name: 'orderNumber',
        placeholder: 'orderNumberpl'
      },
      {
        label: 'chassisNumber',
        type: 'input',
        name: 'borrowChassisNumber',
        placeholder: 'chassisNumberpl'
      },
      {
        label: 'orderType',
        type: 'select',
        name: 'orderType',
        placeholder: 'orderTypepl',
        options: [
          { label: 'BORROW', value: 'BORROW' },
          { label: 'BUY', value: 'BUY' },
        ]
      }
    ],
    [
      {
        label: 'borrowStoreName',
        type: 'input',
        name: 'borrowStoreName',
        placeholder: 'borrowStoreNamepl'
      },
      {
        label: 'batteryNumber',
        type: 'input',
        name: 'batteryNumber',
        placeholder: 'batteryNumberpl'
      },
      {
        label: 'orderStatus',
        type: 'select',
        name: 'orderStatus',
        placeholder: 'orderStatuspl',
        options: [
          { label: 'RUNNING', value: 'RUNNING' },
          { label: 'END', value: 'END' }
        ]
      }
    ]
  ]

  export default {
    name: 'Order',
    i18n: require('./i18n'),
    components: { SearchForm, SelectAlert },
    data() {
      return {
        columns,
        searchFormData,
        oders: [],
        selectedRowKeys: [],
        tableLoading: false,
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10
        }
      }
    },
    created() {
      this.getPageOrder()
    },
    methods: {
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      tableChange({ current }) {
        this.pagination.current = current

        this.getPageOrder()
      },
      async getPageOrder(query = {}) {
        this.tableLoading = true
        try {
          let result = await GetOrders({...query, ...this.pagination, size: this.pagination.pageSize})

          this.pagination.total = result.data.total
          this.oders = result.data.records.map(c => ({...c, key: c.id}))
        }
        catch {
          this.oders = []
        }
        
        this.tableLoading = false
      }
    }
  }
</script>

<style scoped>
.item-info {
  margin: 0;
  line-height: 16px;
}
</style>