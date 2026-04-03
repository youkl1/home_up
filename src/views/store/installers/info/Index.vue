<template>
  <div class="installers-info">
    <div class="page-header">
      <h1>师傅信息管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="addInstaller">新增师傅</el-button>
      </div>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="师傅姓名">
          <el-input v-model="filterForm.name" size="small" placeholder="请输入师傅姓名"></el-input>
        </el-form-item>
        <el-form-item label="服务状态">
          <el-select v-model="filterForm.status" size="small" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="enabled"></el-option>
            <el-option label="禁用" value="disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务类型">
          <el-select v-model="filterForm.serviceType" size="small" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="家具安装" value="furniture"></el-option>
            <el-option label="家电安装" value="appliance"></el-option>
            <el-option label="整体定制" value="custom"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="searchInstallers">查询</el-button>
          <el-button size="small" @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 师傅列表 -->
    <div class="table-section">
      <el-card shadow="hover">
        <el-table :data="installers" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="师傅ID" width="120"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
          <el-table-column prop="serviceType" label="服务类型" width="120">
            <template #default="scope">
              {{ getServiceTypeText(scope.row.serviceType) }}
            </template>
          </el-table-column>
          <el-table-column prop="serviceArea" label="服务范围"></el-table-column>
          <el-table-column prop="rating" label="好评率" width="100">
            <template #default="scope">
              <el-tag type="success">{{ scope.row.rating }}%</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="serviceCount" label="服务工单" width="100"></el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'enabled' ? 'success' : 'danger'">
                {{ scope.row.status === 'enabled' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template #default="scope">
              <el-button size="small" @click="editInstaller(scope.row)">编辑</el-button>
              <el-button size="small" type="primary" @click="showDetailDialog(scope.row)">详情</el-button>
              <el-button size="small" :type="scope.row.status === 'enabled' ? 'danger' : 'success'" @click="toggleStatus(scope.row)">
                {{ scope.row.status === 'enabled' ? '禁用' : '启用' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-card>
    </div>
    
    <!-- 新增/编辑师傅弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑师傅信息' : '新增师傅'"
      width="800px"
    >
      <div class="installer-form">
        <el-form ref="installerFormRef" :model="installerForm" :rules="installerRules" label-width="120px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="installerForm.name" placeholder="请输入师傅姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="installerForm.phone" placeholder="请输入联系电话"></el-input>
          </el-form-item>
          <el-form-item label="服务类型" prop="serviceType">
            <el-select v-model="installerForm.serviceType" placeholder="请选择服务类型">
              <el-option label="家具安装" value="furniture"></el-option>
              <el-option label="家电安装" value="appliance"></el-option>
              <el-option label="整体定制" value="custom"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务范围" prop="serviceArea">
            <el-input v-model="installerForm.serviceArea" placeholder="请输入服务范围"></el-input>
          </el-form-item>
          <el-form-item label="资质证件">
            <el-upload
              class="upload-demo"
              action="#"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="installerForm.certificates"
              :auto-upload="false"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  只能上传图片文件，且不超过5MB
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="installerForm.remark" :rows="3" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">提交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 师傅详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="师傅详情"
      width="800px"
    >
      <div class="installer-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="师傅ID">{{ selectedInstaller.id }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ selectedInstaller.name }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ selectedInstaller.phone }}</el-descriptions-item>
          <el-descriptions-item label="服务类型">{{ getServiceTypeText(selectedInstaller.serviceType) }}</el-descriptions-item>
          <el-descriptions-item label="服务范围">{{ selectedInstaller.serviceArea }}</el-descriptions-item>
          <el-descriptions-item label="好评率"><el-tag type="success">{{ selectedInstaller.rating }}%</el-tag></el-descriptions-item>
          <el-descriptions-item label="服务工单">{{ selectedInstaller.serviceCount }}</el-descriptions-item>
          <el-descriptions-item label="服务状态"><el-tag :type="selectedInstaller.status === 'enabled' ? 'success' : 'danger'">{{ selectedInstaller.status === 'enabled' ? '启用' : '禁用' }}</el-tag></el-descriptions-item>
          <el-descriptions-item label="入职时间" span="2">{{ selectedInstaller.joinTime || '暂无' }}</el-descriptions-item>
          <el-descriptions-item label="备注" span="2">{{ selectedInstaller.remark || '暂无' }}</el-descriptions-item>
        </el-descriptions>

        <div class="service-stats" v-if="selectedInstaller.stats">
          <h3>服务统计</h3>
          <div class="stats-grid">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-label">本月服务</div>
                <div class="stat-value">{{ selectedInstaller.stats.monthlyService || 0 }}</div>
              </div>
            </el-card>
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-label">累计服务</div>
                <div class="stat-value">{{ selectedInstaller.stats.totalService || 0 }}</div>
              </div>
            </el-card>
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-label">平均评分</div>
                <div class="stat-value">{{ selectedInstaller.stats.avgRating || 0 }}分</div>
              </div>
            </el-card>
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-label">准时率</div>
                <div class="stat-value">{{ selectedInstaller.stats.onTimeRate || 0 }}%</div>
              </div>
            </el-card>
          </div>
        </div>

        <div class="recent-orders" v-if="selectedInstaller.recentOrders && selectedInstaller.recentOrders.length > 0">
          <h3>最近服务工单</h3>
          <el-table :data="selectedInstaller.recentOrders" style="width: 100%" size="small">
            <el-table-column prop="orderId" label="工单号" width="150"></el-table-column>
            <el-table-column prop="customer" label="客户" width="120"></el-table-column>
            <el-table-column prop="serviceType" label="服务类型"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'completed' ? 'success' : 'info'">{{ scope.row.status === 'completed' ? '已完成' : '处理中' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 筛选表单
const filterForm = ref({
  name: '',
  status: '',
  serviceType: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)
const loading = ref(false)
const submitting = ref(false)

// 已选师傅
const selectedInstallers = ref([])

// 师傅列表
const installers = ref([
  { id: 'INS001', name: '李师傅', phone: '138****8888', serviceType: 'furniture', serviceArea: '北京市朝阳区', rating: 98, serviceCount: 120, status: 'enabled' },
  { id: 'INS002', name: '王师傅', phone: '139****9999', serviceType: 'appliance', serviceArea: '北京市海淀区', rating: 95, serviceCount: 85, status: 'enabled' },
  { id: 'INS003', name: '张师傅', phone: '137****7777', serviceType: 'custom', serviceArea: '北京市西城区', rating: 92, serviceCount: 68, status: 'disabled' },
  { id: 'INS004', name: '赵师傅', phone: '136****6666', serviceType: 'furniture', serviceArea: '北京市东城区', rating: 97, serviceCount: 95, status: 'enabled' },
  { id: 'INS005', name: '刘师傅', phone: '135****5555', serviceType: 'appliance', serviceArea: '北京市丰台区', rating: 94, serviceCount: 72, status: 'enabled' }
])

// 弹窗
const dialogVisible = ref(false)
const isEdit = ref(false)
const installerForm = reactive({
  id: '',
  name: '',
  phone: '',
  serviceType: '',
  serviceArea: '',
  certificates: [],
  remark: ''
})
const installerRules = {
  name: [{ required: true, message: '请输入师傅姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  serviceType: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
  serviceArea: [{ required: true, message: '请输入服务范围', trigger: 'blur' }]
}
const installerFormRef = ref(null)

// 详情弹窗
const detailDialogVisible = ref(false)
const selectedInstaller = ref({
  id: '',
  name: '',
  phone: '',
  serviceType: '',
  serviceArea: '',
  rating: 0,
  serviceCount: 0,
  status: 'enabled',
  joinTime: '',
  remark: '',
  stats: null,
  recentOrders: []
})

// 获取服务类型文本
const getServiceTypeText = (type) => {
  const typeMap = {
    furniture: '家具安装',
    appliance: '家电安装',
    custom: '整体定制'
  }
  return typeMap[type] || type
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedInstallers.value = selection
}

// 查询师傅
const searchInstallers = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('查询成功')
  }, 500)
}

// 重置筛选
const resetFilter = () => {
  Object.assign(filterForm.value, {
    name: '',
    status: '',
    serviceType: ''
  })
}

// 新增师傅
const addInstaller = () => {
  isEdit.value = false
  Object.assign(installerForm, {
    id: '',
    name: '',
    phone: '',
    serviceType: '',
    serviceArea: '',
    certificates: [],
    remark: ''
  })
  dialogVisible.value = true
}

// 编辑师傅
const editInstaller = (installer) => {
  isEdit.value = true
  Object.assign(installerForm, { ...installer })
  dialogVisible.value = true
}

// 显示详情弹窗
const showDetailDialog = (installer) => {
  // 模拟获取师傅详情
  selectedInstaller.value = {
    ...installer,
    joinTime: '2026-01-01',
    stats: {
      monthlyService: 15,
      totalService: 120,
      avgRating: 4.8,
      onTimeRate: 95
    },
    recentOrders: [
      { orderId: 'SRV20260401001', customer: '张女士', serviceType: '家具安装', status: 'completed', createTime: '2026-04-01 10:30' },
      { orderId: 'SRV20260331001', customer: '李先生', serviceType: '家具安装', status: 'completed', createTime: '2026-03-31 14:20' },
      { orderId: 'SRV20260330001', customer: '王女士', serviceType: '家具安装', status: 'processing', createTime: '2026-03-30 09:15' }
    ]
  }
  detailDialogVisible.value = true
}

// 切换状态
const toggleStatus = (installer) => {
  const newStatus = installer.status === 'enabled' ? 'disabled' : 'enabled'
  const statusText = newStatus === 'enabled' ? '启用' : '禁用'
  
  ElMessageBox.confirm(
    `确定要${statusText}${installer.name}师傅吗？`,
    '状态变更',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      // 更新状态
      installer.status = newStatus
      ElMessage.success(`${installer.name}师傅已${statusText}`)
    }, 500)
  }).catch(() => {
    // 取消操作
  })
}

// 提交表单
const submitForm = async () => {
  const valid = await installerFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    dialogVisible.value = false
    ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
  }, 500)
}

// 上传预览
const handlePreview = (file) => {
  console.log(file)
}

// 上传移除
const handleRemove = (file, fileList) => {
  console.log(file, fileList)
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  // 加载对应页数据
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
.installers-info {
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

.filter-section {
  margin-bottom: 20px;
}

.filter-form {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
}

.table-section {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.installer-form {
  padding: 20px 0;
}

.upload-demo {
  margin-top: 10px;
}

.installer-detail {
  padding: 20px 0;
}

.service-stats {
  margin-top: 30px;
}

.service-stats h3 {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.stat-card {
  text-align: center;
  padding: 20px;
}

.stat-item {
  .stat-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
  }
  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
}

.recent-orders {
  margin-top: 30px;
}

.recent-orders h3 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
</style>
