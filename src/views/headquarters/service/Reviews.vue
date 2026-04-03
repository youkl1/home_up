<template>
  <div class="reviews-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">服务评价管理</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section mb-6">
      <el-card shadow="hover" class="card transition-all">
        <div class="filter-form">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="filterForm.rating" placeholder="评分" size="small" class="w-full">
                <el-option label="全部评分" value=""></el-option>
                <el-option label="5星" value="5"></el-option>
                <el-option label="4星" value="4"></el-option>
                <el-option label="3星" value="3"></el-option>
                <el-option label="2星" value="2"></el-option>
                <el-option label="1星" value="1"></el-option>
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
              <el-select v-model="filterForm.status" placeholder="处理状态" size="small" class="w-full">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="待跟进" value="pending"></el-option>
                <el-option label="已跟进" value="followed"></el-option>
                <el-option label="已解决" value="resolved"></el-option>
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
            <el-button type="primary" size="small" @click="searchReviews">查询</el-button>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 评价统计 -->
    <div class="review-stats mb-6">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card card transition-all">
            <div class="stat-item text-center">
              <div class="stat-value text-3xl font-bold text-primary mb-2">{{ totalReviews }}</div>
              <div class="stat-label text-secondary">总评价数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card card transition-all">
            <div class="stat-item text-center">
              <div class="stat-value text-3xl font-bold text-success mb-2">{{ goodReviews }}</div>
              <div class="stat-label text-secondary">好评数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card card transition-all">
            <div class="stat-item text-center">
              <div class="stat-value text-3xl font-bold text-warning mb-2">{{ neutralReviews }}</div>
              <div class="stat-label text-secondary">中评数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card card transition-all">
            <div class="stat-item text-center">
              <div class="stat-value text-3xl font-bold text-danger mb-2">{{ badReviews }}</div>
              <div class="stat-label text-secondary">差评数</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 评价列表 -->
    <div class="reviews-list mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">评价列表</span>
            <span class="text-secondary">共 {{ total }} 条评价</span>
          </div>
        </template>
        <el-table :data="reviewsList" style="width: 100%" class="reviews-table">
          <el-table-column prop="id" label="评价编号" width="180"></el-table-column>
          <el-table-column prop="customerName" label="客户姓名" width="100"></el-table-column>
          <el-table-column prop="orderId" label="关联工单" width="150"></el-table-column>
          <el-table-column prop="workerName" label="服务师傅" width="100"></el-table-column>
          <el-table-column prop="storeName" label="所属门店" width="120"></el-table-column>
          <el-table-column prop="rating" label="评分" width="120">
            <template #default="scope">
              <div class="flex items-center">
                <el-rate v-model="scope.row.rating" disabled show-score text-color="#ff9900" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="评价内容"></el-table-column>
          <el-table-column prop="tags" label="标签" width="150">
            <template #default="scope">
              <el-tag v-for="tag in scope.row.tags" :key="tag" size="small" class="mr-1" :type="getTagType(tag)">
                {{ tag }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="评价时间" width="180"></el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewReviewDetail(scope.row)">查看详情</el-button>
              <el-button size="small" type="primary" @click="followUpReview(scope.row)" v-if="scope.row.status === '待跟进'">跟进</el-button>
              <el-button size="small" type="success" @click="markGoodReview(scope.row)" v-if="scope.row.rating >= 4 && !scope.row.isGood">标记优质</el-button>
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
  </div>
    
    <!-- 查看详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="`评价详情：${detailForm.id}`"
      width="800px"
    >
      <div class="detail-header mb-4">
        <div class="flex-between items-center">
          <div>
            <h3 class="font-semibold">{{ detailForm.customerName }} 的评价</h3>
            <p class="text-secondary">评价编号：{{ detailForm.id }}</p>
            <p class="text-secondary">关联工单：{{ detailForm.orderId }}</p>
            <p class="text-secondary">评价时间：{{ detailForm.createTime }}</p>
          </div>
          <div class="text-right">
            <p class="text-secondary">评分</p>
            <div class="flex items-center justify-end">
              <el-rate v-model="detailForm.rating" disabled :max="5" show-score></el-rate>
            </div>
            <p class="text-secondary mt-2">处理状态</p>
            <el-tag :type="getProcessStatusType(detailForm.processStatus)">{{ detailForm.processStatus }}</el-tag>
          </div>
        </div>
      </div>
      <div class="detail-content">
        <el-form label-width="100px">
          <el-form-item label="评价内容">
            <el-input v-model="detailForm.content" type="textarea" :rows="4" disabled></el-input>
          </el-form-item>
          <el-form-item label="服务师傅">
            <el-input v-model="detailForm.workerName" disabled></el-input>
          </el-form-item>
          <el-form-item label="所属门店">
            <el-input v-model="detailForm.storeName" disabled></el-input>
          </el-form-item>
          <el-form-item label="跟进记录" v-if="detailForm.followUpRecord">
            <el-input v-model="detailForm.followUpRecord" type="textarea" :rows="3" disabled></el-input>
          </el-form-item>
          <el-form-item label="跟进时间" v-if="detailForm.followUpTime">
            <el-input v-model="detailForm.followUpTime" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 跟进评价弹窗 -->
    <el-dialog
      v-model="followUpDialogVisible"
      :title="`跟进评价：${followUpForm.id}`"
      width="600px"
    >
      <el-form :model="followUpForm" label-width="100px">
        <el-form-item label="评价编号">
          <el-input v-model="followUpForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input v-model="followUpForm.customerName" disabled></el-input>
        </el-form-item>
        <el-form-item label="评价内容">
          <el-input v-model="followUpForm.content" type="textarea" :rows="3" disabled></el-input>
        </el-form-item>
        <el-form-item label="跟进内容">
          <el-input v-model="followUpForm.followUpContent" type="textarea" :rows="4" placeholder="请输入跟进内容"></el-input>
        </el-form-item>
        <el-form-item label="跟进方式">
          <el-select v-model="followUpForm.followUpMethod" placeholder="选择跟进方式">
            <el-option label="电话" value="phone"></el-option>
            <el-option label="短信" value="sms"></el-option>
            <el-option label="上门" value="visit"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="followUpDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitFollowUp">确认跟进</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'

// 筛选表单
const filterForm = ref({
  rating: '',
  store: '',
  status: '',
  dateRange: []
})

// 弹窗相关
const detailDialogVisible = ref(false)
const followUpDialogVisible = ref(false)

// 详情表单
const detailForm = ref({
  id: '',
  orderId: '',
  customerName: '',
  rating: 5,
  content: '',
  workerName: '',
  storeName: '',
  processStatus: '',
  createTime: '',
  followUpRecord: '',
  followUpTime: ''
})

// 跟进表单
const followUpForm = ref({
  id: '',
  customerName: '',
  content: '',
  followUpContent: '',
  followUpMethod: ''
})

// 统计数据
const totalReviews = ref('1,256')
const goodReviews = ref('1,089')
const neutralReviews = ref('128')
const badReviews = ref('39')

// 评价列表
const reviewsList = ref([
  {
    id: 'RV202604001',
    customerName: '张先生',
    orderId: 'WO202604001',
    workerName: '张师傅',
    storeName: '北京旗舰店',
    rating: 5,
    content: '师傅服务态度很好，安装技术专业，非常满意！',
    tags: ['服务热情', '技术专业'],
    status: '已解决',
    isGood: true,
    createTime: '2026-04-01 09:00'
  },
  {
    id: 'RV202604002',
    customerName: '李女士',
    orderId: 'WO202604002',
    workerName: '李师傅',
    storeName: '上海中心店',
    rating: 2,
    content: '安装时间延迟，沟通不够及时，希望改进。',
    tags: ['时间延误', '沟通不畅'],
    status: '待跟进',
    isGood: false,
    createTime: '2026-04-01 10:30'
  },
  {
    id: 'RV202604003',
    customerName: '王先生',
    orderId: 'WO202604003',
    workerName: '王师傅',
    storeName: '广州天河店',
    rating: 5,
    content: '非常专业的服务，安装效果很好，推荐！',
    tags: ['服务热情', '效果满意'],
    status: '已解决',
    isGood: true,
    createTime: '2026-04-01 11:15'
  },
  {
    id: 'RV202604004',
    customerName: '赵先生',
    orderId: 'WO202604004',
    workerName: '赵师傅',
    storeName: '深圳南山店',
    rating: 3,
    content: '整体还可以，但有些地方需要改进。',
    tags: ['一般'],
    status: '已跟进',
    isGood: false,
    createTime: '2026-04-01 14:20'
  },
  {
    id: 'RV202604005',
    customerName: '刘女士',
    orderId: 'WO202604005',
    workerName: '刘师傅',
    storeName: '成都武侯店',
    rating: 1,
    content: '服务态度很差，安装质量也不行，非常不满意！',
    tags: ['态度恶劣', '质量差'],
    status: '待跟进',
    isGood: false,
    createTime: '2026-04-01 15:45'
  }
])

// 分页数据
const total = ref(100)

// 获取标签类型
const getTagType = (tag) => {
  const goodTags = ['服务热情', '技术专业', '效果满意', '准时到达']
  const badTags = ['态度恶劣', '质量差', '时间延误', '沟通不畅']
  
  if (goodTags.includes(tag)) return 'success'
  if (badTags.includes(tag)) return 'danger'
  return 'info'
}

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case '待跟进': return 'danger'
    case '已跟进': return 'warning'
    case '已解决': return 'success'
    default: return ''
  }
}

