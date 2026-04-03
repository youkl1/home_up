<template>
  <div class="headquarters-system-dictionary">
    <div class="page-header">
      <h1>字典配置</h1>
      <el-button type="primary" @click="addDictionary">添加字典</el-button>
    </div>
    
    <!-- 字典筛选 -->
    <div class="dictionary-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="filter.name" placeholder="字典名称" @keyup.enter="search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-input v-model="filter.code" placeholder="字典编码" @keyup.enter="search"></el-input>
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
        <el-table :data="dictionaries" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="字典ID" width="100"></el-table-column>
          <el-table-column prop="name" label="字典名称"></el-table-column>
          <el-table-column prop="code" label="字典编码" width="150"></el-table-column>
          <el-table-column prop="description" label="字典描述"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                {{ scope.row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column prop="updateTime" label="最后更新" width="180"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="viewDictionary(scope.row)">查看</el-button>
              <el-button size="small" type="primary" @click="editDictionary(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteDictionary(scope.row)">删除</el-button>
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
            <el-button size="small" @click="addDictionaryItem(selectedDictionary.id)">添加字典项</el-button>
          </div>
        </template>
        <el-descriptions :column="1">
          <el-descriptions-item label="字典ID">{{ selectedDictionary.id }}</el-descriptions-item>
          <el-descriptions-item label="字典名称">{{ selectedDictionary.name }}</el-descriptions-item>
          <el-descriptions-item label="字典编码">{{ selectedDictionary.code }}</el-descriptions-item>
          <el-descriptions-item label="字典描述">{{ selectedDictionary.description }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ selectedDictionary.status === 1 ? '启用' : '禁用' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ selectedDictionary.createTime }}</el-descriptions-item>
          <el-descriptions-item label="最后更新">{{ selectedDictionary.updateTime }}</el-descriptions-item>
        </el-descriptions>
        
        <!-- 字典项列表 -->
        <div class="dictionary-items" v-if="selectedDictionary.items && selectedDictionary.items.length > 0">
          <h3>字典项</h3>
          <el-table :data="selectedDictionary.items" style="width: 100%">
            <el-table-column prop="id" label="项ID" width="100"></el-table-column>
            <el-table-column prop="label" label="显示值"></el-table-column>
            <el-table-column prop="value" label="实际值" width="150"></el-table-column>
            <el-table-column prop="sort" label="排序" width="100"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                  {{ scope.row.status === 1 ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button size="small" type="primary" @click="editDictionaryItem(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteDictionaryItem(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    
    <!-- 添加/编辑字典弹窗 -->
    <el-dialog
      v-model="dictionaryDialogVisible"
      :title="isEditDictionary ? '编辑字典' : '添加字典'"
      width="600px"
    >
      <el-form
        :model="dictionaryForm"
        :rules="dictionaryFormRules"
        ref="dictionaryFormRef"
        label-position="top"
        v-loading="loading"
      >
        <el-form-item label="字典信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="字典名称" prop="name">
                <el-input v-model="dictionaryForm.name" placeholder="请输入字典名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字典编码" prop="code">
                <el-input v-model="dictionaryForm.code" placeholder="请输入字典编码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="字典描述" prop="description">
                <el-input
                  v-model="dictionaryForm.description"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入字典描述"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-switch v-model="dictionaryForm.status" active-value="1" inactive-value="0"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dictionaryDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDictionaryForm">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 添加/编辑字典项弹窗 -->
    <el-dialog
      v-model="dictionaryItemDialogVisible"
      :title="isEditDictionaryItem ? '编辑字典项' : '添加字典项'"
      width="500px"
    >
      <el-form
        :model="dictionaryItemForm"
        :rules="dictionaryItemFormRules"
        ref="dictionaryItemFormRef"
        label-position="top"
        v-loading="loading"
      >
        <el-form-item label="字典项信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="显示值" prop="label">
                <el-input v-model="dictionaryItemForm.label" placeholder="请输入显示值"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实际值" prop="value">
                <el-input v-model="dictionaryItemForm.value" placeholder="请输入实际值"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="排序" prop="sort">
                <el-input-number v-model="dictionaryItemForm.sort" :min="0" :step="1"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-switch v-model="dictionaryItemForm.status" active-value="1" inactive-value="0"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dictionaryItemDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDictionaryItemForm">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 加载状态
const loading = ref(false)

// 字典筛选
const filter = ref({
  name: '',
  code: ''
})

// 字典数据
const dictionaries = ref([
  {
    id: 1,
    name: '用户状态',
    code: 'user_status',
    description: '用户状态字典',
    status: 1,
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00',
    items: [
      { id: 1, label: '正常', value: 'normal', sort: 1, status: 1 },
      { id: 2, label: '禁用', value: 'disabled', sort: 2, status: 1 },
      { id: 3, label: '锁定', value: 'locked', sort: 3, status: 1 }
    ]
  },
  {
    id: 2,
    name: '订单状态',
    code: 'order_status',
    description: '订单状态字典',
    status: 1,
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00',
    items: [
      { id: 4, label: '待支付', value: 'pending', sort: 1, status: 1 },
      { id: 5, label: '已支付', value: 'paid', sort: 2, status: 1 },
      { id: 6, label: '已发货', value: 'shipped', sort: 3, status: 1 },
      { id: 7, label: '已完成', value: 'completed', sort: 4, status: 1 },
      { id: 8, label: '已取消', value: 'cancelled', sort: 5, status: 1 }
    ]
  },
  {
    id: 3,
    name: '商品分类',
    code: 'product_category',
    description: '商品分类字典',
    status: 1,
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00',
    items: [
      { id: 9, label: '智能家居', value: 'smart_home', sort: 1, status: 1 },
      { id: 10, label: '智能家电', value: 'smart_appliance', sort: 2, status: 1 },
      { id: 11, label: '智能安防', value: 'smart_security', sort: 3, status: 1 }
    ]
  }
])

// 分页
const total = ref(3)
const pageSize = ref(10)
const currentPage = ref(1)

// 选中的字典
const selectedDictionary = ref(null)

// 弹窗状态
const dictionaryDialogVisible = ref(false)
const dictionaryItemDialogVisible = ref(false)

// 是否编辑
const isEditDictionary = ref(false)
const isEditDictionaryItem = ref(false)

// 字典表单
const dictionaryForm = ref({
  id: '',
  name: '',
  code: '',
  description: '',
  status: 1
})

// 字典项表单
const dictionaryItemForm = ref({
  id: '',
  label: '',
  value: '',
  sort: 0,
  status: 1,
  dictionaryId: ''
})

// 表单验证规则
const dictionaryFormRules = {
  name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入字典编码', trigger: 'blur' }],
  description: [{ required: true, message: '请输入字典描述', trigger: 'blur' }]
}

const dictionaryItemFormRules = {
  label: [{ required: true, message: '请输入显示值', trigger: 'blur' }],
  value: [{ required: true, message: '请输入实际值', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
}

// 表单引用
const dictionaryFormRef = ref(null)
const dictionaryItemFormRef = ref(null)

// 搜索
const search = () => {
  loading.value = true
  // 模拟搜索逻辑
  setTimeout(() => {
    // 实际项目中这里应该调用API搜索字典
    console.log(`搜索字典：名称=${filter.value.name}，编码=${filter.value.code}`)
    loading.value = false
  }, 500)
}

// 重置
const reset = () => {
  filter.value = {
    name: '',
    code: ''
  }
}

// 查看字典
const viewDictionary = (dictionary) => {
  loading.value = true
  // 模拟获取字典详情
  setTimeout(() => {
    selectedDictionary.value = { ...dictionary }
    loading.value = false
  }, 500)
}

// 添加字典
const addDictionary = () => {
  isEditDictionary.value = false
  dictionaryForm.value = {
    id: '',
    name: '',
    code: '',
    description: '',
    status: 1
  }
  dictionaryDialogVisible.value = true
}

// 编辑字典
const editDictionary = (dictionary) => {
  isEditDictionary.value = true
  dictionaryForm.value = { ...dictionary }
  dictionaryDialogVisible.value = true
}

// 删除字典
const deleteDictionary = (dictionary) => {
  ElMessageBox.confirm(`确定要删除字典 "${dictionary.name}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true
    // 模拟删除字典
    setTimeout(() => {
      // 实际项目中这里应该调用API删除字典
      ElMessage.success('字典删除成功')
      loading.value = false
    }, 500)
  }).catch(() => {
    ElMessage.info('取消删除操作')
  })
}

// 提交字典表单
const submitDictionaryForm = () => {
  if (!dictionaryFormRef.value) return
  
  dictionaryFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟提交数据
      setTimeout(() => {
        // 实际项目中这里应该调用API保存字典
        if (isEditDictionary.value) {
          ElMessage.success('字典编辑成功')
        } else {
          ElMessage.success('字典添加成功')
        }
        dictionaryDialogVisible.value = false
        loading.value = false
      }, 1000)
    }
  })
}

// 添加字典项
const addDictionaryItem = (dictionaryId) => {
  isEditDictionaryItem.value = false
  dictionaryItemForm.value = {
    id: '',
    label: '',
    value: '',
    sort: 0,
    status: 1,
    dictionaryId: dictionaryId
  }
  dictionaryItemDialogVisible.value = true
}

// 编辑字典项
const editDictionaryItem = (item) => {
  isEditDictionaryItem.value = true
  dictionaryItemForm.value = { ...item }
  dictionaryItemDialogVisible.value = true
}

// 删除字典项
const deleteDictionaryItem = (item) => {
  ElMessageBox.confirm(`确定要删除字典项 "${item.label}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true
    // 模拟删除字典项
    setTimeout(() => {
      // 实际项目中这里应该调用API删除字典项
      ElMessage.success('字典项删除成功')
      loading.value = false
    }, 500)
  }).catch(() => {
    ElMessage.info('取消删除操作')
  })
}

// 提交字典项表单
const submitDictionaryItemForm = () => {
  if (!dictionaryItemFormRef.value) return
  
  dictionaryItemFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟提交数据
      setTimeout(() => {
        // 实际项目中这里应该调用API保存字典项
        if (isEditDictionaryItem.value) {
          ElMessage.success('字典项编辑成功')
        } else {
          ElMessage.success('字典项添加成功')
        }
        dictionaryItemDialogVisible.value = false
        loading.value = false
      }, 1000)
    }
  })
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  // 实际项目中这里应该调用API获取对应页的数据
  console.log(`切换到第 ${page} 页`)
}

// 组件挂载
onMounted(() => {
  // 模拟获取字典数据
  loading.value = true
  setTimeout(() => {
    // 数据加载完成
    console.log('字典数据加载完成')
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.headquarters-system-dictionary {
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

.dictionary-filter {
  margin-bottom: 20px;
}

.dictionary-list {
  margin-bottom: 20px;
}

.dictionary-detail {
  margin-bottom: 20px;
}

.dictionary-items {
  margin-top: 20px;
}

.dictionary-items h3 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 15px 0;
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