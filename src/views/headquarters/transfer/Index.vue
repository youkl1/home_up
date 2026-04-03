<template>
  <div class="headquarters-transfer">
    <div class="page-header">
      <h1>客户资产交接</h1>
      <el-button type="primary" @click="initiateTransfer">发起交接</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索客户姓名或交接单号" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="status" placeholder="选择状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="待交接" value="pending"></el-option>
              <el-option label="已完成" value="completed"></el-option>
              <el-option label="已拒绝" value="rejected"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 交接列表 -->
    <div class="transfer-list">
      <el-card shadow="hover">
        <el-table :data="transfers" style="width: 100%">
          <el-table-column prop="id" label="交接单号" width="150"></el-table-column>
          <el-table-column prop="customerName" label="客户姓名"></el-table-column>
          <el-table-column prop="fromUser" label="交接人" width="120"></el-table-column>
          <el-table-column prop="toUser" label="接收人" width="120"></el-table-column>
          <el-table-column prop="reason" label="交接原因"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.statusText }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewTransfer(scope.row)">查看</el-button>
              <el-button v-if="scope.row.status === 'pending'" type="success" size="small" @click="approveTransfer(scope.row)">确认</el-button>
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
    
    <!-- 发起交接弹窗 -->
    <el-dialog
      v-model="initiateDialogVisible"
      title="发起资产交接"
      width="600px"
    >
      <el-form :model="transferForm" label-width="100px">
        <el-form-item label="客户姓名">
          <el-select v-model="transferForm.customerId" placeholder="选择客户">
            <el-option label="赵先生" value="1"></el-option>
            <el-option label="钱女士" value="2"></el-option>
            <el-option label="孙先生" value="3"></el-option>
            <el-option label="李先生" value="4"></el-option>
            <el-option label="周女士" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接收人">
          <el-select v-model="transferForm.toUser" placeholder="选择接收人">
            <el-option label="张三" value="张三"></el-option>
            <el-option label="李四" value="李四"></el-option>
            <el-option label="王五" value="王五"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交接原因">
          <el-input v-model="transferForm.reason" placeholder="请输入交接原因" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="initiateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitTransfer">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 查看交接详情弹窗 -->
    <el-dialog
      v-model="viewDialogVisible"
      :title="`交接详情：${viewForm.id}`"
      width="600px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="交接单号">{{ viewForm.id }}</el-descriptions-item>
        <el-descriptions-item label="客户姓名">{{ viewForm.customerName }}</el-descriptions-item>
        <el-descriptions-item label="交接人">{{ viewForm.fromUser }}</el-descriptions-item>
        <el-descriptions-item label="接收人">{{ viewForm.toUser }}</el-descriptions-item>
        <el-descriptions-item label="交接原因">{{ viewForm.reason }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ viewForm.statusText }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ viewForm.createTime }}</el-descriptions-item>
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
const status = ref('')

// 弹窗相关
const initiateDialogVisible = ref(false)
const viewDialogVisible = ref(false)

// 交接表单
const transferForm = ref({
  customerId: '',
  toUser: '',
  reason: ''
})

// 查看表单
const viewForm = ref({
  id: '',
  customerName: '',
  fromUser: '',
  toUser: '',
  reason: '',
  status: '',
  statusText: '',
  createTime: ''
})

// 交接数据
const transfers = ref([
  { id: 'TR20260401001', customerName: '赵先生', fromUser: '张三', toUser: '李四', reason: '离职交接', status: 'pending', statusText: '待交接', createTime: '2026-04-01 10:30' },
  { id: 'TR20260331001', customerName: '钱女士', fromUser: '李四', toUser: '王五', reason: '工作调整', status: 'completed', statusText: '已完成', createTime: '2026-03-31 14:20' },
  { id: 'TR20260330001', customerName: '孙先生', fromUser: '王五', toUser: '张三', reason: '客户分配', status: 'rejected', statusText: '已拒绝', createTime: '2026-03-30 09:15' },
  { id: 'TR20260329001', customerName: '李先生', fromUser: '张三', toUser: '李四', reason: '区域调整', status: 'completed', statusText: '已完成', createTime: '2026-03-29 16:45' },
  { id: 'TR20260328001', customerName: '周女士', fromUser: '李四', toUser: '王五', reason: '业务变更', status: 'pending', statusText: '待交接', createTime: '2026-03-28 11:00' }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 客户映射
const customerMap = {
  '1': '赵先生',
  '2': '钱女士',
  '3': '孙先生',
  '4': '李先生',
  '5': '周女士'
}

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'completed':
      return 'success'
    case 'rejected':
      return 'danger'
    default:
      return 'info'
  }
}

