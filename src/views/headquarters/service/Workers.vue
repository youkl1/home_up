<template>
  <div class="workers-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">安装师傅库管理</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section mb-6">
      <el-card shadow="hover" class="card transition-all">
        <div class="filter-form">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="filterForm.region" placeholder="选择区域" size="small" class="w-full">
                <el-option label="全部区域" value=""></el-option>
                <el-option label="华北区" value="north"></el-option>
                <el-option label="华东区" value="east"></el-option>
                <el-option label="华南区" value="south"></el-option>
                <el-option label="西南区" value="southwest"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.serviceType" placeholder="服务类型" size="small" class="w-full">
                <el-option label="全部类型" value=""></el-option>
                <el-option label="橱柜安装" value="cabinet"></el-option>
                <el-option label="衣柜安装" value="wardrobe"></el-option>
                <el-option label="全屋定制" value="wholehouse"></el-option>
                <el-option label="卫浴安装" value="bathroom"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.rating" placeholder="评分" size="small" class="w-full">
                <el-option label="全部评分" value=""></el-option>
                <el-option label="4.5分以上" value="4.5"></el-option>
                <el-option label="4.0分以上" value="4.0"></el-option>
                <el-option label="3.5分以上" value="3.5"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input v-model="filterForm.keyword" placeholder="搜索师傅姓名/手机号" size="small" class="w-full">
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-col>
          </el-row>
          <div class="filter-actions mt-4 flex justify-end">
            <el-button size="small" class="mr-2" @click="resetFilter">重置</el-button>
            <el-button type="primary" size="small" @click="searchWorkers">查询</el-button>
            <el-button type="success" size="small" class="ml-2" @click="addWorker">新增师傅</el-button>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 师傅列表 -->
    <div class="workers-list mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">安装师傅列表</span>
            <span class="text-secondary">共 {{ total }} 位师傅</span>
          </div>
        </template>
        <el-table :data="workersList" style="width: 100%" class="workers-table">
          <el-table-column prop="id" label="师傅编号" width="120"></el-table-column>
          <el-table-column prop="name" label="姓名" width="100"></el-table-column>
          <el-table-column prop="phone" label="手机号" width="130"></el-table-column>
          <el-table-column prop="region" label="服务区域"></el-table-column>
          <el-table-column prop="serviceTypes" label="服务类型" width="150">
            <template #default="scope">
              <el-tag v-for="type in scope.row.serviceTypes" :key="type" size="small" class="mr-1">
                {{ type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="rating" label="评分" width="100">
            <template #default="scope">
              <div class="flex items-center">
                <el-icon class="text-warning mr-1"><StarFilled /></el-icon>
                <span class="font-semibold">{{ scope.row.rating }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="completionRate" label="完成率" width="100">
            <template #default="scope">
              <span class="text-success">{{ scope.row.completionRate }}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewWorkerDetail(scope.row)">查看详情</el-button>
              <el-button size="small" type="primary" @click="editWorker(scope.row)">编辑</el-button>
              <el-button 
                size="small" 
                :type="getActionType(scope.row.status)" 
                @click="toggleWorkerStatus(scope.row)"
              >
                {{ getActionText(scope.row.status) }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination mt-4 flex justify-center">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="10"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
    
    <!-- 新增/编辑师傅弹窗 -->
    <el-dialog
      v-model="workerDialogVisible"
      :title="workerForm.id ? '编辑师傅' : '新增师傅'"
      width="600px"
    >
      <el-form :model="workerForm" label-width="100px">
        <el-form-item label="师傅姓名">
          <el-input v-model="workerForm.name" placeholder="请输入师傅姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="workerForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="服务区域">
          <el-input v-model="workerForm.region" placeholder="请输入服务区域"></el-input>
        </el-form-item>
        <el-form-item label="服务类型">
          <el-select v-model="workerForm.serviceTypes" multiple placeholder="选择服务类型">
            <el-option label="橱柜安装" value="橱柜安装"></el-option>
            <el-option label="衣柜安装" value="衣柜安装"></el-option>
            <el-option label="全屋定制" value="全屋定制"></el-option>
            <el-option label="卫浴安装" value="卫浴安装"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="workerForm.remark" type="textarea" :rows="3" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="workerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitWorker">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 查看详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="`师傅详情：${detailForm.name}`"
      width="800px"
    >
      <div class="detail-header mb-4">
        <div class="flex-between items-center">
          <div>
            <h3 class="font-semibold">{{ detailForm.name }}</h3>
            <p class="text-secondary">师傅编号：{{ detailForm.id }}</p>
            <p class="text-secondary">手机号：{{ detailForm.phone }}</p>
            <p class="text-secondary">服务区域：{{ detailForm.region }}</p>
          </div>
          <div class="text-right">
            <p class="text-secondary">评分</p>
            <p class="text-xl font-bold">{{ detailForm.rating }}</p>
            <p class="text-secondary mt-2">完成率</p>
            <p class="text-lg font-bold text-success">{{ detailForm.completionRate }}%</p>
          </div>
        </div>
      </div>
      <div class="detail-content">
        <el-form label-width="100px">
          <el-form-item label="服务类型">
            <div>
              <el-tag v-for="type in detailForm.serviceTypes" :key="type" size="small" class="mr-1">
                {{ type }}
              </el-tag>
            </div>
          </el-form-item>
          <el-form-item label="工作经验">
            <el-input v-model="detailForm.experience" disabled></el-input>
          </el-form-item>
          <el-form-item label="认证状态">
            <el-tag :type="detailForm.certified ? 'success' : 'info'">
              {{ detailForm.certified ? '已认证' : '未认证' }}
            </el-tag>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="detailForm.remark" type="textarea" :rows="3" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, StarFilled } from '@element-plus/icons-vue'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'

// 筛选表单
const filterForm = ref({
  region: '',
  serviceType: '',
  rating: '',
  keyword: ''
})

// 弹窗相关
const workerDialogVisible = ref(false)
const detailDialogVisible = ref(false)

// 师傅表单
const workerForm = ref({
  id: '',
  name: '',
  phone: '',
  region: '',
  serviceTypes: [],
  remark: ''
})

// 详情表单
const detailForm = ref({
  id: '',
  name: '',
  phone: '',
  region: '',
  serviceTypes: [],
  rating: '',
  completionRate: '',
  experience: '',
  certified: false,
  remark: ''
})

// 师傅列表
const workersList = ref([
  {
    id: 'WK001',
    name: '张师傅',
    phone: '138****1234',
    region: '北京市朝阳区',
    serviceTypes: ['橱柜安装', '衣柜安装'],
    rating: '4.8',
    completionRate: '98',
    status: 'active'
  },
  {
    id: 'WK002',
    name: '李师傅',
    phone: '139****5678',
    region: '上海市浦东新区',
    serviceTypes: ['全屋定制', '卫浴安装'],
    rating: '4.6',
    completionRate: '95',
    status: 'active'
  },
  {
    id: 'WK003',
    name: '王师傅',
    phone: '137****9012',
    region: '广州市天河区',
    serviceTypes: ['橱柜安装', '全屋定制'],
    rating: '4.9',
    completionRate: '99',
    status: 'active'
  },
  {
    id: 'WK004',
    name: '赵师傅',
    phone: '136****3456',
    region: '深圳市南山区',
    serviceTypes: ['衣柜安装'],
    rating: '4.3',
    completionRate: '92',
    status: 'inactive'
  },
  {
    id: 'WK005',
    name: '刘师傅',
    phone: '135****7890',
    region: '成都市武侯区',
    serviceTypes: ['卫浴安装', '橱柜安装'],
    rating: '4.7',
    completionRate: '96',
    status: 'active'
  }
])

// 分页数据
const total = ref(100)

// 重置筛选
const resetFilter = () => {
  filterForm.value = {
    region: '',
    serviceType: '',
    rating: '',
    keyword: ''
  }
  ElMessage.info('筛选条件已重置')
}

// 搜索师傅
const searchWorkers = () => {
  // 模拟搜索过程
  const loading = ElLoading.service({ text: '正在搜索师傅...' })
  
  setTimeout(() => {
    // 过滤数据
    const filteredList = workersList.value.filter(item => {
      const keywordMatch = !filterForm.value.keyword || 
        item.name.includes(filterForm.value.keyword) || 
        item.phone.includes(filterForm.value.keyword)
      const regionMatch = !filterForm.value.region || item.region.includes(filterForm.value.region)
      return keywordMatch && regionMatch
    })
    
    total.value = filteredList.length
    
    if (filteredList.length > 0) {
      ElMessage.success(`找到 ${filteredList.length} 位师傅`)
    } else {
      ElMessage.info('未找到匹配的师傅')
    }
    loading.close()
  }, 500)
}

// 新增师傅
const addWorker = () => {
  // 重置表单
  workerForm.value = {
    id: '',
    name: '',
    phone: '',
    region: '',
    serviceTypes: [],
    remark: ''
  }
  workerDialogVisible.value = true
}

// 查看详情
const viewWorkerDetail = (row) => {
  // 填充详情表单
  detailForm.value = {
    id: row.id,
    name: row.name,
    phone: row.phone,
    region: row.region,
    serviceTypes: row.serviceTypes,
    rating: row.rating,
    completionRate: row.completionRate,
    experience: '5年',
    certified: true,
    remark: '技术精湛，服务态度好'
  }
  detailDialogVisible.value = true
}

// 编辑师傅
const editWorker = (row) => {
  // 填充表单
  workerForm.value = {
    id: row.id,
    name: row.name,
    phone: row.phone,
    region: row.region,
    serviceTypes: row.serviceTypes,
    remark: ''
  }
  workerDialogVisible.value = true
}

// 提交师傅
const submitWorker = () => {
  // 表单验证
  if (!workerForm.value.name) {
    ElMessage.error('请输入师傅姓名')
    return
  }
  if (!workerForm.value.phone) {
    ElMessage.error('请输入手机号')
    return
  }
  if (!workerForm.value.region) {
    ElMessage.error('请输入服务区域')
    return
  }
  if (workerForm.value.serviceTypes.length === 0) {
    ElMessage.error('请选择服务类型')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在保存师傅信息...' })
  
  setTimeout(() => {
    if (workerForm.value.id) {
      // 编辑师傅
      const index = workersList.value.findIndex(item => item.id === workerForm.value.id)
      if (index !== -1) {
        workersList.value[index] = {
          ...workersList.value[index],
          name: workerForm.value.name,
          phone: workerForm.value.phone,
          region: workerForm.value.region,
          serviceTypes: workerForm.value.serviceTypes
        }
        ElMessage.success('师傅信息编辑成功')
      }
    } else {
      // 新增师傅
      const newWorker = {
        id: `WK${String(workersList.value.length + 1).padStart(3, '0')}`,
        name: workerForm.value.name,
        phone: workerForm.value.phone,
        region: workerForm.value.region,
        serviceTypes: workerForm.value.serviceTypes,
        rating: '5.0',
        completionRate: '100',
        status: 'active'
      }
      workersList.value.push(newWorker)
      total.value++
      ElMessage.success('师傅添加成功')
    }
    
    workerDialogVisible.value = false
    loading.close()
  }, 1000)
}

// 切换师傅状态
const toggleWorkerStatus = (row) => {
  ElMessageBox.confirm(
    `确定要${row.status === 'active' ? '禁用' : '启用'}该师傅吗？`,
    '状态确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 模拟状态切换
    const loading = ElLoading.service({ text: '正在更新状态...' })
    
    setTimeout(() => {
      const index = workersList.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        workersList.value[index].status = row.status === 'active' ? 'inactive' : 'active'
        ElMessage.success(`师傅已${row.status === 'active' ? '禁用' : '启用'}`)
      }
      loading.close()
    }, 500)
  }).catch(() => {
    // 取消操作
  })
}

// 分页处理
const handleCurrentChange = (current) => {
  // 模拟API调用延迟
  const loading = ElLoading.service({ text: '正在加载数据...' })
  
  setTimeout(() => {
    // 实际项目中这里应该调用API获取对应页的数据
    ElMessage.success(`切换到第 ${current} 页`)
    loading.close()
  }, 300)
}

// 获取状态类型
const getStatusType = (status) => {
  return status === 'active' ? 'success' : 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  return status === 'active' ? '启用' : '禁用'
}

// 获取操作类型
const getActionType = (status) => {
  return status === 'active' ? 'danger' : 'success'
}

// 获取操作文本
const getActionText = (status) => {
  return status === 'active' ? '禁用' : '启用'
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
.workers-page {
  padding: var(--spacing-md);
  background-color: var(--bg-color);
  min-height: 100vh;
}

.page-header {
  margin-bottom: var(--spacing-md);
}

.filter-section {
  margin-bottom: var(--spacing-md);
}

.filter-form {
  padding: var(--spacing-sm);
}

.workers-list {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.workers-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: center;
}

.text-warning {
  color: var(--warning-color);
}

.text-success {
  color: var(--success-color);
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .filter-form .el-col {
    --el-col-span: 12;
  }
}

@media screen and (max-width: 768px) {
  .workers-page {
    padding: var(--spacing-sm);
  }
  
  .filter-form .el-col {
    --el-col-span: 24;
  }
  
  .filter-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}
</style>