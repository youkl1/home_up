<template>
  <div class="deposit-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">保证金管理</h1>
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
              <el-select v-model="filterForm.status" placeholder="状态" size="small" class="w-full">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="正常" value="normal"></el-option>
                <el-option label="需补缴" value="need_topup"></el-option>
                <el-option label="已退还" value="refunded"></el-option>
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
            <el-button type="primary" size="small" @click="searchDeposit">查询</el-button>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 保证金列表 -->
    <div class="deposit-list mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">门店保证金</span>
          </div>
        </template>
        <el-table :data="depositList" style="width: 100%" class="deposit-table">
          <el-table-column prop="storeName" label="门店名称"></el-table-column>
          <el-table-column prop="depositAmount" label="保证金金额" width="150">
            <template #default="scope">
              <span class="font-semibold">{{ scope.row.depositAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="balance" label="当前余额" width="150">
            <template #default="scope">
              <span :class="scope.row.balance < 50000 ? 'text-danger font-semibold' : 'text-success font-semibold'">
                {{ scope.row.balance }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lastUpdateTime" label="最后更新时间" width="180"></el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewDepositDetail(scope.row)">查看明细</el-button>
              <el-button size="small" type="primary" @click="topupDeposit(scope.row)" v-if="scope.row.status === 'need_topup'">补缴</el-button>
              <el-button size="small" type="success" @click="refundDeposit(scope.row)" v-if="scope.row.status === 'normal'">退还</el-button>
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
    
    <!-- 保证金流水 -->
    <div class="deposit-flow mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">保证金流水</span>
          </div>
        </template>
        <el-table :data="depositFlowList" style="width: 100%" class="flow-table">
          <el-table-column prop="id" label="流水编号" width="180"></el-table-column>
          <el-table-column prop="storeName" label="门店名称"></el-table-column>
          <el-table-column prop="type" label="类型" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.type === 'topup' ? 'success' : 'danger'">
                {{ scope.row.type === 'topup' ? '存入' : '扣除' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额" width="150">
            <template #default="scope">
              <span :class="scope.row.type === 'topup' ? 'text-success font-semibold' : 'text-danger font-semibold'">
                {{ scope.row.type === 'topup' ? '+' : '-' }}{{ scope.row.amount }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="原因"></el-table-column>
          <el-table-column prop="createTime" label="发生时间" width="180"></el-table-column>
        </el-table>
        <div class="pagination mt-4 flex justify-center">
          <el-pagination
            layout="prev, pager, next"
            :total="flowTotal"
            :page-size="10"
            @current-change="handleFlowCurrentChange"
          />
        </div>
      </el-card>
    </div>
    
    <!-- 查看明细弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="`保证金明细：${detailForm.storeName}`"
      width="800px"
    >
      <div class="detail-header mb-4">
        <div class="flex-between items-center">
          <div>
            <h3 class="font-semibold">{{ detailForm.storeName }}</h3>
            <p class="text-secondary">状态：{{ getStatusText(detailForm.status) }}</p>
          </div>
          <div class="text-right">
            <p class="text-secondary">保证金金额</p>
            <p class="text-lg font-bold">{{ detailForm.depositAmount }}</p>
            <p class="text-secondary mt-2">当前余额</p>
            <p class="text-xl font-bold" :class="parseFloat(detailForm.balance.replace(/[^0-9.-]/g, '')) < 50000 ? 'text-danger' : 'text-success'">{{ detailForm.balance }}</p>
          </div>
        </div>
      </div>
      <el-table :data="detailFlows" style="width: 100%">
        <el-table-column prop="id" label="流水编号" width="180"></el-table-column>
        <el-table-column prop="type" label="类型" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.type === 'topup' ? 'success' : 'danger'">
              {{ scope.row.type === 'topup' ? '存入' : '扣除' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="150">
          <template #default="scope">
            <span :class="scope.row.type === 'topup' ? 'text-success font-semibold' : 'text-danger font-semibold'">
              {{ scope.row.type === 'topup' ? '+' : '-' }}{{ scope.row.amount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="原因"></el-table-column>
        <el-table-column prop="createTime" label="发生时间" width="180"></el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 补缴保证金弹窗 -->
    <el-dialog
      v-model="topupDialogVisible"
      :title="`补缴保证金：${topupForm.storeName}`"
      width="600px"
    >
      <el-form :model="topupForm" label-width="100px">
        <el-form-item label="门店名称">
          <el-input v-model="topupForm.storeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="保证金金额">
          <el-input v-model="topupForm.depositAmount" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前余额">
          <el-input v-model="topupForm.balance" disabled></el-input>
        </el-form-item>
        <el-form-item label="需补缴金额">
          <el-input v-model="topupForm.needAmount" disabled></el-input>
        </el-form-item>
        <el-form-item label="实际补缴金额">
          <el-input v-model="topupForm.actualAmount" placeholder="请输入实际补缴金额" prefix="¥"></el-input>
        </el-form-item>
        <el-form-item label="补缴方式">
          <el-select v-model="topupForm.payMethod" placeholder="选择补缴方式">
            <el-option label="银行转账" value="bank"></el-option>
            <el-option label="支付宝" value="alipay"></el-option>
            <el-option label="微信" value="wechat"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="补缴备注">
          <el-input v-model="topupForm.remark" type="textarea" :rows="3" placeholder="请输入补缴备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="topupDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitTopup">确认补缴</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 退还保证金弹窗 -->
    <el-dialog
      v-model="refundDialogVisible"
      :title="`退还保证金：${refundForm.storeName}`"
      width="600px"
    >
      <el-form :model="refundForm" label-width="100px">
        <el-form-item label="门店名称">
          <el-input v-model="refundForm.storeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前余额">
          <el-input v-model="refundForm.balance" disabled></el-input>
        </el-form-item>
        <el-form-item label="退还金额">
          <el-input v-model="refundForm.amount" placeholder="请输入退还金额" prefix="¥"></el-input>
        </el-form-item>
        <el-form-item label="退还方式">
          <el-select v-model="refundForm.refundMethod" placeholder="选择退还方式">
            <el-option label="银行转账" value="bank"></el-option>
            <el-option label="支付宝" value="alipay"></el-option>
            <el-option label="微信" value="wechat"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退还备注">
          <el-input v-model="refundForm.remark" type="textarea" :rows="3" placeholder="请输入退还备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="refundDialogVisible = false">取消</el-button>
          <el-button type="success" @click="submitRefund">确认退还</el-button>
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
const topupDialogVisible = ref(false)
const refundDialogVisible = ref(false)

// 详情表单
const detailForm = ref({
  storeName: '',
  depositAmount: '',
  balance: '',
  status: ''
})

// 补缴表单
const topupForm = ref({
  storeName: '',
  depositAmount: '',
  balance: '',
  needAmount: '',
  actualAmount: '',
  payMethod: '',
  remark: ''
})

// 退还表单
const refundForm = ref({
  storeName: '',
  balance: '',
  amount: '',
  refundMethod: '',
  remark: ''
})

// 详情流水
const detailFlows = ref([])

// 门店映射
const storeMap = {
  'beijing1': '北京旗舰店',
  'shanghai1': '上海中心店',
  'guangzhou1': '广州天河店',
  'shenzhen1': '深圳南山店',
  'chengdu1': '成都武侯店'
}

// 保证金列表
const depositList = ref([
  {
    id: 1,
    storeName: '北京旗舰店',
    depositAmount: '¥100,000',
    balance: '¥100,000',
    status: 'normal',
    lastUpdateTime: '2026-04-01 09:00'
  },
  {
    id: 2,
    storeName: '上海中心店',
    depositAmount: '¥100,000',
    balance: '¥85,000',
    status: 'need_topup',
    lastUpdateTime: '2026-04-01 10:30'
  },
  {
    id: 3,
    storeName: '广州天河店',
    depositAmount: '¥100,000',
    balance: '¥100,000',
    status: 'normal',
    lastUpdateTime: '2026-04-01 11:15'
  },
  {
    id: 4,
    storeName: '深圳南山店',
    depositAmount: '¥100,000',
    balance: '¥95,000',
    status: 'normal',
    lastUpdateTime: '2026-04-01 14:20'
  },
  {
    id: 5,
    storeName: '成都武侯店',
    depositAmount: '¥100,000',
    balance: '¥0',
    status: 'refunded',
    lastUpdateTime: '2026-04-01 15:45'
  }
])

// 保证金流水
const depositFlowList = ref([
  {
    id: 'DF202604001',
    storeName: '上海中心店',
    type: 'deduct',
    amount: '¥15,000',
    reason: '违规操作扣除',
    createTime: '2026-04-01 10:30'
  },
  {
    id: 'DF202604002',
    storeName: '深圳南山店',
    type: 'deduct',
    amount: '¥5,000',
    reason: '服务质量扣除',
    createTime: '2026-04-01 14:20'
  },
  {
    id: 'DF202604003',
    storeName: '成都武侯店',
    type: 'refund',
    amount: '¥100,000',
    reason: '门店关闭退还',
    createTime: '2026-04-01 15:45'
  }
])

// 分页数据
const total = ref(100)
const flowTotal = ref(50)

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case 'normal': return 'success'
    case 'need_topup': return 'warning'
    case 'refunded': return 'info'
    default: return ''
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'normal': return '正常'
    case 'need_topup': return '需补缴'
    case 'refunded': return '已退还'
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

// 搜索保证金
const searchDeposit = () => {
  // 模拟搜索过程
  const loading = ElLoading.service({ text: '正在搜索保证金记录...' })
  
  setTimeout(() => {
    // 过滤数据
    const filteredList = depositList.value.filter(item => {
      const storeMatch = !filterForm.value.store || item.storeName.includes(storeMap[filterForm.value.store])
      const statusMatch = !filterForm.value.status || item.status === filterForm.value.status
      return storeMatch && statusMatch
    })
    
    total.value = filteredList.length
    
    if (filteredList.length > 0) {
      ElMessage.success(`找到 ${filteredList.length} 条保证金记录`)
    } else {
      ElMessage.info('未找到匹配的保证金记录')
    }
    loading.close()
  }, 500)
}

// 查看明细
const viewDepositDetail = (row) => {
  // 填充详情表单
  detailForm.value = {
    storeName: row.storeName,
    depositAmount: row.depositAmount,
    balance: row.balance,
    status: row.status
  }
  
  // 模拟获取流水数据
  const loading = ElLoading.service({ text: '正在加载流水数据...' })
  
  setTimeout(() => {
    // 模拟流水数据
    detailFlows.value = [
      {
        id: 'DF202603001',
        type: 'topup',
        amount: '¥100,000',
        reason: '初始缴纳',
        createTime: '2026-03-01 09:00'
      },
      {
        id: 'DF202603150',
        type: 'deduct',
        amount: '¥15,000',
        reason: '违规操作扣除',
        createTime: '2026-03-15 10:30'
      }
    ]
    
    detailDialogVisible.value = true
    loading.close()
  }, 500)
}

// 补缴保证金
const topupDeposit = (row) => {
  // 计算需补缴金额
  const depositAmount = parseFloat(row.depositAmount.replace(/[^0-9.-]/g, ''))
  const balance = parseFloat(row.balance.replace(/[^0-9.-]/g, ''))
  const needAmount = depositAmount - balance
  
  // 填充补缴表单
  topupForm.value = {
    storeName: row.storeName,
    depositAmount: row.depositAmount,
    balance: row.balance,
    needAmount: `¥${needAmount.toLocaleString()}`,
    actualAmount: '',
    payMethod: '',
    remark: ''
  }
  topupDialogVisible.value = true
}

// 提交补缴
const submitTopup = () => {
  // 表单验证
  if (!topupForm.value.actualAmount) {
    ElMessage.error('请输入实际补缴金额')
    return
  }
  if (!topupForm.value.payMethod) {
    ElMessage.error('请选择补缴方式')
    return
  }
  if (!topupForm.value.remark) {
    ElMessage.error('请输入补缴备注')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在处理补缴...' })
  
  setTimeout(() => {
    // 模拟更新余额
    const index = depositList.value.findIndex(item => item.storeName === topupForm.value.storeName)
    if (index !== -1) {
      const currentBalance = parseFloat(depositList.value[index].balance.replace(/[^0-9.-]/g, ''))
      const topupAmount = parseFloat(topupForm.value.actualAmount)
      const newBalance = currentBalance + topupAmount
      
      depositList.value[index].balance = `¥${newBalance.toLocaleString()}`
      depositList.value[index].status = 'normal'
      depositList.value[index].lastUpdateTime = new Date().toLocaleString('zh-CN')
      
      // 新增流水记录
      const newFlow = {
        id: `DF${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(depositFlowList.value.length + 1).padStart(3, '0')}`,
        storeName: topupForm.value.storeName,
        type: 'topup',
        amount: `¥${topupAmount.toLocaleString()}`,
        reason: topupForm.value.remark,
        createTime: new Date().toLocaleString('zh-CN')
      }
      depositFlowList.value.unshift(newFlow)
      flowTotal.value++
      
      ElMessage.success('补缴成功')
    }
    
    topupDialogVisible.value = false
    loading.close()
  }, 1000)
}

// 退还保证金
const refundDeposit = (row) => {
  // 填充退还表单
  refundForm.value = {
    storeName: row.storeName,
    balance: row.balance,
    amount: '',
    refundMethod: '',
    remark: ''
  }
  refundDialogVisible.value = true
}

// 提交退还
const submitRefund = () => {
  // 表单验证
  if (!refundForm.value.amount) {
    ElMessage.error('请输入退还金额')
    return
  }
  if (!refundForm.value.refundMethod) {
    ElMessage.error('请选择退还方式')
    return
  }
  if (!refundForm.value.remark) {
    ElMessage.error('请输入退还备注')
    return
  }
  
  // 验证退还金额
  const balance = parseFloat(refundForm.value.balance.replace(/[^0-9.-]/g, ''))
  const refundAmount = parseFloat(refundForm.value.amount)
  
  if (refundAmount > balance) {
    ElMessage.error('退还金额不能大于当前余额')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在处理退还...' })
  
  setTimeout(() => {
    // 模拟更新余额
    const index = depositList.value.findIndex(item => item.storeName === refundForm.value.storeName)
    if (index !== -1) {
      const newBalance = balance - refundAmount
      
      depositList.value[index].balance = `¥${newBalance.toLocaleString()}`
      if (newBalance === 0) {
        depositList.value[index].status = 'refunded'
      }
      depositList.value[index].lastUpdateTime = new Date().toLocaleString('zh-CN')
      
      // 新增流水记录
      const newFlow = {
        id: `DF${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(depositFlowList.value.length + 1).padStart(3, '0')}`,
        storeName: refundForm.value.storeName,
        type: 'refund',
        amount: `¥${refundAmount.toLocaleString()}`,
        reason: refundForm.value.remark,
        createTime: new Date().toLocaleString('zh-CN')
      }
      depositFlowList.value.unshift(newFlow)
      flowTotal.value++
      
      ElMessage.success('退还成功')
    }
    
    refundDialogVisible.value = false
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

// 流水分页处理
const handleFlowCurrentChange = (current) => {
  // 模拟API调用延迟
  const loading = ElLoading.service({ text: '正在加载流水数据...' })
  
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
.deposit-page {
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

.deposit-list,
.deposit-flow {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.deposit-table,
.flow-table {
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
  .deposit-page {
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