<template>
  <div class="headquarters-settings-dictionary">
    <div class="page-header">
      <h1>字典配置管理</h1>
      <el-button type="primary">添加字典</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索字典名称" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="dictType" placeholder="选择字典类型">
              <el-option label="全部" value=""></el-option>
              <el-option label="系统字典" value="system"></el-option>
              <el-option label="业务字典" value="business"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 字典列表 -->
    <div class="dictionary-list">
      <el-card shadow="hover">
        <el-table :data="dictionaries" style="width: 100%">
          <el-table-column prop="id" label="字典ID" width="100"></el-table-column>
          <el-table-column prop="name" label="字典名称"></el-table-column>
          <el-table-column prop="code" label="字典编码" width="150"></el-table-column>
          <el-table-column prop="type" label="字典类型" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'enabled' ? 'success' : 'danger'">
                {{ scope.row.status === 'enabled' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewDictionary(scope.row.id)">查看</el-button>
              <el-button type="warning" size="small" @click="editDictionary(scope.row.id)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteDictionary(scope.row.id)">删除</el-button>
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
    
    <!-- 字典详情 -->
    <div class="dictionary-detail" v-if="selectedDictionary">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>字典详情：{{ selectedDictionary.name }}</span>
            <el-button type="primary" size="small" @click="saveDictionary">保存修改</el-button>
          </div>
        </template>
        <el-form :model="selectedDictionary" label-width="120px">
          <el-form-item label="字典名称">
            <el-input v-model="selectedDictionary.name" placeholder="请输入字典名称"></el-input>
          </el-form-item>
          <el-form-item label="字典编码">
            <el-input v-model="selectedDictionary.code" placeholder="请输入字典编码"></el-input>
          </el-form-item>
          <el-form-item label="字典类型">
            <el-select v-model="selectedDictionary.type" placeholder="选择字典类型">
              <el-option label="系统字典" value="system"></el-option>
              <el-option label="业务字典" value="business"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字典描述">
            <el-input
              v-model="selectedDictionary.description"
              type="textarea"
              :rows="3"
              placeholder="请输入字典描述"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch v-model="selectedDictionary.status"></el-switch>
          </el-form-item>
          <el-form-item label="字典项">
            <el-button type="primary" size="small" @click="addDictItem">添加字典项</el-button>
            <el-table :data="selectedDictionary.items" style="width: 100%; margin-top: 10px;">
              <el-table-column prop="id" label="项ID" width="80"></el-table-column>
              <el-table-column prop="value" label="值" width="150"></el-table-column>
              <el-table-column prop="label" label="标签"></el-table-column>
              <el-table-column prop="sort" label="排序" width="80"></el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="scope">
                  <el-button type="danger" size="small" @click="deleteDictItem(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const dictType = ref('')

// 字典数据
const dictionaries = ref([
  { id: 1, name: '用户角色', code: 'user_role', type: '系统字典', status: 'enabled' },
  { id: 2, name: '订单状态', code: 'order_status', type: '业务字典', status: 'enabled' },
  { id: 3, name: '产品分类', code: 'product_category', type: '业务字典', status: 'enabled' },
  { id: 4, name: '门店类型', code: 'store_type', type: '业务字典', status: 'enabled' },
  { id: 5, name: '客户来源', code: 'customer_source', type: '业务字典', status: 'enabled' }
])

// 选中的字典
const selectedDictionary = ref(null)

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 搜索
const search = () => {
  ElMessage.success('搜索功能开发中')
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  dictType.value = ''
}

// 查看字典
const viewDictionary = (dictId) => {
  selectedDictionary.value = {
    id: dictId,
    name: '用户角色',
    code: 'user_role',
    type: 'system',
    description: '系统用户角色定义',
    status: true,
    items: [
      { id: 1, value: 'admin', label: '管理员', sort: 1 },
      { id: 2, value: 'storeManager', label: '门店经理', sort: 2 },
      { id: 3, value: 'guide', label: '导购', sort: 3 }
    ]
  }
  ElMessage.success(`查看字典：${dictId}`)
}

// 编辑字典
const editDictionary = (dictId) => {
  viewDictionary(dictId)
  ElMessage.success(`编辑字典：${dictId}`)
}

// 删除字典
const deleteDictionary = (dictId) => {
  ElMessage.success(`删除字典：${dictId}`)
}

// 保存字典
const saveDictionary = () => {
  ElMessage.success('字典保存成功')
}

// 添加字典项
const addDictItem = () => {
  if (selectedDictionary.value) {
    if (!selectedDictionary.value.items) {
      selectedDictionary.value.items = []
    }
    selectedDictionary.value.items.push({
      id: selectedDictionary.value.items.length + 1,
      value: '',
      label: '',
      sort: selectedDictionary.value.items.length + 1
    })
  }
}

// 删除字典项
const deleteDictItem = (index) => {
  if (selectedDictionary.value && selectedDictionary.value.items) {
    selectedDictionary.value.items.splice(index, 1)
  }
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
.headquarters-settings-dictionary {
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

.dictionary-list {
  margin-bottom: 20px;
}

.dictionary-detail {
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