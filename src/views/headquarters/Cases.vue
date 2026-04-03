<template>
  <div class="headquarters-cases">
    <div class="page-header">
      <h1>案例管理</h1>
      <el-button type="primary" @click="addCase">添加案例</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索案例名称" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="categoryId" placeholder="选择分类">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="category in categories" :key="category.value" :label="category.label" :value="category.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 案例列表 -->
    <div class="case-list">
      <el-card shadow="hover">
        <el-table :data="cases" style="width: 100%">
          <el-table-column prop="id" label="案例ID" width="80"></el-table-column>
          <el-table-column prop="title" label="案例名称"></el-table-column>
          <el-table-column prop="category" label="分类" width="120"></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editCase(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteCase(scope.row.id)">删除</el-button>
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
    
    <!-- 添加/编辑案例弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="案例名称">
          <el-input v-model="form.title" placeholder="请输入案例名称"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.categoryId" placeholder="选择分类">
            <el-option v-for="category in categories" :key="category.value" :label="category.label" :value="category.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入案例描述"
          ></el-input>
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
const categories = [
  { label: '现代简约', value: '1' },
  { label: '欧式古典', value: '2' },
  { label: '中式风格', value: '3' },
  { label: '北欧风格', value: '4' }
]

// 案例数据
const cases = ref([
  { id: 1, title: '现代简约三居室', category: '现代简约', description: '89㎡现代简约风格装修案例' },
  { id: 2, title: '欧式古典别墅', category: '欧式古典', description: '200㎡欧式古典风格装修案例' },
  { id: 3, title: '中式风格复式', category: '中式风格', description: '150㎡中式风格装修案例' },
  { id: 4, title: '北欧风格两居室', category: '北欧风格', description: '60㎡北欧风格装修案例' }
])

// 分页
const total = ref(4)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const form = ref({
  id: null,
  title: '',
  categoryId: '',
  description: ''
})

// 搜索
const search = () => {
  // 模拟搜索逻辑
  const keyword = searchKeyword.value.toLowerCase()
  const category = categoryId.value
  
  // 模拟搜索过程
  const loading = ElLoading.service({ text: '正在搜索案例...' })
  
  // 模拟API调用延迟
  setTimeout(() => {
    // 过滤数据
    const filteredCases = cases.value.filter(c => {
      const titleMatch = c.title.toLowerCase().includes(keyword)
      const categoryMatch = !category || c.category === categories.find(cat => cat.value == category)?.label
      return titleMatch && categoryMatch
    })
    
    // 更新显示数据
    total.value = filteredCases.length
    
    if (filteredCases.length > 0) {
      ElMessage.success(`找到 ${filteredCases.length} 个案例`)
    } else {
      ElMessage.info('未找到匹配的案例')
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

// 编辑案例
const editCase = (caseItem) => {
  // 填充表单数据
  form.value = {
    id: caseItem.id,
    title: caseItem.title,
    categoryId: categories.find(cat => cat.label === caseItem.category)?.value || '',
    description: caseItem.description
  }
  dialogTitle.value = '编辑案例'
  dialogVisible.value = true
}

// 删除案例
const deleteCase = (caseId) => {
  // 确认删除
  ElMessageBox.confirm('确定要删除该案例吗？删除后将无法恢复。', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除过程
    const loading = ElLoading.service({ text: '正在删除案例...' })
    
    // 模拟API调用延迟
    setTimeout(() => {
      // 模拟删除逻辑
      const index = cases.value.findIndex(c => c.id === caseId)
      if (index !== -1) {
        cases.value.splice(index, 1)
        total.value--
        ElMessage.success('案例删除成功')
      } else {
        ElMessage.error('案例不存在或已被删除')
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

// 添加案例
const addCase = () => {
  // 重置表单
  form.value = {
    id: null,
    title: '',
    categoryId: '',
    description: ''
  }
  dialogTitle.value = '添加案例'
  dialogVisible.value = true
}

// 提交表单
const submitForm = () => {
  // 表单验证
  if (!form.value.title) {
    ElMessage.error('请输入案例名称')
    return
  }
  if (!form.value.categoryId) {
    ElMessage.error('请选择分类')
    return
  }
  if (!form.value.description) {
    ElMessage.error('请输入案例描述')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在保存案例...' })
  
  // 模拟API调用延迟
  setTimeout(() => {
    const categoryName = categories.find(cat => cat.value == form.value.categoryId)?.label || ''
    
    if (form.value.id) {
      // 编辑案例
      const index = cases.value.findIndex(c => c.id === form.value.id)
      if (index !== -1) {
        cases.value[index] = {
          ...cases.value[index],
          title: form.value.title,
          category: categoryName,
          description: form.value.description
        }
        ElMessage.success('案例编辑成功')
      } else {
        ElMessage.error('案例不存在或已被删除')
      }
    } else {
      // 添加案例
      const newCase = {
        id: cases.value.length + 1,
        title: form.value.title,
        category: categoryName,
        description: form.value.description
      }
      cases.value.push(newCase)
      total.value++
      ElMessage.success('案例添加成功')
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
    console.log('案例数据加载完成')
  }, 500)
})
</script>

<style scoped>
.headquarters-cases {
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

.case-list {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>