<template>
  <div class="store-activities">
    <div class="page-header">
      <h1>门店自主活动</h1>
      <el-button type="primary" @click="createActivity">创建活动</el-button>
    </div>
    
    <!-- 活动列表 -->
    <div class="activities-list">
      <el-card shadow="hover">
        <div class="filter-section">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input v-model="searchKeyword" placeholder="搜索活动名称" prefix-icon="Search"></el-input>
            </el-col>
            <el-col :span="8">
              <el-select v-model="activityStatus" placeholder="活动状态">
                <el-option label="全部" value=""></el-option>
                <el-option label="进行中" value="ongoing"></el-option>
                <el-option label="已结束" value="ended"></el-option>
                <el-option label="未开始" value="upcoming"></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button @click="reset">重置</el-button>
            </el-col>
          </el-row>
        </div>
        
        <el-table :data="activities" style="width: 100%">
          <el-table-column prop="id" label="活动ID" width="120"></el-table-column>
          <el-table-column prop="name" label="活动名称"></el-table-column>
          <el-table-column prop="type" label="活动类型" width="120"></el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="180"></el-table-column>
          <el-table-column prop="endTime" label="结束时间" width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row.id)">查看</el-button>
              <el-button size="small" type="primary" @click="editActivity(scope.row.id)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteActivity(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
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
    
    <!-- 创建/编辑活动弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑活动' : '创建活动'" width="800px">
      <el-form :model="activityForm" label-width="120px">
        <el-form-item label="活动名称" required>
          <el-input v-model="activityForm.name" placeholder="请输入活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动类型" required>
          <el-select v-model="activityForm.type" placeholder="请选择活动类型">
            <el-option label="促销活动" value="promotion"></el-option>
            <el-option label="节日活动" value="festival"></el-option>
            <el-option label="新品发布" value="newProduct"></el-option>
            <el-option label="客户回馈" value="customer"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-date-picker
            v-model="activityForm.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="活动内容" required>
          <el-input type="textarea" v-model="activityForm.content" :rows="4" placeholder="请输入活动内容"></el-input>
        </el-form-item>
        <el-form-item label="活动规则">
          <div v-for="(rule, index) in activityForm.rules" :key="index" class="rule-item">
            <el-input v-model="activityForm.rules[index]" placeholder="请输入活动规则">
              <template #append>
                <el-button @click="removeRule(index)">删除</el-button>
              </template>
            </el-input>
          </div>
          <el-button type="primary" @click="addRule">添加规则</el-button>
        </el-form-item>
        <el-form-item label="参与商品">
          <el-select v-model="activityForm.products" multiple placeholder="请选择参与商品">
            <el-option label="沙发" value="sofa"></el-option>
            <el-option label="茶几" value="table"></el-option>
            <el-option label="床" value="bed"></el-option>
            <el-option label="衣柜" value="wardrobe"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitActivity">提交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 活动详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="活动详情" width="800px">
      <div class="activity-detail">
        <el-descriptions :column="2" border class="mb-4">
          <el-descriptions-item label="活动ID">{{ selectedActivity.id }}</el-descriptions-item>
          <el-descriptions-item label="活动名称">{{ selectedActivity.name }}</el-descriptions-item>
          <el-descriptions-item label="活动类型">{{ getActivityTypeText(selectedActivity.type) }}</el-descriptions-item>
          <el-descriptions-item label="活动状态">
            <el-tag :type="getStatusType(selectedActivity.status)">{{ getStatusText(selectedActivity.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="开始时间">{{ selectedActivity.startTime }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{ selectedActivity.endTime }}</el-descriptions-item>
        </el-descriptions>

        <div class="activity-content">
          <h3>活动内容</h3>
          <p>{{ selectedActivity.content }}</p>
        </div>

        <div class="activity-rules">
          <h3>活动规则</h3>
          <ul>
            <li v-for="(rule, index) in selectedActivity.rules" :key="index">{{ rule }}</li>
          </ul>
        </div>

        <div class="activity-products">
          <h3>参与商品</h3>
          <div class="products-list">
            <el-tag v-for="(product, index) in getProductNames(selectedActivity.products)" :key="index" class="product-tag">
              {{ product }}
            </el-tag>
          </div>
        </div>

        <div class="activity-stats">
          <h3>活动统计</h3>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="参与人数">{{ selectedActivity.stats?.participants || 0 }}</el-descriptions-item>
            <el-descriptions-item label="销售额">{{ selectedActivity.stats?.sales || '¥0' }}</el-descriptions-item>
            <el-descriptions-item label="转化率">{{ selectedActivity.stats?.conversionRate || '0%' }}</el-descriptions-item>
          </el-descriptions>
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
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchKeyword = ref('')
const activityStatus = ref('')
const activities = ref([
  { id: 'SA001', name: '春季特惠', type: '促销活动', startTime: '2026-04-01 00:00', endTime: '2026-04-15 23:59', status: 'ongoing' },
  { id: 'SA002', name: '老客户回馈', type: '客户回馈', startTime: '2026-03-01 00:00', endTime: '2026-03-31 23:59', status: 'ended' }
])

const total = ref(2)
const pageSize = ref(10)
const currentPage = ref(1)
const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const isEdit = ref(false)
const activityForm = ref({
  id: '',
  name: '',
  type: '',
  timeRange: [],
  content: '',
  rules: [''],
  products: []
})

const selectedActivity = ref({
  id: '',
  name: '',
  type: '',
  status: '',
  startTime: '',
  endTime: '',
  content: '',
  rules: [],
  products: [],
  stats: {
    participants: 0,
    sales: '¥0',
    conversionRate: '0%'
  }
})

const getStatusType = (status) => {
  const typeMap = { ongoing: 'success', ended: 'info', upcoming: 'warning' }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = { ongoing: '进行中', ended: '已结束', upcoming: '未开始' }
  return textMap[status] || status
}

const getActivityTypeText = (type) => {
  const typeMap = { 
    promotion: '促销活动', 
    festival: '节日活动', 
    newProduct: '新品发布', 
    customer: '客户回馈'
  }
  return typeMap[type] || type
}

const getProductNames = (products) => {
  const productMap = { 
    sofa: '沙发', 
    table: '茶几', 
    bed: '床', 
    wardrobe: '衣柜'
  }
  return products.map(product => productMap[product] || product)
}

const search = () => {
  ElMessage.success('搜索功能开发中')
}

const reset = () => {
  searchKeyword.value = ''
  activityStatus.value = ''
}

const createActivity = () => {
  isEdit.value = false
  activityForm.value = {
    id: '',
    name: '',
    type: '',
    timeRange: [],
    content: '',
    rules: [''],
    products: []
  }
  dialogVisible.value = true
}

const editActivity = (id) => {
  isEdit.value = true
  const activity = activities.value.find(item => item.id === id)
  if (activity) {
    activityForm.value = {
      ...activity,
      timeRange: [activity.startTime, activity.endTime],
      rules: ['满10000减1000'],
      products: ['sofa', 'table']
    }
    dialogVisible.value = true
  }
}

const deleteActivity = (id) => {
  ElMessageBox.confirm('确定要删除该活动吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const addRule = () => {
  activityForm.value.rules.push('')
}

const removeRule = (index) => {
  activityForm.value.rules.splice(index, 1)
}

const submitActivity = () => {
  ElMessage.success(isEdit.value ? '编辑成功' : '创建成功')
  dialogVisible.value = false
}

const viewDetail = (id) => {
  // 模拟获取活动详情
  selectedActivity.value = {
    id: id,
    name: '春季特惠',
    type: 'promotion',
    status: 'ongoing',
    startTime: '2026-04-01 00:00',
    endTime: '2026-04-15 23:59',
    content: '春季特惠活动，全场家具8折起，满10000减1000，限时两周，欢迎新老客户前来选购。',
    rules: [
      '全场家具8折起',
      '满10000减1000',
      '满20000减2500',
      '活动期间免费上门量尺',
      '活动期间免费设计方案'
    ],
    products: ['sofa', 'table', 'bed', 'wardrobe'],
    stats: {
      participants: 580,
      sales: '¥1,250,000',
      conversionRate: '15.2%'
    }
  }
  detailDialogVisible.value = true
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

onMounted(() => {
  console.log('[StoreActivities] 组件挂载')
})
</script>

<style scoped>
.store-activities {
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

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.rule-item {
  margin-bottom: 10px;
}

/* 活动详情样式 */
.activity-detail {
  padding: 10px 0;
}

.mb-4 {
  margin-bottom: 20px;
}

.activity-content,
.activity-rules,
.activity-products,
.activity-stats {
  margin-top: 20px;
}

.activity-content h3,
.activity-rules h3,
.activity-products h3,
.activity-stats h3 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.activity-rules ul {
  padding-left: 20px;
}

.activity-rules li {
  margin-bottom: 5px;
  line-height: 1.5;
}

.products-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.product-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .el-descriptions {
    :deep(.el-descriptions__body) {
      display: flex;
      flex-direction: column;
    }
    :deep(.el-descriptions__row) {
      flex-direction: column;
    }
    :deep(.el-descriptions__cell) {
      width: 100% !important;
    }
  }
  
  .products-list {
    flex-direction: column;
  }
  
  .product-tag {
    width: 100%;
    text-align: center;
  }
}
</style>
