<template>
  <div class="headquarters-marketing-tools">
    <div class="page-header">
      <h1>营销工具配置</h1>
      <el-button type="primary" @click="addTool">添加工具</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索工具名称" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="toolType" placeholder="选择工具类型">
              <el-option label="全部" value=""></el-option>
              <el-option label="促销工具" value="促销工具"></el-option>
              <el-option label="活动工具" value="活动工具"></el-option>
              <el-option label="客户工具" value="客户工具"></el-option>
              <el-option label="分析工具" value="分析工具"></el-option>
              <el-option label="推广工具" value="推广工具"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 工具列表 -->
    <div class="tools-list">
      <el-card shadow="hover">
        <el-table :data="filteredTools" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="工具ID" width="80"></el-table-column>
          <el-table-column prop="name" label="工具名称"></el-table-column>
          <el-table-column prop="type" label="工具类型" width="120"></el-table-column>
          <el-table-column prop="description" label="工具描述"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getToolStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="viewTool(scope.row)">查看</el-button>
              <el-button type="primary" size="small" @click="editTool(scope.row)">编辑</el-button>
              <el-button :type="getToolStatusType(scope.row.status) === 'success' ? 'warning' : 'success'" size="small" @click="toggleStatus(scope.row)">
                {{ scope.row.status === '启用' ? '禁用' : '启用' }}
              </el-button>
              <el-button type="danger" size="small" @click="deleteTool(scope.row.id)">删除</el-button>
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
    
    <!-- 工具详情弹窗 -->
    <el-dialog
      v-model="toolDetailVisible"
      title="工具详情"
      width="600px"
    >
      <el-form label-position="top" v-loading="loading">
        <el-form-item label="工具信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工具ID">
                <el-input v-model="currentTool.id" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工具名称">
                <el-input v-model="currentTool.name" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工具类型">
                <el-input v-model="currentTool.type" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态">
                <el-input v-model="currentTool.status" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="创建时间">
                <el-input v-model="currentTool.createTime" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="工具描述">
          <el-input
            v-model="currentTool.description"
            type="textarea"
            :rows="4"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="toolDetailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 添加/编辑工具弹窗 -->
    <el-dialog
      v-model="toolFormDialogVisible"
      :title="isEdit ? '编辑工具' : '添加工具'"
      width="600px"
    >
      <el-form
        :model="toolForm"
        :rules="toolFormRules"
        ref="toolFormRef"
        label-position="top"
        v-loading="loading"
      >
        <el-form-item label="工具信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工具名称" prop="name">
                <el-input v-model="toolForm.name" placeholder="请输入工具名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工具类型" prop="type">
                <el-select v-model="toolForm.type" placeholder="请选择工具类型">
                  <el-option label="促销工具" value="促销工具"></el-option>
                  <el-option label="活动工具" value="活动工具"></el-option>
                  <el-option label="客户工具" value="客户工具"></el-option>
                  <el-option label="分析工具" value="分析工具"></el-option>
                  <el-option label="推广工具" value="推广工具"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="toolForm.status" placeholder="请选择状态">
                  <el-option label="启用" value="启用"></el-option>
                  <el-option label="禁用" value="禁用"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="工具描述" prop="description">
          <el-input
            v-model="toolForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入工具描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="toolFormDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitToolForm">保存</el-button>
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
const toolType = ref('')

// 加载状态
const loading = ref(false)

