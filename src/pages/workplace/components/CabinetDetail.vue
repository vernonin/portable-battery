<template>
  <a-drawer
      :title="$t('deviceInfoTitle')"
      placement="right"
      width="50%"
      :visible="visible"
      @close="onClose"
    >
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" @submit="handleSubmit">
        <div style="text-align: right;margin-bottom: 12px;">
          <a-button type="primary" html-type="submit">
            {{$t('search')}}
          </a-button>
          <a-button style="margin-left: 8px;" @click="handleReset">
            {{$t('reset')}}
          </a-button>
        </div>
        <a-row>
          <a-col :span="12" >
            <a-form-item :label="$t('batteryNumber')">
              <a-input v-decorator="['batteryNumber']" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item :label="$t('status')">
              <a-select
                v-decorator="['batteryStatus']"
                placeholder="请选择"
              >
                <a-select-option value="IN_USE">{{$t('IN_USE')}}</a-select-option>
                <a-select-option value="SOLD">{{$t('SOLD')}}</a-select-option>
                <a-select-option value="FREE">{{$t('FREE')}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <SelectAlert :num="selectedRowKeys.length" @clear="selectedRowKeys = []" />
      <a-table
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        :data-source="batterys"
        :loading="tableLoading"
        :pagination="false"
      >
        <div slot="batteryStatus" slot-scope="batteryStatus">
          <a-badge :status="batteryStatus === 'IN_USE' ? 'processing': batteryStatus === 'SOLD' ? 'error' : 'success'" />
          {{batteryStatus === 'IN_USE' ? '使用中' : batteryStatus === 'SOLD' ? '已出售' : '空闲'}}
        </div>

        <div slot="action" slot-scope="cabinet">
          <a-progress
            :percent="(cabinet.power * 10)"
            :status="cabinet.batteryStatus === 'FREE' ? 'active' : ''"
            :stroke-color="cabinet.power <= 3 ? {
              '0%': '#FF4D52',
              '100%': '#FF4D52',
            } : {}"
          />
        </div>
      </a-table>
    </a-drawer>
</template>

<script>
  import SelectAlert from '@/components/tool/SelectAlert.vue';

  import { GetBatterys } from '@/services/battery'

  const columns = [
    { title: '充电宝编号', dataIndex: 'batteryNumber', key: 'batteryNumber', width: 130 },
    { title: '数据更新时间', dataIndex: 'lastSyncTime', key: 'lastSyncTime' },
    { title: '状态', dataIndex: 'batteryStatus', key: 'batteryStatus', width: 100, scopedSlots: { customRender: 'batteryStatus' } },
    { title: '当前电量', dataIndex: '', key: 'power', width: 150, scopedSlots: { customRender: 'action' } },
  ]; 

  export default {
    name: 'CabinetDetail',
    i18n: require('../i18n'),
    components: { SelectAlert },
    props: {
      id: { type: String, default: '' },
      visible: { type: Boolean, default: false },
    },
    data() {
      return {
        columns,

        tableLoading: false,
        batterys: [],
        selectedRowKeys: [],

        pagination: {
          current: 1,
          size: 50 // 一个机柜应该不超过50个充电宝
        },
        form: this.$form.createForm(this, { name: 'coordinated' })
      }
    },
    watch: {
      visible(newVal) {
        if (newVal && this.id) {
          this.getDeviceInfo()
        }
      }
    },
    methods: {
      onClose() {
        this.$emit('close')
      },
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      async getDeviceInfo(query = {}) {
        this.tableLoading = true

        try {
          let result = await GetBatterys({chassisId: this.id, ...this.pagination, ...query})
          
          this.batterys = result.data.records.map(b => ({...b, key: b.id}))
        }
        catch {
          this.batterys = []
        }

        this.tableLoading = false
      },
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            this.getDeviceInfo(values)
          }
        });
      },
      handleReset() {
        this.form.resetFields()
      }
    }
  }
</script>