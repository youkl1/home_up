<template>
  <div class="headquarters-stores">
    <div class="page-header">
      <h1>门店管理</h1>
      <el-button type="primary" @click="addStore">添加门店</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索门店名称或编号" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="status" placeholder="选择状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="营业中" value="operating"></el-option>
              <el-option label="装修中" value="renovation"></el-option>
              <el-option label="已关闭" value="closed"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 批量操作按钮 -->
    <div class="batch-actions" v-if="multipleSelection.length > 0">
      <el-button type="danger" @click="batchDeleteStores">批量删除</el-button>
      <el-button type="primary" @click="batchUpdateStatus('operating')">设为营业中</el-button>
      <el-button type="warning" @click="batchUpdateStatus('renovation')">设为装修中</el-button>
      <el-button type="info" @click="batchUpdateStatus('closed')">设为已关闭</el-button>
    </div>
    
    <!-- 门店列表 -->
    <div class="store-list">
      <el-card shadow="hover">
        <el-table 
          :data="stores" 
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="门店ID" width="80"></el-table-column>
          <el-table-column prop="name" label="门店名称"></el-table-column>
          <el-table-column prop="code" label="门店编号" width="120"></el-table-column>
          <el-table-column prop="region" label="所属区域" width="150"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.statusText }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="openDate" label="开业时间" width="150"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewStore(scope.row)">查看</el-button>
              <el-button type="success" size="small" @click="editStore(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteStore(scope.row.id)">删除</el-button>
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
    
    <!-- 添加/编辑门店弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form :model="storeForm" label-width="100px">
        <el-form-item label="门店名称">
          <el-input v-model="storeForm.name" placeholder="请输入门店名称"></el-input>
        </el-form-item>
        <el-form-item label="门店编号">
          <el-input v-model="storeForm.code" placeholder="请输入门店编号"></el-input>
        </el-form-item>
        <el-form-item label="所属区域">
          <el-input v-model="storeForm.region" placeholder="请输入所属区域"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="storeForm.address" placeholder="请输入门店地址" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="storeForm.status">
            <el-option label="营业中" value="operating"></el-option>
            <el-option label="装修中" value="renovation"></el-option>
            <el-option label="已关闭" value="closed"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开业时间">
          <el-date-picker
            v-model="storeForm.openDate"
            type="date"
            placeholder="选择开业时间"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitStore">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 查看门店详情弹窗 -->
    <el-dialog
      v-model="viewDialogVisible"
      :title="viewForm.name || '门店详情'"
      width="600px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="门店ID">{{ viewForm.id }}</el-descriptions-item>
        <el-descriptions-item label="门店名称">{{ viewForm.name }}</el-descriptions-item>
        <el-descriptions-item label="门店编号">{{ viewForm.code }}</el-descriptions-item>
        <el-descriptions-item label="所属区域">{{ viewForm.region }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{ viewForm.address }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ viewForm.statusText }}</el-descriptions-item>
        <el-descriptions-item label="开业时间">{{ viewForm.openDate }}</el-descriptions-item>
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
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const status = ref('')

// 弹窗相关
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const dialogTitle = ref('添加门店')

// 批量操作相关
const multipleSelection = ref([])

// 门店表单
const storeForm = ref({
  id: null,
  name: '',
  code: '',
  region: '',
  address: '',
  status: 'operating',
  openDate: ''
})

// 查看表单
const viewForm = ref({
  id: null,
  name: '',
  code: '',
  region: '',
  address: '',
  status: '',
  statusText: '',
  openDate: ''
})

// 门店数据
const stores = ref([
  { id: 1, name: '北京旗舰店', code: 'BJ001', region: '北京', address: '北京市朝阳区建国路88号', status: 'operating', statusText: '营业中', openDate: '2025-01-01' },
  { id: 2, name: '上海中心店', code: 'SH001', region: '上海', address: '上海市浦东新区世纪大道100号', status: 'operating', statusText: '营业中', openDate: '2025-02-01' },
  { id: 3, name: '广州天河店', code: 'GZ001', region: '广州', address: '广州市天河区天河路385号', status: 'renovation', statusText: '装修中', openDate: '2025-03-01' },
  { id: 4, name: '深圳南山店', code: 'SZ001', region: '深圳', address: '深圳市南山区科技园南区', status: 'operating', statusText: '营业中', openDate: '2025-04-01' },
  { id: 5, name: '成都武侯店', code: 'CD001', region: '成都', address: '成都市武侯区武侯大道', status: 'closed', statusText: '已关闭', openDate: '2025-05-01' }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case 'operating':
      return 'success'
    case 'renovation':
      return 'warning'
    case 'closed':
      return 'danger'
    default:
      return 'info'
  }
}

// 搜索
const search = () => {
  // 模拟搜索逻辑
  const keyword = searchKeyword.value.toLowerCase()
  const storeStatus = status.value
  
  // 模拟搜索过程
  const loading = ElLoading.service({ text: '正在搜索门店...' })
  
  setTimeout(() => {
    // 过滤数据
    const filteredStores = stores.value.filter(store => {
      const nameMatch = store.name.toLowerCase().includes(keyword) || store.code.toLowerCase().includes(keyword)
      const statusMatch = !storeStatus || store.status === storeStatus
      return nameMatch && statusMatch
    })
    
    // 更新显示数据
    total.value = filteredStores.length
    
    if (filteredStores.length > 0) {
      ElMessage.success(`找到 ${filteredStores.length} 个门店`)
    } else {
      ElMessage.info('未找到匹配的门店')
    }
    loading.close()
  }, 500)
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  status.value = ''
  ElMessage.info('搜索条件已重置')
}

