<template>
  <div class="headquarters-training-activities">
    <div class="page-header">
      <h1>线下活动管理</h1>
      <el-button type="primary" @click="addActivity">添加活动</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索活动名称" prefix-icon="el-icon-search"></el-input>
          </el-col>
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
    
    <!-- 活动列表 -->
    <div class="activity-list">
      <el-card shadow="hover">
        <el-table :data="activities" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="活动ID" width="100"></el-table-column>
          <el-table-column prop="name" label="活动名称"></el-table-column>
          <el-table-column prop="location" label="活动地点" width="150"></el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="180"></el-table-column>
          <el-table-column prop="endTime" label="结束时间" width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.statusText }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewActivity(scope.row)">查看</el-button>
              <el-button type="warning" size="small" @click="editActivity(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteActivity(scope.row.id)">删除</el-button>
              <el-button type="info" size="small" @click="toggleStatus(scope.row)">
                {{ scope.row.status === 'upcoming' ? '开始' : scope.row.status === 'ongoing' ? '结束' : '重新开始' }}
              </el-button>
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
    
    <!-- 活动详情弹窗 -->
    <el-dialog
      v-model="activityDetailDialogVisible"
      title="活动详情"
      width="600px"
    >
      <el-form label-position="top" v-loading="loading">
        <el-form-item label="活动信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="活动ID">
                <el-input v-model="currentActivity.id" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="活动名称">
                <el-input v-model="currentActivity.name" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="活动地点">
                <el-input v-model="currentActivity.location" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态">
                <el-input v-model="currentActivity.statusText" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="开始时间">
                <el-input v-model="currentActivity.startTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间">
                <el-input v-model="currentActivity.endTime" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="活动描述">
          <el-input
            v-model="currentActivity.description"
            type="textarea"
            :rows="4"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="活动内容">
          <el-input
            v-model="currentActivity.content"
            type="textarea"
            :rows="4"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="参与人员">
          <el-input
            v-model="currentActivity.participants"
            type="textarea"
            :rows="4"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="activityDetailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 添加/编辑活动弹窗 -->
    <el-dialog
      v-model="activityFormDialogVisible"
      :title="isEdit ? '编辑活动' : '添加活动'"
      width="600px"
    >
      <el-form
        :model="activityForm"
        :rules="activityFormRules"
        ref="activityFormRef"
        label-position="top"
        v-loading="loading"
      >
        <el-form-item label="活动信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="活动名称" prop="name">
                <el-input v-model="activityForm.name" placeholder="请输入活动名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="活动地点" prop="location">
                <el-input v-model="activityForm.location" placeholder="请输入活动地点"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="开始时间" prop="startTime">
                <el-datetime-picker
                  v-model="activityForm.startTime"
                  type="datetime"
                  placeholder="选择开始时间"
                  value-format="YYYY-MM-DD HH:mm"
                ></el-datetime-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间" prop="endTime">
                <el-datetime-picker
                  v-model="activityForm.endTime"
                  type="datetime"
                  placeholder="选择结束时间"
                  value-format="YYYY-MM-DD HH:mm"
                ></el-datetime-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="activityForm.status" placeholder="请选择状态">
                  <el-option label="即将开始" value="upcoming"></el-option>
                  <el-option label="进行中" value="ongoing"></el-option>
                  <el-option label="已完成" value="completed"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="活动描述" prop="description">
          <el-input
            v-model="activityForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入活动描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动内容" prop="content">
          <el-input
            v-model="activityForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入活动内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="参与人员" prop="participants">
          <el-input
            v-model="activityForm.participants"
            type="textarea"
            :rows="4"
            placeholder="请输入参与人员，多个人员用逗号分隔"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="activityFormDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitActivityForm">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const dateRange = ref([])

// 加载状态
const loading = ref(false)

// 活动数据
const activities = ref([
  { id: 1, name: '产品知识培训大会', location: '北京总部', startTime: '2026-04-10 09:00', endTime: '2026-04-10 17:00', status: 'upcoming', statusText: '即将开始', description: '全面介绍公司产品的最新功能和技术特点', content: '产品功能讲解、技术演示、互动问答等环节', participants: '全体销售人员、技术支持人员' },
  { id: 2, name: '销售技巧分享会', location: '上海分公司', startTime: '2026-04-05 14:00', endTime: '2026-04-05 16:00', status: 'upcoming', statusText: '即将开始', description: '分享销售经验和技巧，提升销售团队的业绩', content: '成功案例分享、销售技巧培训、角色扮演等', participants: '上海区域销售人员' },
  { id: 3, name: '服务规范培训', location: '广州分公司', startTime: '2026-03-25 09:00', endTime: '2026-03-25 12:00', status: 'completed', statusText: '已完成', description: '规范服务流程，提升服务质量', content: '服务标准讲解、服务流程演示、服务技巧培训等', participants: '广州区域服务人员' },
  { id: 4, name: '企业文化宣讲会', location: '深圳分公司', startTime: '2026-03-20 10:00', endTime: '2026-03-20 11:30', status: 'completed', statusText: '已完成', description: '宣讲公司企业文化和价值观', content: '公司历史介绍、核心价值观讲解、员工分享等', participants: '深圳区域全体员工' },
  { id: 5, name: '店长管理培训', location: '北京总部', startTime: '2026-04-15 09:00', endTime: '2026-04-16 17:00', status: 'upcoming', statusText: '即将开始', description: '提升店长的管理能力和业务水平', content: '团队管理、销售管理、库存管理、客户服务等培训', participants: '全国各门店店长' }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗状态
const activityDetailDialogVisible = ref(false)
const activityFormDialogVisible = ref(false)
const isEdit = ref(false)

// 当前活动
const currentActivity = ref({})

// 活动表单
const activityForm = ref({
  name: '',
  location: '',
  startTime: '',
  endTime: '',
  status: 'upcoming',
  description: '',
  content: '',
  participants: ''
})

// 表单验证规则
const activityFormRules = {
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  location: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  description: [{ required: true, message: '请输入活动描述', trigger: 'blur' }],
  content: [{ required: true, message: '请输入活动内容', trigger: 'blur' }],
  participants: [{ required: true, message: '请输入参与人员', trigger: 'blur' }]
}

// 表单引用
const activityFormRef = ref(null)

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case 'upcoming':
      return 'warning'
    case 'ongoing':
      return 'primary'
    case 'completed':
      return 'success'
    default:
      return 'info'
  }
}

