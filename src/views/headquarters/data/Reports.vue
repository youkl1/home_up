<template>
  <div class="headquarters-data-reports">
    <div class="page-header">
      <h1>自定义报表</h1>
      <el-button type="primary" @click="addReport">新建报表</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索报表名称" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="reportStatus" placeholder="选择状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="活跃" value="active"></el-option>
              <el-option label="停用" value="inactive"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 报表列表 -->
    <div class="report-list">
      <el-card shadow="hover">
        <el-table :data="filteredReports" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="报表ID" width="100"></el-table-column>
          <el-table-column prop="name" label="报表名称"></el-table-column>
          <el-table-column prop="description" label="报表描述"></el-table-column>
          <el-table-column prop="creator" label="创建人" width="120"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status === 'active' ? '活跃' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template #default="scope">
              <el-button size="small" @click="viewReport(scope.row)">查看</el-button>
              <el-button type="primary" size="small" @click="editReport(scope.row)">编辑</el-button>
              <el-button :type="getStatusType(scope.row.status) === 'success' ? 'warning' : 'success'" size="small" @click="toggleStatus(scope.row)">
                {{ scope.row.status === 'active' ? '停用' : '启用' }}
              </el-button>
              <el-button type="danger" size="small" @click="deleteReport(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-card>
    </div>
    
    <!-- 报表预览 -->
    <div class="report-preview" v-if="selectedReport">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>报表预览：{{ selectedReport.name }}</span>
            <el-button type="primary" size="small" @click="exportReport">导出报表</el-button>
          </div>
        </template>
        <div class="preview-content" v-loading="loading">
          <div class="report-content">
            <h3>{{ selectedReport.name }}</h3>
            <p>{{ selectedReport.description }}</p>
            <div class="report-stats">
              <el-row :gutter="20">
                <el-col :span="6">
                  <div class="stat-item">
                    <div class="stat-value">{{ reportStats.totalSales }}</div>
                    <div class="stat-label">总销售额</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="stat-item">
                    <div class="stat-value">{{ reportStats.totalOrders }}</div>
                    <div class="stat-label">总订单数</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="stat-item">
                    <div class="stat-value">{{ reportStats.totalCustomers }}</div>
                    <div class="stat-label">总客户数</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="stat-item">
                    <div class="stat-value">{{ reportStats.avgOrderValue }}</div>
                    <div class="stat-label">平均订单价值</div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="report-table">
              <el-table :data="reportData" style="width: 100%">
                <el-table-column prop="date" label="日期" width="120"></el-table-column>
                <el-table-column prop="product" label="产品名称"></el-table-column>
                <el-table-column prop="store" label="门店" width="150"></el-table-column>
                <el-table-column prop="amount" label="销售金额" width="120"></el-table-column>
                <el-table-column prop="quantity" label="销售数量" width="100"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 报表详情弹窗 -->
    <el-dialog
      v-model="reportDetailVisible"
      title="报表详情"
      width="800px"
    >
      <el-form label-position="top" v-loading="loading">
        <el-form-item label="报表信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="报表ID">
                <el-input v-model="currentReport.id" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报表名称">
                <el-input v-model="currentReport.name" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="创建人">
                <el-input v-model="currentReport.creator" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间">
                <el-input v-model="currentReport.createTime" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="状态">
                <el-input :value="currentReport.status === 'active' ? '活跃' : '停用'" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="报表描述">
          <el-input
            v-model="currentReport.description"
            type="textarea"
            :rows="4"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="报表配置">
          <el-input
            v-model="currentReport.config"
            type="textarea"
            :rows="6"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reportDetailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 添加/编辑报表弹窗 -->
    <el-dialog
      v-model="reportFormDialogVisible"
      :title="isEdit ? '编辑报表' : '新建报表'"
      width="800px"
    >
      <el-form
        :model="reportForm"
        :rules="reportFormRules"
        ref="reportFormRef"
        label-position="top"
        v-loading="loading"
      >
        <el-form-item label="报表信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="报表名称" prop="name">
                <el-input v-model="reportForm.name" placeholder="请输入报表名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="reportForm.status" placeholder="请选择状态">
                  <el-option label="活跃" value="active"></el-option>
                  <el-option label="停用" value="inactive"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="报表描述" prop="description">
          <el-input
            v-model="reportForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入报表描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="报表配置" prop="config">
          <el-input
            v-model="reportForm.config"
            type="textarea"
            :rows="6"
            placeholder="请输入报表配置（JSON格式）"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reportFormDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReportForm">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const reportStatus = ref('')

