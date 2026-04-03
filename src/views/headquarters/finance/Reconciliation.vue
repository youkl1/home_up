<template>
  <div class="reconciliation-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">门店对账管理</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section mb-6">
      <el-card shadow="hover" class="card transition-all">
        <div class="filter-form">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="filterForm.region" placeholder="选择区域" size="small" class="w-full">
                <el-option label="全部区域" value=""></el-option>
                <el-option label="华北区" value="north"></el-option>
                <el-option label="华东区" value="east"></el-option>
                <el-option label="华南区" value="south"></el-option>
                <el-option label="西南区" value="southwest"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.store" placeholder="选择门店" size="small" class="w-full">
                <el-option label="全部门店" value=""></el-option>
                <el-option label="北京旗舰店" value="beijing1"></el-option>
                <el-option label="上海中心店" value="shanghai1"></el-option>
                <el-option label="广州天河店" value="guangzhou1"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.status" placeholder="对账状态" size="small" class="w-full">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="待对账" value="pending"></el-option>
                <el-option label="已对账" value="reconciled"></el-option>
                <el-option label="已结算" value="settled"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
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
            <el-button type="primary" size="small" @click="searchReconciliation">查询</el-button>
            <el-button type="success" size="small" class="ml-2" @click="exportReconciliation">导出</el-button>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 对账列表 -->
    <div class="reconciliation-list mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">门店对账单</span>
            <el-button type="primary" size="small" @click="createReconciliation">生成对账单</el-button>
          </div>
        </template>
        <el-table :data="reconciliationList" style="width: 100%" class="reconciliation-table">
          <el-table-column prop="id" label="账单编号" width="180"></el-table-column>
          <el-table-column prop="storeName" label="门店名称"></el-table-column>
          <el-table-column prop="period" label="对账周期" width="180"></el-table-column>
          <el-table-column prop="amount" label="对账金额" width="150">
            <template #default="scope">
              <span class="text-danger font-semibold">{{ scope.row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row)">查看明细</el-button>
              <el-button size="small" type="primary" @click="confirmReconciliation(scope.row)" v-if="scope.row.status === 'pending'">确认对账</el-button>
              <el-button size="small" type="success" @click="markSettled(scope.row)" v-if="scope.row.status === 'reconciled'">标记结算</el-button>
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
    
    <!-- 查看明细弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="`对账明细：${detailForm.id}`"
      width="800px"
    >
      <div class="detail-header mb-4">
        <div class="flex-between items-center">
          <div>
            <h3 class="font-semibold">{{ detailForm.storeName }}</h3>
            <p class="text-secondary">对账周期：{{ detailForm.period }}</p>
          </div>
          <div class="text-right">
            <p class="text-secondary">对账金额</p>
            <p class="text-xl font-bold text-danger">{{ detailForm.amount }}</p>
          </div>
        </div>
      </div>
      <el-table :data="detailItems" style="width: 100%">
        <el-table-column prop="orderId" label="订单编号" width="180"></el-table-column>
        <el-table-column prop="orderTime" label="订单时间" width="180"></el-table-column>
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="scope">
            <span class="font-semibold">{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 确认对账弹窗 -->
    <el-dialog
      v-model="confirmDialogVisible"
      :title="`确认对账：${confirmForm.id}`"
      width="600px"
    >
      <el-form :model="confirmForm" label-width="100px">
        <el-form-item label="门店名称">
          <el-input v-model="confirmForm.storeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="对账周期">
          <el-input v-model="confirmForm.period" disabled></el-input>
        </el-form-item>
        <el-form-item label="对账金额">
          <el-input v-model="confirmForm.amount" disabled></el-input>
        </el-form-item>
        <el-form-item label="确认备注">
          <el-input v-model="confirmForm.remark" type="textarea" :rows="3" placeholder="请输入确认备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirmDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitConfirm">确认对账</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 标记结算弹窗 -->
    <el-dialog
      v-model="settleDialogVisible"
      :title="`标记结算：${settleForm.id}`"
      width="600px"
    >
      <el-form :model="settleForm" label-width="100px">
        <el-form-item label="门店名称">
          <el-input v-model="settleForm.storeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="对账金额">
          <el-input v-model="settleForm.amount" disabled></el-input>
        </el-form-item>
        <el-form-item label="结算日期">
          <el-date-picker
            v-model="settleForm.settleDate"
            type="date"
            placeholder="选择结算日期"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结算备注">
          <el-input v-model="settleForm.remark" type="textarea" :rows="3" placeholder="请输入结算备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="settleDialogVisible = false">取消</el-button>
          <el-button type="success" @click="submitSettle">标记结算</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 生成对账单弹窗 -->
    <el-dialog
      v-model="createDialogVisible"
      title="生成对账单"
      width="600px"
    >
      <el-form :model="createForm" label-width="100px">
        <el-form-item label="选择门店">
          <el-select v-model="createForm.store" placeholder="选择门店" class="w-full">
            <el-option label="北京旗舰店" value="beijing1"></el-option>
            <el-option label="上海中心店" value="shanghai1"></el-option>
            <el-option label="广州天河店" value="guangzhou1"></el-option>
            <el-option label="深圳南山店" value="shenzhen1"></el-option>
            <el-option label="成都武侯店" value="chengdu1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对账周期">
          <el-date-picker
            v-model="createForm.period"
            type="month"
            placeholder="选择对账周期"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="createForm.remark" type="textarea" :rows="3" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitCreate">生成对账单</el-button>
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
  region: '',
  store: '',
  status: '',
  dateRange: []
})