// 搜索
const search = () => {
  // 模拟搜索过程
  const loading = ElLoading.service({ text: '正在搜索交接记录...' })
  
  setTimeout(() => {
    // 过滤数据
    const filteredTransfers = transfers.value.filter(transfer => {
      const keywordMatch = transfer.id.includes(searchKeyword.value) || transfer.customerName.includes(searchKeyword.value)
      const statusMatch = !status.value || transfer.status === status.value
      return keywordMatch && statusMatch
    })
    
    // 更新显示数据
    total.value = filteredTransfers.length
    
    if (filteredTransfers.length > 0) {
      ElMessage.success(`找到 ${filteredTransfers.length} 条交接记录`)
    } else {
      ElMessage.info('未找到匹配的交接记录')
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

// 发起交接
const initiateTransfer = () => {
  // 重置表单
  transferForm.value = {
    customerId: '',
    toUser: '',
    reason: ''
  }
  initiateDialogVisible.value = true
}

// 提交交接
const submitTransfer = () => {
  // 表单验证
  if (!transferForm.value.customerId) {
    ElMessage.error('请选择客户')
    return
  }
  if (!transferForm.value.toUser) {
    ElMessage.error('请选择接收人')
    return
  }
  if (!transferForm.value.reason) {
    ElMessage.error('请输入交接原因')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在发起交接...' })
  
  setTimeout(() => {
    // 生成交接单号
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const serial = String(transfers.value.length + 1).padStart(3, '0')
    const transferId = `TR${date}${serial}`
    
    // 新增交接记录
    const newTransfer = {
      id: transferId,
      customerName: customerMap[transferForm.value.customerId],
      fromUser: '当前用户', // 实际项目中应该从登录信息获取
      toUser: transferForm.value.toUser,
      reason: transferForm.value.reason,
      status: 'pending',
      statusText: '待交接',
      createTime: new Date().toLocaleString('zh-CN')
    }
    
    transfers.value.unshift(newTransfer)
    total.value = transfers.value.length
    
    ElMessage.success('交接发起成功')
    initiateDialogVisible.value = false
    loading.close()
  }, 1000)
}

// 查看交接
const viewTransfer = (transfer) => {
  // 填充查看表单数据
  viewForm.value = {
    id: transfer.id,
    customerName: transfer.customerName,
    fromUser: transfer.fromUser,
    toUser: transfer.toUser,
    reason: transfer.reason,
    status: transfer.status,
    statusText: transfer.statusText,
    createTime: transfer.createTime
  }
  viewDialogVisible.value = true
}

// 确认交接
const approveTransfer = (transfer) => {
  // 确认对话框
  ElMessageBox.confirm(`确定要确认交接 ${transfer.id} 吗？`, '确认交接', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟确认过程
    const loading = ElLoading.service({ text: '正在确认交接...' })
    
    setTimeout(() => {
      // 更新交接状态
      const index = transfers.value.findIndex(t => t.id === transfer.id)
      if (index !== -1) {
        transfers.value[index].status = 'completed'
        transfers.value[index].statusText = '已完成'
        ElMessage.success('交接确认成功')
      }
      loading.close()
    }, 500)
  }).catch(() => {
    // 取消确认
    ElMessage.info('已取消确认操作')
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

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
  }, 500)
})
</script>

<style scoped>
.headquarters-transfer {
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

.transfer-list {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>