// 工具数据
const tools = ref([
  { id: 1, name: '优惠券生成器', type: '促销工具', description: '用于生成和管理优惠券', status: '启用', createTime: '2026-04-01 10:30' },
  { id: 2, name: '活动报名系统', type: '活动工具', description: '用于活动报名和管理', status: '启用', createTime: '2026-03-31 14:20' },
  { id: 3, name: '客户标签管理', type: '客户工具', description: '用于管理客户标签', status: '启用', createTime: '2026-03-30 09:15' },
  { id: 4, name: '营销数据分析', type: '分析工具', description: '用于分析营销数据', status: '禁用', createTime: '2026-03-29 16:45' },
  { id: 5, name: '社交媒体发布', type: '推广工具', description: '用于社交媒体内容发布', status: '启用', createTime: '2026-03-28 11:00' }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗状态
const toolDetailVisible = ref(false)
const toolFormDialogVisible = ref(false)
const isEdit = ref(false)

// 当前工具
const currentTool = ref({})

// 工具表单
const toolForm = ref({
  name: '',
  type: '',
  status: '启用',
  description: ''
})

// 表单验证规则
const toolFormRules = {
  name: [{ required: true, message: '请输入工具名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择工具类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  description: [{ required: true, message: '请输入工具描述', trigger: 'blur' }]
}

// 表单引用
const toolFormRef = ref(null)

// 获取工具状态类型
const getToolStatusType = (status) => {
  return status === '启用' ? 'success' : 'danger'
}

// 过滤后的工具列表
const filteredTools = computed(() => {
  let result = [...tools.value]
  
  // 搜索关键词过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(tool => tool.name.toLowerCase().includes(keyword))
  }
  
  // 工具类型过滤
  if (toolType.value) {
    result = result.filter(tool => tool.type === toolType.value)
  }
  
  return result
})

// 搜索
const search = () => {
  loading.value = true
  // 模拟搜索逻辑
  setTimeout(() => {
    // 实际项目中这里应该调用API获取数据
    console.log(`搜索工具：${searchKeyword.value}，类型：${toolType.value}`)
    ElMessage.success('搜索成功')
    loading.value = false
  }, 500)
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  toolType.value = ''
  ElMessage.info('搜索条件已重置')
}

// 查看工具
const viewTool = (tool) => {
  loading.value = true
  // 模拟API调用获取工具详情
  setTimeout(() => {
    currentTool.value = { ...tool }
    toolDetailVisible.value = true
    loading.value = false
  }, 500)
}

// 编辑工具
const editTool = (tool) => {
  isEdit.value = true
  toolForm.value.name = tool.name
  toolForm.value.type = tool.type
  toolForm.value.status = tool.status
  toolForm.value.description = tool.description
  toolFormDialogVisible.value = true
}

// 删除工具
const deleteTool = (toolId) => {
  // 确认删除
  ElMessageBox.confirm('确定要删除该工具吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true
    // 模拟删除逻辑
    setTimeout(() => {
      const index = tools.value.findIndex(t => t.id === toolId)
      if (index !== -1) {
        tools.value.splice(index, 1)
        total.value--
        ElMessage.success('工具删除成功')
      }
      loading.value = false
    }, 500)
  }).catch(() => {
    // 取消删除
    ElMessage.info('已取消删除操作')
  })
}

// 切换工具状态
const toggleStatus = (tool) => {
  loading.value = true
  // 模拟状态切换逻辑
  setTimeout(() => {
    tool.status = tool.status === '启用' ? '禁用' : '启用'
    ElMessage.success(`工具已${tool.status}`)
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

// 添加工具
const addTool = () => {
  isEdit.value = false
  toolForm.value = {
    name: '',
    type: '',
    status: '启用',
    description: ''
  }
  toolFormDialogVisible.value = true
}

// 提交工具表单
const submitToolForm = () => {
  if (!toolFormRef.value) return
  
  toolFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟API调用
      setTimeout(() => {
        if (isEdit.value) {
          // 编辑工具
          const index = tools.value.findIndex(t => t.id === toolForm.value.id)
          if (index !== -1) {
            tools.value[index] = { ...toolForm.value }
            ElMessage.success('工具编辑成功')
          }
        } else {
          // 添加工具
          const newTool = {
            ...toolForm.value,
            id: tools.value.length + 1,
            createTime: new Date().toLocaleString('zh-CN')
          }
          tools.value.unshift(newTool)
          total.value++
          ElMessage.success('工具添加成功')
        }
        toolFormDialogVisible.value = false
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
    console.log('工具数据加载完成')
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.headquarters-marketing-tools {
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

.tools-list {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>