// 搜索
const search = () => {
  loading.value = true
  // 模拟搜索逻辑
  const keyword = searchKeyword.value.toLowerCase()
  const [startDate, endDate] = dateRange.value
  
  // 模拟API调用
  setTimeout(() => {
    // 实际项目中这里应该调用API获取数据
    console.log(`搜索活动：${keyword}，日期范围：${startDate} 至 ${endDate}`)
    ElMessage.success(`搜索活动：${keyword}，日期范围：${startDate} 至 ${endDate}`)
    loading.value = false
  }, 500)
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  dateRange.value = []
  ElMessage.info('搜索条件已重置')
}

// 查看活动
const viewActivity = (activity) => {
  loading.value = true
  // 模拟API调用获取活动详情
  setTimeout(() => {
    currentActivity.value = { ...activity }
    activityDetailDialogVisible.value = true
    loading.value = false
  }, 500)
}

// 编辑活动
const editActivity = (activity) => {
  isEdit.value = true
  activityForm.value = { ...activity }
  activityFormDialogVisible.value = true
}

// 删除活动
const deleteActivity = (activityId) => {
  // 确认删除
  ElMessageBox.confirm('确定要删除该活动吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true
    // 模拟删除逻辑
    setTimeout(() => {
      const index = activities.value.findIndex(a => a.id === activityId)
      if (index !== -1) {
        activities.value.splice(index, 1)
        total.value--
        ElMessage.success('活动删除成功')
      }
      loading.value = false
    }, 500)
  }).catch(() => {
    // 取消删除
    ElMessage.info('已取消删除操作')
  })
}

// 切换活动状态
const toggleStatus = (activity) => {
  loading.value = true
  // 模拟状态切换逻辑
  setTimeout(() => {
    if (activity.status === 'upcoming') {
      activity.status = 'ongoing'
      activity.statusText = '进行中'
      ElMessage.success('活动已开始')
    } else if (activity.status === 'ongoing') {
      activity.status = 'completed'
      activity.statusText = '已完成'
      ElMessage.success('活动已结束')
    } else if (activity.status === 'completed') {
      activity.status = 'upcoming'
      activity.statusText = '即将开始'
      ElMessage.success('活动已重新设置为即将开始')
    }
    loading.value = false
  }, 500)
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  // 实际项目中这里应该调用API获取对应页的数据
  console.log(`切换到第 ${page} 页`)
  ElMessage.info(`切换到第 ${page} 页`)
}

// 添加活动
const addActivity = () => {
  isEdit.value = false
  activityForm.value = {
    name: '',
    location: '',
    startTime: '',
    endTime: '',
    status: 'upcoming',
    description: '',
    content: '',
    participants: ''
  }
  activityFormDialogVisible.value = true
}

// 提交活动表单
const submitActivityForm = () => {
  if (!activityFormRef.value) return
  
  activityFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟API调用
      setTimeout(() => {
        if (isEdit.value) {
          // 编辑活动
          const index = activities.value.findIndex(a => a.id === activityForm.value.id)
          if (index !== -1) {
            // 更新状态文本
            const statusMap = {
              upcoming: '即将开始',
              ongoing: '进行中',
              completed: '已完成'
            }
            activityForm.value.statusText = statusMap[activityForm.value.status]
            activities.value[index] = { ...activityForm.value }
            ElMessage.success('活动编辑成功')
          }
        } else {
          // 添加活动
          const statusMap = {
            upcoming: '即将开始',
            ongoing: '进行中',
            completed: '已完成'
          }
          const newActivity = {
            ...activityForm.value,
            id: activities.value.length + 1,
            statusText: statusMap[activityForm.value.status]
          }
          activities.value.unshift(newActivity)
          total.value++
          ElMessage.success('活动添加成功')
        }
        activityFormDialogVisible.value = false
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
    console.log('活动数据加载完成')
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.headquarters-training-activities {
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

.activity-list {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>