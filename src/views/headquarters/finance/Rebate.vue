<template>
  <div class="rebate-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">返利核算管理</h1>
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
              <el-select v-model="filterForm.rebateType" placeholder="返利类型" size="small" class="w-full">
                <el-option label="全部类型" value=""></el-option>
                <el-option label="销售返利" value="sales"></el-option>
                <el-option label="季度返利" value="quarterly"></el-option>
                <el-option label="年度返利" value="annual"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.status" placeholder="发放状态" size="small" class="w-full">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="待核算" value="pending"></el-option>
                <el-option label="已核算" value="calculated"></el-option>
                <el-option label="已发放" value="issued"></el-option>
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
            <el-button type="primary" size="small" @click="searchRebate">查询</el-button>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 返利规则配置 -->
    <div class="rule-config mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">返利规则配置</span>
            <el-button type="primary" size="small" @click="configureRules">配置规则</el-button>
          </div>
        </template>
        <div class="rules-list">
          <div v-for="rule in rebateRules" :key="rule.id" class="rule-item flex-between items-center p-4 border-b">
            <div class="rule-info">
              <h4 class="rule-name font-semibold">{{ rule.name }}</h4>
              <p class="rule-desc text-secondary">{{ rule.description }}</p>
            </div>
            <el-button size="small" @click="editRule(rule)">编辑</el-button>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 返利明细 -->
    <div class="rebate-list mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">返利明细</span>
            <el-button type="primary" size="small" @click="calculateRebate">核算返利</el-button>
          </div>
        </template>
        <el-table :data="rebateList" style="width: 100%" class="rebate-table">
          <el-table-column prop="id" label="返利编号" width="180"></el-table-column>
          <el-table-column prop="storeName" label="门店名称"></el-table-column>
          <el-table-column prop="rebateType" label="返利类型" width="120">
            <template #default="scope">
              <el-tag>{{ scope.row.rebateType }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="返利金额" width="150">
            <template #default="scope">
              <span class="text-success font-semibold">{{ scope.row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="calculateTime" label="核算时间" width="180"></el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewRebateDetail(scope.row)">查看详情</el-button>
              <el-button size="small" type="primary" @click="adjustAmount(scope.row)" v-if="scope.row.status === 'calculated'">调整金额</el-button>
              <el-button size="small" type="success" @click="issueRebate(scope.row)" v-if="scope.row.status === 'calculated'">标记发放</el-button>
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
    
    <!-- 配置规则弹窗 -->
    <el-dialog
      v-model="ruleDialogVisible"
      :title="ruleForm.id ? '编辑规则' : '配置规则'"
      width="600px"
    >
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="规则名称">
          <el-input v-model="ruleForm.name" placeholder="请输入规则名称"></el-input>
        </el-form-item>
        <el-form-item label="规则类型">
          <el-select v-model="ruleForm.type" placeholder="选择规则类型">
            <el-option label="销售返利" value="sales"></el-option>
            <el-option label="季度返利" value="quarterly"></el-option>
            <el-option label="年度返利" value="annual"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规则描述">
          <el-input v-model="ruleForm.description" type="textarea" :rows="3" placeholder="请输入规则描述"></el-input>
        </el-form-item>
        <el-form-item label="返利比例">
          <el-input v-model="ruleForm.rate" placeholder="请输入返利比例（如：3）" suffix="%"></el-input>
        </el-form-item>
        <el-form-item label="最低销售额">
          <el-input v-model="ruleForm.minSales" placeholder="请输入最低销售额（如：100000）" prefix="¥"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ruleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitRule">保存规则</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 查看详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="`返利详情：${detailForm.id}`"
      width="800px"
    >
      <div class="detail-header mb-4">
        <div class="flex-between items-center">
          <div>
            <h3 class="font-semibold">{{ detailForm.storeName }}</h3>
            <p class="text-secondary">返利类型：{{ detailForm.rebateType }}</p>
          </div>
          <div class="text-right">
            <p class="text-secondary">返利金额</p>
            <p class="text-xl font-bold text-success">{{ detailForm.amount }}</p>
          </div>
        </div>
      </div>
      <el-table :data="detailItems" style="width: 100%">
        <el-table-column prop="orderId" label="订单编号" width="180"></el-table-column>
        <el-table-column prop="orderTime" label="订单时间" width="180"></el-table-column>
        <el-table-column prop="amount" label="订单金额" width="120">
          <template #default="scope">
            <span class="font-semibold">{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rebateAmount" label="返利金额" width="120">
          <template #default="scope">
            <span class="text-success font-semibold">{{ scope.row.rebateAmount }}</span>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 调整金额弹窗 -->
    <el-dialog
      v-model="adjustDialogVisible"
      :title="`调整金额：${adjustForm.id}`"
      width="600px"
    >
      <el-form :model="adjustForm" label-width="100px">
        <el-form-item label="门店名称">
          <el-input v-model="adjustForm.storeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="返利类型">
          <el-input v-model="adjustForm.rebateType" disabled></el-input>
        </el-form-item>
        <el-form-item label="原返利金额">
          <el-input v-model="adjustForm.originalAmount" disabled></el-input>
        </el-form-item>
        <el-form-item label="调整后金额">
          <el-input v-model="adjustForm.newAmount" placeholder="请输入调整后的金额" prefix="¥"></el-input>
        </el-form-item>
        <el-form-item label="调整原因">
          <el-input v-model="adjustForm.reason" type="textarea" :rows="3" placeholder="请输入调整原因"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="adjustDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAdjust">调整金额</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 标记发放弹窗 -->
    <el-dialog
      v-model="issueDialogVisible"
      :title="`标记发放：${issueForm.id}`"
      width="600px"
    >
      <el-form :model="issueForm" label-width="100px">
        <el-form-item label="门店名称">
          <el-input v-model="issueForm.storeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="返利金额">
          <el-input v-model="issueForm.amount" disabled></el-input>
        </el-form-item>
        <el-form-item label="发放日期">
          <el-date-picker
            v-model="issueForm.issueDate"
            type="date"
            placeholder="选择发放日期"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="发放方式">
          <el-select v-model="issueForm.issueMethod" placeholder="选择发放方式">
            <el-option label="银行转账" value="bank"></el-option>
            <el-option label="支付宝" value="alipay"></el-option>
            <el-option label="微信" value="wechat"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发放备注">
          <el-input v-model="issueForm.remark" type="textarea" :rows="3" placeholder="请输入发放备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="issueDialogVisible = false">取消</el-button>
          <el-button type="success" @click="submitIssue">标记发放</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 核算返利弹窗 -->
    <el-dialog
      v-model="calculateDialogVisible"
      title="核算返利"
      width="600px"
    >
      <el-form :model="calculateForm" label-width="100px">
        <el-form-item label="选择门店">
          <el-select v-model="calculateForm.store" placeholder="选择门店" class="w-full">
            <el-option label="北京旗舰店" value="beijing1"></el-option>
            <el-option label="上海中心店" value="shanghai1"></el-option>
            <el-option label="广州天河店" value="guangzhou1"></el-option>
            <el-option label="深圳南山店" value="shenzhen1"></el-option>
            <el-option label="成都武侯店" value="chengdu1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="核算周期">
          <el-date-picker
            v-model="calculateForm.period"
            type="month"
            placeholder="选择核算周期"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="返利类型">
          <el-select v-model="calculateForm.rebateType" placeholder="选择返利类型">
            <el-option label="销售返利" value="sales"></el-option>
            <el-option label="季度返利" value="quarterly"></el-option>
            <el-option label="年度返利" value="annual"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="calculateForm.remark" type="textarea" :rows="3" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="calculateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitCalculate">核算返利</el-button>
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
  rebateType: '',
  status: '',
  dateRange: []
})

// 弹窗相关
const ruleDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const adjustDialogVisible = ref(false)
const issueDialogVisible = ref(false)
const calculateDialogVisible = ref(false)

// 规则表单
const ruleForm = ref({
  id: null,
  name: '',
  type: '',
  description: '',
  rate: '',
  minSales: ''
})

// 详情表单
const detailForm = ref({
  id: '',
  storeName: '',
  rebateType: '',
  amount: ''
})

// 调整金额表单
const adjustForm = ref({
  id: '',
  storeName: '',
  rebateType: '',
  originalAmount: '',
  newAmount: '',
  reason: ''
})

// 标记发放表单
const issueForm = ref({
  id: '',
  storeName: '',
  amount: '',
  issueDate: '',
  issueMethod: '',
  remark: ''
})

// 核算返利表单
const calculateForm = ref({
  store: '',
  period: '',
  rebateType: '',
  remark: ''
})

// 返利明细
const detailItems = ref([])

// 门店映射
const storeMap = {
  'beijing1': '北京旗舰店',
  'shanghai1': '上海中心店',
  'guangzhou1': '广州天河店',
  'shenzhen1': '深圳南山店',
  'chengdu1': '成都武侯店'
}

// 返利规则
const rebateRules = ref([
  {
    id: 1,
    name: '销售返利规则',
    description: '销售额达到10万以上，返利3%',
    type: 'sales',
    rate: '3',
    minSales: '100000'
  },
  {
    id: 2,
    name: '季度返利规则',
    description: '季度销售额达到50万以上，额外返利2%',
    type: 'quarterly',
    rate: '2',
    minSales: '500000'
  },
  {
    id: 3,
    name: '年度返利规则',
    description: '年度销售额达到300万以上，额外返利1%',
    type: 'annual',
    rate: '1',
    minSales: '3000000'
  }
])

// 返利明细
const rebateList = ref([
  {
    id: 'RB202604001',
    storeName: '北京旗舰店',
    rebateType: '销售返利',
    amount: '¥3,855',
    status: 'pending',
    calculateTime: '2026-04-01 09:00'
  },
  {
    id: 'RB202604002',
    storeName: '上海中心店',
    rebateType: '销售返利',
    amount: '¥3,156',
    status: 'calculated',
    calculateTime: '2026-04-01 10:30'
  },
  {
    id: 'RB202604003',
    storeName: '广州天河店',
    rebateType: '季度返利',
    amount: '¥9,860',
    status: 'issued',
    calculateTime: '2026-04-01 11:15'
  },
  {
    id: 'RB202604004',
    storeName: '深圳南山店',
    rebateType: '销售返利',
    amount: '¥2,679',
    status: 'pending',
    calculateTime: '2026-04-01 14:20'
  },
  {
    id: 'RB202604005',
    storeName: '成都武侯店',
    rebateType: '销售返利',
    amount: '¥2,295',
    status: 'calculated',
    calculateTime: '2026-04-01 15:45'
  }
])

// 分页数据
const total = ref(100)

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'calculated': return 'primary'
    case 'issued': return 'success'
    default: return ''
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'pending': return '待核算'
    case 'calculated': return '已核算'
    case 'issued': return '已发放'
    default: return ''
  }
}

