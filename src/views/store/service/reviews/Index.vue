<template>
  <div class="service-reviews">
    <div class="page-header">
      <h1>客户评价管理</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="评分">
          <el-select v-model="filterForm.rating" size="small" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="5星" value="5"></el-option>
            <el-option label="4星" value="4"></el-option>
            <el-option label="3星" value="3"></el-option>
            <el-option label="2星" value="2"></el-option>
            <el-option label="1星" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="filterForm.status" size="small" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="待跟进" value="pending"></el-option>
            <el-option label="已跟进" value="followed"></el-option>
            <el-option label="已归档" value="archived"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            size="small"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="searchReviews">查询</el-button>
          <el-button size="small" @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 评价表格 -->
    <div class="table-section">
      <el-card shadow="hover">
        <el-table :data="reviews" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="评价ID" width="180"></el-table-column>
          <el-table-column prop="customer" label="客户"></el-table-column>
          <el-table-column prop="ticketId" label="工单号" width="180"></el-table-column>
          <el-table-column prop="rating" label="评分" width="100">
            <template #default="scope">
              <div class="rating-stars">
                <el-rate v-model="scope.row.rating" disabled :max="5"></el-rate>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="评价内容"></el-table-column>
          <el-table-column prop="status" label="处理状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="评价时间" width="180"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row)">查看详情</el-button>
              <el-button size="small" type="primary" v-if="scope.row.status === 'pending'" @click="followUp(scope.row)">跟进处理</el-button>
              <el-button size="small" type="success" @click="showMarkCaseDialog(scope.row)">标记案例</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-card>
    </div>
    
    <!-- 评价详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="评价详情"
      width="800px"
    >
      <div class="review-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="评价ID">{{ selectedReview.id }}</el-descriptions-item>
          <el-descriptions-item label="客户">{{ selectedReview.customer }}</el-descriptions-item>
          <el-descriptions-item label="工单号">{{ selectedReview.ticketId }}</el-descriptions-item>
          <el-descriptions-item label="评分">
            <el-rate v-model="selectedReview.rating" disabled :max="5"></el-rate>
          </el-descriptions-item>
          <el-descriptions-item label="评价时间">{{ selectedReview.createTime }}</el-descriptions-item>
          <el-descriptions-item label="处理状态">{{ getStatusText(selectedReview.status) }}</el-descriptions-item>
        </el-descriptions>
        
        <div class="review-content">
          <h3>评价内容</h3>
          <div class="content-text">{{ selectedReview.content }}</div>
        </div>
        
        <div v-if="selectedReview.images && selectedReview.images.length > 0" class="review-images">
          <h3>评价图片</h3>
          <div class="images-container">
            <el-image
              v-for="(image, index) in selectedReview.images"
              :key="index"
              :src="image"
              fit="cover"
              class="review-image"
            ></el-image>
          </div>
        </div>
        
        <div class="follow-up-section" v-if="selectedReview.status === 'pending'">
          <h3>跟进处理</h3>
          <el-form ref="followUpFormRef" :model="followUpForm" :rules="followUpRules" label-width="100px">
            <el-form-item label="跟进内容" prop="content">
              <el-input type="textarea" v-model="followUpForm.content" :rows="3" placeholder="请输入跟进内容"></el-input>
            </el-form-item>
            <el-form-item label="处理结果" prop="result">
              <el-select v-model="followUpForm.result" placeholder="选择处理结果" style="width: 100%">
                <el-option label="已解决" value="resolved" />
                <el-option label="部分解决" value="partially_resolved" />
                <el-option label="未解决" value="unresolved" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitFollowUp" :loading="submitting">提交跟进</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 标记案例弹窗 -->
    <el-dialog
      v-model="markCaseDialogVisible"
      title="标记优质服务案例"
      width="600px"
    >
      <div class="mark-case-dialog">
        <el-alert
          :title="`为客户 ${currentReview?.customer} 的评价标记为优质服务案例`"
          type="success"
          :closable="false"
          style="margin-bottom: 20px"
        />
        <el-form ref="markCaseFormRef" :model="markCaseForm" :rules="markCaseRules" label-width="100px">
          <el-form-item label="案例类型" prop="caseType">
            <el-select v-model="markCaseForm.caseType" placeholder="选择案例类型" style="width: 100%">
              <el-option label="优质服务" value="quality_service" />
              <el-option label="技术创新" value="technical_innovation" />
              <el-option label="客户满意" value="customer_satisfaction" />
              <el-option label="问题解决" value="problem_solving" />
            </el-select>
          </el-form-item>
          <el-form-item label="案例标题" prop="title">
            <el-input v-model="markCaseForm.title" placeholder="请输入案例标题" />
          </el-form-item>
          <el-form-item label="案例描述" prop="description">
            <el-input v-model="markCaseForm.description" type="textarea" :rows="3" placeholder="请输入案例描述" />
          </el-form-item>
          <el-form-item label="案例标签">
            <el-checkbox-group v-model="markCaseForm.tags">
              <el-checkbox label="服务态度好" />
              <el-checkbox label="技术专业" />
              <el-checkbox label="响应及时" />
              <el-checkbox label="解决问题" />
              <el-checkbox label="客户满意" />
              <el-checkbox label="值得推广" />
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="markCaseDialogVisible = false">取消</el-button>
          <el-button type="success" @click="submitMarkCase" :loading="submitting">确认标记</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 筛选表单
