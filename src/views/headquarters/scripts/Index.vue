<template>
  <div class="headquarters-scripts">
    <div class="page-header">
      <h1>话术库管理</h1>
      <el-button type="primary" @click="addScript">添加话术</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索话术内容" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="categoryId" placeholder="选择分类">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 话术列表 -->
    <div class="script-list">
      <el-card shadow="hover">
        <el-table :data="scripts" style="width: 100%">
          <el-table-column prop="id" label="话术ID" width="80"></el-table-column>
          <el-table-column prop="title" label="话术标题"></el-table-column>
          <el-table-column prop="category" label="分类" width="120"></el-table-column>
          <el-table-column prop="content" label="话术内容"></el-table-column>
          <el-table-column prop="usageCount" label="使用次数" width="100"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === '启用' ? 'success' : 'danger'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editScript(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteScript(scope.row.id)">删除</el-button>
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
    
    <!-- 添加/编辑话术弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="话术标题">
          <el-input v-model="form.title" placeholder="请输入话术标题"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.categoryId" placeholder="选择分类">
            <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="话术内容">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="请输入话术内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="禁用">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const categoryId = ref('')

// 分类数据
const categories = ref([
  { id: 1, name: '产品介绍' },
  { id: 2, name: '销售技巧' },
  { id: 3, name: '客户服务' },
  { id: 4, name: '异议处理' }
])

// 话术数据
const scripts = ref([
  { id: 1, title: '产品优势介绍', category: '产品介绍', content: '我们的产品采用优质材料，环保健康，使用寿命长，是您的理想选择。', usageCount: 156, status: '启用' },
  { id: 2, title: '价格谈判技巧', category: '销售技巧', content: '我们的价格是市场上最具竞争力的，同时提供完善的售后服务。', usageCount: 89, status: '启用' },
  { id: 3, title: '客户投诉处理', category: '客户服务', content: '非常抱歉给您带来不便，我们会立即处理您的问题，确保您的满意。', usageCount: 45, status: '启用' },
  { id: 4, title: '竞品对比话术', category: '异议处理', content: '与竞品相比，我们的产品在质量、价格和服务方面都更具优势。', usageCount: 123, status: '启用' },
  { id: 5, title: '活动促销话术', category: '销售技巧', content: '现在购买可享受8折优惠，还有精美礼品赠送，机会难得。', usageCount: 78, status: '禁用' }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const form = ref({
  id: null,
  title: '',
  categoryId: '',
  content: '',
  status: '启用'
})

// 搜索
const search = () => {
  // 模拟搜索逻辑
  const keyword = searchKeyword.value.toLowerCase()
  const category = categoryId.value
  
  // 模拟搜索过程
  const loading = ElLoading.service({ text: '正在搜索话术...' })
  
  // 模拟API调用延迟
  setTimeout(() => {
    // 过滤数据
    const filteredScripts = scripts.value.filter(s => {
      const titleMatch = s.title.toLowerCase().includes(keyword) || s.content.toLowerCase().includes(keyword)
      const categoryMatch = !category || s.category === categories.value.find(c => c.id == category)?.name
      return titleMatch && categoryMatch
    })
    
    // 更新显示数据
    total.value = filteredScripts.length
    
    if (filteredScripts.length > 0) {
      ElMessage.success(`找到 ${filteredScripts.length} 条话术`)
    } else {
      ElMessage.info('未找到匹配的话术')
    }
    loading.close()
  }, 500)
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  categoryId.value = ''
  ElMessage.info('搜索条件已重置')
}

// 编辑话术
const editScript = (script) => {
  // 填充表单数据
  form.value = {
    id: script.id,
    title: script.title,
    categoryId: categories.value.find(c => c.name === script.category)?.id || '',
    content: script.content,
    status: script.status
  }
  dialogTitle.value = '编辑话术'
  dialogVisible.value = true
}

// 删除话术
const deleteScript = (scriptId) => {
  // 确认删除
  ElMessageBox.confirm('确定要删除该话术吗？删除后将无法恢复。', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除过程
    const loading = ElLoading.service({ text: '正在删除话术...' })
    
    // 模拟API调用延迟
    setTimeout(() => {
      // 模拟删除逻辑
      const index = scripts.value.findIndex(s => s.id === scriptId)
      if (index !== -1) {
        scripts.value.splice(index, 1)
        total.value--
        ElMessage.success('话术删除成功')
      } else {
        ElMessage.error('话术不存在或已被删除')
      }
      loading.close()
    }, 500)
  }).catch(() => {
    // 取消删除
    ElMessage.info('已取消删除操作')
  })
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  // 模拟API调用延迟
  const loading = ElLoading.service({ text: '正在加载数据...' })
  
  setTimeout(() => {
    // 实际项目中这里应该调用API获取对应页的数据
    ElMessage.success(`切换到第 ${page} 页`)
    loading.close()
  }, 300)
}

// 添加话术
const addScript = () => {
  // 重置表单
  form.value = {
    id: null,
    title: '',
    categoryId: '',
    content: '',
    status: '启用'
  }
  dialogTitle.value = '添加话术'
  dialogVisible.value = true
}

// 提交表单
const submitForm = () => {
  // 表单验证
  if (!form.value.title) {
    ElMessage.error('请输入话术标题')
    return
  }
  if (!form.value.categoryId) {
    ElMessage.error('请选择分类')
    return
  }
  if (!form.value.content) {
    ElMessage.error('请输入话术内容')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在保存话术...' })
  
  // 模拟API调用延迟
  setTimeout(() => {
    const categoryName = categories.value.find(c => c.id == form.value.categoryId)?.name || ''
    
    if (form.value.id) {
      // 编辑话术
      const index = scripts.value.findIndex(s => s.id === form.value.id)
      if (index !== -1) {
        scripts.value[index] = {
          ...scripts.value[index],
          title: form.value.title,
          category: categoryName,
          content: form.value.content,
          status: form.value.status
        }
        ElMessage.success('话术编辑成功')
      } else {
        ElMessage.error('话术不存在或已被删除')
      }
    } else {
      // 添加话术
      const newScript = {
        id: scripts.value.length + 1,
        title: form.value.title,
        category: categoryName,
        content: form.value.content,
        usageCount: 0,
        status: form.value.status
      }
      scripts.value.push(newScript)
      total.value++
      ElMessage.success('话术添加成功')
    }
    
    dialogVisible.value = false
    loading.close()
  }, 500)
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
    console.log('话术数据加载完成')
  }, 500)
})
</script>

<style scoped>
.headquarters-scripts {
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

.script-list {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>