// 重置筛选条件
const resetFilter = () => {
  filterForm.value = {
    store: '',
    rebateType: '',
    status: '',
    dateRange: []
  }
  ElMessage.info('筛选条件已重置')
}

// 搜索返利
const searchRebate = () => {
  // 模拟搜索过程
  const loading = ElLoading.service({ text: '正在搜索返利记录...' })
  
  setTimeout(() => {
    // 过滤数据
    const filteredList = rebateList.value.filter(item => {
      const storeMatch = !filterForm.value.store || item.storeName.includes(storeMap[filterForm.value.store])
      const typeMatch = !filterForm.value.rebateType || item.rebateType.includes(filterForm.value.rebateType)
      const statusMatch = !filterForm.value.status || item.status === filterForm.value.status
      return storeMatch && typeMatch && statusMatch
    })
    
    total.value = filteredList.length
    
    if (filteredList.length > 0) {
      ElMessage.success(`找到 ${filteredList.length} 条返利记录`)
    } else {
      ElMessage.info('未找到匹配的返利记录')
    }
    loading.close()
  }, 500)
}

// 配置规则
const configureRules = () => {
  // 重置表单
  ruleForm.value = {
    id: null,
    name: '',
    type: '',
    description: '',
    rate: '',
    minSales: ''
  }
  ruleDialogVisible.value = true
}