// 加载状态
const loading = ref(false)

// 报表数据
const reports = ref([
  { id: 1, name: '销售月度报表', description: '每月销售数据汇总', creator: 'admin', createTime: '2026-04-01 10:00', status: 'active', config: '{"dataSource": "sales", "timeRange": "monthly", "fields": ["date", "product", "amount", "quantity"]}' },
  { id: 2, name: '客户分析报表', description: '客户分布与转化分析', creator: 'admin', createTime: '2026-03-28 14:30', status: 'active', config: '{"dataSource": "customers", "timeRange": "quarterly", "fields": ["region", "ageGroup", "gender", "conversionRate"]}' },
  { id: 3, name: '门店业绩报表', description: '各门店业绩对比', creator: 'admin', createTime: '2026-03-25 09:15', status: 'active', config: '{"dataSource": "stores", "timeRange": "monthly", "fields": ["storeName", "sales", "orders", "customers"]}' },
  { id: 4, name: '产品销售排行', description: '产品销售情况排行', creator: 'admin', createTime: '2026-03-20 16:45', status: 'active', config: '{"dataSource": "products", "timeRange": "monthly", "fields": ["productName", "sales", "quantity", "rank"]}' },
  { id: 5, name: '库存分析报表', description: '库存周转率分析', creator: 'admin', createTime: '2026-03-15 11:20', status: 'inactive', config: '{"dataSource": "inventory", "timeRange": "monthly", "fields": ["productName", "stockLevel", "turnoverRate", "alert"]}' }
])

// 选中的报表
const selectedReport = ref(null)

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗状态
const reportDetailVisible = ref(false)
const reportFormDialogVisible = ref(false)
const isEdit = ref(false)

// 当前报表
const currentReport = ref({})

// 报表表单
const reportForm = ref({
  name: '',
  description: '',
  status: 'active',
  config: ''
})

// 表单验证规则
const reportFormRules = {
  name: [{ required: true, message: '请输入报表名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入报表描述', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  config: [{ required: true, message: '请输入报表配置', trigger: 'blur' }]
}

// 表单引用
const reportFormRef = ref(null)

// 获取状态类型
const getStatusType = (status) => {
  return status === 'active' ? 'success' : 'info'
}

// 报表统计数据
const reportStats = ref({
  totalSales: '¥78,200',
  totalOrders: 15,
  totalCustomers: 9,
  avgOrderValue: '¥8,688'
})

// 报表数据
const reportData = ref([
  { date: '2026-04-01', product: '整体衣柜', store: '北京旗舰店', amount: '¥12,500', quantity: 5 },
  { date: '2026-04-01', product: '书柜', store: '上海体验店', amount: '¥8,900', quantity: 3 },
  { date: '2026-04-02', product: '餐桌', store: '广州专卖店', amount: '¥15,600', quantity: 2 },
  { date: '2026-04-02', product: '沙发', store: '北京旗舰店', amount: '¥28,000', quantity: 1 },
  { date: '2026-04-03', product: '整体衣柜', store: '深圳体验店', amount: '¥13,200', quantity: 4 }
])

// 过滤后的报表列表
const filteredReports = computed(() => {
  let result = [...reports.value]
  
  // 搜索关键词过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(report => report.name.toLowerCase().includes(keyword))
  }
  
  // 状态过滤
  if (reportStatus.value) {
    result = result.filter(report => report.status === reportStatus.value)
  }
  
  return result
})

// 搜索
const search = () => {
  loading.value = true
  // 模拟搜索逻辑
  setTimeout(() => {
    // 实际项目中这里应该调用API获取数据
    console.log(`搜索报表：${searchKeyword.value}，状态：${reportStatus.value}`)
    ElMessage.success('搜索成功')
    loading.value = false
  }, 500)
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  reportStatus.value = ''
  ElMessage.info('搜索条件已重置')
}

// 查看报表
const viewReport = (report) => {
  loading.value = true
  // 模拟获取报表详情
  setTimeout(() => {
    selectedReport.value = { ...report }
    reportDetailVisible.value = true
    loading.value = false
  }, 500)
}

// 编辑报表
const editReport = (report) => {
  isEdit.value = true
  reportForm.value = { ...report }
  reportFormDialogVisible.value = true
}

// 删除报表
const deleteReport = (reportId) => {
  // 确认删除
  ElMessageBox.confirm('确定要删除该报表吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true
    // 模拟删除逻辑
    setTimeout(() => {
      const index = reports.value.findIndex(r => r.id === reportId)
      if (index !== -1) {
        reports.value.splice(index, 1)
        total.value--
        ElMessage.success('报表删除成功')
      }
      loading.value = false
    }, 500)
  }).catch(() => {
    // 取消删除
    ElMessage.info('已取消删除操作')
  })
}