// 获取处理状态类型
const getProcessStatusType = (status) => {
  switch (status) {
    case '待跟进': return 'danger'
    case '已跟进': return 'warning'
    case '已解决': return 'success'
    default: return ''
  }
}

// 重置筛选
const resetFilter = () => {
  filterForm.value = {
    rating: '',
    store: '',
    status: '',
    dateRange: []
  }
  ElMessage.info('筛选条件已重置')
}

// 搜索评价
const searchReviews = () => {
  // 模拟搜索过程
  const loading = ElLoading.service({ text: '正在搜索评价...' })
  
  setTimeout(() => {
    // 过滤数据
    const filteredList = reviewsList.value.filter(item => {
      const ratingMatch = !filterForm.value.rating || item.rating === parseInt(filterForm.value.rating)
      const statusMatch = !filterForm.value.status || item.status === filterForm.value.status
      return ratingMatch && statusMatch
    })
    
    total.value = filteredList.length
    
    if (filteredList.length > 0) {
      ElMessage.success(`找到 ${filteredList.length} 条评价`)
    } else {
      ElMessage.info('未找到匹配的评价')
    }
    loading.close()
  }, 500)
}

// 查看详情
const viewReviewDetail = (row) => {
  // 填充详情表单
  detailForm.value = {
    id: row.id,
    orderId: row.orderId,
    customerName: row.customerName,
    rating: row.rating,
    content: row.content,
    workerName: row.workerName,
    storeName: row.storeName,
    processStatus: row.status,
    createTime: row.createTime,
    followUpRecord: row.status !== '待跟进' ? '已电话联系客户，客户表示满意' : '',
    followUpTime: row.status !== '待跟进' ? '2026-04-01 15:00' : ''
  }
  detailDialogVisible.value = true
}