// 弹窗相关
const detailDialogVisible = ref(false)
const confirmDialogVisible = ref(false)
const settleDialogVisible = ref(false)
const createDialogVisible = ref(false)

// 详情表单
const detailForm = ref({
  id: '',
  storeName: '',
  period: '',
  amount: ''
})

// 确认对账表单
const confirmForm = ref({
  id: '',
  storeName: '',
  period: '',
  amount: '',
  remark: ''
})

// 标记结算表单
const settleForm = ref({
  id: '',
  storeName: '',
  amount: '',
  settleDate: '',
  remark: ''
})

// 生成对账单表单
const createForm = ref({
  store: '',
  period: '',
  remark: ''
})

// 对账明细
const detailItems = ref([])

// 门店映射
const storeMap = {
  'beijing1': '北京旗舰店',
  'shanghai1': '上海中心店',
  'guangzhou1': '广州天河店',
  'shenzhen1': '深圳南山店',
  'chengdu1': '成都武侯店'
}

// 对账列表
const reconciliationList = ref([
  {
    id: 'RE202604001',
    storeName: '北京旗舰店',
    period: '2026-03',
    amount: '¥128,500',
    status: 'pending',
    createTime: '2026-04-01 09:00'
  },
  {
    id: 'RE202604002',
    storeName: '上海中心店',
    period: '2026-03',
    amount: '¥105,200',
    status: 'reconciled',
    createTime: '2026-04-01 10:30'
  },
  {
    id: 'RE202604003',
    storeName: '广州天河店',
    period: '2026-03',
    amount: '¥98,600',
    status: 'settled',
    createTime: '2026-04-01 11:15'
  },
  {
    id: 'RE202604004',
    storeName: '深圳南山店',
    period: '2026-03',
    amount: '¥89,300',
    status: 'pending',
    createTime: '2026-04-01 14:20'
  },
  {
    id: 'RE202604005',
    storeName: '成都武侯店',
    period: '2026-03',
    amount: '¥76,500',
    status: 'reconciled',
    createTime: '2026-04-01 15:45'
  }
])

// 分页数据
const total = ref(100)

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'reconciled': return 'primary'
    case 'settled': return 'success'
    case 'completed': return 'success'
    default: return ''
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'pending': return '待对账'
    case 'reconciled': return '已对账'
    case 'settled': return '已结算'
    case 'completed': return '已完成'
    default: return ''
  }
}

// 重置筛选条件
const resetFilter = () => {
  filterForm.value = {
    region: '',
    store: '',
    status: '',
    dateRange: []
  }
  ElMessage.info('筛选条件已重置')
}

// 搜索对账
const searchReconciliation = () => {
  // 模拟搜索过程
  const loading = ElLoading.service({ text: '正在搜索对账记录...' })
  
  setTimeout(() => {
    // 过滤数据
    const filteredList = reconciliationList.value.filter(item => {
      const regionMatch = !filterForm.value.region
      const storeMatch = !filterForm.value.store || item.storeName.includes(storeMap[filterForm.value.store])
      const statusMatch = !filterForm.value.status || item.status === filterForm.value.status
      return regionMatch && storeMatch && statusMatch
    })
    
    total.value = filteredList.length
    
    if (filteredList.length > 0) {
      ElMessage.success(`找到 ${filteredList.length} 条对账记录`)
    } else {
      ElMessage.info('未找到匹配的对账记录')
    }
    loading.close()
  }, 500)
}

