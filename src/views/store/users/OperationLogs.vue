<template>
  <div class="operation-logs">
    <div class="page-header">
      <h1>操作日志</h1>
      <el-button type="primary" @click="exportLogs">
        <el-icon><Download /></el-icon>
        导出日志
      </el-button>
    </div>
    
    <!-- 搜索筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-input 
              v-model="searchForm.keyword" 
              placeholder="搜索操作人/内容" 
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="searchForm.module" placeholder="操作模块" clearable>
              <el-option label="账号管理" value="account" />
              <el-option label="客户管理" value="customer" />
              <el-option label="订单管理" value="order" />
              <el-option label="产品管理" value="product" />
              <el-option label="营销活动" value="marketing" />
              <el-option label="系统设置" value="system" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="searchForm.operationType" placeholder="操作类型" clearable>
              <el-option label="新增" value="CREATE" />
              <el-option label="修改" value="UPDATE" />
              <el-option label="删除" value="DELETE" />
              <el-option label="查询" value="QUERY" />
              <el-option label="导出" value="EXPORT" />
              <el-option label="登录" value="LOGIN" />
              <el-option label="登出" value="LOGOUT" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="searchForm.result" placeholder="操作结果" clearable>
              <el-option label="成功" value="SUCCESS" />
              <el-option label="失败" value="FAILURE" />
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 统计卡片 -->
    <div class="stats-row">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ stats.todayCount }}</div>
            <div class="stat-label">今日操作</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card success">
            <div class="stat-value">{{ stats.successRate }}%</div>
            <div class="stat-label">成功率</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card warning">
            <div class="stat-value">{{ stats.activeUsers }}</div>
            <div class="stat-label">活跃用户</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card danger">
            <div class="stat-value">{{ stats.failures }}</div>
            <div class="stat-label">异常操作</div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 日志列表 -->
    <div class="logs-list">
      <el-card shadow="hover">
        <el-table 
          :data="logs" 
          style="width: 100%"
          v-loading="loading"
          @expand-change="handleExpandChange"
        >
          <el-table-column type="expand">
            <template #default="{ row }">
              <div class="log-detail">
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="操作ID">{{ row.id }}</el-descriptions-item>
                  <el-descriptions-item label="操作时间">{{ row.operationTime }}</el-descriptions-item>
                  <el-descriptions-item label="操作人ID">{{ row.operatorId }}</el-descriptions-item>
                  <el-descriptions-item label="操作人姓名">{{ row.operatorName }}</el-descriptions-item>
                  <el-descriptions-item label="操作模块">{{ row.module }}</el-descriptions-item>
                  <el-descriptions-item label="操作类型">{{ row.operationType }}</el-descriptions-item>
                  <el-descriptions-item label="客户端IP">{{ row.ipAddress }}</el-descriptions-item>
                  <el-descriptions-item label="操作结果">
                    <el-tag :type="row.result === 'SUCCESS' ? 'success' : 'danger'">
                      {{ row.result === 'SUCCESS' ? '成功' : '失败' }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="操作内容" :span="2">{{ row.content }}</el-descriptions-item>
                  <el-descriptions-item label="请求参数" :span="2">
                    <pre class="json-content">{{ formatJson(row.requestParams) }}</pre>
                  </el-descriptions-item>
                  <el-descriptions-item label="响应结果" :span="2" v-if="row.responseData">
                    <pre class="json-content">{{ formatJson(row.responseData) }}</pre>
                  </el-descriptions-item>
                  <el-descriptions-item label="错误信息" :span="2" v-if="row.errorMessage">
                    <div class="error-message">{{ row.errorMessage }}</div>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="日志ID" width="100" />
          <el-table-column prop="operationTime" label="操作时间" width="160" sortable />
          <el-table-column label="操作人" min-width="150">
            <template #default="{ row }">
              <div class="operator-info">
                <el-avatar :size="28" :src="row.operatorAvatar">{{ row.operatorName?.charAt(0) }}</el-avatar>
                <div class="operator-detail">
                  <div class="name">{{ row.operatorName }}</div>
                  <div class="id">ID: {{ row.operatorId }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="module" label="操作模块" width="120">
            <template #default="{ row }">
              <el-tag size="small">{{ getModuleText(row.module) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="operationType" label="操作类型" width="100">
            <template #default="{ row }">
              <el-tag :type="getOperationTypeType(row.operationType)" size="small">
                {{ getOperationTypeText(row.operationType) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="操作内容" min-width="200" show-overflow-tooltip />
          <el-table-column prop="ipAddress" label="IP地址" width="130" />
          <el-table-column prop="result" label="结果" width="80" align="center">
            <template #default="{ row }">
              <el-icon :size="18" :color="row.result === 'SUCCESS' ? '#67c23a' : '#f56c6c'">
                <CircleCheck v-if="row.result === 'SUCCESS'" />
                <CircleClose v-else />
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </el-card>
    </div>
    
    <!-- 日志详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="日志详情"
      width="800px"
    >
      <div class="log-detail-dialog" v-if="currentLog">
        <el-timeline>
          <el-timeline-item 
            :type="currentLog.result === 'SUCCESS' ? 'success' : 'danger'"
            :icon="currentLog.result === 'SUCCESS' ? CircleCheck : CircleClose"
            :timestamp="currentLog.operationTime"
          >
            <h4>{{ currentLog.content }}</h4>
            <p>操作人：{{ currentLog.operatorName }} (ID: {{ currentLog.operatorId }})</p>
          </el-timeline-item>
        </el-timeline>
        
        <el-divider />
        
        <el-descriptions :column="2" border>
          <el-descriptions-item label="操作模块">{{ getModuleText(currentLog.module) }}</el-descriptions-item>
          <el-descriptions-item label="操作类型">{{ getOperationTypeText(currentLog.operationType) }}</el-descriptions-item>
          <el-descriptions-item label="客户端IP">{{ currentLog.ipAddress }}</el-descriptions-item>
          <el-descriptions-item label="用户代理">{{ currentLog.userAgent }}</el-descriptions-item>
          <el-descriptions-item label="请求URL" :span="2">{{ currentLog.requestUrl }}</el-descriptions-item>
        </el-descriptions>
        
        <div class="detail-section">
          <div class="section-title">请求参数</div>
          <pre class="code-block">{{ formatJson(currentLog.requestParams) }}</pre>
        </div>
        
        <div class="detail-section" v-if="currentLog.responseData">
          <div class="section-title">响应结果</div>
          <pre class="code-block">{{ formatJson(currentLog.responseData) }}</pre>
        </div>
        
        <div class="detail-section error" v-if="currentLog.errorMessage">
          <div class="section-title">错误信息</div>
          <div class="error-content">{{ currentLog.errorMessage }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Search, CircleCheck, CircleClose } from '@element-plus/icons-vue'

// 统计数据
const stats = reactive({
  todayCount: 156,
  successRate: 98.5,
  activeUsers: 12,
  failures: 3
})

// 搜索表单
const searchForm = reactive({
  keyword: '',
  module: '',
  operationType: '',
  result: '',
  dateRange: []
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 1256
})

// 加载状态
const loading = ref(false)

// 日志列表
const logs = ref([
  {
    id: 'LOG20241201001',
    operationTime: '2024-12-01 15:32:18',
    operatorId: 'GD001',
    operatorName: '张小明',
    operatorAvatar: '',
    module: 'account',
    operationType: 'UPDATE',
    content: '修改导购李小红的基本信息',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    requestUrl: '/api/users/guides/GD002',
    requestParams: {
      id: 'GD002',
      name: '李小红',
      phone: '139****5678',
      role: 'senior'
    },
    responseData: {
      code: 200,
      message: '更新成功',
      data: { id: 'GD002', name: '李小红' }
    },
    result: 'SUCCESS',
    errorMessage: null
  },
  {
    id: 'LOG20241201002',
    operationTime: '2024-12-01 15:28:45',
    operatorId: 'GD001',
    operatorName: '张小明',
    operatorAvatar: '',
    module: 'customer',
    operationType: 'CREATE',
    content: '新增客户：王先生',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    requestUrl: '/api/customers',
    requestParams: {
      name: '王先生',
      phone: '138****1234',
      source: '自然进店',
      level: 'A'
    },
    responseData: {
      code: 200,
      message: '创建成功',
      data: { id: 12345 }
    },
    result: 'SUCCESS',
    errorMessage: null
  },
  {
    id: 'LOG20241201003',
    operationTime: '2024-12-01 15:25:12',
    operatorId: 'GD003',
    operatorName: '王小强',
    operatorAvatar: '',
    module: 'order',
    operationType: 'UPDATE',
    content: '修改订单ORD2024001状态为生产中',
    ipAddress: '192.168.1.108',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    requestUrl: '/api/orders/ORD2024001',
    requestParams: {
      orderNo: 'ORD2024001',
      status: 'producing'
    },
    responseData: null,
    result: 'FAILURE',
    errorMessage: '订单状态不允许此操作，当前状态：已完成'
  },
  {
    id: 'LOG20241201004',
    operationTime: '2024-12-01 15:20:33',
    operatorId: 'GD002',
    operatorName: '李小红',
    operatorAvatar: '',
    module: 'marketing',
    operationType: 'EXPORT',
    content: '导出营销活动数据',
    ipAddress: '192.168.1.106',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    requestUrl: '/api/marketing/export',
    requestParams: {
      startDate: '2024-11-01',
      endDate: '2024-11-30',
      format: 'excel'
    },
    responseData: {
      code: 200,
      message: '导出成功',
      data: { downloadUrl: '/downloads/marketing_202411.xlsx' }
    },
    result: 'SUCCESS',
    errorMessage: null
  },
  {
    id: 'LOG20241201005',
    operationTime: '2024-12-01 15:15:08',
    operatorId: 'ADMIN001',
    operatorName: '系统管理员',
    operatorAvatar: '',
    module: 'system',
    operationType: 'LOGIN',
    content: '用户登录系统',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    requestUrl: '/api/auth/login',
    requestParams: {
      username: 'admin',
      loginType: 'password'
    },
    responseData: {
      code: 200,
      message: '登录成功',
      data: { token: 'eyJhbGciOiJIUzI1NiIs...' }
    },
    result: 'SUCCESS',
    errorMessage: null
  }
])

// 弹窗控制
const detailDialogVisible = ref(false)
const currentLog = ref(null)

// 模块文本
const getModuleText = (module) => {
  const map = {
    account: '账号管理',
    customer: '客户管理',
    order: '订单管理',
    product: '产品管理',
    marketing: '营销活动',
    system: '系统设置'
  }
  return map[module] || module
}

// 操作类型
const getOperationTypeText = (type) => {
  const map = {
    CREATE: '新增',
    UPDATE: '修改',
    DELETE: '删除',
    QUERY: '查询',
    EXPORT: '导出',
    LOGIN: '登录',
    LOGOUT: '登出'
  }
  return map[type] || type
}

const getOperationTypeType = (type) => {
  const map = {
    CREATE: 'success',
    UPDATE: 'primary',
    DELETE: 'danger',
    QUERY: 'info',
    EXPORT: 'warning',
    LOGIN: 'success',
    LOGOUT: 'info'
  }
  return map[type] || ''
}

// JSON格式化
const formatJson = (json) => {
  if (!json) return ''
  try {
    const data = typeof json === 'string' ? JSON.parse(json) : json
    return JSON.stringify(data, null, 2)
  } catch {
    return String(json)
  }
}

// 搜索
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('搜索完成')
  }, 500)
}

// 分页
const handleSizeChange = (size) => {
  pagination.pageSize = size
  handleSearch()
}

const handlePageChange = (page) => {
  pagination.page = page
  handleSearch()
}

// 展开详情
const handleExpandChange = (row, expandedRows) => {
  console.log('展开行:', row, expandedRows)
}

// 查看详情
const viewDetail = (row) => {
  currentLog.value = row
  detailDialogVisible.value = true
}

// 导出日志
const exportLogs = () => {
  ElMessage.success('日志导出中，请稍候...')
}

onMounted(() => {
  handleSearch()
})
</script>

<style scoped lang="scss">
.operation-logs {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h1 {
      margin: 0;
      font-size: 24px;
    }
  }

  .search-filter {
    margin-bottom: 20px;
  }

  .stats-row {
    margin-bottom: 20px;

    .stat-card {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);

      .stat-value {
        font-size: 28px;
        font-weight: bold;
        color: #409eff;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
      }

      &.success .stat-value {
        color: #67c23a;
      }

      &.warning .stat-value {
        color: #e6a23c;
      }

      &.danger .stat-value {
        color: #f56c6c;
      }
    }
  }

  .logs-list {
    .operator-info {
      display: flex;
      align-items: center;
      gap: 10px;

      .operator-detail {
        .name {
          font-weight: 500;
          color: #303133;
        }

        .id {
          font-size: 12px;
          color: #909399;
        }
      }
    }

    .log-detail {
      padding: 20px;
      background: #f5f7fa;

      .json-content {
        background: #2d2d2d;
        color: #f8f8f2;
        padding: 10px;
        border-radius: 4px;
        overflow-x: auto;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        margin: 0;
      }

      .error-message {
        color: #f56c6c;
        padding: 10px;
        background: #fef0f0;
        border-radius: 4px;
      }
    }

    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }

  .log-detail-dialog {
    .detail-section {
      margin-top: 20px;

      .section-title {
        font-weight: 500;
        margin-bottom: 10px;
        color: #303133;
      }

      .code-block {
        background: #2d2d2d;
        color: #f8f8f2;
        padding: 15px;
        border-radius: 4px;
        overflow-x: auto;
        font-family: 'Courier New', monospace;
        font-size: 13px;
        margin: 0;
      }

      .error-content {
        color: #f56c6c;
        padding: 15px;
        background: #fef0f0;
        border-radius: 4px;
      }

      &.error {
        .section-title {
          color: #f56c6c;
        }
      }
    }
  }
}
</style>
