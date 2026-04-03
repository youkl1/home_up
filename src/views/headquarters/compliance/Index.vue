<template>
  <div class="compliance-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">内容审核管理</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section mb-6">
      <el-card shadow="hover" class="card transition-all">
        <div class="filter-form">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="filterForm.contentType" placeholder="内容类型" size="small" class="w-full">
                <el-option label="全部类型" value=""></el-option>
                <el-option label="宣传海报" value="poster"></el-option>
                <el-option label="活动信息" value="activity"></el-option>
                <el-option label="产品推广" value="product"></el-option>
                <el-option label="其他" value="other"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.status" placeholder="审核状态" size="small" class="w-full">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="待审核" value="pending"></el-option>
                <el-option label="已通过" value="approved"></el-option>
                <el-option label="已驳回" value="rejected"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.store" placeholder="提交门店" size="small" class="w-full">
                <el-option label="全部门店" value=""></el-option>
                <el-option label="北京旗舰店" value="beijing1"></el-option>
                <el-option label="上海中心店" value="shanghai1"></el-option>
                <el-option label="广州天河店" value="guangzhou1"></el-option>
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
            <el-button type="primary" size="small" @click="searchContent">查询</el-button>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 内容审核列表 -->
    <div class="content-list mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">内容审核列表</span>
            <span class="text-secondary">共 {{ total }} 条记录</span>
          </div>
        </template>
        <el-table :data="contentList" style="width: 100%" class="content-table">
          <el-table-column prop="id" label="内容编号" width="180"></el-table-column>
          <el-table-column prop="title" label="内容标题"></el-table-column>
          <el-table-column prop="contentType" label="类型" width="120">
            <template #default="scope">
              <el-tag>{{ scope.row.contentType }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="storeName" label="提交门店" width="120"></el-table-column>
          <el-table-column prop="submitter" label="提交人" width="100"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" label="提交时间" width="180"></el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewContentDetail(scope.row)">查看详情</el-button>
              <el-button size="small" type="success" @click="approveContent(scope.row)" v-if="scope.row.status === '待审核'">通过</el-button>
              <el-button size="small" type="danger" @click="rejectContent(scope.row)" v-if="scope.row.status === '待审核'">驳回</el-button>
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
    title="内容详情"
    width="600px"
  >
    <div class="content-detail">
      <div class="detail-item">
        <span class="label">内容编号：</span>
        <span class="value">{{ currentContent.id }}</span>
      </div>
      <div class="detail-item">
        <span class="label">内容标题：</span>
        <span class="value">{{ currentContent.title }}</span>
      </div>
      <div class="detail-item">
        <span class="label">内容类型：</span>
        <span class="value">{{ currentContent.contentType }}</span>
      </div>
      <div class="detail-item">
        <span class="label">提交门店：</span>
        <span class="value">{{ currentContent.storeName }}</span>
      </div>
      <div class="detail-item">
        <span class="label">提交人：</span>
        <span class="value">{{ currentContent.submitter }}</span>
      </div>
      <div class="detail-item">
        <span class="label">提交时间：</span>
        <span class="value">{{ currentContent.submitTime }}</span>
      </div>
      <div class="detail-item">
        <span class="label">状态：</span>
        <el-tag :type="getStatusType(currentContent.status)">
          {{ currentContent.status }}
        </el-tag>
      </div>
      <div class="detail-item">
        <span class="label">内容描述：</span>
        <div class="content-desc">{{ currentContent.description || '无描述' }}</div>
      </div>
    </div>
  </el-dialog>
  
  <!-- 驳回审核弹窗 -->
  <el-dialog
    v-model="rejectDialogVisible"
    title="驳回审核"
    width="500px"
  >
    <el-form :model="rejectForm" label-width="100px">
      <el-form-item label="驳回原因">
        <el-input
          v-model="rejectForm.reason"
          type="textarea"
          :rows="4"
          placeholder="请输入驳回原因"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmReject">确认驳回</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'

// 筛选表单
const filterForm = ref({
  contentType: '',
  status: '',
  store: '',
  dateRange: []
})

// 内容列表
const contentList = ref([
  {
    id: 'CT202604001',
    title: '春季新品促销活动海报',
    contentType: '宣传海报',
    storeName: '北京旗舰店',
    submitter: '张导购',
    status: '待审核',
    submitTime: '2026-04-01 09:00',
    description: '春季新品促销活动海报，包含折扣信息和活动时间'
  },
  {
    id: 'CT202604002',
    title: '五一劳动节优惠活动',
    contentType: '活动信息',
    storeName: '上海中心店',
    submitter: '李店长',
    status: '已通过',
    submitTime: '2026-04-01 10:30',
    description: '五一劳动节优惠活动，全场满10000减1000'
  },
  {
    id: 'CT202604003',
    title: '全屋定制产品推广',
    contentType: '产品推广',
    storeName: '广州天河店',
    submitter: '王导购',
    status: '已驳回',
    submitTime: '2026-04-01 11:15',
    description: '全屋定制产品推广，包含橱柜、衣柜等产品'
  },
  {
    id: 'CT202604004',
    title: '新店开业庆典活动',
    contentType: '活动信息',
    storeName: '深圳南山店',
    submitter: '赵店长',
    status: '待审核',
    submitTime: '2026-04-01 14:20',
    description: '新店开业庆典活动，邀请老客户参加'
  },
  {
    id: 'CT202604005',
    title: '橱柜系列产品介绍',
    contentType: '产品推广',
    storeName: '成都武侯店',
    submitter: '刘导购',
    status: '已通过',
    submitTime: '2026-04-01 15:45',
    description: '橱柜系列产品介绍，包含现代简约、欧式古典等风格'
  }
])

// 分页数据
const total = ref(100)

// 弹窗相关
const detailDialogVisible = ref(false)
const rejectDialogVisible = ref(false)
const currentContent = ref({})
const rejectForm = ref({
  reason: ''
})

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case '待审核': return 'warning'
    case '已通过': return 'success'
    case '已驳回': return 'danger'
    default: return ''
  }
}

