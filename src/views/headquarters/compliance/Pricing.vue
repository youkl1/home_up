<template>
  <div class="pricing-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">价格体系管理</h1>
    </div>
    
    <!-- 价格规则配置 -->
    <div class="pricing-rules mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">价格规则配置</span>
            <el-button type="primary" size="small" @click="addPricingRule">新增规则</el-button>
          </div>
        </template>
        <el-table :data="pricingRules" style="width: 100%" class="rules-table">
          <el-table-column prop="category" label="产品类目" width="150"></el-table-column>
          <el-table-column prop="series" label="产品套系" width="150"></el-table-column>
          <el-table-column prop="guidePrice" label="指导价" width="150">
            <template #default="scope">
              <span class="font-semibold">{{ scope.row.guidePrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="minPrice" label="最低限价" width="150">
            <template #default="scope">
              <span class="text-danger font-semibold">{{ scope.row.minPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="maxPrice" label="最高限价" width="150">
            <template #default="scope">
              <span class="text-success font-semibold">{{ scope.row.maxPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="editPricingRule(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deletePricingRule(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    
    <!-- 门店报价记录 -->
    <div class="store-pricing mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">门店终端报价记录</span>
            <div class="filter-inline">
              <el-select v-model="filterStore" placeholder="选择门店" size="small" class="mr-2">
                <el-option label="全部门店" value=""></el-option>
                <el-option label="北京旗舰店" value="beijing1"></el-option>
                <el-option label="上海中心店" value="shanghai1"></el-option>
                <el-option label="广州天河店" value="guangzhou1"></el-option>
              </el-select>
              <el-button type="primary" size="small" @click="searchStorePricing">查询</el-button>
            </div>
          </div>
        </template>
        <el-table :data="storePricingList" style="width: 100%" class="store-pricing-table">
          <el-table-column prop="id" label="报价编号" width="180"></el-table-column>
          <el-table-column prop="storeName" label="门店名称" width="150"></el-table-column>
          <el-table-column prop="productName" label="产品名称"></el-table-column>
          <el-table-column prop="guidePrice" label="指导价" width="120">
            <template #default="scope">
              <span>{{ scope.row.guidePrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quotedPrice" label="门店报价" width="120">
            <template #default="scope">
              <span :class="getQuotePriceClass(scope.row.quotedPrice, scope.row.minPrice)">
                {{ scope.row.quotedPrice }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="minPrice" label="最低限价" width="120">
            <template #default="scope">
              <span class="text-secondary">{{ scope.row.minPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getQuoteStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="quoteTime" label="报价时间" width="180"></el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewQuoteDetail(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination mt-4 flex justify-center">
          <el-pagination
            layout="prev, pager, next"
            :total="pricingTotal"
            :page-size="10"
            @current-change="handlePricingCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
  
  <!-- 新增/编辑价格规则弹窗 -->
  <el-dialog
    v-model="ruleDialogVisible"
    :title="isEditMode ? '编辑价格规则' : '新增价格规则'"
    width="500px"
  >
    <el-form :model="ruleForm" label-width="100px">
      <el-form-item label="产品类目" required>
        <el-input v-model="ruleForm.category" placeholder="请输入产品类目" />
      </el-form-item>
      <el-form-item label="产品套系" required>
        <el-input v-model="ruleForm.series" placeholder="请输入产品套系" />
      </el-form-item>
      <el-form-item label="指导价" required>
        <el-input v-model="ruleForm.guidePrice" placeholder="请输入指导价" />
      </el-form-item>
      <el-form-item label="最低限价" required>
        <el-input v-model="ruleForm.minPrice" placeholder="请输入最低限价" />
      </el-form-item>
      <el-form-item label="最高限价" required>
        <el-input v-model="ruleForm.maxPrice" placeholder="请输入最高限价" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="ruleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePricingRule">保存</el-button>
      </span>
    </template>
  </el-dialog>
  
  <!-- 删除价格规则弹窗 -->
  <el-dialog
    v-model="deleteDialogVisible"
    title="删除价格规则"
    width="400px"
  >
    <div class="delete-content">
      <p>确定要删除该价格规则吗？</p>
      <p class="text-secondary">删除后将无法恢复</p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmDelete">确认删除</el-button>
      </span>
    </template>
  </el-dialog>
  
  <!-- 查看报价详情弹窗 -->
  <el-dialog
    v-model="quoteDetailDialogVisible"
    title="报价详情"
    width="600px"
  >
    <div class="quote-detail">
      <div class="detail-item">
        <span class="label">报价编号：</span>
        <span class="value">{{ currentQuote.id }}</span>
      </div>
      <div class="detail-item">
        <span class="label">门店名称：</span>
        <span class="value">{{ currentQuote.storeName }}</span>
      </div>
      <div class="detail-item">
        <span class="label">产品名称：</span>
        <span class="value">{{ currentQuote.productName }}</span>
      </div>
      <div class="detail-item">
        <span class="label">指导价：</span>
        <span class="value">{{ currentQuote.guidePrice }}</span>
      </div>
      <div class="detail-item">
        <span class="label">门店报价：</span>
        <span :class="getQuotePriceClass(currentQuote.quotedPrice, currentQuote.minPrice)">
          {{ currentQuote.quotedPrice }}
        </span>
      </div>
      <div class="detail-item">
        <span class="label">最低限价：</span>
        <span class="value">{{ currentQuote.minPrice }}</span>
      </div>
      <div class="detail-item">
        <span class="label">状态：</span>
        <el-tag :type="getQuoteStatusType(currentQuote.status)">
          {{ currentQuote.status }}
        </el-tag>
      </div>
      <div class="detail-item">
        <span class="label">报价时间：</span>
        <span class="value">{{ currentQuote.quoteTime }}</span>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'

// 价格规则
const pricingRules = ref([
  {
    category: '橱柜',
    series: '现代简约系列',
    guidePrice: '¥2,580/延米',
    minPrice: '¥2,200/延米',
    maxPrice: '¥3,200/延米',
    updateTime: '2026-04-01 09:00'
  },
  {
    category: '橱柜',
    series: '欧式古典系列',
    guidePrice: '¥3,280/延米',
    minPrice: '¥2,800/延米',
    maxPrice: '¥4,000/延米',
    updateTime: '2026-04-01 09:00'
  },
  {
    category: '衣柜',
    series: '推拉门系列',
    guidePrice: '¥1,680/平方米',
    minPrice: '¥1,400/平方米',
    maxPrice: '¥2,000/平方米',
    updateTime: '2026-04-01 10:30'
  },
  {
    category: '衣柜',
    series: '平开门系列',
    guidePrice: '¥1,980/平方米',
    minPrice: '¥1,600/平方米',
    maxPrice: '¥2,400/平方米',
    updateTime: '2026-04-01 10:30'
  },
  {
    category: '全屋定制',
    series: '标准套餐',
    guidePrice: '¥15,800/套',
    minPrice: '¥12,800/套',
    maxPrice: '¥19,800/套',
    updateTime: '2026-04-01 11:15'
  }
])

// 筛选门店
const filterStore = ref('')

// 门店报价列表
const storePricingList = ref([
  {
    id: 'QP202604001',
    storeName: '北京旗舰店',
    productName: '现代简约橱柜',
    guidePrice: '¥2,580/延米',
    quotedPrice: '¥2,400/延米',
    minPrice: '¥2,200/延米',
    status: '合规',
    quoteTime: '2026-04-01 09:00'
  },
  {
    id: 'QP202604002',
    storeName: '上海中心店',
    productName: '欧式古典橱柜',
    guidePrice: '¥3,280/延米',
    quotedPrice: '¥2,600/延米',
    minPrice: '¥2,800/延米',
    status: '违规',
    quoteTime: '2026-04-01 10:30'
  },
  {
    id: 'QP202604003',
    storeName: '广州天河店',
    productName: '推拉门衣柜',
    guidePrice: '¥1,680/平方米',
    quotedPrice: '¥1,500/平方米',
    minPrice: '¥1,400/平方米',
    status: '合规',
    quoteTime: '2026-04-01 11:15'
  },
  {
    id: 'QP202604004',
    storeName: '深圳南山店',
    productName: '全屋定制套餐',
    guidePrice: '¥15,800/套',
    quotedPrice: '¥12,500/套',
    minPrice: '¥12,800/套',
    status: '违规',
    quoteTime: '2026-04-01 14:20'
  },
  {
    id: 'QP202604005',
    storeName: '成都武侯店',
    productName: '平开门衣柜',
    guidePrice: '¥1,980/平方米',
    quotedPrice: '¥1,700/平方米',
    minPrice: '¥1,600/平方米',
    status: '合规',
    quoteTime: '2026-04-01 15:45'
  }
])

// 分页数据
const pricingTotal = ref(100)

// 弹窗相关
const ruleDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const quoteDetailDialogVisible = ref(false)
const isEditMode = ref(false)
const ruleForm = ref({
  category: '',
  series: '',
  guidePrice: '',
  minPrice: '',
  maxPrice: ''
})
const currentRule = ref({})
const currentQuote = ref({})

// 新增价格规则
const addPricingRule = () => {
  isEditMode.value = false
  ruleForm.value = {
    category: '',
    series: '',
    guidePrice: '',
    minPrice: '',
    maxPrice: ''
  }
  ruleDialogVisible.value = true
}

// 编辑价格规则
const editPricingRule = (row) => {
  isEditMode.value = true
  currentRule.value = { ...row }
  ruleForm.value = {
    category: row.category,
    series: row.series,
    guidePrice: row.guidePrice,
    minPrice: row.minPrice,
    maxPrice: row.maxPrice
  }
  ruleDialogVisible.value = true
}

// 保存价格规则
const savePricingRule = () => {
  if (!ruleForm.value.category || !ruleForm.value.series || !ruleForm.value.guidePrice || !ruleForm.value.minPrice || !ruleForm.value.maxPrice) {
    ElMessage.error('请填写所有必填项')
    return
  }
  
  const loading = ElLoading.service({
    lock: true,
    text: '保存中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  setTimeout(() => {
    loading.close()
    if (isEditMode.value) {
      // 更新规则
      const index = pricingRules.value.findIndex(item => item.category === currentRule.value.category && item.series === currentRule.value.series)
      if (index !== -1) {
        pricingRules.value[index] = {
          ...ruleForm.value,
          updateTime: new Date().toLocaleString()
        }
      }
      ElMessage.success('规则更新成功')
    } else {
      // 新增规则
      pricingRules.value.push({
        ...ruleForm.value,
        updateTime: new Date().toLocaleString()
      })
      ElMessage.success('规则新增成功')
    }
    ruleDialogVisible.value = false
  }, 1000)
}

// 删除价格规则
const deletePricingRule = (row) => {
  currentRule.value = { ...row }
  deleteDialogVisible.value = true
}

// 确认删除
const confirmDelete = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '删除中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  setTimeout(() => {
    loading.close()
    // 删除规则
    const index = pricingRules.value.findIndex(item => item.category === currentRule.value.category && item.series === currentRule.value.series)
    if (index !== -1) {
      pricingRules.value.splice(index, 1)
    }
    deleteDialogVisible.value = false
    ElMessage.success('规则删除成功')
  }, 1000)
}

// 搜索门店报价
const searchStorePricing = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '搜索中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  setTimeout(() => {
    loading.close()
    ElMessage.success('搜索完成')
  }, 1000)
}

// 查看报价详情
const viewQuoteDetail = (row) => {
  currentQuote.value = { ...row }
  quoteDetailDialogVisible.value = true
}

// 分页处理
const handlePricingCurrentChange = (current) => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  setTimeout(() => {
    loading.close()
    ElMessage.success(`加载第 ${current} 页数据`)
  }, 1000)
}

// 获取报价状态类型
const getQuoteStatusType = (status) => {
  return status === '合规' ? 'success' : 'danger'
}

// 获取报价价格样式
const getQuotePriceClass = (quotedPrice, minPrice) => {
  return quotedPrice < minPrice ? 'text-danger font-semibold' : 'font-semibold'
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
.pricing-page {
  padding: var(--spacing-md);
  background-color: var(--bg-color);
  min-height: 100vh;
}

.page-header {
  margin-bottom: var(--spacing-md);
}

.pricing-rules,
.store-pricing {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-inline {
  display: flex;
  align-items: center;
}

.rules-table,
.store-pricing-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: center;
}

.text-danger {
  color: var(--danger-color);
}

.text-success {
  color: var(--success-color);
}

.text-secondary {
  color: var(--text-secondary);
}

/* 弹窗样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

.delete-content {
  padding: var(--spacing-sm);
}

.delete-content p {
  margin-bottom: var(--spacing-xs);
}

/* 报价详情样式 */
.quote-detail {
  padding: var(--spacing-sm);
}

.detail-item {
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: flex-start;
}

.detail-item .label {
  width: 100px;
  font-weight: bold;
  color: var(--text-secondary);
}

.detail-item .value {
  flex: 1;
  color: var(--text-primary);
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .pricing-page {
    padding: var(--spacing-sm);
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .filter-inline {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}
</style>