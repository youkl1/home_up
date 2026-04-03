<template>
  <div class="customer-detail">
    <div class="page-header">
      <h1>客户详情</h1>
      <div class="header-actions">
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="editCustomer">编辑客户</el-button>
      </div>
    </div>
    
    <!-- 客户基本信息 -->
    <div class="info-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>客户基本信息</span>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="客户ID">{{ customer.id }}</el-descriptions-item>
          <el-descriptions-item label="客户姓名">{{ customer.name }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ customer.phone }}</el-descriptions-item>
          <el-descriptions-item label="客户标签">
            <el-tag :type="getTagType(customer.tag)">{{ getTagText(customer.tag) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="所属导购">{{ customer.guide }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ customer.createTime }}</el-descriptions-item>
          <el-descriptions-item label="客户来源">{{ customer.source }}</el-descriptions-item>
          <el-descriptions-item label="最后联系时间">{{ customer.lastContact }}</el-descriptions-item>
          <el-descriptions-item label="客户状态">{{ customer.status }}</el-descriptions-item>
        </el-descriptions>
        <div class="customer-note">
          <h4>客户备注</h4>
          <p>{{ customer.note }}</p>
        </div>
      </el-card>
    </div>
    
    <!-- 关联数据标签页 -->
    <div class="tabs-section">
      <el-card shadow="hover">
        <el-tabs v-model="activeTab">
          <!-- 订单记录 -->
          <el-tab-pane label="订单记录" name="orders">
            <div class="tab-content">
              <div class="tab-header">
                <span>共 {{ customer.orders.length }} 个订单</span>
                <el-button type="primary" size="small" @click="createOrder">新建订单</el-button>
              </div>
              <el-table :data="customer.orders" style="width: 100%">
                <el-table-column prop="id" label="订单号" width="180"></el-table-column>
                <el-table-column prop="amount" label="订单金额"></el-table-column>
                <el-table-column prop="status" label="订单状态">
                  <template #default="scope">
                    <el-tag :type="getOrderStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                <el-table-column label="操作" width="120">
                  <template #default="scope">
                    <el-button size="small" @click="viewOrder(scope.row.id)">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          
          <!-- 售后工单 -->
          <el-tab-pane label="售后工单" name="tickets">
            <div class="tab-content">
              <div class="tab-header">
                <span>共 {{ customer.tickets.length }} 个工单</span>
                <el-button type="primary" size="small" @click="createTicket">新建工单</el-button>
              </div>
              <el-table :data="customer.tickets" style="width: 100%">
                <el-table-column prop="id" label="工单号" width="180"></el-table-column>
                <el-table-column prop="type" label="工单类型"></el-table-column>
                <el-table-column prop="status" label="处理状态">
                  <template #default="scope">
                    <el-tag :type="getTicketStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                <el-table-column label="操作" width="120">
                  <template #default="scope">
                    <el-button size="small" @click="viewTicket(scope.row.id)">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          
          <!-- 转介绍记录 -->
          <el-tab-pane label="转介绍记录" name="referrals">
            <div class="tab-content">
              <div class="tab-header">
                <span>共 {{ customer.referrals.length }} 条转介绍记录</span>
              </div>
              <el-table :data="customer.referrals" style="width: 100%">
                <el-table-column prop="id" label="记录ID" width="120"></el-table-column>
                <el-table-column prop="referee" label="被介绍人"></el-table-column>
                <el-table-column prop="status" label="状态">
                  <template #default="scope">
                    <el-tag :type="scope.row.status === '已转化' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="转介绍时间" width="180"></el-table-column>
                <el-table-column label="操作" width="120">
                  <template #default="scope">
                    <el-button size="small" @click="viewReferral(scope.row.id)">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          
          <!-- 跟进记录 -->
          <el-tab-pane label="跟进记录" name="followups">
            <div class="tab-content">
              <div class="tab-header">
                <span>共 {{ customer.followups.length }} 条跟进记录</span>
                <el-button type="primary" size="small" @click="addFollowup">添加跟进</el-button>
              </div>
              <el-timeline>
                <el-timeline-item
                  v-for="(record, index) in customer.followups"
                  :key="index"
                  :timestamp="record.time"
                >
                  <div class="followup-item">
                    <div class="followup-operator">{{ record.operator }}</div>
                    <div class="followup-content">{{ record.content }}</div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 编辑客户弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑客户信息" width="600px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="客户姓名" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="客户标签" prop="tag">
          <el-select v-model="editForm.tag" placeholder="请选择" style="width: 100%">
            <el-option label="热门" value="hot" />
            <el-option label="新客户" value="new" />
            <el-option label="普通" value="normal" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属导购" prop="guide">
          <el-select v-model="editForm.guide" placeholder="请选择" style="width: 100%">
            <el-option label="张三" value="张三" />
            <el-option label="李四" value="李四" />
            <el-option label="王五" value="王五" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户来源" prop="source">
          <el-select v-model="editForm.source" placeholder="请选择" style="width: 100%">
            <el-option label="自然进店" value="自然进店" />
            <el-option label="电话邀约" value="电话邀约" />
            <el-option label="线上推广" value="线上推广" />
            <el-option label="转介绍" value="转介绍" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择" style="width: 100%">
            <el-option label="新客资" value="新客资" />
            <el-option label="跟进中" value="跟进中" />
            <el-option label="意向强烈" value="意向强烈" />
            <el-option label="已报价" value="已报价" />
            <el-option label="已成交" value="已成交" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户备注" prop="note">
          <el-input v-model="editForm.note" type="textarea" :rows="3" placeholder="请输入客户备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit" :loading="submitting">保存</el-button>
      </template>
    </el-dialog>

    <!-- 创建订单弹窗 -->
    <el-dialog v-model="orderDialogVisible" title="新建订单" width="700px">
      <el-form ref="orderFormRef" :model="orderForm" :rules="orderRules" label-width="100px">
        <el-alert
          title="订单信息"
          :description="`为客户 ${customer.name} 创建新订单`"
          type="info"
          show-icon
          :closable="false"
          style="margin-bottom: 20px"
        />
        <el-form-item label="订单类型" prop="type">
          <el-radio-group v-model="orderForm.type">
            <el-radio-button label="custom">全屋定制</el-radio-button>
            <el-radio-button label="furniture">成品家具</el-radio-button>
            <el-radio-button label="mixed">混合订单</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品信息" prop="products">
          <el-input v-model="orderForm.products" type="textarea" :rows="2" placeholder="请输入产品信息" />
        </el-form-item>
        <el-form-item label="订单金额" prop="amount">
          <el-input-number v-model="orderForm.amount" :min="0" :precision="2" style="width: 200px" />
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item label="定金金额" prop="deposit">
          <el-input-number v-model="orderForm.deposit" :min="0" :precision="2" style="width: 200px" />
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item label="预计交付" prop="deliveryDate">
          <el-date-picker v-model="orderForm.deliveryDate" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="订单备注" prop="remark">
          <el-input v-model="orderForm.remark" type="textarea" :rows="2" placeholder="请输入订单备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="orderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateOrder" :loading="submitting">创建订单</el-button>
      </template>
    </el-dialog>

    <!-- 创建工单弹窗 -->
    <el-dialog v-model="ticketDialogVisible" title="新建售后工单" width="600px">
      <el-form ref="ticketFormRef" :model="ticketForm" :rules="ticketRules" label-width="100px">
        <el-alert
          title="工单信息"
          :description="`为客户 ${customer.name} 创建售后工单`"
          type="info"
          show-icon
          :closable="false"
          style="margin-bottom: 20px"
        />
        <el-form-item label="工单类型" prop="type">
          <el-select v-model="ticketForm.type" placeholder="请选择" style="width: 100%">
            <el-option label="安装问题" value="安装问题" />
            <el-option label="产品质量" value="产品质量" />
            <el-option label="物流问题" value="物流问题" />
            <el-option label="售后维修" value="售后维修" />
            <el-option label="投诉建议" value="投诉建议" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联订单" prop="orderId">
          <el-select v-model="ticketForm.orderId" placeholder="请选择关联订单（可选）" style="width: 100%" clearable>
            <el-option 
              v-for="order in customer.orders" 
              :key="order.id" 
              :label="order.id" 
              :value="order.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="问题描述" prop="description">
          <el-input v-model="ticketForm.description" type="textarea" :rows="4" placeholder="请详细描述问题" />
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-radio-group v-model="ticketForm.priority">
            <el-radio-button label="low">低</el-radio-button>
            <el-radio-button label="normal">中</el-radio-button>
            <el-radio-button label="high">高</el-radio-button>
            <el-radio-button label="urgent">紧急</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="ticketDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateTicket" :loading="submitting">创建工单</el-button>
      </template>
    </el-dialog>

    <!-- 添加跟进弹窗 -->
    <el-dialog v-model="followupDialogVisible" title="添加跟进记录" width="600px">
      <el-form ref="followupFormRef" :model="followupForm" :rules="followupRules" label-width="100px">
        <el-alert
          title="跟进信息"
          :description="`为客户 ${customer.name} 添加跟进记录`"
          type="info"
          show-icon
          :closable="false"
          style="margin-bottom: 20px"
        />
        <el-form-item label="跟进方式" prop="method">
          <el-radio-group v-model="followupForm.method">
            <el-radio-button label="phone">电话</el-radio-button>
            <el-radio-button label="wechat">微信</el-radio-button>
            <el-radio-button label="visit">到店</el-radio-button>
            <el-radio-button label="onsite">上门</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="跟进内容" prop="content">
          <el-input v-model="followupForm.content" type="textarea" :rows="4" placeholder="记录跟进内容" />
        </el-form-item>
        <el-form-item label="客户意向" prop="intention">
          <el-rate v-model="followupForm.intention" :max="5" show-score />
        </el-form-item>
        <el-form-item label="下次跟进" prop="nextTime">
          <el-date-picker v-model="followupForm.nextTime" type="datetime" placeholder="选择时间" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="followupDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddFollowup" :loading="submitting">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 当前激活的标签页
const activeTab = ref('orders')

// 客户数据
const customer = ref({
  id: 'CUST001',
  name: '张女士',
  phone: '138****1234',
  tag: 'hot',
  guide: '李四',
  createTime: '2026-01-15 10:30',
  source: '自然进店',
  lastContact: '2026-04-01 14:20',
  status: '跟进中',
  note: '意向橱柜定制，预算15万，对品牌认可度较高，需要尽快跟进',
  orders: [
    { id: 'ORD20260301001', amount: '¥89,000', status: '已完成', createTime: '2026-03-01 10:30' },
    { id: 'ORD20260401001', amount: '¥25,000', status: '生产中', createTime: '2026-04-01 09:15' }
  ],
  tickets: [
    { id: 'SRV20260315001', type: '安装问题', status: '已完成', createTime: '2026-03-15 16:45' }
  ],
  referrals: [
    { id: 'REF20260320001', referee: '陈女士', status: '已转化', createTime: '2026-03-20 11:00' }
  ],
  followups: [
    { time: '2026-04-01 14:20', operator: '李四', content: '电话沟通，客户对设计方案满意，准备签订合同' },
    { time: '2026-03-28 10:30', operator: '李四', content: '上门量尺，确认厨房布局' },
    { time: '2026-03-15 09:00', operator: '张三', content: '首次接待，了解客户需求' }
  ]
})

// 弹窗控制
const editDialogVisible = ref(false)
const orderDialogVisible = ref(false)
const ticketDialogVisible = ref(false)
const followupDialogVisible = ref(false)
const submitting = ref(false)

// 表单引用
const editFormRef = ref(null)
const orderFormRef = ref(null)
const ticketFormRef = ref(null)
const followupFormRef = ref(null)

// 编辑表单
const editForm = reactive({
  name: '',
  phone: '',
  tag: '',
  guide: '',
  source: '',
  status: '',
  note: ''
})

// 订单表单
const orderForm = reactive({
  type: 'custom',
  products: '',
  amount: 0,
  deposit: 0,
  deliveryDate: '',
  remark: ''
})

// 工单表单
const ticketForm = reactive({
  type: '',
  orderId: '',
  description: '',
  priority: 'normal'
})

// 跟进表单
const followupForm = reactive({
  method: 'phone',
  content: '',
  intention: 3,
  nextTime: ''
})

// 表单校验规则
const editRules = {
  name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  tag: [{ required: true, message: '请选择客户标签', trigger: 'change' }],
  guide: [{ required: true, message: '请选择所属导购', trigger: 'change' }],
  source: [{ required: true, message: '请选择客户来源', trigger: 'change' }],
  status: [{ required: true, message: '请选择客户状态', trigger: 'change' }]
}

const orderRules = {
  type: [{ required: true, message: '请选择订单类型', trigger: 'change' }],
  products: [{ required: true, message: '请输入产品信息', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入订单金额', trigger: 'blur' }]
}

const ticketRules = {
  type: [{ required: true, message: '请选择工单类型', trigger: 'change' }],
  description: [{ required: true, message: '请输入问题描述', trigger: 'blur' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }]
}

const followupRules = {
  method: [{ required: true, message: '请选择跟进方式', trigger: 'change' }],
  content: [{ required: true, message: '请输入跟进内容', trigger: 'blur' }]
}

// 获取标签类型
const getTagType = (tag) => {
  const typeMap = { hot: 'danger', new: 'success', normal: 'info' }
  return typeMap[tag] || 'info'
}

// 获取标签文本
const getTagText = (tag) => {
  const textMap = { hot: '热门', new: '新客户', normal: '普通' }
  return textMap[tag] || '普通'
}

// 获取订单状态类型
const getOrderStatusType = (status) => {
  const typeMap = { '已完成': 'success', '生产中': 'warning', '待付款': 'danger', '已取消': 'info' }
  return typeMap[status] || 'info'
}

// 获取工单状态类型
const getTicketStatusType = (status) => {
  const typeMap = { '已完成': 'success', '处理中': 'warning', '待处理': 'danger' }
  return typeMap[status] || 'info'
}

// 返回
const goBack = () => {
  router.push('/store/customers')
}

// 编辑客户
const editCustomer = () => {
  Object.assign(editForm, {
    name: customer.value.name,
    phone: customer.value.phone,
    tag: customer.value.tag,
    guide: customer.value.guide,
    source: customer.value.source,
    status: customer.value.status,
    note: customer.value.note
  })
  editDialogVisible.value = true
}

// 确认编辑
const confirmEdit = async () => {
  const valid = await editFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    Object.assign(customer.value, editForm)
    submitting.value = false
    editDialogVisible.value = false
    ElMessage.success('客户信息更新成功')
  }, 500)
}

// 创建订单
const createOrder = () => {
  Object.assign(orderForm, {
    type: 'custom',
    products: '',
    amount: 0,
    deposit: 0,
    deliveryDate: '',
    remark: ''
  })
  orderDialogVisible.value = true
}

// 确认创建订单
const confirmCreateOrder = async () => {
  const valid = await orderFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    const newOrder = {
      id: 'ORD' + Date.now(),
      amount: '¥' + orderForm.amount.toLocaleString(),
      status: '待付款',
      createTime: new Date().toLocaleString()
    }
    customer.value.orders.unshift(newOrder)
    submitting.value = false
    orderDialogVisible.value = false
    ElMessage.success('订单创建成功')
  }, 500)
}

