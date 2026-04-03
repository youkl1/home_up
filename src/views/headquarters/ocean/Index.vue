<template>
  <div class="headquarters-ocean">
    <div class="page-header">
      <h1>公海客资管理</h1>
      <el-button type="primary" @click="batchAssignCustomers" :disabled="selectedCustomers.length === 0">批量分配</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索客户姓名或电话" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="source" placeholder="选择来源">
              <el-option label="全部" value=""></el-option>
              <el-option label="网站" value="website"></el-option>
              <el-option label="电话" value="phone"></el-option>
              <el-option label="微信" value="wechat"></el-option>
              <el-option label="推荐" value="recommend"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 公海客资列表 -->
    <div class="ocean-list">
      <el-card shadow="hover">
        <el-table :data="oceanCustomers" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="客户ID" width="80"></el-table-column>
          <el-table-column prop="name" label="客户姓名"></el-table-column>
          <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
          <el-table-column prop="source" label="来源" width="120"></el-table-column>
          <el-table-column prop="intentLevel" label="意向等级" width="100">
            <template #default="scope">
              <el-tag :type="getLevelType(scope.row.intentLevel)">{{ scope.row.intentLevel }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="进入公海时间" width="180"></el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button type="primary" size="small" @click="assignCustomer(scope.row)">分配</el-button>
              <el-button type="info" size="small" @click="viewCustomer(scope.row)">查看</el-button>
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
    
    <!-- 分配客户弹窗 -->
    <el-dialog
      v-model="assignDialogVisible"
      :title="assignDialogTitle"
      width="600px"
    >
      <el-form :model="assignForm" label-width="100px">
        <el-form-item label="分配给">
          <el-select v-model="assignForm.userId" placeholder="选择分配对象">
            <el-option label="张三" value="1"></el-option>
            <el-option label="李四" value="2"></el-option>
            <el-option label="王五" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配原因">
          <el-input v-model="assignForm.reason" placeholder="请输入分配原因" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item v-if="assignForm.customerIds.length > 1" label="分配客户">
          <el-tag v-for="id in assignForm.customerIds" :key="id" closable>{{ id }}</el-tag>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="assignDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAssign">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 查看客户详情弹窗 -->
    <el-dialog
      v-model="viewDialogVisible"
      :title="viewForm.name || '客户详情'"
      width="600px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="客户ID">{{ viewForm.id }}</el-descriptions-item>
        <el-descriptions-item label="客户姓名">{{ viewForm.name }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ viewForm.phone }}</el-descriptions-item>
        <el-descriptions-item label="来源">{{ viewForm.source }}</el-descriptions-item>
        <el-descriptions-item label="意向等级">{{ viewForm.intentLevel }}</el-descriptions-item>
        <el-descriptions-item label="进入公海时间">{{ viewForm.createTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const source = ref('')

// 弹窗相关
const assignDialogVisible = ref(false)
const viewDialogVisible = ref(false)
const assignDialogTitle = ref('分配客户')

// 分配表单
const assignForm = ref({
  customerIds: [],
  userId: '',
  reason: ''
})

// 查看表单
const viewForm = ref({
  id: null,
  name: '',
  phone: '',
  source: '',
  intentLevel: '',
  createTime: ''
})

// 多选客户
const selectedCustomers = ref([])

// 处理选择变化
const handleSelectionChange = (val) => {
  selectedCustomers.value = val
}

// 公海客资数据
const oceanCustomers = ref([
  { id: 1, name: '赵先生', phone: '138****1234', source: '网站', intentLevel: '高', createTime: '2026-04-01 10:30' },
  { id: 2, name: '钱女士', phone: '139****5678', source: '电话', intentLevel: '中', createTime: '2026-03-31 14:20' },
  { id: 3, name: '孙先生', phone: '137****9012', source: '微信', intentLevel: '低', createTime: '2026-03-30 09:15' },
  { id: 4, name: '李先生', phone: '136****3456', source: '推荐', intentLevel: '高', createTime: '2026-03-29 16:45' },
  { id: 5, name: '周女士', phone: '135****7890', source: '网站', intentLevel: '中', createTime: '2026-03-28 11:00' }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 获取意向等级样式
const getLevelType = (level) => {
  switch (level) {
    case '高':
      return 'danger'
    case '中':
      return 'warning'
    case '低':
      return 'info'
    default:
      return 'info'
  }
}

// 搜索
const search = () => {
  // 模拟搜索过程
  const loading = ElLoading.service({ text: '正在搜索客户...' })
  
  setTimeout(() => {
    // 过滤数据
    const filteredCustomers = oceanCustomers.value.filter(customer => {
      const nameMatch = customer.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) || customer.phone.toLowerCase().includes(searchKeyword.value.toLowerCase())
      const sourceMatch = !source.value || customer.source === source.value
      return nameMatch && sourceMatch
    })
    
    // 更新显示数据
    total.value = filteredCustomers.length
    
    if (filteredCustomers.length > 0) {
      ElMessage.success(`找到 ${filteredCustomers.length} 个客户`)
    } else {
      ElMessage.info('未找到匹配的客户')
    }
    loading.close()
  }, 500)
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  source.value = ''
  ElMessage.info('搜索条件已重置')
}

// 批量分配客户
const batchAssignCustomers = () => {
  if (selectedCustomers.value.length === 0) {
    ElMessage.warning('请选择要分配的客户')
    return
  }
  
  // 填充分配表单
  assignForm.value = {
    customerIds: selectedCustomers.value.map(item => item.id),
    userId: '',
    reason: ''
  }
  assignDialogTitle.value = '批量分配客户'
  assignDialogVisible.value = true
}

// 分配客户
const assignCustomer = (customer) => {
  // 填充分配表单
  assignForm.value = {
    customerIds: [customer.id],
    userId: '',
    reason: ''
  }
  assignDialogTitle.value = `分配客户：${customer.name}`
  assignDialogVisible.value = true
}

// 提交分配
const submitAssign = () => {
  // 表单验证
  if (!assignForm.value.userId) {
    ElMessage.error('请选择分配对象')
    return
  }
  if (!assignForm.value.reason) {
    ElMessage.error('请输入分配原因')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在分配客户...' })
  
  setTimeout(() => {
    // 模拟分配逻辑
    assignForm.value.customerIds.forEach(customerId => {
      const index = oceanCustomers.value.findIndex(c => c.id === customerId)
      if (index !== -1) {
        oceanCustomers.value.splice(index, 1)
      }
    })
    total.value = oceanCustomers.value.length
    selectedCustomers.value = []
    
    ElMessage.success(`成功分配 ${assignForm.value.customerIds.length} 个客户`)
    assignDialogVisible.value = false
    loading.close()
  }, 1000)
}

// 查看客户
const viewCustomer = (customer) => {
  // 填充查看表单数据
  viewForm.value = {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    source: customer.source,
    intentLevel: customer.intentLevel,
    createTime: customer.createTime
  }
  viewDialogVisible.value = true
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

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
  }, 500)
})
</script>

<style scoped>
.headquarters-ocean {
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

.ocean-list {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>