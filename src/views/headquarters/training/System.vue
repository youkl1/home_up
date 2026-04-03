<template>
  <div class="headquarters-training-system">
    <div class="page-header">
      <h1>培训体系管理</h1>
      <el-button type="primary" @click="addSystem">添加培训计划</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索培训计划名称" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="systemType" placeholder="选择培训类型">
              <el-option label="全部" value=""></el-option>
              <el-option label="新员工培训" value="新员工培训"></el-option>
              <el-option label="在职培训" value="在职培训"></el-option>
              <el-option label="晋升培训" value="晋升培训"></el-option>
              <el-option label="专项培训" value="专项培训"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 培训计划列表 -->
    <div class="system-list">
      <el-card shadow="hover">
        <el-table :data="trainingSystems" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="计划ID" width="100"></el-table-column>
          <el-table-column prop="name" label="培训计划名称"></el-table-column>
          <el-table-column prop="type" label="培训类型" width="120"></el-table-column>
          <el-table-column prop="target" label="培训对象" width="150"></el-table-column>
          <el-table-column prop="duration" label="培训周期" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.statusText }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewSystem(scope.row)">查看</el-button>
              <el-button type="warning" size="small" @click="editSystem(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteSystem(scope.row.id)">删除</el-button>
              <el-button type="info" size="small" @click="toggleStatus(scope.row)">
                {{ scope.row.status === 'active' ? '暂停' : '启动' }}
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
    
    <!-- 培训计划详情弹窗 -->
    <el-dialog
      v-model="systemDetailDialogVisible"
      title="培训计划详情"
      width="600px"
    >
      <el-form label-position="top" v-loading="loading">
        <el-form-item label="培训计划信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="计划ID">
                <el-input v-model="currentSystem.id" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="培训计划名称">
                <el-input v-model="currentSystem.name" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="培训类型">
                <el-input v-model="currentSystem.type" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="培训对象">
                <el-input v-model="currentSystem.target" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="培训周期">
                <el-input v-model="currentSystem.duration" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态">
                <el-input v-model="currentSystem.statusText" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="培训目标">
          <el-input
            v-model="currentSystem.objective"
            type="textarea"
            :rows="4"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="培训内容">
          <el-input
            v-model="currentSystem.content"
            type="textarea"
            :rows="4"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="考核标准">
          <el-input
            v-model="currentSystem.assessment"
            type="textarea"
            :rows="4"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="systemDetailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 添加/编辑培训计划弹窗 -->
    <el-dialog
      v-model="systemFormDialogVisible"
      :title="isEdit ? '编辑培训计划' : '添加培训计划'"
      width="600px"
    >
      <el-form
        :model="systemForm"
        :rules="systemFormRules"
        ref="systemFormRef"
        label-position="top"
        v-loading="loading"
      >
        <el-form-item label="培训计划信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="培训计划名称" prop="name">
                <el-input v-model="systemForm.name" placeholder="请输入培训计划名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="培训类型" prop="type">
                <el-select v-model="systemForm.type" placeholder="请选择培训类型">
                  <el-option label="新员工培训" value="新员工培训"></el-option>
                  <el-option label="在职培训" value="在职培训"></el-option>
                  <el-option label="晋升培训" value="晋升培训"></el-option>
                  <el-option label="专项培训" value="专项培训"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="培训对象" prop="target">
                <el-input v-model="systemForm.target" placeholder="请输入培训对象"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="培训周期" prop="duration">
                <el-input v-model="systemForm.duration" placeholder="请输入培训周期，如：2周"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="systemForm.status" placeholder="请选择状态">
                  <el-option label="计划中" value="planned"></el-option>
                  <el-option label="进行中" value="active"></el-option>
                  <el-option label="已完成" value="completed"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="培训目标" prop="objective">
          <el-input
            v-model="systemForm.objective"
            type="textarea"
            :rows="4"
            placeholder="请输入培训目标"
          ></el-input>
        </el-form-item>
        <el-form-item label="培训内容" prop="content">
          <el-input
            v-model="systemForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入培训内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="考核标准" prop="assessment">
          <el-input
            v-model="systemForm.assessment"
            type="textarea"
            :rows="4"
            placeholder="请输入考核标准"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="systemFormDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitSystemForm">保存</el-button>
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
const systemType = ref('')

// 加载状态
const loading = ref(false)

