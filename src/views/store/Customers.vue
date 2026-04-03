<template>
  <div class="store-customers">
    <div class="page-header">
      <h1>客户管理</h1>
      <el-button type="primary">添加客户</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索客户名称或电话" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="customerTag" placeholder="选择客户标签">
              <el-option label="全部" value=""></el-option>
              <el-option label="热门" value="hot"></el-option>
              <el-option label="新客户" value="new"></el-option>
              <el-option label="普通" value="normal"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 客户列表 -->
    <div class="customer-list">
      <el-card shadow="hover">
        <el-table :data="customers" style="width: 100%">
          <el-table-column prop="id" label="客户ID" width="80"></el-table-column>
          <el-table-column prop="name" label="客户名称"></el-table-column>
          <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
          <el-table-column prop="note" label="备注"></el-table-column>
          <el-table-column prop="tag" label="标签" width="100">
            <template #default="scope">
              <el-tag :type="getTagType(scope.row.tag)">
                {{ getTagText(scope.row.tag) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lastContact" label="最后联系时间" width="180"></el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewCustomer(scope.row.id)">查看</el-button>
              <el-button type="danger" size="small" @click="deleteCustomer(scope.row.id)">删除</el-button>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const customerTag = ref('')

// 客户数据
const customers = ref([
  { id: 1, name: '张女士', phone: '138****1234', note: '意向橱柜定制，预算15万', tag: 'hot', lastContact: '2026-04-01 10:30' },
  { id: 2, name: '李先生', phone: '139****5678', note: '新房装修，需要全屋定制', tag: 'new', lastContact: '2026-03-31 14:20' },
  { id: 3, name: '王女士', phone: '137****9012', note: '老客户介绍，关注衣柜产品', tag: 'normal', lastContact: '2026-03-30 09:15' },
  { id: 4, name: '赵先生', phone: '136****3456', note: '别墅装修，需要整体方案', tag: 'hot', lastContact: '2026-03-29 16:45' }
])

// 分页
const total = ref(4)
const pageSize = ref(10)
const currentPage = ref(1)

// 获取标签类型
const getTagType = (tag) => {
  switch (tag) {
    case 'hot': return 'danger'
    case 'new': return 'success'
    case 'normal': return 'info'
    default: return 'info'
  }
}

// 获取标签文本
const getTagText = (tag) => {
  switch (tag) {
    case 'hot': return '热门'
    case 'new': return '新客户'
    case 'normal': return '普通'
    default: return '普通'
  }
}

// 搜索
const search = () => {
  ElMessage.success('搜索功能开发中')
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  customerTag.value = ''
}

// 查看客户
const viewCustomer = (customerId) => {
  ElMessage.success(`查看客户：${customerId}`)
}

// 删除客户
const deleteCustomer = (customerId) => {
  ElMessage.success(`删除客户：${customerId}`)
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
.store-customers {
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

.customer-list {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>