// 重置筛选
const resetFilter = () => {
  filterForm.value = {
    contentType: '',
    status: '',
    store: '',
    dateRange: []
  }
}

// 搜索内容
const searchContent = () => {
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

// 查看详情
const viewContentDetail = (row) => {
  currentContent.value = { ...row }
  detailDialogVisible.value = true
}

// 通过审核
const approveContent = (row) => {
  const loading = ElLoading.service({
    lock: true,
    text: '审核中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  setTimeout(() => {
    loading.close()
    // 更新状态
    const index = contentList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      contentList.value[index].status = '已通过'
    }
    ElMessage.success('审核通过')
  }, 1000)
}

// 驳回审核
const rejectContent = (row) => {
  currentContent.value = { ...row }
  rejectForm.value = { reason: '' }
  rejectDialogVisible.value = true
}

// 确认驳回
const confirmReject = () => {
  if (!rejectForm.value.reason) {
    ElMessage.error('请输入驳回原因')
    return
  }
  
  const loading = ElLoading.service({
    lock: true,
    text: '处理中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  setTimeout(() => {
    loading.close()
    // 更新状态
    const index = contentList.value.findIndex(item => item.id === currentContent.value.id)
    if (index !== -1) {
      contentList.value[index].status = '已驳回'
    }
    rejectDialogVisible.value = false
    ElMessage.success('审核驳回')
  }, 1000)
}

// 分页处理
const handleCurrentChange = (current) => {
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

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
  }, 500)
})
</script>

<style scoped>
.compliance-page {
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

.content-list {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: center;
}

/* 详情弹窗样式 */
.content-detail {
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

.content-desc {
  flex: 1;
  color: var(--text-primary);
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .filter-form .el-col {
    --el-col-span: 12;
  }
}

@media screen and (max-width: 768px) {
  .compliance-page {
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