// 编辑规则
const editRule = (rule) => {
  // 填充表单
  ruleForm.value = {
    id: rule.id,
    name: rule.name,
    type: rule.type,
    description: rule.description,
    rate: rule.rate,
    minSales: rule.minSales
  }
  ruleDialogVisible.value = true
}

// 提交规则
const submitRule = () => {
  // 表单验证
  if (!ruleForm.value.name) {
    ElMessage.error('请输入规则名称')
    return
  }
  if (!ruleForm.value.type) {
    ElMessage.error('请选择规则类型')
    return
  }
  if (!ruleForm.value.description) {
    ElMessage.error('请输入规则描述')
    return
  }
  if (!ruleForm.value.rate) {
    ElMessage.error('请输入返利比例')
    return
  }
  if (!ruleForm.value.minSales) {
    ElMessage.error('请输入最低销售额')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在保存规则...' })
  
  setTimeout(() => {
    if (ruleForm.value.id) {
      // 编辑规则
      const index = rebateRules.value.findIndex(item => item.id === ruleForm.value.id)
      if (index !== -1) {
        rebateRules.value[index] = {
          ...rebateRules.value[index],
          name: ruleForm.value.name,
          type: ruleForm.value.type,
          description: ruleForm.value.description,
          rate: ruleForm.value.rate,
          minSales: ruleForm.value.minSales
        }
        ElMessage.success('规则编辑成功')
      }
    } else {
      // 新增规则
      const newRule = {
        id: rebateRules.value.length + 1,
        name: ruleForm.value.name,
        type: ruleForm.value.type,
        description: ruleForm.value.description,
        rate: ruleForm.value.rate,
        minSales: ruleForm.value.minSales
      }
      rebateRules.value.push(newRule)
      ElMessage.success('规则添加成功')
    }
    
    ruleDialogVisible.value = false
    loading.close()
  }, 1000)
}

// 核算返利
const calculateRebate = () => {
  // 重置表单
  calculateForm.value = {
    store: '',
    period: '',
    rebateType: '',
    remark: ''
  }
  calculateDialogVisible.value = true
}

// 提交核算返利
const submitCalculate = () => {
  // 表单验证
  if (!calculateForm.value.store) {
    ElMessage.error('请选择门店')
    return
  }
  if (!calculateForm.value.period) {
    ElMessage.error('请选择核算周期')
    return
  }
  if (!calculateForm.value.rebateType) {
    ElMessage.error('请选择返利类型')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在核算返利...' })
  
  setTimeout(() => {
    // 生成返利编号
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const serial = String(rebateList.value.length + 1).padStart(3, '0')
    const newId = `RB${date}${serial}`
    
    // 新增返利记录
    const newRebate = {
      id: newId,
      storeName: storeMap[calculateForm.value.store],
      rebateType: calculateForm.value.rebateType === 'sales' ? '销售返利' : calculateForm.value.rebateType === 'quarterly' ? '季度返利' : '年度返利',
      amount: '¥0',
      status: 'pending',
      calculateTime: new Date().toLocaleString('zh-CN')
    }
    
    rebateList.value.unshift(newRebate)
    total.value++
    
    ElMessage.success('返利核算成功')
    calculateDialogVisible.value = false
    loading.close()
  }, 1000)
}

// 查看详情
const viewRebateDetail = (row) => {
  // 填充详情表单
  detailForm.value = {
    id: row.id,
    storeName: row.storeName,
    rebateType: row.rebateType,
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
        rebateAmount: '¥1,050'
      },
      {
        orderId: 'ORD202603002',
        orderTime: '2026-03-20 14:20',
        amount: '¥45,500',
        rebateAmount: '¥1,365'
      },
      {
        orderId: 'ORD202603003',
        orderTime: '2026-03-25 09:15',
        amount: '¥48,000',
        rebateAmount: '¥1,440'
      }
    ]
    
    detailDialogVisible.value = true
    loading.close()
  }, 500)
}

