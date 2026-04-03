<template>
  <div class="invoice-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">发票管理</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section mb-6">
      <el-card shadow="hover" class="card transition-all">
        <div class="filter-form">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="filterForm.store" placeholder="选择门店" size="small" class="w-full">
                <el-option label="全部门店" value=""></el-option>
                <el-option label="北京旗舰店" value="beijing1"></el-option>
                <el-option label="上海中心店" value="shanghai1"></el-option>
                <el-option label="广州天河店" value="guangzhou1"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.status" placeholder="申请状态" size="small" class="w-full">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="待处理" value="pending"></el-option>
                <el-option label="已开票" value="issued"></el-option>
                <el-option label="已寄送" value="sent"></el-option>
                <el-option label="已完成" value="completed"></el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-date-picker
                v-model="filterForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                class="w-full"
              />
            </el-col>
          </el-row>
          <div class="filter-actions mt-4 flex justify-end">
            <el-button size="small" class="mr-2" @click="resetFilter">重置</el-button>
            <el-button type="primary" size="small" @click="searchInvoice">查询</el-button>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 发票申请列表 -->
    <div class="invoice-list mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">发票申请</span>
          </div>
        </template>
        <el-table :data="invoiceList" style="width: 100%" class="invoice-table">
          <el-table-column prop="id" label="申请编号" width="180"></el-table-column>
          <el-table-column prop="storeName" label="门店名称"></el-table-column>
          <el-table-column prop="amount" label="发票金额" width="150">
            <template #default="scope">
              <span class="font-semibold">{{ scope.row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="invoiceType" label="发票类型" width="120">
            <template #default="scope">
              <el-tag>{{ scope.row.invoiceType }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="applyTime" label="申请时间" width="180"></el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewInvoiceDetail(scope.row)">查看详情</el-button>
              <el-button size="small" type="primary" @click="processInvoice(scope.row)" v-if="scope.row.status === 'pending'">处理</el-button>
              <el-button size="small" type="success" @click="markSent(scope.row)" v-if="scope.row.status === 'issued'">标记寄送</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination mt-4 flex justify-center">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="10"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
    
    <!-- 查看详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="`发票详情：${detailForm.id}`"
      width="800px"
    >
      <div class="detail-header mb-4">
        <div class="flex-between items-center">
          <div>
            <h3 class="font-semibold">{{ detailForm.storeName }}</h3>
            <p class="text-secondary">发票类型：{{ detailForm.invoiceType }}</p>
            <p class="text-secondary">申请时间：{{ detailForm.applyTime }}</p>
          </div>
          <div class="text-right">
            <p class="text-secondary">发票金额</p>
            <p class="text-xl font-bold">{{ detailForm.amount }}</p>
            <p class="text-secondary mt-2">状态：{{ getStatusText(detailForm.status) }}</p>
          </div>
        </div>
      </div>
      <div class="invoice-info">
        <el-form label-width="100px">
          <el-form-item label="发票抬头">
            <el-input v-model="detailForm.title" disabled></el-input>
          </el-form-item>
          <el-form-item label="税号">
            <el-input v-model="detailForm.taxNumber" disabled></el-input>
          </el-form-item>
          <el-form-item label="开户银行">
            <el-input v-model="detailForm.bank" disabled></el-input>
          </el-form-item>
          <el-form-item label="银行账号">
            <el-input v-model="detailForm.account" disabled></el-input>
          </el-form-item>
          <el-form-item label="地址电话">
            <el-input v-model="detailForm.addressPhone" disabled></el-input>
          </el-form-item>
          <el-form-item label="申请备注">
            <el-input v-model="detailForm.remark" type="textarea" :rows="3" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 处理发票弹窗 -->
    <el-dialog
      v-model="processDialogVisible"
      :title="`处理发票：${processForm.id}`"
      width="600px"
    >
      <el-form :model="processForm" label-width="100px">
        <el-form-item label="申请编号">
          <el-input v-model="processForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="门店名称">
          <el-input v-model="processForm.storeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="发票金额">
          <el-input v-model="processForm.amount" disabled></el-input>
        </el-form-item>
        <el-form-item label="处理结果">
          <el-radio-group v-model="processForm.result">
            <el-radio label="approve">通过</el-radio>
            <el-radio label="reject">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理备注" v-if="processForm.result">
          <el-input v-model="processForm.remark" type="textarea" :rows="3" placeholder="请输入处理备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="processDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitProcess">确认处理</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 标记寄送弹窗 -->
    <el-dialog
      v-model="sendDialogVisible"
      :title="`标记寄送：${sendForm.id}`"
      width="600px"
    >
      <el-form :model="sendForm" label-width="100px">
        <el-form-item label="申请编号">
          <el-input v-model="sendForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="门店名称">
          <el-input v-model="sendForm.storeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="快递公司">
          <el-select v-model="sendForm.expressCompany" placeholder="选择快递公司">
            <el-option label="顺丰快递" value="sf"></el-option>
            <el-option label="中通快递" value="zt"></el-option>
            <el-option label="申通快递" value="st"></el-option>
            <el-option label="圆通快递" value="yt"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号">
          <el-input v-model="sendForm.expressNo" placeholder="请输入快递单号"></el-input>
        </el-form-item>
        <el-form-item label="寄送日期">
          <el-date-picker
            v-model="sendForm.sendDate"
            type="date"
            placeholder="选择寄送日期"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="寄送备注">
          <el-input v-model="sendForm.remark" type="textarea" :rows="3" placeholder="请输入寄送备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="sendDialogVisible = false">取消</el-button>
          <el-button type="success" @click="submitSend">确认寄送</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'

// 筛选表单
const filterForm = ref({
  store: '',
  status: '',
  dateRange: []
})

// 弹窗相关
const detailDialogVisible = ref(false)
const processDialogVisible = ref(false)
const sendDialogVisible = ref(false)

// 详情表单
const detailForm = ref({
  id: '',
  storeName: '',
  amount: '',
  invoiceType: '',
  status: '',
  applyTime: '',
  title: '',
  taxNumber: '',
  bank: '',
  account: '',
  addressPhone: '',
  remark: ''
})

// 处理表单
const processForm = ref({
  id: '',
  storeName: '',
  amount: '',
  result: '',
  remark: ''
})

// 寄送表单
const sendForm = ref({
  id: '',
  storeName: '',
  expressCompany: '',
  expressNo: '',
  sendDate: '',
  remark: ''
})

// 门店映射
const storeMap = {
  'beijing1': '北京旗舰店',
  'shanghai1': '上海中心店',
  'guangzhou1': '广州天河店',
  'shenzhen1': '深圳南山店',
  'chengdu1': '成都武侯店'
}

// 发票列表
const invoiceList = ref([
  {
    id: 'IV202604001',
    storeName: '北京旗舰店',
    amount: '¥128,500',
    invoiceType: '增值税专用发票',
    status: 'pending',
    applyTime: '2026-04-01 09:00'
  },
  {
    id: 'IV202604002',
    storeName: '上海中心店',
    amount: '¥105,200',
    invoiceType: '增值税普通发票',
    status: 'issued',
    applyTime: '2026-04-01 10:30'
  },
  {
    id: 'IV202604003',
    storeName: '广州天河店',
    amount: '¥98,600',
    invoiceType: '增值税专用发票',
    status: 'sent',
    applyTime: '2026-04-01 11:15'
  },
  {
    id: 'IV202604004',
    storeName: '深圳南山店',
    amount: '¥89,300',
    invoiceType: '增值税普通发票',
    status: 'completed',
    applyTime: '2026-04-01 14:20'
  },
  {
    id: 'IV202604005',
    storeName: '成都武侯店',
    amount: '¥76,500',
    invoiceType: '增值税专用发票',
    status: 'pending',
    applyTime: '2026-04-01 15:45'
  }
])

// 分页数据
const total = ref(100)

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'issued': return 'primary'
    case 'sent': return 'info'
    case 'completed': return 'success'
    default: return ''
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'pending': return '待处理'
    case 'issued': return '已开票'
    case 'sent': return '已寄送'
    case 'completed': return '已完成'
    default: return ''
  }
}

// 重置筛选条件
const resetFilter = () => {
  filterForm.value = {
    store: '',
    status: '',
    dateRange: []
  }
  ElMessage.info('筛选条件已重置')
}

// 搜索发票
const searchInvoice = () => {
  // 模拟搜索过程
  const loading = ElLoading.service({ text: '正在搜索发票记录...' })
  
  setTimeout(() => {
    // 过滤数据
    const filteredList = invoiceList.value.filter(item => {
      const storeMatch = !filterForm.value.store || item.storeName.includes(storeMap[filterForm.value.store])
      const statusMatch = !filterForm.value.status || item.status === filterForm.value.status
      return storeMatch && statusMatch
    })
    
    total.value = filteredList.length
    
    if (filteredList.length > 0) {
      ElMessage.success(`找到 ${filteredList.length} 条发票记录`)
    } else {
      ElMessage.info('未找到匹配的发票记录')
    }
    loading.close()
  }, 500)
}

// 查看详情
const viewInvoiceDetail = (row) => {
  // 填充详情表单
  detailForm.value = {
    id: row.id,
    storeName: row.storeName,
    amount: row.amount,
    invoiceType: row.invoiceType,
    status: row.status,
    applyTime: row.applyTime,
    title: '北京旗舰店有限公司',
    taxNumber: '91110000XXXXXXXXXX',
    bank: '中国工商银行北京分行',
    account: '6222XXXXXXXXXXXX1234',
    addressPhone: '北京市朝阳区XX街道XX号 010-12345678',
    remark: '用于日常经营活动'
  }
  
  detailDialogVisible.value = true
}

// 处理发票
const processInvoice = (row) => {
  // 填充处理表单
  processForm.value = {
    id: row.id,
    storeName: row.storeName,
    amount: row.amount,
    result: '',
    remark: ''
  }
  processDialogVisible.value = true
}

// 提交处理
const submitProcess = () => {
  // 表单验证
  if (!processForm.value.result) {
    ElMessage.error('请选择处理结果')
    return
  }
  if (!processForm.value.remark) {
    ElMessage.error('请输入处理备注')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在处理发票...' })
  
  setTimeout(() => {
    // 模拟更新状态
    const index = invoiceList.value.findIndex(item => item.id === processForm.value.id)
    if (index !== -1) {
      if (processForm.value.result === 'approve') {
        invoiceList.value[index].status = 'issued'
        ElMessage.success('发票处理成功，已标记为已开票')
      } else {
        invoiceList.value[index].status = 'rejected'
        ElMessage.success('发票处理成功，已驳回申请')
      }
    }
    
    processDialogVisible.value = false
    loading.close()
  }, 1000)
}

// 标记寄送
const markSent = (row) => {
  // 填充寄送表单
  sendForm.value = {
    id: row.id,
    storeName: row.storeName,
    expressCompany: '',
    expressNo: '',
    sendDate: '',
    remark: ''
  }
  sendDialogVisible.value = true
}

// 提交寄送
const submitSend = () => {
  // 表单验证
  if (!sendForm.value.expressCompany) {
    ElMessage.error('请选择快递公司')
    return
  }
  if (!sendForm.value.expressNo) {
    ElMessage.error('请输入快递单号')
    return
  }
  if (!sendForm.value.sendDate) {
    ElMessage.error('请选择寄送日期')
    return
  }
  if (!sendForm.value.remark) {
    ElMessage.error('请输入寄送备注')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在标记寄送...' })
  
  setTimeout(() => {
    // 模拟更新状态
    const index = invoiceList.value.findIndex(item => item.id === sendForm.value.id)
    if (index !== -1) {
      invoiceList.value[index].status = 'sent'
      ElMessage.success('标记寄送成功')
    }
    
    sendDialogVisible.value = false
    loading.close()
  }, 1000)
}

// 分页处理
const handleCurrentChange = (current) => {
  // 模拟API调用延迟
  const loading = ElLoading.service({ text: '正在加载数据...' })
  
  setTimeout(() => {
    // 实际项目中这里应该调用API获取对应页的数据
    ElMessage.success(`切换到第 ${current} 页`)
    loading.close()
  }, 300)
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
  }, 500)
})
</script>

<style scoped>
.invoice-page {
  padding: var(--spacing-md);
  background-color: var(--bg-color);
  min-height: 100vh;
}

.page-header {
  margin-bottom: var(--spacing-md);
}

.filter-section {
  margin-bottom: var(--spacing-md);
}

.filter-form {
  padding: var(--spacing-sm);
}

.invoice-list {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.invoice-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .filter-form .el-col {
    --el-col-span: 12;
  }
}

@media screen and (max-width: 768px) {
  .invoice-page {
    padding: var(--spacing-sm);
  }
  
  .filter-form .el-col {
    --el-col-span: 24;
  }
  
  .filter-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}
</style>