// 查看订单
const viewOrder = (orderId) => {
  router.push(`/store/orders/detail/${orderId}`)
}

// 创建工单
const createTicket = () => {
  Object.assign(ticketForm, {
    type: '',
    orderId: '',
    description: '',
    priority: 'normal'
  })
  ticketDialogVisible.value = true
}

// 确认创建工单
const confirmCreateTicket = async () => {
  const valid = await ticketFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    const newTicket = {
      id: 'SRV' + Date.now(),
      type: ticketForm.type,
      status: '待处理',
      createTime: new Date().toLocaleString()
    }
    customer.value.tickets.unshift(newTicket)
    submitting.value = false
    ticketDialogVisible.value = false
    ElMessage.success('工单创建成功')
  }, 500)
}

// 查看工单
const viewTicket = (ticketId) => {
  ElMessageBox.alert(
    `工单编号：${ticketId}<br>客户：${customer.value.name}<br>状态：处理中`,
    '工单详情',
    { dangerouslyUseHTMLString: true }
  )
}

// 查看转介绍
const viewReferral = (referralId) => {
  const referral = customer.value.referrals.find(r => r.id === referralId)
  if (referral) {
    ElMessageBox.alert(
      `记录编号：${referral.id}<br>被介绍人：${referral.referee}<br>状态：${referral.status}<br>时间：${referral.createTime}`,
      '转介绍详情',
      { dangerouslyUseHTMLString: true }
    )
  }
}