// 调整金额
const adjustAmount = (row) => {
  // 填充调整表单
  adjustForm.value = {
    id: row.id,
    storeName: row.storeName,
    rebateType: row.rebateType,
    originalAmount: row.amount,
    newAmount: '',
    reason: ''
  }
  adjustDialogVisible.value = true
}

// 提交调整金额
const submitAdjust = () => {
  // 表单验证
  if (!adjustForm.value.newAmount) {
    ElMessage.error('请输入调整后的金额')
    return
  }
  if (!adjustForm.value.reason) {
    ElMessage.error('请输入调整原因')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在调整金额...' })
  
  setTimeout(() => {
    // 模拟调整金额逻辑
    const index = rebateList.value.findIndex(item => item.id === adjustForm.value.id)
    if (index !== -1) {
      rebateList.value[index].amount = `¥${adjustForm.value.newAmount}`
      ElMessage.success('金额调整成功')
    }
    
    adjustDialogVisible.value = false
    loading.close()
  }, 1000)
}

// 标记发放
const issueRebate = (row) => {
  // 填充发放表单
  issueForm.value = {
    id: row.id,
    storeName: row.storeName,
    amount: row.amount,
    issueDate: '',
    issueMethod: '',
    remark: ''
  }
  issueDialogVisible.value = true
}

// 提交标记发放
const submitIssue = () => {
  // 表单验证
  if (!issueForm.value.issueDate) {
    ElMessage.error('请选择发放日期')
    return
  }
  if (!issueForm.value.issueMethod) {
    ElMessage.error('请选择发放方式')
    return
  }
  if (!issueForm.value.remark) {
    ElMessage.error('请输入发放备注')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在标记发放...' })
  
  setTimeout(() => {
    // 模拟标记发放逻辑
    const index = rebateList.value.findIndex(item => item.id === issueForm.value.id)
    if (index !== -1) {
      rebateList.value[index].status = 'issued'
      ElMessage.success('标记发放成功')
    }
    
    issueDialogVisible.value = false
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
.rebate-page {
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

.rule-config {
  margin-bottom: var(--spacing-md);
}

.rule-item {
  border-bottom: 1px solid var(--border-color);
  padding: var(--spacing-sm) 0;
}

.rule-item:last-child {
  border-bottom: none;
}

.rule-name {
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
}

.rule-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

.rebate-list {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rebate-table {
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
  .rebate-page {
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