// 切换报表状态
const toggleStatus = (report) => {
  loading.value = true
  // 模拟状态切换逻辑
  setTimeout(() => {
    report.status = report.status === 'active' ? 'inactive' : 'active'
    ElMessage.success(`报表已${report.status === 'active' ? '启用' : '停用'}`)
    loading.value = false
  }, 500)
}

// 导出报表
const exportReport = () => {
  loading.value = true
  // 模拟导出报表逻辑
  setTimeout(() => {
    // 实际项目中这里应该调用API导出报表
    ElMessage.success('报表导出成功')
    loading.value = false
  }, 1000)
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  // 实际项目中这里应该调用API获取对应页的数据
  console.log(`切换到第 ${page} 页`)
  ElMessage.info(`切换到第 ${page} 页`)
}

// 添加报表
const addReport = () => {
  isEdit.value = false
  reportForm.value = {
    name: '',
    description: '',
    status: 'active',
    config: ''
  }
  reportFormDialogVisible.value = true
}

// 提交报表表单
const submitReportForm = () => {
  if (!reportFormRef.value) return
  
  reportFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟API调用
      setTimeout(() => {
        if (isEdit.value) {
          // 编辑报表
          const index = reports.value.findIndex(r => r.id === reportForm.value.id)
          if (index !== -1) {
            reports.value[index] = { ...reportForm.value }
            ElMessage.success('报表编辑成功')
          }
        } else {
          // 添加报表
          const newReport = {
            ...reportForm.value,
            id: reports.value.length + 1,
            creator: 'admin',
            createTime: new Date().toLocaleString('zh-CN')
          }
          reports.value.unshift(newReport)
          total.value++
          ElMessage.success('报表创建成功')
        }
        reportFormDialogVisible.value = false
        loading.value = false
      }, 500)
    }
  })
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  loading.value = true
  setTimeout(() => {
    // 数据加载完成
    console.log('自定义报表数据加载完成')
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.headquarters-data-reports {
  padding: 20px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.search-filter {
  margin-bottom: 20px;
}

.report-list {
  margin-bottom: 20px;
}

.report-preview {
  margin-bottom: 20px;
}

.preview-content {
  min-height: 400px;
  position: relative;
}

.report-content {
  padding: 20px;
}

.report-content h3 {
  margin-bottom: 10px;
  color: #333;
}

.report-content p {
  margin-bottom: 20px;
  color: #666;
}

.report-stats {
  margin-bottom: 20px;
}

.stat-item {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.report-table {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>