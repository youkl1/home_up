<template>
  <div class="headquarters-marketing-activities">
    <div class="page-header">
      <h1>总部活动管理</h1>
      <el-button type="primary" @click="addActivity">创建活动</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索活动名称" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="activityStatus" placeholder="选择状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="未开始" value="pending"></el-option>
              <el-option label="进行中" value="ongoing"></el-option>
              <el-option label="已结束" value="ended"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 活动列表 -->
    <div class="activities-list">
      <el-card shadow="hover">
        <el-table :data="filteredActivities" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="活动ID" width="80"></el-table-column>
          <el-table-column prop="name" label="活动名称"></el-table-column>
          <el-table-column prop="type" label="活动类型" width="120"></el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="180"></el-table-column>
          <el-table-column prop="endTime" label="结束时间" width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.statusText }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="participants" label="参与人数" width="100"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="viewActivity(scope.row)">查看</el-button>
              <el-button type="primary" size="small" @click="editActivity(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteActivity(scope.row.id)">删除</el-button>
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
      v-model="activityDetailVisible"
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
              <el-form-item label="活动类型">
                <el-input v-model="currentActivity.type" disabled></el-input>
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
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="参与人数">
                <el-input v-model="currentActivity.participants" disabled></el-input>
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
        <el-form-item label="活动规则">
          <el-input
            v-model="currentActivity.rules"
            type="textarea"
            :rows="4"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="activityDetailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 添加/编辑活动弹窗 -->
    <el-dialog
      v-model="activityFormDialogVisible"
      :title="isEdit ? '编辑活动' : '创建活动'"
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
              <el-form-item label="活动类型" prop="type">
                <el-select v-model="activityForm.type" placeholder="请选择活动类型">
                  <el-option label="促销活动" value="促销活动"></el-option>
                  <el-option label="品牌活动" value="品牌活动"></el-option>
                  <el-option label="会员活动" value="会员活动"></el-option>
                  <el-option label="其他活动" value="其他活动"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                  v-model="activityForm.startTime"
                  type="datetime"
                  placeholder="选择开始时间"
                  value-format="YYYY-MM-DD HH:mm"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                  v-model="activityForm.endTime"
                  type="datetime"
                  placeholder="选择结束时间"
                  value-format="YYYY-MM-DD HH:mm"
                ></el-date-picker>
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
        <el-form-item label="活动规则" prop="rules">
          <el-input
            v-model="activityForm.rules"
            type="textarea"
            :rows="4"
            placeholder="请输入活动规则"
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const activityStatus = ref('')

// 加载状态
const loading = ref(false)

// 活动数据
const activities = ref([
  { id: 1, name: '春季促销活动', type: '促销活动', startTime: '2026-04-01 00:00', endTime: '2026-04-30 23:59', status: 'ongoing', statusText: '进行中', participants: 1256, description: '春季促销活动，全场商品8折起', rules: '1. 活动时间：2026年4月1日-4月30日\n2. 全场商品8折起\n3. 会员享额外95折' },
  { id: 2, name: '新品发布会', type: '品牌活动', startTime: '2026-03-15 14:00', endTime: '2026-03-15 16:00', status: 'ended', statusText: '已结束', participants: 892, description: '2026年春季新品发布会', rules: '1. 活动时间：2026年3月15日14:00-16:00\n2. 仅限邀请嘉宾参加\n3. 现场有抽奖活动' },
  { id: 3, name: '五一特惠活动', type: '促销活动', startTime: '2026-05-01 00:00', endTime: '2026-05-07 23:59', status: 'pending', statusText: '未开始', participants: 0, description: '五一劳动节特惠活动', rules: '1. 活动时间：2026年5月1日-5月7日\n2. 全场商品7折起\n3. 满1000减200' },
  { id: 4, name: '会员专享活动', type: '会员活动', startTime: '2026-03-20 00:00', endTime: '2026-03-27 23:59', status: 'ended', statusText: '已结束', participants: 456, description: '会员专享福利活动', rules: '1. 活动时间：2026年3月20日-3月27日\n2. 仅限会员参加\n3. 会员专享商品5折起' },
  { id: 5, name: '夏季新品预览', type: '品牌活动', startTime: '2026-04-15 10:00', endTime: '2026-04-15 18:00', status: 'pending', statusText: '未开始', participants: 0, description: '2026年夏季新品预览会', rules: '1. 活动时间：2026年4月15日10:00-18:00\n2. 预约制参加\n3. 现场预订享优惠' }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗状态
const activityDetailVisible = ref(false)
const activityFormDialogVisible = ref(false)
const isEdit = ref(false)

// 当前活动
const currentActivity = ref({})

// 活动表单
const activityForm = ref({
  name: '',
  type: '',
  startTime: '',
  endTime: '',
  description: '',
  rules: ''
})

// 表单验证规则
const activityFormRules = {
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  description: [{ required: true, message: '请输入活动描述', trigger: 'blur' }],
  rules: [{ required: true, message: '请输入活动规则', trigger: 'blur' }]
}

// 表单引用
const activityFormRef = ref(null)

// 过滤后的活动列表
const filteredActivities = computed(() => {
  let result = [...activities.value]
  
  // 搜索关键词过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(activity => activity.name.toLowerCase().includes(keyword))
  }
  
  // 状态过滤
  if (activityStatus.value) {
    result = result.filter(activity => activity.status === activityStatus.value)
  }
  
  return result
})

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case 'pending':
      return 'info'
    case 'ongoing':
      return 'success'
    case 'ended':
      return 'danger'
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
    console.log(`搜索活动：${searchKeyword.value}，状态：${activityStatus.value}`)
    ElMessage.success('搜索成功')
    loading.value = false
  }, 500)
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  activityStatus.value = ''
  ElMessage.info('搜索条件已重置')
}

// 查看活动
const viewActivity = (activity) => {
  loading.value = true
  // 模拟API调用获取活动详情
  setTimeout(() => {
    currentActivity.value = { ...activity }
    activityDetailVisible.value = true
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
    type: '',
    startTime: '',
    endTime: '',
    description: '',
    rules: ''
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
            // 更新状态
            const now = new Date().toISOString().replace('T', ' ').substring(0, 16)
            let status = 'pending'
            let statusText = '未开始'
            if (activityForm.value.startTime <= now && activityForm.value.endTime >= now) {
              status = 'ongoing'
              statusText = '进行中'
            } else if (activityForm.value.endTime < now) {
              status = 'ended'
              statusText = '已结束'
            }
            activities.value[index] = {
              ...activityForm.value,
              status,
              statusText
            }
            ElMessage.success('活动编辑成功')
          }
        } else {
          // 添加活动
          const now = new Date().toISOString().replace('T', ' ').substring(0, 16)
          let status = 'pending'
          let statusText = '未开始'
          if (activityForm.value.startTime <= now && activityForm.value.endTime >= now) {
            status = 'ongoing'
            statusText = '进行中'
          } else if (activityForm.value.endTime < now) {
            status = 'ended'
            statusText = '已结束'
          }
          const newActivity = {
            ...activityForm.value,
            id: activities.value.length + 1,
            status,
            statusText,
            participants: 0
          }
          activities.value.unshift(newActivity)
          total.value++
          ElMessage.success('活动创建成功')
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
.headquarters-marketing-activities {
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

.activities-list {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>