// 查看明细
const viewDetail = (row) => {
  // 填充详情表单
  detailForm.value = {
    id: row.id,
    storeName: row.storeName,
    period: row.period,
    amount: row.amount
  }
  
  // 模拟获取明细数据
  const loading = ElLoading.service({ text: '正在加载明细数据...' })
  
  setTimeout(() => {
    // 模拟明细数据
    detailItems.value = [
      {
        orderId: 'ORD202603001',
        orderTime: '2026-03-15 10:30',
        amount: '¥35,000',
        status: 'completed'
      },
      {
        orderId: 'ORD202603002',
        orderTime: '2026-03-20 14:20',
        amount: '¥45,500',
        status: 'completed'
      },
      {
        orderId: 'ORD202603003',
        orderTime: '2026-03-25 09:15',
        amount: '¥48,000',
        status: 'completed'
      }
    ]
    
    detailDialogVisible.value = true
    loading.close()
  }, 500)
}

// 确认对账
const confirmReconciliation = (row) => {
  // 填充确认表单
  confirmForm.value = {
    id: row.id,
    storeName: row.storeName,
    period: row.period,
    amount: row.amount,
    remark: ''
  }
  confirmDialogVisible.value = true
}

// 提交确认对账
const submitConfirm = () => {
  // 表单验证
  if (!confirmForm.value.remark) {
    ElMessage.error('请输入确认备注')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在确认对账...' })
  
  setTimeout(() => {
    // 模拟确认对账逻辑
    const index = reconciliationList.value.findIndex(item => item.id === confirmForm.value.id)
    if (index !== -1) {
      reconciliationList.value[index].status = 'reconciled'
      ElMessage.success('对账确认成功')
    }
    
    confirmDialogVisible.value = false
    loading.close()
  }, 1000)
}

// 标记结算
const markSettled = (row) => {
  // 填充结算表单
  settleForm.value = {
    id: row.id,
    storeName: row.storeName,
    amount: row.amount,
    settleDate: '',
    remark: ''
  }
  settleDialogVisible.value = true
}

// 提交标记结算
const submitSettle = () => {
  // 表单验证
  if (!settleForm.value.settleDate) {
    ElMessage.error('请选择结算日期')
    return
  }
  if (!settleForm.value.remark) {
    ElMessage.error('请输入结算备注')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在标记结算...' })
  
  setTimeout(() => {
    // 模拟标记结算逻辑
    const index = reconciliationList.value.findIndex(item => item.id === settleForm.value.id)
    if (index !== -1) {
      reconciliationList.value[index].status = 'settled'
      ElMessage.success('标记结算成功')
    }
    
    settleDialogVisible.value = false
    loading.close()
  }, 1000)
}

// 生成对账单
const createReconciliation = () => {
  // 重置表单
  createForm.value = {
    store: '',
    period: '',
    remark: ''
  }
  createDialogVisible.value = true
}

// 提交生成对账单
const submitCreate = () => {
  // 表单验证
  if (!createForm.value.store) {
    ElMessage.error('请选择门店')
    return
  }
  if (!createForm.value.period) {
    ElMessage.error('请选择对账周期')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在生成对账单...' })
  
  setTimeout(() => {
    // 生成对账单编号
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const serial = String(reconciliationList.value.length + 1).padStart(3, '0')
    const newId = `RE${date}${serial}`
    
    // 新增对账单
    const newReconciliation = {
      id: newId,
      storeName: storeMap[createForm.value.store],
      period: createForm.value.period,
      amount: '¥0',
      status: 'pending',
      createTime: new Date().toLocaleString('zh-CN')
    }
    
    reconciliationList.value.unshift(newReconciliation)
    total.value++
    
    ElMessage.success('对账单生成成功')
    createDialogVisible.value = false
    loading.close()
  }, 1000)
}

// 导出对账单
const exportReconciliation = () => {
  // 模拟导出过程
  const loading = ElLoading.service({ text: '正在导出对账单...' })
  
  setTimeout(() => {
    // 模拟导出成功
    ElMessage.success('对账单导出成功，文件已下载')
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
.reconciliation-page {
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

.reconciliation-list {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reconciliation-table {
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
  .reconciliation-page {
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