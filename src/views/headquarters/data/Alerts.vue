<template>
  <div class="headquarters-data-alerts">
    <div class="page-header">
      <h1>异常预警</h1>
      <el-button type="primary" @click="refreshAlerts">刷新预警</el-button>
    </div>
    
    <!-- 预警筛选 -->
    <div class="alert-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-select v-model="alertType" placeholder="选择预警类型">
              <el-option label="全部" value=""></el-option>
              <el-option label="销售异常" value="sales"></el-option>
              <el-option label="库存异常" value="inventory"></el-option>
              <el-option label="客户异常" value="customers"></el-option>
              <el-option label="门店异常" value="stores"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select v-model="alertLevel" placeholder="选择预警级别">
              <el-option label="全部" value=""></el-option>
              <el-option label="紧急" value="urgent"></el-option>
              <el-option label="重要" value="important"></el-option>
              <el-option label="一般" value="normal"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select v-model="alertStatus" placeholder="选择处理状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="未处理" value="unprocessed"></el-option>
              <el-option label="已处理" value="processed"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 15px;">
          <el-col :span="8">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 预警统计 -->
    <div class="alert-stats">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ totalAlerts }}</div>
              <div class="stat-label">总预警数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ unprocessedAlerts }}</div>
              <div class="stat-label">未处理预警</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ urgentAlerts }}</div>
              <div class="stat-label">紧急预警</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ processedAlerts }}</div>
              <div class="stat-label">已处理预警</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 预警列表 -->
    <div class="alert-list">
      <el-card shadow="hover">
        <el-table :data="filteredAlerts" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="预警ID" width="100"></el-table-column>
          <el-table-column prop="title" label="预警标题"></el-table-column>
          <el-table-column prop="type" label="预警类型" width="120"></el-table-column>
          <el-table-column prop="level" label="预警级别" width="100">
            <template #default="scope">
              <el-tag :type="getLevelType(scope.row.level)">{{ scope.row.levelText }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="预警时间" width="180"></el-table-column>
          <el-table-column prop="status" label="处理状态" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'processed' ? 'success' : 'warning'">
                {{ scope.row.status === 'processed' ? '已处理' : '未处理' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button size="small" @click="viewAlert(scope.row)">查看</el-button>
              <el-button v-if="scope.row.status === 'unprocessed'" type="success" size="small" @click="processAlert(scope.row)">处理</el-button>
              <el-button v-else type="info" size="small" @click="viewProcessRecord(scope.row)">查看处理记录</el-button>
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
    
    <!-- 预警详情弹窗 -->
    <el-dialog
      v-model="alertDetailVisible"
      title="预警详情"
      width="800px"
    >
      <el-form label-position="top" v-loading="loading">
        <el-form-item label="预警信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="预警ID">
                <el-input v-model="currentAlert.id" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预警标题">
                <el-input v-model="currentAlert.title" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="预警类型">
                <el-input v-model="currentAlert.type" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预警级别">
                <el-input v-model="currentAlert.levelText" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="预警时间">
                <el-input v-model="currentAlert.time" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="处理状态">
                <el-input :value="currentAlert.status === 'processed' ? '已处理' : '未处理'" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="currentAlert.processTime">
            <el-col :span="12">
              <el-form-item label="处理时间">
                <el-input v-model="currentAlert.processTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="处理人">
                <el-input v-model="currentAlert.processor" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="预警内容">
          <el-input
            v-model="currentAlert.content"
            type="textarea"
            :rows="4"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="处理记录" v-if="currentAlert.processRecord">
          <el-input
            v-model="currentAlert.processRecord"
            type="textarea"
            :rows="4"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="alertDetailVisible = false">关闭</el-button>
          <el-button v-if="currentAlert.status === 'unprocessed'" type="success" @click="openProcessDialog">处理预警</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 处理预警弹窗 -->
    <el-dialog
      v-model="processDialogVisible"
      title="处理预警"
      width="600px"
    >
      <el-form
        :model="processForm"
        :rules="processFormRules"
        ref="processFormRef"
        label-position="top"
        v-loading="loading"
      >
        <el-form-item label="处理信息">
          <el-form-item label="处理方式" prop="processMethod">
            <el-select v-model="processForm.processMethod" placeholder="选择处理方式">
              <el-option label="立即处理" value="immediate"></el-option>
              <el-option label="稍后处理" value="later"></el-option>
              <el-option label="忽略" value="ignore"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理备注" prop="processRecord">
            <el-input
              v-model="processForm.processRecord"
              type="textarea"
              :rows="4"
              placeholder="请输入处理备注"
            ></el-input>
          </el-form-item>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="processDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitProcessForm">确认处理</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 处理记录弹窗 -->
    <el-dialog
      v-model="processRecordVisible"
      title="处理记录"
      width="600px"
    >
      <el-form label-position="top" v-loading="loading">
        <el-form-item label="处理信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="处理时间">
                <el-input v-model="processRecord.processTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="处理人">
                <el-input v-model="processRecord.processor" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="处理方式">
                <el-input v-model="processRecord.processMethod" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="处理备注">
          <el-input
            v-model="processRecord.processRecord"
            type="textarea"
            :rows="4"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="processRecordVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 预警筛选
const alertType = ref('')
const alertLevel = ref('')
const alertStatus = ref('')
const dateRange = ref([])

// 加载状态
const loading = ref(false)

// 预警数据
const alerts = ref([
  { id: 1, title: '销售数据异常', type: '销售异常', level: 'urgent', levelText: '紧急', time: '2026-04-01 15:30', status: 'unprocessed', content: '北京旗舰店销售数据较昨日下降50%，异常波动' },
  { id: 2, title: '库存不足预警', type: '库存异常', level: 'important', levelText: '重要', time: '2026-04-01 14:20', status: 'unprocessed', content: '书柜库存不足，当前库存仅剩余5件' },
  { id: 3, title: '客户流失预警', type: '客户异常', level: 'normal', levelText: '一般', time: '2026-04-01 10:15', status: 'processed', content: '本月客户流失率较上月上升10%', processTime: '2026-04-01 11:00', processor: 'admin', processMethod: '立即处理', processRecord: '已联系市场部门分析原因并制定挽回计划' },
  { id: 4, title: '门店业绩预警', type: '门店异常', level: 'important', levelText: '重要', time: '2026-03-31 16:45', status: 'processed', content: '上海体验店连续3天业绩未达标', processTime: '2026-04-01 09:30', processor: 'admin', processMethod: '立即处理', processRecord: '已与门店经理沟通，了解情况并提供销售支持' },
  { id: 5, title: '销售数据异常', type: '销售异常', level: 'normal', levelText: '一般', time: '2026-03-31 13:20', status: 'unprocessed', content: '广州专卖店销售数据波动较大' }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗状态
const alertDetailVisible = ref(false)
const processDialogVisible = ref(false)
const processRecordVisible = ref(false)

// 当前预警
const currentAlert = ref({})

// 处理表单
const processForm = ref({
  processMethod: '',
  processRecord: ''
})

// 处理记录
const processRecord = ref({})

// 表单验证规则
const processFormRules = {
  processMethod: [{ required: true, message: '请选择处理方式', trigger: 'change' }],
  processRecord: [{ required: true, message: '请输入处理备注', trigger: 'blur' }]
}

// 表单引用
const processFormRef = ref(null)

// 过滤后的预警列表
const filteredAlerts = computed(() => {
  let result = [...alerts.value]
  
  // 类型过滤
  if (alertType.value) {
    result = result.filter(alert => alert.type === alertType.value)
  }
  
  // 级别过滤
  if (alertLevel.value) {
    result = result.filter(alert => alert.level === alertLevel.value)
  }
  
  // 状态过滤
  if (alertStatus.value) {
    result = result.filter(alert => alert.status === alertStatus.value)
  }
  
  // 日期过滤
  if (dateRange.value && dateRange.value.length === 2) {
    const startDate = new Date(dateRange.value[0])
    const endDate = new Date(dateRange.value[1])
    result = result.filter(alert => {
      const alertDate = new Date(alert.time.split(' ')[0])
      return alertDate >= startDate && alertDate <= endDate
    })
  }
  
  return result
})

// 统计数据
const totalAlerts = computed(() => alerts.value.length)
const unprocessedAlerts = computed(() => alerts.value.filter(a => a.status === 'unprocessed').length)
const urgentAlerts = computed(() => alerts.value.filter(a => a.level === 'urgent').length)
const processedAlerts = computed(() => alerts.value.filter(a => a.status === 'processed').length)

// 获取级别类型
const getLevelType = (level) => {
  switch (level) {
    case 'urgent':
      return 'danger'
    case 'important':
      return 'warning'
    case 'normal':
      return 'info'
    default:
      return 'info'
  }
}

// 搜索
const search = () => {
  loading.value = true
  // 模拟搜索逻辑
  setTimeout(() => {
    // 实际项目中这里应该调用API获取数据
    console.log(`搜索预警：类型=${alertType.value}，级别=${alertLevel.value}，状态=${alertStatus.value}，日期范围=${dateRange.value}`)
    ElMessage.success('搜索成功')
    loading.value = false
  }, 500)
}

// 重置
const reset = () => {
  alertType.value = ''
  alertLevel.value = ''
  alertStatus.value = ''
  dateRange.value = []
  ElMessage.info('搜索条件已重置')
}

// 刷新预警
const refreshAlerts = () => {
  loading.value = true
  // 模拟刷新数据
  setTimeout(() => {
    // 实际项目中这里应该调用API获取最新数据
    ElMessage.success('预警数据已刷新')
    loading.value = false
  }, 1000)
}

// 查看预警
const viewAlert = (alert) => {
  loading.value = true
  // 模拟获取预警详情
  setTimeout(() => {
    currentAlert.value = { ...alert }
    alertDetailVisible.value = true
    loading.value = false
  }, 500)
}

// 打开处理弹窗
const openProcessDialog = () => {
  processForm.value = {
    processMethod: '',
    processRecord: ''
  }
  processDialogVisible.value = true
}

// 处理预警
const processAlert = (alert) => {
  currentAlert.value = { ...alert }
  openProcessDialog()
}

// 提交处理表单
const submitProcessForm = () => {
  if (!processFormRef.value) return
  
  processFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟处理预警逻辑
      setTimeout(() => {
        const index = alerts.value.findIndex(a => a.id === currentAlert.value.id)
        if (index !== -1) {
          alerts.value[index] = {
            ...alerts.value[index],
            status: 'processed',
            processTime: new Date().toLocaleString('zh-CN'),
            processor: 'admin',
            processMethod: processForm.value.processMethod === 'immediate' ? '立即处理' : processForm.value.processMethod === 'later' ? '稍后处理' : '忽略',
            processRecord: processForm.value.processRecord
          }
          ElMessage.success('预警处理成功')
        }
        processDialogVisible.value = false
        alertDetailVisible.value = false
        loading.value = false
      }, 1000)
    }
  })
}

// 查看处理记录
const viewProcessRecord = (alert) => {
  processRecord.value = {
    processTime: alert.processTime,
    processor: alert.processor,
    processMethod: alert.processMethod,
    processRecord: alert.processRecord
  }
  processRecordVisible.value = true
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  // 实际项目中这里应该调用API获取对应页的数据
  console.log(`切换到第 ${page} 页`)
  ElMessage.info(`切换到第 ${page} 页`)
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  loading.value = true
  setTimeout(() => {
    // 数据加载完成
    console.log('异常预警数据加载完成')
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.headquarters-data-alerts {
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

.alert-filter {
  margin-bottom: 20px;
}

.alert-stats {
  margin-bottom: 20px;
}

.stat-card {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.alert-list {
  margin-bottom: 20px;
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