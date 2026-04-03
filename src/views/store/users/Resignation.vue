<template>
  <div class="resignation">
    <div class="page-header">
      <h1>离职交接</h1>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索导购姓名" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 离职交接列表 -->
    <div class="resignation-list">
      <el-card shadow="hover">
        <el-table :data="resignations" style="width: 100%">
          <el-table-column prop="id" label="交接ID" width="100"></el-table-column>
          <el-table-column prop="guideName" label="导购姓名"></el-table-column>
          <el-table-column prop="resignDate" label="离职日期" width="150"></el-table-column>
          <el-table-column prop="handoverPerson" label="交接人" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row.id)">查看详情</el-button>
              <el-button size="small" type="primary" v-if="scope.row.status === 'pending'" @click="completeHandover(scope.row.id)">完成交接</el-button>
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
    
    <!-- 交接详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="交接详情"
      width="800px"
    >
      <div class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="交接ID">{{ selectedResignation.id }}</el-descriptions-item>
          <el-descriptions-item label="导购姓名">{{ selectedResignation.guideName }}</el-descriptions-item>
          <el-descriptions-item label="离职日期">{{ selectedResignation.resignDate }}</el-descriptions-item>
          <el-descriptions-item label="交接人">{{ selectedResignation.handoverPerson }}</el-descriptions-item>
          <el-descriptions-item label="交接日期">{{ selectedResignation.handoverDate }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ getStatusText(selectedResignation.status) }}</el-descriptions-item>
        </el-descriptions>
        
        <div class="handover-items">
          <h3>交接事项</h3>
          <el-divider></el-divider>
          <el-collapse>
            <el-collapse-item title="客户资源">
              <div class="item-content">
                <p>待跟进客户：{{ selectedResignation.handoverItems.customers }}个</p>
                <p>已分配客户：{{ selectedResignation.handoverItems.assignedCustomers }}个</p>
                <el-button size="small" @click="viewCustomers">查看客户列表</el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="未完成订单">
              <div class="item-content">
                <p>待处理订单：{{ selectedResignation.handoverItems.orders }}个</p>
                <el-button size="small" @click="viewOrders">查看订单列表</el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="工作设备">
              <div class="item-content">
                <p v-for="(device, index) in selectedResignation.handoverItems.devices" :key="index">
                  {{ device }}
                </p>
              </div>
            </el-collapse-item>
            <el-collapse-item title="其他事项">
              <div class="item-content">
                <p>{{ selectedResignation.handoverItems.other }}</p>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 完成交接弹窗 -->
    <el-dialog
      v-model="completeDialogVisible"
      title="完成交接"
      width="600px"
    >
      <div class="complete-handover">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="交接ID">{{ currentHandover.id }}</el-descriptions-item>
          <el-descriptions-item label="导购姓名">{{ currentHandover.guideName }}</el-descriptions-item>
          <el-descriptions-item label="离职日期">{{ currentHandover.resignDate }}</el-descriptions-item>
          <el-descriptions-item label="交接人">{{ currentHandover.handoverPerson }}</el-descriptions-item>
        </el-descriptions>

        <div class="handover-confirmation">
          <h3>交接确认</h3>
          <el-divider></el-divider>
          <el-form>
            <el-form-item label="交接日期">
              <el-date-picker v-model="currentHandover.handoverDate" type="date" placeholder="选择交接日期" style="width: 100%" />
            </el-form-item>
            <el-form-item label="交接事项确认">
              <el-checkbox-group v-model="handoverConfirmItems">
                <el-checkbox label="客户资源已交接">客户资源已交接</el-checkbox>
                <el-checkbox label="未完成订单已交接">未完成订单已交接</el-checkbox>
                <el-checkbox label="工作设备已收回">工作设备已收回</el-checkbox>
                <el-checkbox label="其他事项已确认">其他事项已确认</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="currentHandover.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <el-button @click="completeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCompleteHandover" :loading="completing">
          确认完成交接
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const dateRange = ref([])

// 离职交接数据
const resignations = ref([
  { id: 1, guideName: '孙七', resignDate: '2026-03-15', handoverPerson: '李四', status: 'completed', handoverDate: '2026-03-14' },
  { id: 2, guideName: '周八', resignDate: '2026-04-01', handoverPerson: '赵六', status: 'pending', handoverDate: '' }
])

// 分页
const total = ref(2)
const pageSize = ref(10)
const currentPage = ref(1)

// 详情弹窗
const detailDialogVisible = ref(false)
const selectedResignation = ref({
  id: '',
  guideName: '',
  resignDate: '',
  handoverPerson: '',
  handoverDate: '',
  status: '',
  handoverItems: {
    customers: 0,
    assignedCustomers: 0,
    orders: 0,
    devices: [],
    other: ''
  }
})

// 完成交接弹窗
const completeDialogVisible = ref(false)
const currentHandover = ref({})
const completing = ref(false)
const handoverConfirmItems = ref([])

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    completed: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    pending: '待交接',
    completed: '已完成'
  }
  return textMap[status] || status
}

// 搜索
const search = () => {
  ElMessage.success('搜索功能开发中')
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  dateRange.value = []
}

// 查看详情
const viewDetail = (id) => {
  // 模拟获取交接详情
  selectedResignation.value = {
    id: id,
    guideName: '孙七',
    resignDate: '2026-03-15',
    handoverPerson: '李四',
    handoverDate: '2026-03-14',
    status: 'completed',
    handoverItems: {
      customers: 15,
      assignedCustomers: 15,
      orders: 3,
      devices: ['工作手机', '工牌', '销售手册'],
      other: '交接了所有客户资料和销售技巧'
    }
  }
  detailDialogVisible.value = true
}

// 完成交接
const completeHandover = (id) => {
  const resignation = resignations.value.find(r => r.id === id)
  if (resignation) {
    currentHandover.value = {
      ...resignation,
      handoverDate: new Date().toISOString().split('T')[0],
      remark: ''
    }
    handoverConfirmItems.value = []
    completeDialogVisible.value = true
  }
}

// 确认完成交接
const confirmCompleteHandover = async () => {
  if (handoverConfirmItems.value.length === 0) {
    ElMessage.error('请至少确认一项交接事项')
    return
  }
  
  if (!currentHandover.value.handoverDate) {
    ElMessage.error('请选择交接日期')
    return
  }
  
  completing.value = true
  try {
    // 模拟完成交接的API调用
    setTimeout(() => {
      const index = resignations.value.findIndex(r => r.id === currentHandover.value.id)
      if (index > -1) {
        resignations.value[index] = {
          ...resignations.value[index],
          status: 'completed',
          handoverDate: currentHandover.value.handoverDate
        }
      }
      ElMessage.success('交接完成成功')
      completeDialogVisible.value = false
      completing.value = false
    }, 1000)
  } catch (error) {
    ElMessage.error('交接完成失败')
    completing.value = false
  }
}

// 查看客户列表
const viewCustomers = () => {
  ElMessage.success('查看客户列表功能开发中')
}

// 查看订单列表
const viewOrders = () => {
  ElMessage.success('查看订单列表功能开发中')
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
.resignation {
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

.resignation-list {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.detail-content {
  padding: 20px 0;
}

.handover-items {
  margin-top: 20px;
}

.handover-items h3 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}

.item-content {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.item-content p {
  margin: 5px 0;
}

.complete-handover {
  .handover-confirmation {
    margin-top: 20px;
    
    h3 {
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: bold;
    }
    
    .el-checkbox {
      display: block;
      margin-bottom: 10px;
    }
  }
}
</style>