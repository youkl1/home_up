<template>
  <div class="headquarters-system-log">
    <div class="page-header">
      <h1>日志管理</h1>
      <el-button type="primary" @click="refreshLogs">刷新日志</el-button>
    </div>
    
    <!-- 日志筛选 -->
    <div class="log-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-select v-model="filter.level" placeholder="日志级别">
              <el-option label="全部" value=""></el-option>
              <el-option label="ERROR" value="ERROR"></el-option>
              <el-option label="WARN" value="WARN"></el-option>
              <el-option label="INFO" value="INFO"></el-option>
              <el-option label="DEBUG" value="DEBUG"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input v-model="filter.keyword" placeholder="关键字" @keyup.enter="search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 15px;">
          <el-col :span="8">
            <el-select v-model="filter.type" placeholder="操作类型">
              <el-option label="全部" value=""></el-option>
              <el-option label="登录" value="login"></el-option>
              <el-option label="操作" value="operation"></el-option>
              <el-option label="异常" value="exception"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input v-model="filter.username" placeholder="操作人" @keyup.enter="search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button type="danger" @click="clearLogs">清空日志</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 日志统计 -->
    <div class="log-stats">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ totalLogs }}</div>
              <div class="stat-label">总日志数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ errorLogs }}</div>
              <div class="stat-label">错误日志</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ warnLogs }}</div>
              <div class="stat-label">警告日志</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ infoLogs }}</div>
              <div class="stat-label">信息日志</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 日志列表 -->
    <div class="log-list">
      <el-card shadow="hover">
        <el-table :data="filteredLogs" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="日志ID" width="100"></el-table-column>
          <el-table-column prop="level" label="日志级别" width="100">
            <template #default="scope">
              <el-tag :type="getLogLevelType(scope.row.level)">{{ scope.row.level }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="操作人" width="120"></el-table-column>
          <el-table-column prop="ip" label="IP地址" width="150"></el-table-column>
          <el-table-column prop="module" label="模块" width="120"></el-table-column>
          <el-table-column prop="operation" label="操作"></el-table-column>
          <el-table-column prop="message" label="日志内容"></el-table-column>
          <el-table-column prop="time" label="操作时间" width="180"></el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button size="small" @click="viewLog(scope.row)">查看</el-button>
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
    
    <!-- 日志详情弹窗 -->
    <el-dialog
      v-model="logDetailVisible"
      title="日志详情"
      width="800px"
    >
      <el-form label-position="top" v-loading="loading">
        <el-form-item label="基本信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="日志ID">
                <el-input v-model="currentLog.id" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="日志级别">
                <el-input v-model="currentLog.level" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="操作人">
                <el-input v-model="currentLog.username" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="IP地址">
                <el-input v-model="currentLog.ip" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="模块">
                <el-input v-model="currentLog.module" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="操作类型">
                <el-input v-model="currentLog.type" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="操作时间">
                <el-input v-model="currentLog.time" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="详细信息">
          <el-form-item label="操作">
            <el-input v-model="currentLog.operation" disabled></el-input>
          </el-form-item>
          <el-form-item label="日志内容">
            <el-input
              v-model="currentLog.message"
              type="textarea"
              :rows="4"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="请求参数" v-if="currentLog.params">
            <el-input
              v-model="currentLog.params"
              type="textarea"
              :rows="3"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="响应结果" v-if="currentLog.result">
            <el-input
              v-model="currentLog.result"
              type="textarea"
              :rows="3"
              disabled
            ></el-input>
          </el-form-item>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="logDetailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 加载状态
const loading = ref(false)

// 日志筛选
const filter = ref({
  level: '',
  keyword: '',
  type: '',
  username: ''
})

// 日期范围
const dateRange = ref([])

// 日志数据
const logs = ref([
  { id: 1, level: 'INFO', username: 'admin', ip: '192.168.1.100', module: 'system', type: 'login', operation: '用户登录', message: '用户admin登录成功', time: '2026-04-01 15:30:00' },
  { id: 2, level: 'INFO', username: 'admin', ip: '192.168.1.100', module: 'marketing', type: 'operation', operation: '添加活动', message: '添加活动"春季促销"成功', time: '2026-04-01 15:25:00' },
  { id: 3, level: 'ERROR', username: 'user1', ip: '192.168.1.101', module: 'data', type: 'exception', operation: '数据查询', message: '查询数据时发生异常：数据库连接失败', time: '2026-04-01 15:20:00' },
  { id: 4, level: 'WARN', username: 'admin', ip: '192.168.1.100', module: 'system', type: 'operation', operation: '修改配置', message: '修改系统配置时警告：配置值超出推荐范围', time: '2026-04-01 15:15:00' },
  { id: 5, level: 'INFO', username: 'user2', ip: '192.168.1.102', module: 'marketing', type: 'operation', operation: '发送短信', message: '发送短信成功，目标号码：138****1234', time: '2026-04-01 15:10:00' },
  { id: 6, level: 'INFO', username: 'admin', ip: '192.168.1.100', module: 'system', type: 'operation', operation: '添加菜单', message: '添加菜单"数据统计"成功', time: '2026-04-01 15:05:00' },
  { id: 7, level: 'ERROR', username: 'user1', ip: '192.168.1.101', module: 'marketing', type: 'exception', operation: '上传图片', message: '上传图片失败：文件大小超出限制', time: '2026-04-01 15:00:00' },
  { id: 8, level: 'INFO', username: 'user3', ip: '192.168.1.103', module: 'data', type: 'operation', operation: '导出报表', message: '导出报表"销售统计"成功', time: '2026-04-01 14:55:00' }
])

// 分页
const total = ref(8)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗状态
const logDetailVisible = ref(false)

// 当前日志
const currentLog = ref({})

// 过滤后的日志列表
const filteredLogs = computed(() => {
  let result = [...logs.value]
  
  // 级别过滤
  if (filter.value.level) {
    result = result.filter(log => log.level === filter.value.level)
  }
  
  // 关键字过滤
  if (filter.value.keyword) {
    const keyword = filter.value.keyword.toLowerCase()
    result = result.filter(log => 
      log.operation.toLowerCase().includes(keyword) || 
      log.message.toLowerCase().includes(keyword)
    )
  }
  
  // 类型过滤
  if (filter.value.type) {
    result = result.filter(log => log.type === filter.value.type)
  }
  
  // 操作人过滤
  if (filter.value.username) {
    result = result.filter(log => log.username === filter.value.username)
  }
  
  // 日期过滤
  if (dateRange.value && dateRange.value.length === 2) {
    const startDate = new Date(dateRange.value[0])
    const endDate = new Date(dateRange.value[1])
    result = result.filter(log => {
      const logDate = new Date(log.time.split(' ')[0])
      return logDate >= startDate && logDate <= endDate
    })
  }
  
  return result
})

// 统计数据
const totalLogs = computed(() => logs.value.length)
const errorLogs = computed(() => logs.value.filter(log => log.level === 'ERROR').length)
const warnLogs = computed(() => logs.value.filter(log => log.level === 'WARN').length)
const infoLogs = computed(() => logs.value.filter(log => log.level === 'INFO').length)

// 获取日志级别类型
const getLogLevelType = (level) => {
  switch (level) {
    case 'ERROR':
      return 'danger'
    case 'WARN':
      return 'warning'
    case 'INFO':
      return 'info'
    case 'DEBUG':
      return 'success'
    default:
      return 'info'
  }
}

// 搜索
const search = () => {
  loading.value = true
  // 模拟搜索逻辑
  setTimeout(() => {
    // 实际项目中这里应该调用API搜索日志
    console.log(`搜索日志：级别=${filter.value.level}，关键字=${filter.value.keyword}，类型=${filter.value.type}，操作人=${filter.value.username}，日期范围=${dateRange.value}`)
    ElMessage.success('搜索成功')
    loading.value = false
  }, 500)
}

// 重置
const reset = () => {
  filter.value = {
    level: '',
    keyword: '',
    type: '',
    username: ''
  }
  dateRange.value = []
  ElMessage.info('搜索条件已重置')
}

// 刷新日志
const refreshLogs = () => {
  loading.value = true
  // 模拟刷新日志
  setTimeout(() => {
    // 实际项目中这里应该调用API获取最新日志
    ElMessage.success('日志已刷新')
    loading.value = false
  }, 1000)
}

// 清空日志
const clearLogs = () => {
  ElMessageBox.confirm('确定要清空所有日志吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true
    // 模拟清空日志
    setTimeout(() => {
      // 实际项目中这里应该调用API清空日志
      ElMessage.success('日志已清空')
      loading.value = false
    }, 500)
  }).catch(() => {
    ElMessage.info('取消清空操作')
  })
}

// 查看日志
const viewLog = (log) => {
  loading.value = true
  // 模拟获取日志详情
  setTimeout(() => {
    currentLog.value = { ...log }
    logDetailVisible.value = true
    loading.value = false
  }, 500)
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  // 实际项目中这里应该调用API获取对应页的数据
  console.log(`切换到第 ${page} 页`)
  ElMessage.info(`切换到第 ${page} 页`)
}

// 组件挂载
onMounted(() => {
  // 模拟获取日志数据
  loading.value = true
  setTimeout(() => {
    // 数据加载完成
    console.log('日志数据加载完成')
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.headquarters-system-log {
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

.log-filter {
  margin-bottom: 20px;
}

.log-stats {
  margin-bottom: 20px;
}

.stat-card {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
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