const filterForm = ref({
  rating: '',
  status: '',
  dateRange: []
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(120)
const loading = ref(false)
const submitting = ref(false)

// 已选评价
const selectedReviews = ref([])

// 评价列表
const reviews = ref([
  { id: 'REV20260401001', customer: '张女士', ticketId: 'SRV20260331001', rating: 5, content: '师傅服务态度很好，安装专业，非常满意！', status: 'archived', createTime: '2026-04-01 10:30' },
  { id: 'REV20260401002', customer: '李先生', ticketId: 'SRV20260331002', rating: 3, content: '服务一般，安装有点慢，希望改进。', status: 'pending', createTime: '2026-04-01 09:15' },
  { id: 'REV20260331001', customer: '王女士', ticketId: 'SRV20260330001', rating: 4, content: '整体服务不错，响应及时。', status: 'followed', createTime: '2026-03-31 16:45' },
  { id: 'REV20260331002', customer: '赵先生', ticketId: 'SRV20260329001', rating: 1, content: '非常不满意，安装出现问题，多次沟通无果。', status: 'pending', createTime: '2026-03-31 14:20' },
  { id: 'REV20260330001', customer: '刘女士', ticketId: 'SRV20260328001', rating: 5, content: '服务非常好，师傅很专业，下次还会选择。', status: 'archived', createTime: '2026-03-30 11:00' }
])

// 详情弹窗
const detailDialogVisible = ref(false)
const selectedReview = ref({
  id: '',
  customer: '',
  ticketId: '',
  rating: 5,
  content: '',
  status: '',
  createTime: '',
  images: []
})

// 当前操作评价
const currentReview = ref(null)

// 跟进表单
const followUpForm = reactive({
  content: '',
  result: ''
})
const followUpRules = {
  content: [{ required: true, message: '请输入跟进内容', trigger: 'blur' }],
  result: [{ required: true, message: '请选择处理结果', trigger: 'change' }]
}
const followUpFormRef = ref(null)

// 标记案例弹窗
const markCaseDialogVisible = ref(false)
const markCaseForm = reactive({
  caseType: '',
  title: '',
  description: '',
  tags: []
})
const markCaseRules = {
  caseType: [{ required: true, message: '请选择案例类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入案例标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入案例描述', trigger: 'blur' }]
}
const markCaseFormRef = ref(null)

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    followed: 'info',
    archived: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    pending: '待跟进',
    followed: '已跟进',
    archived: '已归档'
  }
  return textMap[status] || status
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedReviews.value = selection
}

// 查询评价
const searchReviews = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('查询成功')
  }, 500)
}

// 重置筛选
const resetFilter = () => {
  Object.assign(filterForm.value, {
    rating: '',
    status: '',
    dateRange: []
  })
}

// 查看详情
const viewDetail = (row) => {
  // 模拟获取评价详情
  selectedReview.value = {
    id: row.id,
    customer: row.customer,
    ticketId: row.ticketId,
    rating: row.rating,
    content: row.content,
    status: row.status,
    createTime: row.createTime,
    images: []
  }
  Object.assign(followUpForm, {
    content: '',
    result: ''
  })
  detailDialogVisible.value = true
}

// 跟进处理
const followUp = (row) => {
  viewDetail(row)
}

// 提交跟进
const submitFollowUp = async () => {
  const valid = await followUpFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    detailDialogVisible.value = false
    ElMessage.success('跟进提交成功')
  }, 500)
}

// 显示标记案例弹窗
const showMarkCaseDialog = (row) => {
  currentReview.value = row
  Object.assign(markCaseForm, {
    caseType: '',
    title: '',
    description: '',
    tags: []
  })
  markCaseDialogVisible.value = true
}

// 提交标记案例
const submitMarkCase = async () => {
  const valid = await markCaseFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    markCaseDialogVisible.value = false
    ElMessage.success('案例标记成功')
  }, 500)
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  // 加载对应页数据
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
.service-reviews {
  padding: 20px 0;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-form {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
}

.table-section {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.review-detail {
  padding: 20px 0;
}

.review-content {
  margin-top: 20px;
}

.review-content h3 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}

.content-text {
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  line-height: 1.6;
}

.review-images {
  margin-top: 20px;
}

.review-images h3 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}

.images-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.review-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}

.follow-up-section {
  margin-top: 20px;
}

.follow-up-section h3 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}

.rating-stars {
  display: flex;
  align-items: center;
}

.mark-case-dialog {
  .el-alert {
    margin-bottom: 20px;
  }
}
</style>