// 添加跟进
const addFollowup = () => {
  Object.assign(followupForm, {
    method: 'phone',
    content: '',
    intention: 3,
    nextTime: ''
  })
  followupDialogVisible.value = true
}

// 确认添加跟进
const confirmAddFollowup = async () => {
  const valid = await followupFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    const newFollowup = {
      time: new Date().toLocaleString(),
      operator: '当前用户',
      content: followupForm.content
    }
    customer.value.followups.unshift(newFollowup)
    submitting.value = false
    followupDialogVisible.value = false
    ElMessage.success('跟进记录添加成功')
  }, 500)
}

// 组件挂载
onMounted(() => {
  const customerId = route.params.id
  console.log('客户ID:', customerId)
  // 模拟获取客户详情数据
})
</script>

<style scoped>
.customer-detail {
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

.header-actions {
  display: flex;
  gap: 10px;
}

.info-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.customer-note {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.customer-note h4 {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
}

.customer-note p {
  margin: 0;
  line-height: 1.6;
}

.tabs-section {
  margin-bottom: 20px;
}

.tab-content {
  padding: 20px 0;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.followup-item {
  margin-bottom: 10px;
}

.followup-operator {
  font-weight: bold;
  margin-bottom: 5px;
}

.followup-content {
  color: #666;
  line-height: 1.5;
}
</style>
