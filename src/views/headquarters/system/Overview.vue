<template>
  <div class="headquarters-system-overview">
    <div class="page-header">
      <h1>系统总览</h1>
      <el-button type="primary" @click="refreshSystemStatus">刷新状态</el-button>
    </div>
    
    <!-- 系统状态 -->
    <div class="system-status">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="status-card">
            <div class="status-content">
              <div class="status-icon">
                <el-icon><Server /></el-icon>
              </div>
              <div class="status-info">
                <div class="status-value">{{ systemStatus.server }}</div>
                <div class="status-label">服务器状态</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="status-card">
            <div class="status-content">
              <div class="status-icon">
                <el-icon><Database /></el-icon>
              </div>
              <div class="status-info">
                <div class="status-value">{{ systemStatus.database }}</div>
                <div class="status-label">数据库状态</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="status-card">
            <div class="status-content">
              <div class="status-icon">
                <el-icon><Cloud /></el-icon>
              </div>
              <div class="status-info">
                <div class="status-value">{{ systemStatus.memory }}</div>
                <div class="status-label">内存使用</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="status-card">
            <div class="status-content">
              <div class="status-icon">
                <el-icon><HardDrive /></el-icon>
              </div>
              <div class="status-info">
                <div class="status-value">{{ systemStatus.disk }}</div>
                <div class="status-label">磁盘使用</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 系统信息 -->
    <div class="system-info">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>系统信息</span>
            <el-button size="small" @click="exportSystemInfo">导出信息</el-button>
          </div>
        </template>
        <el-descriptions :column="1">
          <el-descriptions-item label="系统版本">{{ systemInfo.version }}</el-descriptions-item>
          <el-descriptions-item label="运行环境">{{ systemInfo.environment }}</el-descriptions-item>
          <el-descriptions-item label="启动时间">{{ systemInfo.startTime }}</el-descriptions-item>
          <el-descriptions-item label="当前时间">{{ systemInfo.currentTime }}</el-descriptions-item>
          <el-descriptions-item label="服务器地址">{{ systemInfo.serverAddress }}</el-descriptions-item>
          <el-descriptions-item label="数据库版本">{{ systemInfo.databaseVersion }}</el-descriptions-item>
          <el-descriptions-item label="JVM版本">{{ systemInfo.jvmVersion }}</el-descriptions-item>
          <el-descriptions-item label="操作系统">{{ systemInfo.os }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
    
    <!-- 系统资源使用 -->
    <div class="system-resources">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>系统资源使用</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="resource-item">
              <div class="resource-label">CPU使用率</div>
              <el-progress :percentage="resources.cpu" :color="getProgressColor(resources.cpu)"></el-progress>
              <div class="resource-value">{{ resources.cpu }}%</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="resource-item">
              <div class="resource-label">内存使用率</div>
              <el-progress :percentage="resources.memory" :color="getProgressColor(resources.memory)"></el-progress>
              <div class="resource-value">{{ resources.memory }}%</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="resource-item">
              <div class="resource-label">磁盘使用率</div>
              <el-progress :percentage="resources.disk" :color="getProgressColor(resources.disk)"></el-progress>
              <div class="resource-value">{{ resources.disk }}%</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="resource-item">
              <div class="resource-label">网络带宽</div>
              <el-progress :percentage="resources.network" :color="getProgressColor(resources.network)"></el-progress>
              <div class="resource-value">{{ resources.network }}%</div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 系统日志 -->
    <div class="system-logs">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>系统日志</span>
            <el-button size="small" @click="clearLogs">清空日志</el-button>
          </div>
        </template>
        <el-table :data="logs" style="width: 100%">
          <el-table-column prop="time" label="时间" width="180"></el-table-column>
          <el-table-column prop="level" label="级别" width="100">
            <template #default="scope">
              <el-tag :type="getLogLevelType(scope.row.level)">{{ scope.row.level }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="message" label="日志内容"></el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Server, Database, Cloud, HardDrive } from '@element-plus/icons-vue'

// 加载状态
const loading = ref(false)

// 系统状态
const systemStatus = ref({
  server: '运行中',
  database: '连接正常',
  memory: '65%',
  disk: '45%'
})

// 系统信息
const systemInfo = ref({
  version: '1.0.0',
  environment: '生产环境',
  startTime: '2026-04-01 08:00:00',
  currentTime: new Date().toLocaleString('zh-CN'),
  serverAddress: '192.168.1.100:8080',
  databaseVersion: 'MySQL 8.0',
  jvmVersion: '1.8.0_301',
  os: 'CentOS 7.9'
})

// 系统资源
const resources = ref({
  cpu: 45,
  memory: 65,
  disk: 45,
  network: 30
})

// 系统日志
const logs = ref([
  { time: '2026-04-01 15:30:00', level: 'INFO', message: '系统启动成功' },
  { time: '2026-04-01 15:29:55', level: 'INFO', message: '数据库连接成功' },
  { time: '2026-04-01 15:29:50', level: 'INFO', message: '加载配置文件成功' },
  { time: '2026-04-01 15:29:45', level: 'WARN', message: '内存使用接近阈值' },
  { time: '2026-04-01 15:29:40', level: 'INFO', message: '系统初始化开始' }
])

// 计算当前时间
const currentTime = computed(() => {
  return new Date().toLocaleString('zh-CN')
})

// 获取进度条颜色
const getProgressColor = (percentage) => {
  if (percentage < 60) return '#67C23A'
  if (percentage < 80) return '#E6A23C'
  return '#F56C6C'
}

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

// 刷新系统状态
const refreshSystemStatus = () => {
  loading.value = true
  // 模拟刷新系统状态
  setTimeout(() => {
    // 随机更新资源使用情况
    resources.value = {
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      disk: Math.floor(Math.random() * 100),
      network: Math.floor(Math.random() * 100)
    }
    // 更新当前时间
    systemInfo.value.currentTime = currentTime.value
    ElMessage.success('系统状态已刷新')
    loading.value = false
  }, 1000)
}

// 导出系统信息
const exportSystemInfo = () => {
  loading.value = true
  // 模拟导出系统信息
  setTimeout(() => {
    ElMessage.success('系统信息导出成功')
    loading.value = false
  }, 500)
}

// 清空日志
const clearLogs = () => {
  ElMessageBox.confirm('确定要清空系统日志吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true
    // 模拟清空日志
    setTimeout(() => {
      logs.value = []
      ElMessage.success('系统日志已清空')
      loading.value = false
    }, 500)
  }).catch(() => {
    ElMessage.info('取消清空操作')
  })
}

// 组件挂载
onMounted(() => {
  // 模拟获取系统状态
  loading.value = true
  setTimeout(() => {
    // 数据加载完成
    console.log('系统总览数据加载完成')
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.headquarters-system-overview {
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

.system-status {
  margin-bottom: 20px;
}

.status-card {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-content {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 20px;
}

.status-icon {
  font-size: 48px;
  color: #409eff;
  margin-right: 20px;
}

.status-info {
  flex: 1;
}

.status-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.status-label {
  font-size: 14px;
  color: #606266;
}

.system-info {
  margin-bottom: 20px;
}

.system-resources {
  margin-bottom: 20px;
}

.resource-item {
  margin-bottom: 20px;
}

.resource-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.resource-value {
  font-size: 14px;
  color: #333;
  margin-top: 5px;
  text-align: right;
}

.system-logs {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>