// 跟进评价
const followUpReview = (row) => {
  // 填充跟进表单
  followUpForm.value = {
    id: row.id,
    customerName: row.customerName,
    content: row.content,
    followUpContent: '',
    followUpMethod: ''
  }
  followUpDialogVisible.value = true
}

// 提交跟进
const submitFollowUp = () => {
  // 表单验证
  if (!followUpForm.value.followUpContent) {
    ElMessage.error('请输入跟进内容')
    return
  }
  if (!followUpForm.value.followUpMethod) {
    ElMessage.error('请选择跟进方式')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在提交跟进...' })
  
  setTimeout(() => {
    const index = reviewsList.value.findIndex(item => item.id === followUpForm.value.id)
    if (index !== -1) {
      reviewsList.value[index].status = '已跟进'
      ElMessage.success('评价跟进成功')
    }
    
    followUpDialogVisible.value = false
    loading.close()
  }, 1000)
}

// 标记优质评价
const markGoodReview = (row) => {
  ElMessageBox.confirm(
    '确定要标记此评价为优质评价吗？',
    '标记确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }
  ).then(() => {
    // 模拟标记过程
    const loading = ElLoading.service({ text: '正在标记优质评价...' })
    
    setTimeout(() => {
      const index = reviewsList.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        reviewsList.value[index].isGood = true
        ElMessage.success('评价已标记为优质评价')
      }
      loading.close()
    }, 500)
  }).catch(() => {
    // 取消操作
  })
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
.reviews-page {
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

.review-stats {
  margin-bottom: var(--spacing-md);
}

.stat-card {
  height: 120px;
  transition: all var(--transition-normal);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: bold;
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.reviews-list {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reviews-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: center;
}

.text-primary {
  color: var(--primary-color);
}

.text-success {
  color: var(--success-color);
}

.text-warning {
  color: var(--warning-color);
}

.text-danger {
  color: var(--danger-color);
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .filter-form .el-col {
    --el-col-span: 12;
  }
  
  .review-stats .el-col {
    --el-col-span: 12;
  }
}

@media screen and (max-width: 768px) {
  .reviews-page {
    padding: var(--spacing-sm);
  }
  
  .filter-form .el-col {
    --el-col-span: 24;
  }
  
  .review-stats .el-col {
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