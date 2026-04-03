<template>
  <div class="store-cases">
    <div class="page-header">
      <h1>案例管理</h1>
      <el-button type="primary">添加案例</el-button>
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
              <el-option label="现代简约" value="1"></el-option>
              <el-option label="欧式古典" value="2"></el-option>
              <el-option label="中式风格" value="3"></el-option>
              <el-option label="北欧风格" value="4"></el-option>
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
              <el-button type="primary" size="small" @click="editCase(scope.row.id)">编辑</el-button>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const categoryId = ref('')

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

// 搜索
const search = () => {
  ElMessage.success('搜索功能开发中')
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  categoryId.value = ''
}

// 编辑案例
const editCase = (caseId) => {
  ElMessage.success(`编辑案例：${caseId}`)
}

// 删除案例
const deleteCase = (caseId) => {
  ElMessage.success(`删除案例：${caseId}`)
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
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
.store-cases {
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