// 培训体系数据
const trainingSystems = ref([
  { id: 1, name: '新员工入职培训', type: '新员工培训', target: '全体新员工', duration: '2周', status: 'active', statusText: '进行中', objective: '帮助新员工快速融入公司文化，了解公司制度和产品知识', content: '公司文化、规章制度、产品知识、服务规范等', assessment: '考试成绩达到80分以上' },
  { id: 2, name: '销售技能提升培训', type: '在职培训', target: '销售人员', duration: '1个月', status: 'active', statusText: '进行中', objective: '提升销售人员的销售技巧和客户沟通能力', content: '销售技巧、客户需求分析、产品演示、异议处理等', assessment: '销售业绩提升20%' },
  { id: 3, name: '店长晋升培训', type: '晋升培训', target: '储备店长', duration: '3个月', status: 'planned', statusText: '计划中', objective: '培养具备管理能力的店长候选人', content: '团队管理、销售管理、库存管理、客户服务等', assessment: '综合考核成绩达到85分以上' },
  { id: 4, name: '产品知识专项培训', type: '专项培训', target: '全体员工', duration: '2周', status: 'completed', statusText: '已完成', objective: '全面了解公司产品的功能和特点', content: '产品功能、技术参数、应用场景、竞品分析等', assessment: '产品知识考试成绩达到90分以上' },
  { id: 5, name: '服务规范培训', type: '在职培训', target: '服务人员', duration: '1周', status: 'active', statusText: '进行中', objective: '规范服务流程，提升服务质量', content: '服务标准、沟通技巧、问题处理、客户投诉应对等', assessment: '服务满意度达到95%以上' }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗状态
const systemDetailDialogVisible = ref(false)
const systemFormDialogVisible = ref(false)
const isEdit = ref(false)

// 当前培训计划
const currentSystem = ref({})

// 培训计划表单
const systemForm = ref({
  name: '',
  type: '',
  target: '',
  duration: '',
  status: 'planned',
  objective: '',
  content: '',
  assessment: ''
})

// 表单验证规则
const systemFormRules = {
  name: [{ required: true, message: '请输入培训计划名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择培训类型', trigger: 'change' }],
  target: [{ required: true, message: '请输入培训对象', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入培训周期', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  objective: [{ required: true, message: '请输入培训目标', trigger: 'blur' }],
  content: [{ required: true, message: '请输入培训内容', trigger: 'blur' }],
  assessment: [{ required: true, message: '请输入考核标准', trigger: 'blur' }]
}

// 表单引用
const systemFormRef = ref(null)

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'planned':
      return 'warning'
    case 'completed':
      return 'info'
    default:
      return 'info'
  }
}

// 搜索
const search = () => {
  loading.value = true
  // 模拟搜索逻辑
  const keyword = searchKeyword.value.toLowerCase()
  const type = systemType.value
  
  // 模拟API调用
  setTimeout(() => {
    // 实际项目中这里应该调用API获取数据
    console.log(`搜索培训计划：${keyword}，类型：${type}`)
    ElMessage.success(`搜索培训计划：${keyword}，类型：${type}`)
    loading.value = false
  }, 500)
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  systemType.value = ''
  ElMessage.info('搜索条件已重置')
}

// 查看培训计划
const viewSystem = (system) => {
  loading.value = true
  // 模拟API调用获取培训计划详情
  setTimeout(() => {
    currentSystem.value = { ...system }
    systemDetailDialogVisible.value = true
    loading.value = false
  }, 500)
}

// 编辑培训计划
const editSystem = (system) => {
  isEdit.value = true
  systemForm.value = { ...system }
  systemFormDialogVisible.value = true
}

// 删除培训计划
const deleteSystem = (systemId) => {
  // 确认删除
  ElMessageBox.confirm('确定要删除该培训计划吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true
    // 模拟删除逻辑
    setTimeout(() => {
      const index = trainingSystems.value.findIndex(s => s.id === systemId)
      if (index !== -1) {
        trainingSystems.value.splice(index, 1)
        total.value--
        ElMessage.success('培训计划删除成功')
      }
      loading.value = false
    }, 500)
  }).catch(() => {
    // 取消删除
    ElMessage.info('已取消删除操作')
  })
}

// 切换培训计划状态
const toggleStatus = (system) => {
  loading.value = true
  // 模拟状态切换逻辑
  setTimeout(() => {
    if (system.status === 'active') {
      system.status = 'planned'
      system.statusText = '计划中'
      ElMessage.success('培训计划已暂停')
    } else if (system.status === 'planned') {
      system.status = 'active'
      system.statusText = '进行中'
      ElMessage.success('培训计划已启动')
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

// 添加培训计划
const addSystem = () => {
  isEdit.value = false
  systemForm.value = {
    name: '',
    type: '',
    target: '',
    duration: '',
    status: 'planned',
    objective: '',
    content: '',
    assessment: ''
  }
  systemFormDialogVisible.value = true
}

// 提交培训计划表单
const submitSystemForm = () => {
  if (!systemFormRef.value) return
  
  systemFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟API调用
      setTimeout(() => {
        if (isEdit.value) {
          // 编辑培训计划
          const index = trainingSystems.value.findIndex(s => s.id === systemForm.value.id)
          if (index !== -1) {
            // 更新状态文本
            const statusMap = {
              planned: '计划中',
              active: '进行中',
              completed: '已完成'
            }
            systemForm.value.statusText = statusMap[systemForm.value.status]
            trainingSystems.value[index] = { ...systemForm.value }
            ElMessage.success('培训计划编辑成功')
          }
        } else {
          // 添加培训计划
          const statusMap = {
            planned: '计划中',
            active: '进行中',
            completed: '已完成'
          }
          const newSystem = {
            ...systemForm.value,
            id: trainingSystems.value.length + 1,
            statusText: statusMap[systemForm.value.status]
          }
          trainingSystems.value.unshift(newSystem)
          total.value++
          ElMessage.success('培训计划添加成功')
        }
        systemFormDialogVisible.value = false
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
    console.log('培训体系数据加载完成')
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.headquarters-training-system {
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

.system-list {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>