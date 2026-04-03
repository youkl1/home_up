<template>
  <div class="contracts-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">签约管理</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section mb-6">
      <el-card shadow="hover" class="card transition-all">
        <div class="filter-form">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="filterForm.status" placeholder="签约状态" size="small" class="w-full">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="待签约" value="pending"></el-option>
                <el-option label="已签约" value="signed"></el-option>
                <el-option label="已过期" value="expired"></el-option>
                <el-option label="已终止" value="terminated"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.region" placeholder="区域" size="small" class="w-full">
                <el-option label="全部区域" value=""></el-option>
                <el-option label="华北区" value="north"></el-option>
                <el-option label="华东区" value="east"></el-option>
                <el-option label="华南区" value="south"></el-option>
                <el-option label="西南区" value="southwest"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input v-model="filterForm.keyword" placeholder="搜索加盟商名称" size="small" class="w-full">
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-date-picker
                v-model="filterForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                class="w-full"
              />
            </el-col>
          </el-row>
          <div class="filter-actions mt-4 flex justify-end">
            <el-button size="small" class="mr-2" @click="resetFilter">重置</el-button>
            <el-button type="primary" size="small" @click="searchContracts">查询</el-button>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 合同列表 -->
    <div class="contracts-list mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">加盟商合同列表</span>
            <span class="text-secondary">共 {{ total }} 份合同</span>
          </div>
        </template>
        <el-table :data="contractsList" style="width: 100%" class="contracts-table">
          <el-table-column prop="id" label="合同编号" width="180"></el-table-column>
          <el-table-column prop="franchiseeName" label="加盟商名称"></el-table-column>
          <el-table-column prop="contactName" label="联系人" width="120"></el-table-column>
          <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
          <el-table-column prop="region" label="区域" width="120"></el-table-column>
          <el-table-column prop="signingDate" label="签约日期" width="150"></el-table-column>
          <el-table-column prop="expiryDate" label="到期日期" width="150"></el-table-column>
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row)">查看详情</el-button>
              <el-button size="small" type="primary" @click="viewContract(scope.row)">查看合同</el-button>
              <el-button size="small" :type="scope.row.status === '已签约' ? 'danger' : 'success'" @click="toggleStatus(scope.row)">
                {{ scope.row.status === '已签约' ? '禁用' : '启用' }}
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
    
    <!-- 合同详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="合同详情"
      width="800px"
    >
      <div class="contract-detail">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form :model="currentContract" label-width="100px">
              <el-form-item label="合同编号">
                <span>{{ currentContract.id }}</span>
              </el-form-item>
              <el-form-item label="加盟商名称">
                <span>{{ currentContract.franchiseeName }}</span>
              </el-form-item>
              <el-form-item label="联系人">
                <span>{{ currentContract.contactName }}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{ currentContract.phone }}</span>
              </el-form-item>
              <el-form-item label="区域">
                <span>{{ currentContract.region }}</span>
              </el-form-item>
              <el-form-item label="签约日期">
                <span>{{ currentContract.signingDate }}</span>
              </el-form-item>
              <el-form-item label="到期日期">
                <span>{{ currentContract.expiryDate }}</span>
              </el-form-item>
              <el-form-item label="状态">
                <el-tag :type="getStatusType(currentContract.status)">{{ currentContract.status }}</el-tag>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" class="mb-4">
              <template #header>
                <div class="card-header">
                  <span>合同信息</span>
                </div>
              </template>
              <div class="contract-info">
                <div class="info-item">
                  <span class="info-label">合同类型：</span>
                  <span>{{ currentContract.contractType || '标准加盟合同' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">合同金额：</span>
                  <span>{{ currentContract.amount || '¥50,000' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">付款方式：</span>
                  <span>{{ currentContract.paymentMethod || '一次性支付' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">签约地点：</span>
                  <span>{{ currentContract.signingLocation || '总部' }}</span>
                </div>
              </div>
            </el-card>
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>合同附件</span>
                </div>
              </template>
              <div class="contract-attachments">
                <div v-for="(attachment, index) in currentContract.attachments" :key="index" class="attachment-item">
                  <el-icon class="attachment-icon"><Document /></el-icon>
                  <span class="attachment-name">{{ attachment.name }}</span>
                  <el-button size="small" type="primary" @click="downloadAttachment(attachment)">下载</el-button>
                </div>
                <div v-if="!currentContract.attachments || currentContract.attachments.length === 0" class="no-attachments">
                  暂无附件
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="renewContract">续约</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 查看合同弹窗 -->
    <el-dialog
      v-model="viewContractDialogVisible"
      title="查看合同"
      width="900px"
    >
      <div class="view-contract">
        <div class="contract-header">
          <h2 class="contract-title">{{ currentContract.franchiseeName }} - 加盟合同</h2>
          <div class="contract-meta">
            <span class="meta-item">合同编号：{{ currentContract.id }}</span>
            <span class="meta-item">签约日期：{{ currentContract.signingDate }}</span>
          </div>
        </div>
        <div class="contract-content">
          <div class="content-section">
            <h3>一、合同双方</h3>
            <p>甲方：品牌总部</p>
            <p>乙方：{{ currentContract.franchiseeName }}</p>
          </div>
          <div class="content-section">
            <h3>二、合同期限</h3>
            <p>本合同有效期自 {{ currentContract.signingDate }} 至 {{ currentContract.expiryDate }}，为期3年。</p>
          </div>
          <div class="content-section">
            <h3>三、加盟费用</h3>
            <p>乙方应向甲方支付加盟费 {{ currentContract.amount || '¥50,000' }}，支付方式为 {{ currentContract.paymentMethod || '一次性支付' }}。</p>
          </div>
          <div class="content-section">
            <h3>四、双方权利与义务</h3>
            <p>1. 甲方应向乙方提供品牌授权、培训支持、营销支持等服务。</p>
            <p>2. 乙方应按照甲方的标准经营，维护品牌形象。</p>
          </div>
          <div class="content-section">
            <h3>五、违约责任</h3>
            <p>任何一方违反合同约定，应承担相应的违约责任。</p>
          </div>
          <div class="content-section">
            <h3>六、争议解决</h3>
            <p>本合同发生争议，双方应协商解决；协商不成的，提交甲方所在地法院诉讼解决。</p>
          </div>
        </div>
        <div class="contract-footer">
          <div class="signatory">
            <div class="sign-party">
              <p class="party-name">甲方（盖章）：品牌总部</p>
              <p class="sign-date">日期：{{ currentContract.signingDate }}</p>
            </div>
            <div class="sign-party">
              <p class="party-name">乙方（盖章）：{{ currentContract.franchiseeName }}</p>
              <p class="sign-date">日期：{{ currentContract.signingDate }}</p>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="viewContractDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="printContract">打印合同</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, Document } from '@element-plus/icons-vue'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'

// 筛选表单
const filterForm = ref({
  status: '',
  region: '',
  keyword: '',
  dateRange: []
})

// 合同列表
const contractsList = ref([
  {
    id: 'CT202604001',
    franchiseeName: '北京现代家居有限公司',
    contactName: '张总',
    phone: '138****1234',
    region: '华北区',
    signingDate: '2026-04-01',
    expiryDate: '2029-03-31',
    status: '已签约',
    contractType: '标准加盟合同',
    amount: '¥50,000',
    paymentMethod: '一次性支付',
    signingLocation: '总部',
    attachments: [
      { name: '合同正本.pdf', url: '#' },
      { name: '补充协议.pdf', url: '#' }
    ]
  },
  {
    id: 'CT202604002',
    franchiseeName: '上海时尚家居有限公司',
    contactName: '李总',
    phone: '139****5678',
    region: '华东区',
    signingDate: '2026-03-15',
    expiryDate: '2029-03-14',
    status: '已签约',
    contractType: '标准加盟合同',
    amount: '¥50,000',
    paymentMethod: '一次性支付',
    signingLocation: '上海分公司',
    attachments: [
      { name: '合同正本.pdf', url: '#' }
    ]
  },
  {
    id: 'CT202604003',
    franchiseeName: '广州宜居家居有限公司',
    contactName: '王总',
    phone: '137****9012',
    region: '华南区',
    signingDate: '2026-02-20',
    expiryDate: '2029-02-19',
    status: '已签约',
    contractType: '标准加盟合同',
    amount: '¥50,000',
    paymentMethod: '一次性支付',
    signingLocation: '广州分公司',
    attachments: [
      { name: '合同正本.pdf', url: '#' },
      { name: '补充协议.pdf', url: '#' }
    ]
  },
  {
    id: 'CT202604004',
    franchiseeName: '成都舒适家居有限公司',
    contactName: '赵总',
    phone: '136****3456',
    region: '西南区',
    signingDate: '2026-01-10',
    expiryDate: '2029-01-09',
    status: '已签约',
    contractType: '标准加盟合同',
    amount: '¥50,000',
    paymentMethod: '一次性支付',
    signingLocation: '成都分公司',
    attachments: [
      { name: '合同正本.pdf', url: '#' }
    ]
  },
  {
    id: 'CT202604005',
    franchiseeName: '深圳创新家居有限公司',
    contactName: '刘总',
    phone: '135****7890',
    region: '华南区',
    signingDate: '2025-12-01',
    expiryDate: '2028-11-30',
    status: '已过期',
    contractType: '标准加盟合同',
    amount: '¥50,000',
    paymentMethod: '一次性支付',
    signingLocation: '深圳分公司',
    attachments: [
      { name: '合同正本.pdf', url: '#' }
    ]
  }
])

// 分页数据
const total = ref(50)

// 弹窗状态
const detailDialogVisible = ref(false)
const viewContractDialogVisible = ref(false)

// 当前合同
const currentContract = ref({})

// 获取状态类型
const getStatusType = (status) => {
  const map = {
    '待签约': 'info',
    '已签约': 'success',
    '已过期': 'warning',
    '已终止': 'danger'
  }
  return map[status] || ''
}

// 重置筛选
const resetFilter = () => {
  filterForm.value = {
    status: '',
    region: '',
    keyword: '',
    dateRange: []
  }
}

// 搜索合同
const searchContracts = () => {
  console.log('搜索合同:', filterForm.value)
  // 这里可以调用接口搜索合同
}

// 查看详情
const viewDetail = (row) => {
  Object.assign(currentContract.value, row)
  detailDialogVisible.value = true
}

// 查看合同
const viewContract = (row) => {
  Object.assign(currentContract.value, row)
  viewContractDialogVisible.value = true
}

// 切换状态
const toggleStatus = (row) => {
  const newStatus = row.status === '已签约' ? '已终止' : '已签约'
  const confirmMessage = row.status === '已签约' ? `确定要终止合同「${row.id}」吗？` : `确定要启用合同「${row.id}」吗？`
  
  ElMessageBox.confirm(
    confirmMessage,
    '切换状态',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: row.status === '已签约' ? 'warning' : 'success'
    }
  ).then(() => {
    const loading = ElLoading.service({
      lock: true,
      text: '处理中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    // 模拟API调用
    setTimeout(() => {
      row.status = newStatus
      ElMessage.success('状态切换成功')
      loading.close()
    }, 1000)
  }).catch(() => {
    // 取消操作
  })
}

// 下载附件
const downloadAttachment = (attachment) => {
  ElMessage.success(`正在下载：${attachment.name}`)
  // 这里可以实现文件下载逻辑
}

// 续约
const renewContract = () => {
  ElMessageBox.confirm(
    `确定要为「${currentContract.value.franchiseeName}」续约吗？`,
    '续约',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    const loading = ElLoading.service({
      lock: true,
      text: '处理中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    // 模拟API调用
    setTimeout(() => {
      // 更新合同到期日期
      const currentDate = new Date(currentContract.value.expiryDate)
      currentDate.setFullYear(currentDate.getFullYear() + 3)
      currentContract.value.expiryDate = currentDate.toISOString().split('T')[0]
      currentContract.value.status = '已签约'
      
      // 更新列表中的数据
      const index = contractsList.value.findIndex(item => item.id === currentContract.value.id)
      if (index !== -1) {
        contractsList.value[index].expiryDate = currentContract.value.expiryDate
        contractsList.value[index].status = '已签约'
      }
      
      ElMessage.success('续约成功')
      loading.close()
      detailDialogVisible.value = false
    }, 1000)
  }).catch(() => {
    // 取消续约
  })
}

// 打印合同
const printContract = () => {
  ElMessage.success('正在打印合同...')
  // 这里可以实现打印逻辑
}

// 分页处理
const handleCurrentChange = (current) => {
  console.log('当前页码:', current)
  // 这里可以调用接口获取对应页码的数据
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
.contracts-page {
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

.contracts-list {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contracts-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: center;
}

/* 合同详情弹窗样式 */
.contract-detail {
  padding: var(--spacing-sm);
}

.contract-info {
  padding: var(--spacing-sm);
}

.info-item {
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: center;
}

.info-label {
  width: 80px;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.contract-attachments {
  padding: var(--spacing-sm);
}

.attachment-item {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--bg-light);
  border-radius: var(--border-radius-sm);
}

.attachment-icon {
  margin-right: var(--spacing-sm);
  color: var(--primary-color);
}

.attachment-name {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

.no-attachments {
  text-align: center;
  color: var(--text-secondary);
  padding: var(--spacing-md);
  font-size: var(--font-size-sm);
}

/* 查看合同弹窗样式 */
.view-contract {
  padding: var(--spacing-md);
  background: white;
  border-radius: var(--border-radius-md);
}

.contract-header {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.contract-title {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--text-title);
  margin-bottom: var(--spacing-sm);
  text-align: center;
}

.contract-meta {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.contract-content {
  margin-bottom: var(--spacing-lg);
}

.content-section {
  margin-bottom: var(--spacing-md);
}

.content-section h3 {
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: var(--text-title);
  margin-bottom: var(--spacing-sm);
}

.content-section p {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  line-height: 1.5;
  margin-bottom: var(--spacing-xs);
}

.contract-footer {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.signatory {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-md);
}

.sign-party {
  text-align: center;
  flex: 1;
}

.party-name {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.sign-date {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .filter-form .el-col {
    --el-col-span: 12;
  }
}

@media screen and (max-width: 768px) {
  .contracts-page {
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
  
  .contract-detail .el-col {
    --el-col-span: 24;
  }
  
  .contract-meta {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: center;
  }
  
  .signatory {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .sign-party {
    margin-bottom: var(--spacing-md);
  }
}
</style>