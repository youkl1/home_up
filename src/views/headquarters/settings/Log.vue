<template>
  <div class="headquarters-settings-log">
    <div class="page-header">
      <h1>日志管理</h1>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索操作人或操作内容" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="logType" placeholder="选择日志类型">
              <el-option label="全部" value=""></el-option>
              <el-option label="登录日志" value="login"></el-option>
              <el-option label="操作日志" value="operation"></el-option>
              <el-option label="系统日志" value="system"></el-option>
            </el-select>
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
        <el-row :gutter="20" style="margin-top: 10px;">
          <el-col :span="24">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button @click="exportLog">导出日志</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 日志列表 -->
    <div class="log-list">
      <el-card shadow="hover">
        <el-table :data="logs" style="width: 100%">
          <el-table-column prop="id" label="日志ID" width="100"></el-table-column>
          <el-table-column prop="type" label="日志类型" width="120"></el-table-column>
          <el-table-column prop="operator" label="操作人" width="120"></el-table-column>
          <el-table-column prop="content" label="操作内容"></el-table-column>
          <el-table-column prop="ip" label="IP地址" width="150"></el-table-column>
          <el-table-column prop="time" label="操作时间" width="180"></el-table-column>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const logType = ref('')
const dateRange = ref([])

// 日志数据
const logs = ref([
  { id: 1, type: '登录日志', operator: 'admin', content: '管理员登录系统', ip: '192.168.1.100', time: '2026-04-01 10:30:00' },
  { id: 2, type: '操作日志', operator: 'admin', content: '添加了新的产品', ip: '192.168.1.100', time: '2026-04-01 10:15:00' },
  { id: 3, type: '操作日志', operator: 'admin', content: '修改了门店信息', ip: '192.168.1.100', time: '2026-04-01 09:45:00' },
  { id: 4, type: '系统日志', operator: 'system', content: '系统自动备份', ip: '127.0.0.1', time: '2026-04-01 00:00:00' },
  { id: 5, type: '登录日志', operator: 'user1', content: '用户登录系统', ip: '192.168.1.101', time: '2026-03-31 16:30:00' }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 搜索
const search = () => {
  ElMessage.success('搜索功能开发中')
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  logType.value = ''
  dateRange.value = []
}

// 导出日志
const exportLog = () => {
  ElMessage.success('导出日志功能开发中')
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
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
.headquarters-settings-log {
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