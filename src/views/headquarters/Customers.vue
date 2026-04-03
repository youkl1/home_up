<template>
  <div class="headquarters-customers">
    <div class="page-header">
      <h1>客户管理</h1>
      <el-button type="primary" @click="addCustomer">添加客户</el-button>
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
          <el-table-column prop="orderCount" label="订单数" width="80"></el-table-column>
          <el-table-column prop="workOrderCount" label="工单数" width="80"></el-table-column>
          <el-table-column label="操作" width="280">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewCustomer(scope.row)">查看</el-button>
              <el-button type="success" size="small" @click="editCustomer(scope.row)">编辑</el-button>
              <el-button type="info" size="small" @click="viewOrders(scope.row.id)">订单</el-button>
              <el-button type="warning" size="small" @click="viewWorkOrders(scope.row.id)">工单</el-button>
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
    
    <!-- 添加/编辑客户弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form :model="customerForm" label-width="100px">
        <el-form-item label="客户名称">
          <el-input v-model="customerForm.name" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="customerForm.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="customerForm.note" placeholder="请输入备注信息" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="客户标签">
          <el-select v-model="customerForm.tag">
            <el-option label="热门" value="hot"></el-option>
            <el-option label="新客户" value="new"></el-option>
            <el-option label="普通" value="normal"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitCustomer">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 查看客户详情弹窗 -->
    <el-dialog
      v-model="viewDialogVisible"
      :title="viewForm.name || '客户详情'"
      width="600px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="客户ID">{{ viewForm.id }}</el-descriptions-item>
        <el-descriptions-item label="客户名称">{{ viewForm.name }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ viewForm.phone }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ viewForm.note }}</el-descriptions-item>
        <el-descriptions-item label="客户标签">{{ getTagText(viewForm.tag) }}</el-descriptions-item>
        <el-descriptions-item label="最后联系时间">{{ viewForm.lastContact }}</el-descriptions-item>
        <el-descriptions-item label="订单数">{{ viewForm.orderCount }}</el-descriptions-item>
        <el-descriptions-item label="工单数">{{ viewForm.workOrderCount }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 查看订单弹窗 -->
    <el-dialog
      v-model="ordersDialogVisible"
      :title="`${currentCustomerName || '客户'}的订单`"
      width="800px"
    >
      <el-table :data="customerOrders" style="width: 100%">
        <el-table-column prop="orderId" label="订单ID" width="120"></el-table-column>
        <el-table-column prop="orderDate" label="下单时间" width="180"></el-table-column>
        <el-table-column prop="amount" label="订单金额" width="120"></el-table-column>
        <el-table-column prop="status" label="订单状态" width="120"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ordersDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 查看工单弹窗 -->
    <el-dialog
      v-model="workOrdersDialogVisible"
      :title="`${currentCustomerName || '客户'}的工单`"
      width="800px"
    >
      <el-table :data="customerWorkOrders" style="width: 100%">
        <el-table-column prop="workOrderId" label="工单ID" width="120"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="type" label="工单类型" width="120"></el-table-column>
        <el-table-column prop="status" label="工单状态" width="120"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="workOrdersDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const customerTag = ref('')

// 弹窗相关
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const ordersDialogVisible = ref(false)
const workOrdersDialogVisible = ref(false)
const dialogTitle = ref('添加客户')

// 客户表单
const customerForm = ref({
  id: null,
  name: '',
  phone: '',
  note: '',
  tag: 'normal'
})

// 查看表单
const viewForm = ref({
  id: null,
  name: '',
  phone: '',
  note: '',
  tag: '',
  lastContact: '',
  orderCount: 0,
  workOrderCount: 0
})

// 订单和工单相关
const currentCustomerId = ref(null)
const currentCustomerName = ref('')
const customerOrders = ref([])
const customerWorkOrders = ref([])

// 客户数据
const customers = ref([
  { id: 1, name: '张女士', phone: '138****1234', note: '意向橱柜定制，预算15万', tag: 'hot', lastContact: '2026-04-01 10:30', orderCount: 2, workOrderCount: 1 },
  { id: 2, name: '李先生', phone: '139****5678', note: '新房装修，需要全屋定制', tag: 'new', lastContact: '2026-03-31 14:20', orderCount: 1, workOrderCount: 1 },
  { id: 3, name: '王女士', phone: '137****9012', note: '老客户介绍，关注衣柜产品', tag: 'normal', lastContact: '2026-03-30 09:15', orderCount: 0, workOrderCount: 0 },
  { id: 4, name: '赵先生', phone: '136****3456', note: '别墅装修，需要整体方案', tag: 'hot', lastContact: '2026-03-29 16:45', orderCount: 3, workOrderCount: 2 }
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
  // 模拟搜索逻辑
  const keyword = searchKeyword.value.toLowerCase()
  const tag = customerTag.value
  
  // 模拟搜索过程
  const loading = ElLoading.service({ text: '正在搜索客户...' })
  
  setTimeout(() => {
    // 过滤数据
    const filteredCustomers = customers.value.filter(customer => {
      const nameMatch = customer.name.toLowerCase().includes(keyword) || customer.phone.toLowerCase().includes(keyword)
      const tagMatch = !tag || customer.tag === tag
      return nameMatch && tagMatch
    })
    
    // 更新显示数据
    total.value = filteredCustomers.length
    
    if (filteredCustomers.length > 0) {
      ElMessage.success(`找到 ${filteredCustomers.length} 个客户`)
    } else {
      ElMessage.info('未找到匹配的客户')
    }
    loading.close()
  }, 500)
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  customerTag.value = ''
  ElMessage.info('搜索条件已重置')
}

// 查看客户
const viewCustomer = (customer) => {
  // 填充查看表单数据
  viewForm.value = {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    note: customer.note,
    tag: customer.tag,
    lastContact: customer.lastContact,
    orderCount: customer.orderCount,
    workOrderCount: customer.workOrderCount
  }
  viewDialogVisible.value = true
}

// 编辑客户
const editCustomer = (customer) => {
  // 填充表单数据
  customerForm.value = {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    note: customer.note,
    tag: customer.tag
  }
  dialogTitle.value = '编辑客户'
  dialogVisible.value = true
}

// 删除客户
const deleteCustomer = (customerId) => {
  // 确认删除
  ElMessageBox.confirm('确定要删除该客户吗？删除后将无法恢复。', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除过程
    const loading = ElLoading.service({ text: '正在删除客户...' })
    
    setTimeout(() => {
      // 模拟删除逻辑
      const index = customers.value.findIndex(c => c.id === customerId)
      if (index !== -1) {
        customers.value.splice(index, 1)
        total.value--
        ElMessage.success('客户删除成功')
      } else {
        ElMessage.error('客户不存在或已被删除')
      }
      loading.close()
    }, 500)
  }).catch(() => {
    // 取消删除
    ElMessage.info('已取消删除操作')
  })
}

// 提交客户表单
const submitCustomer = () => {
  // 表单验证
  if (!customerForm.value.name) {
    ElMessage.error('请输入客户名称')
    return
  }
  if (!customerForm.value.phone) {
    ElMessage.error('请输入联系电话')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在保存客户信息...' })
  
  setTimeout(() => {
    if (customerForm.value.id) {
      // 编辑客户
      const index = customers.value.findIndex(c => c.id === customerForm.value.id)
      if (index !== -1) {
        customers.value[index] = {
          ...customers.value[index],
          name: customerForm.value.name,
          phone: customerForm.value.phone,
          note: customerForm.value.note,
          tag: customerForm.value.tag
        }
        ElMessage.success('客户编辑成功')
      }
    } else {
      // 添加客户
      const newCustomer = {
        id: customers.value.length + 1,
        name: customerForm.value.name,
        phone: customerForm.value.phone,
        note: customerForm.value.note,
        tag: customerForm.value.tag,
        lastContact: new Date().toLocaleString('zh-CN'),
        orderCount: 0,
        workOrderCount: 0
      }
      customers.value.push(newCustomer)
      total.value++
      ElMessage.success('客户添加成功')
    }
    
    dialogVisible.value = false
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

// 查看订单
const viewOrders = (customerId) => {
  // 找到客户信息
  const customer = customers.value.find(c => c.id === customerId)
  if (customer) {
    currentCustomerId.value = customerId
    currentCustomerName.value = customer.name
    
    // 模拟获取订单数据
    const loading = ElLoading.service({ text: '正在加载订单数据...' })
    
    setTimeout(() => {
      // 模拟订单数据
      customerOrders.value = [
        {
          orderId: `ORD${customerId}001`,
          orderDate: '2026-03-20 14:30',
          amount: '150000.00',
          status: '已完成',
          remark: '橱柜定制订单'
        },
        {
          orderId: `ORD${customerId}002`,
          orderDate: '2026-03-15 10:20',
          amount: '50000.00',
          status: '进行中',
          remark: '衣柜定制订单'
        }
      ]
      
      ordersDialogVisible.value = true
      loading.close()
    }, 500)
  }
}

// 查看工单
const viewWorkOrders = (customerId) => {
  // 找到客户信息
  const customer = customers.value.find(c => c.id === customerId)
  if (customer) {
    currentCustomerId.value = customerId
    currentCustomerName.value = customer.name
    
    // 模拟获取工单数据
    const loading = ElLoading.service({ text: '正在加载工单数据...' })
    
    setTimeout(() => {
      // 模拟工单数据
      customerWorkOrders.value = [
        {
          workOrderId: `WO${customerId}001`,
          createDate: '2026-03-22 09:15',
          type: '安装',
          status: '已完成',
          remark: '橱柜安装'
        },
        {
          workOrderId: `WO${customerId}002`,
          createDate: '2026-03-25 14:45',
          type: '维修',
          status: '待处理',
          remark: '衣柜门调整'
        }
      ]
      
      workOrdersDialogVisible.value = true
      loading.close()
    }, 500)
  }
}

// 添加客户
const addCustomer = () => {
  // 重置表单
  customerForm.value = {
    id: null,
    name: '',
    phone: '',
    note: '',
    tag: 'normal'
  }
  dialogTitle.value = '添加客户'
  dialogVisible.value = true
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
    console.log('客户数据加载完成')
  }, 500)
})
</script>

<style scoped>
.headquarters-customers {
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