<template>
  <div class="headquarters-activities">
    <div class="page-header">
      <h1>总部活动承接</h1>
    </div>
    
    <!-- 活动列表 -->
    <div class="activities-list">
      <el-card shadow="hover">
        <div class="filter-section">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input v-model="searchKeyword" placeholder="搜索活动名称" prefix-icon="Search"></el-input>
            </el-col>
            <el-col :span="8">
              <el-select v-model="activityStatus" placeholder="活动状态">
                <el-option label="全部" value=""></el-option>
                <el-option label="进行中" value="ongoing"></el-option>
                <el-option label="已结束" value="ended"></el-option>
                <el-option label="未开始" value="upcoming"></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button @click="reset">重置</el-button>
            </el-col>
          </el-row>
        </div>
        
        <el-table :data="activities" style="width: 100%">
          <el-table-column prop="id" label="活动ID" width="120"></el-table-column>
          <el-table-column prop="name" label="活动名称"></el-table-column>
          <el-table-column prop="type" label="活动类型" width="120"></el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="180"></el-table-column>
          <el-table-column prop="endTime" label="结束时间" width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row.id)">查看详情</el-button>
              <el-button size="small" type="primary" v-if="scope.row.status === 'ongoing'" @click="executeActivity(scope.row.id)">执行活动</el-button>
            </template>
          </el-table-column>
        </el-table>
        
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
    
    <!-- 活动详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="活动详情" width="800px">
      <div class="activity-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="活动ID">{{ selectedActivity.id }}</el-descriptions-item>
          <el-descriptions-item label="活动名称">{{ selectedActivity.name }}</el-descriptions-item>
          <el-descriptions-item label="活动类型">{{ selectedActivity.type }}</el-descriptions-item>
          <el-descriptions-item label="活动状态">
            <el-tag :type="getStatusType(selectedActivity.status)">{{ getStatusText(selectedActivity.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="开始时间">{{ selectedActivity.startTime }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{ selectedActivity.endTime }}</el-descriptions-item>
        </el-descriptions>
        
        <div class="activity-content">
          <h3>活动内容</h3>
          <p>{{ selectedActivity.content }}</p>
        </div>
        
        <div class="activity-rules">
          <h3>活动规则</h3>
          <ul>
            <li v-for="(rule, index) in selectedActivity.rules" :key="index">{{ rule }}</li>
          </ul>
        </div>
        
        <div class="activity-materials">
          <h3>活动物料</h3>
          <div class="materials-list">
            <el-tag v-for="(material, index) in selectedActivity.materials" :key="index" class="material-tag">
              {{ material }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 执行活动弹窗 -->
    <el-dialog
      v-model="executeDialogVisible"
      title="执行活动"
      width="700px"
    >
      <div class="execute-activity">
        <!-- 活动基本信息 -->
        <el-descriptions :column="2" border class="mb-4">
          <el-descriptions-item label="活动ID">{{ executingActivity.id }}</el-descriptions-item>
          <el-descriptions-item label="活动名称">{{ executingActivity.name }}</el-descriptions-item>
          <el-descriptions-item label="活动类型">{{ executingActivity.type }}</el-descriptions-item>
          <el-descriptions-item label="活动状态">
            <el-tag :type="getStatusType(executingActivity.status)">{{ getStatusText(executingActivity.status) }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 执行表单 -->
        <el-form :model="executeForm" label-width="120px">
          <el-form-item label="执行时间">
            <el-date-picker
              v-model="executeForm.executeTime"
              type="datetime"
              placeholder="选择执行时间"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          
          <el-form-item label="执行负责人">
            <el-input v-model="executeForm.responsiblePerson" placeholder="请输入执行负责人"></el-input>
          </el-form-item>
          
          <el-form-item label="执行方式">
            <el-select v-model="executeForm.executeMethod" placeholder="选择执行方式" style="width: 100%">
              <el-option label="线上执行" value="online"></el-option>
              <el-option label="线下执行" value="offline"></el-option>
              <el-option label="混合执行" value="hybrid"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="执行进度">
            <el-steps :active="executeForm.progress" finish-status="success">
              <el-step title="准备阶段" description="活动物料准备"></el-step>
              <el-step title="执行阶段" description="活动现场执行"></el-step>
              <el-step title="收尾阶段" description="活动总结与反馈"></el-step>
            </el-steps>
          </el-form-item>
          
          <el-form-item label="执行备注">
            <el-input type="textarea" v-model="executeForm.remark" :rows="4" placeholder="请输入执行备注"></el-input>
          </el-form-item>
          
          <el-form-item label="执行凭证">
            <el-upload
              class="upload-demo"
              action="#"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="executeForm.attachments"
              :auto-upload="false"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  只能上传图片文件，且不超过5MB
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>

        <!-- 执行记录 -->
        <div v-if="executingActivity.executionRecords && executingActivity.executionRecords.length > 0" class="execution-records">
          <h3 class="mb-2">执行记录</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(record, index) in executingActivity.executionRecords"
              :key="index"
              :timestamp="record.time"
              :type="record.type"
            >
              <div class="timeline-content">
                <div class="timeline-title">{{ record.title }}</div>
                <div class="timeline-desc">{{ record.description }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="executeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitExecute">提交执行</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const searchKeyword = ref('')
const activityStatus = ref('')
const activities = ref([
  { id: 'ACT001', name: '春季家装节', type: '促销活动', startTime: '2026-04-01 00:00', endTime: '2026-04-30 23:59', status: 'ongoing', content: '全场家具8折起，满10000减1000', rules: ['满10000减1000', '满20000减2500', '满50000减7000'], materials: ['海报', '宣传单', '展架', '优惠券'] },
  { id: 'ACT002', name: '五一劳动节特惠', type: '节日活动', startTime: '2026-05-01 00:00', endTime: '2026-05-05 23:59', status: 'upcoming', content: '劳动节特惠活动，全场5折起', rules: ['全场5折起', '满额赠礼', '免费设计'], materials: ['海报', '展架', '礼品'] },
  { id: 'ACT003', name: '新年开门红', type: '促销活动', startTime: '2026-01-01 00:00', endTime: '2026-01-31 23:59', status: 'ended', content: '新年开门红活动，全场6折起', rules: ['全场6折起', '满额抽奖'], materials: ['海报', '宣传单'] }
])

const total = ref(3)
const pageSize = ref(10)
const currentPage = ref(1)
const detailDialogVisible = ref(false)
const selectedActivity = ref({
  id: '',
  name: '',
  type: '',
  status: '',
  startTime: '',
  endTime: '',
  content: '',
  rules: [],
  materials: []
})

// 执行活动弹窗
const executeDialogVisible = ref(false)
const executingActivity = ref({
  id: '',
  name: '',
  type: '',
  status: '',
  executionRecords: []
})

// 执行表单
const executeForm = ref({
  executeTime: new Date(),
  responsiblePerson: '',
  executeMethod: 'online',
  progress: 0,
  remark: '',
  attachments: []
})

const getStatusType = (status) => {
  const typeMap = { ongoing: 'success', ended: 'info', upcoming: 'warning' }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = { ongoing: '进行中', ended: '已结束', upcoming: '未开始' }
  return textMap[status] || status
}

const search = () => {
  ElMessage.success('搜索功能开发中')
}

const reset = () => {
  searchKeyword.value = ''
  activityStatus.value = ''
}

const viewDetail = (id) => {
  const activity = activities.value.find(item => item.id === id)
  if (activity) {
    selectedActivity.value = { ...activity }
    detailDialogVisible.value = true
  }
}

const executeActivity = (id) => {
  const activity = activities.value.find(item => item.id === id)
  if (activity) {
    executingActivity.value = {
      ...activity,
      executionRecords: [
        {
          time: new Date().toISOString().slice(0, 19).replace('T', ' '),
          type: 'primary',
          title: '开始执行',
          description: `开始执行活动：${activity.name}`
        }
      ]
    }
    executeForm.value = {
      executeTime: new Date(),
      responsiblePerson: '',
      executeMethod: 'online',
      progress: 0,
      remark: '',
      attachments: []
    }
    executeDialogVisible.value = true
  }
}

const submitExecute = () => {
  // 模拟提交执行记录
  console.log('提交执行记录:', executeForm.value)
  
  // 添加执行记录
  executingActivity.value.executionRecords.push({
    time: new Date().toISOString().slice(0, 19).replace('T', ' '),
    type: 'success',
    title: '执行更新',
    description: `执行进度更新至${['准备阶段', '执行阶段', '收尾阶段'][executeForm.value.progress]}`
  })
  
  ElMessage.success('活动执行记录提交成功')
  executeDialogVisible.value = false
}

const handlePreview = (file) => {
  console.log('预览文件:', file)
}

const handleRemove = (file, fileList) => {
  console.log('移除文件:', file, fileList)
  executeForm.value.attachments = fileList
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

onMounted(() => {
  console.log('[HeadquartersActivities] 组件挂载')
})
</script>

<style scoped>
.headquarters-activities {
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

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.activity-detail {
  padding: 20px 0;
}

.activity-content,
.activity-rules,
.activity-materials {
  margin-top: 20px;
}

.activity-content h3,
.activity-rules h3,
.activity-materials h3 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}

.materials-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.material-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

/* 执行活动样式 */
.execute-activity {
  padding: 10px 0;
}

.mb-4 {
  margin-bottom: 20px;
}

.execution-records {
  margin-top: 20px;
}

.execution-records h3 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.timeline-content {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-top: 5px;
}

.timeline-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.timeline-desc {
  color: #666;
}

.upload-demo {
  margin-top: 10px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .el-descriptions {
    :deep(.el-descriptions__body) {
      display: flex;
      flex-direction: column;
    }
    :deep(.el-descriptions__row) {
      flex-direction: column;
    }
    :deep(.el-descriptions__cell) {
      width: 100% !important;
    }
  }
}
</style>
