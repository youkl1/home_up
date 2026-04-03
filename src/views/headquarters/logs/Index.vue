<template>
  <div class="headquarters-logs">
    <div class="page-header">
      <h1>操作日志审计</h1>
      <div class="header-actions">
        <el-button type="primary" @click="exportLogs">导出日志</el-button>
      </div>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索操作人或操作内容" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="operationType" placeholder="选择操作类型">
              <el-option label="全部" value=""></el-option>
              <el-option label="登录" value="login"></el-option>
              <el-option label="新增" value="create"></el-option>
              <el-option label="编辑" value="update"></el-option>
              <el-option label="删除" value="delete"></el-option>
              <el-option label="其他" value="other"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="24" style="text-align: right">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 日志列表 -->
    <div class="log-list">
      <el-card shadow="hover">
        <el-table :data="logs" style="width: 100%">
          <el-table-column prop="id" label="日志ID" width="80"></el-table-column>
          <el-table-column prop="operator" label="操作人" width="120"></el-table-column>
          <el-table-column prop="operation" label="操作内容"></el-table-column>
          <el-table-column prop="type" label="操作类型" width="100">
            <template #default="scope">
              <el-tag :type="getTypeType(scope.row.type)">{{ scope.row.typeText }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="IP地址" width="150"></el-table-column>
          <el-table-column prop="device" label="设备" width="150"></el-table-column>
          <el-table-column prop="createTime" label="操作时间" width="180"></el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="scope">
              <el-button type="text" size="small" @click="viewLog(scope.row)">查看</el-button>
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
    
    <!-- 查看日志详情弹窗 -->
    <el-dialog
      v-model="viewDialogVisible"
      :title="`日志详情：${viewForm.id}`"
      width="600px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="日志ID">{{ viewForm.id }}</el-descriptions-item>
        <el-descriptions-item label="操作人">{{ viewForm.operator }}</el-descriptions-item>
        <el-descriptions-item label="操作内容">{{ viewForm.operation }}</el-descriptions-item>
        <el-descriptions-item label="操作类型">{{ viewForm.typeText }}</el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ viewForm.ip }}</el-descriptions-item>
        <el-descriptions-item label="设备">{{ viewForm.device }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ viewForm.createTime }}</el-descriptions-item>
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
import { ElMessage, ElLoading } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const operationType = ref('')
const dateRange = ref([])

// 弹窗相关
const viewDialogVisible = ref(false)

// 查看表单
const viewForm = ref({
  id: null,
  operator: '',
  operation: '',
  type: '',
  typeText: '',
  ip: '',
  device: '',
  createTime: ''
})

// 日志数据
const logs = ref([
  { id: 1, operator: '管理员', operation: '登录系统', type: 'login', typeText: '登录', ip: '192.168.1.100', device: 'Chrome/90.0.4430.212', createTime: '2026-04-01 10:30:25' },
  { id: 2, operator: '张三', operation: '新增用户李四', type: 'create', typeText: '新增', ip: '192.168.1.101', device: 'Firefox/88.0', createTime: '2026-04-01 09:15:42' },
  { id: 3, operator: '李四', operation: '编辑产品信息', type: 'update', typeText: '编辑', ip: '192.168.1.102', device: 'Safari/14.0', createTime: '2026-03-31 16:45:18' },
  { id: 4, operator: '王五', operation: '删除客户记录', type: 'delete', typeText: '删除', ip: '192.168.1.103', device: 'Edge/90.0.818.66', createTime: '2026-03-31 14:20:33' },
  { id: 5, operator: '管理员', operation: '导出报表', type: 'other', typeText: '其他', ip: '192.168.1.100', device: 'Chrome/90.0.4430.212', createTime: '2026-03-30 11:05:57' }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 获取操作类型样式
const getTypeType = (type) => {
  switch (type) {
    case 'login':
      return 'info'
    case 'create':
      return 'success'
    case 'update':
      return 'warning'
    case 'delete':
      return 'danger'
    default:
      return 'info'
  }
}

// 搜索
const search = () => {
  // 模拟搜索过程
  const loading = ElLoading.service({ text: '正在搜索日志...' })
  
  setTimeout(() => {
    // 过滤数据
    const filteredLogs = logs.value.filter(log => {
      const keywordMatch = log.operator.toLowerCase().includes(searchKeyword.value.toLowerCase()) || log.operation.toLowerCase().includes(searchKeyword.value.toLowerCase())
      const typeMatch = !operationType.value || log.type === operationType.value
      // 日期范围匹配
      let dateMatch = true
      if (dateRange.value && dateRange.value.length === 2) {
        const logDate = new Date(log.createTime)
        const startDate = new Date(dateRange.value[0])
        const endDate = new Date(dateRange.value[1])
        dateMatch = logDate >= startDate && logDate <= endDate
      }
      return keywordMatch && typeMatch && dateMatch
    })
    
    // 更新显示数据
    total.value = filteredLogs.length
    
    if (filteredLogs.length > 0) {
      ElMessage.success(`找到 ${filteredLogs.length} 条日志记录`)
    } else {
      ElMessage.info('未找到匹配的日志记录')
    }
    loading.close()
  }, 500)
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  operationType.value = ''
  dateRange.value = []
  ElMessage.info('搜索条件已重置')
}

// 查看日志详情
const viewLog = (log) => {
  // 填充查看表单数据
  viewForm.value = {
    id: log.id,
    operator: log.operator,
    operation: log.operation,
    type: log.type,
    typeText: log.typeText,
    ip: log.ip,
    device: log.device,
    createTime: log.createTime
  }
  viewDialogVisible.value = true
}

// 导出日志
const exportLogs = () => {
  // 模拟导出过程
  const loading = ElLoading.service({ text: '正在导出日志...' })
  
  setTimeout(() => {
    // 模拟导出成功
    ElMessage.success('日志导出成功，文件已下载')
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

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
  }, 500)
})
</script>

<style scoped>
.headquarters-logs {
  padding: 20px 0;
}

.page-header {
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

.log-list {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>