// 查看门店
const viewStore = (store) => {
  // 填充查看表单数据
  viewForm.value = {
    id: store.id,
    name: store.name,
    code: store.code,
    region: store.region,
    address: store.address,
    status: store.status,
    statusText: store.statusText,
    openDate: store.openDate
  }
  viewDialogVisible.value = true
}

// 编辑门店
const editStore = (store) => {
  // 填充表单数据
  storeForm.value = {
    id: store.id,
    name: store.name,
    code: store.code,
    region: store.region,
    address: store.address,
    status: store.status,
    openDate: store.openDate
  }
  dialogTitle.value = '编辑门店'
  dialogVisible.value = true
}

// 删除门店
const deleteStore = (storeId) => {
  // 确认删除
  ElMessageBox.confirm('确定要删除该门店吗？删除后将无法恢复。', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除过程
    const loading = ElLoading.service({ text: '正在删除门店...' })
    
    setTimeout(() => {
      // 模拟删除逻辑
      const index = stores.value.findIndex(s => s.id === storeId)
      if (index !== -1) {
        stores.value.splice(index, 1)
        total.value--
        ElMessage.success('门店删除成功')
      } else {
        ElMessage.error('门店不存在或已被删除')
      }
      loading.close()
    }, 500)
  }).catch(() => {
    // 取消删除
    ElMessage.info('已取消删除操作')
  })
}

// 提交门店表单
const submitStore = () => {
  // 表单验证
  if (!storeForm.value.name) {
    ElMessage.error('请输入门店名称')
    return
  }
  if (!storeForm.value.code) {
    ElMessage.error('请输入门店编号')
    return
  }
  if (!storeForm.value.region) {
    ElMessage.error('请输入所属区域')
    return
  }
  if (!storeForm.value.address) {
    ElMessage.error('请输入门店地址')
    return
  }
  if (!storeForm.value.openDate) {
    ElMessage.error('请选择开业时间')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在保存门店信息...' })
  
  setTimeout(() => {
    const statusTextMap = {
      operating: '营业中',
      renovation: '装修中',
      closed: '已关闭'
    }
    
    if (storeForm.value.id) {
      // 编辑门店
      const index = stores.value.findIndex(s => s.id === storeForm.value.id)
      if (index !== -1) {
        stores.value[index] = {
          ...stores.value[index],
          name: storeForm.value.name,
          code: storeForm.value.code,
          region: storeForm.value.region,
          address: storeForm.value.address,
          status: storeForm.value.status,
          statusText: statusTextMap[storeForm.value.status],
          openDate: storeForm.value.openDate
        }
        ElMessage.success('门店编辑成功')
      }
    } else {
      // 添加门店
      const newStore = {
        id: stores.value.length + 1,
        name: storeForm.value.name,
        code: storeForm.value.code,
        region: storeForm.value.region,
        address: storeForm.value.address,
        status: storeForm.value.status,
        statusText: statusTextMap[storeForm.value.status],
        openDate: storeForm.value.openDate
      }
      stores.value.push(newStore)
      total.value++
      ElMessage.success('门店添加成功')
    }
    
    dialogVisible.value = false
    loading.close()
  }, 1000)
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

// 添加门店
const addStore = () => {
  // 重置表单
  storeForm.value = {
    id: null,
    name: '',
    code: '',
    region: '',
    address: '',
    status: 'operating',
    openDate: ''
  }
  dialogTitle.value = '添加门店'
  dialogVisible.value = true
}

// 处理选择变化
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

// 批量删除门店
const batchDeleteStores = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请选择要删除的门店')
    return
  }
  
  ElMessageBox.confirm(`确定要删除选中的 ${multipleSelection.value.length} 个门店吗？删除后将无法恢复。`, '批量删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const loading = ElLoading.service({ text: '正在批量删除门店...' })
    
    setTimeout(() => {
      // 模拟批量删除逻辑
      const idsToDelete = multipleSelection.value.map(item => item.id)
      stores.value = stores.value.filter(store => !idsToDelete.includes(store.id))
      total.value = stores.value.length
      multipleSelection.value = []
      ElMessage.success(`成功删除 ${idsToDelete.length} 个门店`)
      loading.close()
    }, 1000)
  }).catch(() => {
    ElMessage.info('已取消批量删除操作')
  })
}

// 批量修改门店状态
const batchUpdateStatus = (status) => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请选择要修改的门店')
    return
  }
  
  const statusTextMap = {
    operating: '营业中',
    renovation: '装修中',
    closed: '已关闭'
  }
  
  const loading = ElLoading.service({ text: '正在批量修改门店状态...' })
  
  setTimeout(() => {
    // 模拟批量修改状态逻辑
    multipleSelection.value.forEach(item => {
      const store = stores.value.find(s => s.id === item.id)
      if (store) {
        store.status = status
        store.statusText = statusTextMap[status]
      }
    })
    ElMessage.success(`成功修改 ${multipleSelection.value.length} 个门店的状态为 ${statusTextMap[status]}`)
    loading.close()
  }, 1000)
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
    console.log('门店数据加载完成')
  }, 500)
})
</script>

<style scoped>
.headquarters-stores {
  padding: 20px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
}

.page-header h1 {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.search-filter {
  margin-bottom: 20px;
  padding: 0 20px;
}

/* 批量操作按钮样式 */
.batch-actions {
  margin-bottom: 16px;
  padding: 12px 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.store-list {
  padding: 0 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>