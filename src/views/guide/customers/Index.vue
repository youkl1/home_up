<template>
  <div class="guide-customers">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <h1>客户管理</h1>
      <div class="nav-icons">
        <div class="nav-icon order" @click="navigateTo('订单')"></div>
        <div class="nav-icon ticket" @click="navigateTo('工单')"></div>
        <div class="nav-icon referral" @click="navigateTo('转介绍')"></div>
        <div class="nav-icon tag" @click="navigateTo('标签')"></div>
        <div class="nav-icon plus" @click="addCustomer"></div>
      </div>
    </div>
    
    <!-- 搜索框 -->
    <div class="search-bar">
      <div class="search-input">
        <div class="search-icon"></div>
        <input 
          type="text" 
          v-model="searchValue" 
          placeholder="搜索客户"
          class="search-input-field"
          @keyup.enter="onSearch"
        />
        <button class="search-cancel" @click="onCancel">取消</button>
      </div>
    </div>
    
    <!-- 客户列表 -->
    <div class="customer-list">
      <div class="customers">
        <div
          v-for="customer in filteredCustomers"
          :key="customer.id"
          class="customer-item"
        >
          <div class="customer-avatar">{{ customer.name.charAt(0) }}</div>
          <div class="customer-info" @click="viewCustomerDetail(customer)">
            <div class="customer-header">
              <h3 class="customer-name">{{ customer.name }}</h3>
              <span class="customer-tag" :class="customer.tag">{{ customer.tagText }}</span>
            </div>
            <p class="customer-phone">{{ customer.phone }}</p>
            <p class="customer-note">{{ customer.note }}</p>
            <div class="customer-time">
              <span>{{ customer.lastContact }}</span>
            </div>
          </div>
          <div class="customer-actions">
            <div class="action-icon edit" @click.stop="editCustomer(customer)"></div>
            <div class="action-icon delete" @click.stop="deleteCustomer(customer.id)"></div>
          </div>
        </div>
        <div v-if="filteredCustomers.length === 0" class="no-data">暂无客户</div>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-if="finished" class="finished">没有更多了</div>
      </div>
    </div>
    
    <!-- 添加/编辑客户弹窗 -->
    <div class="dialog-overlay" v-if="dialogVisible">
      <div class="dialog">
        <div class="dialog-header">
          <h2>{{ dialogTitle }}</h2>
          <div class="dialog-close" @click="dialogVisible = false">&times;</div>
        </div>
        <div class="dialog-content">
          <form @submit.prevent="submitCustomer">
            <div class="form-group">
              <label>客户姓名</label>
              <input type="text" v-model="customerForm.name" placeholder="请输入客户姓名" required>
            </div>
            <div class="form-group">
              <label>手机号码</label>
              <input type="tel" v-model="customerForm.phone" placeholder="请输入手机号码" required>
            </div>
            <div class="form-group">
              <label>备注信息</label>
              <textarea v-model="customerForm.note" placeholder="请输入备注信息"></textarea>
            </div>
            <div class="form-group">
              <label>客户标签</label>
              <select v-model="customerForm.tag">
                <option value="hot">热门</option>
                <option value="new">新客户</option>
                <option value="normal">普通</option>
              </select>
            </div>
            <div class="dialog-footer">
              <button type="button" class="btn-cancel" @click="dialogVisible = false">取消</button>
              <button type="submit" class="btn-submit">{{ dialogTitle }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- 查看客户详情弹窗 -->
    <div class="dialog-overlay" v-if="viewDialogVisible">
      <div class="dialog">
        <div class="dialog-header">
          <h2>{{ viewForm.name }} - 客户详情</h2>
          <div class="dialog-close" @click="viewDialogVisible = false">&times;</div>
        </div>
        <div class="dialog-content">
          <div class="info-group">
            <label>客户姓名</label>
            <span>{{ viewForm.name }}</span>
          </div>
          <div class="info-group">
            <label>手机号码</label>
            <span>{{ viewForm.phone }}</span>
          </div>
          <div class="info-group">
            <label>备注信息</label>
            <span>{{ viewForm.note }}</span>
          </div>
          <div class="info-group">
            <label>客户标签</label>
            <span>{{ viewForm.tagText }}</span>
          </div>
          <div class="info-group">
            <label>最后联系时间</label>
            <span>{{ viewForm.lastContact }}</span>
          </div>
        </div>
        <div class="dialog-footer">
          <button type="button" class="btn-cancel" @click="viewDialogVisible = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 搜索值
const searchValue = ref('')
// 加载状态
const loading = ref(false)
const finished = ref(false)

// 弹窗相关
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
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
  tagText: '',
  lastContact: ''
})

// 客户数据
const customers = ref([
  {
    id: 1,
    name: '张女士',
    phone: '138****1234',
    note: '意向橱柜定制，预算15万',
    tag: 'hot',
    tagText: '热门',
    lastContact: '2026-04-01 10:30'
  },
  {
    id: 2,
    name: '李先生',
    phone: '139****5678',
    note: '新房装修，需要全屋定制',
    tag: 'new',
    tagText: '新客户',
    lastContact: '2026-03-31 14:20'
  },
  {
    id: 3,
    name: '王女士',
    phone: '137****9012',
    note: '老客户介绍，关注衣柜产品',
    tag: 'normal',
    tagText: '普通',
    lastContact: '2026-03-30 09:15'
  },
  {
    id: 4,
    name: '赵先生',
    phone: '136****3456',
    note: '别墅装修，需要整体方案',
    tag: 'hot',
    tagText: '热门',
    lastContact: '2026-03-29 16:45'
  },
  {
    id: 5,
    name: '陈女士',
    phone: '135****7890',
    note: '公寓装修，需要橱柜和卫浴',
    tag: 'new',
    tagText: '新客户',
    lastContact: '2026-03-28 11:30'
  },
  {
    id: 6,
    name: '吴先生',
    phone: '134****2345',
    note: '旧房改造，需要局部定制',
    tag: 'normal',
    tagText: '普通',
    lastContact: '2026-03-27 15:20'
  }
])

// 过滤后的客户列表
const filteredCustomers = computed(() => {
  let result = customers.value
  
  // 按搜索词过滤
  if (searchValue.value) {
    const searchLower = searchValue.value.toLowerCase()
    result = result.filter(customer => 
      customer.name.toLowerCase().includes(searchLower) ||
      customer.phone.toLowerCase().includes(searchLower) ||
      customer.note.toLowerCase().includes(searchLower)
    )
  }
  
  return result
})

// 搜索
const onSearch = () => {
  // 搜索逻辑已在filteredCustomers中实现
}

// 取消搜索
const onCancel = () => {
  searchValue.value = ''
}

// 添加客户
const addCustomer = () => {
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

// 编辑客户
const editCustomer = (customer) => {
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
  if (confirm('确定要删除该客户吗？删除后将无法恢复。')) {
    // 模拟删除过程
    loading.value = true
    
    setTimeout(() => {
      const index = customers.value.findIndex(c => c.id === customerId)
      if (index !== -1) {
        customers.value.splice(index, 1)
        alert('客户删除成功')
      } else {
        alert('客户不存在或已被删除')
      }
      loading.value = false
    }, 500)
  }
}

// 提交客户表单
const submitCustomer = () => {
  // 表单验证
  if (!customerForm.value.name) {
    alert('请输入客户姓名')
    return
  }
  if (!customerForm.value.phone) {
    alert('请输入手机号码')
    return
  }
  
  // 模拟提交过程
  loading.value = true
  
  setTimeout(() => {
    const tagTextMap = {
      hot: '热门',
      new: '新客户',
      normal: '普通'
    }
    
    if (customerForm.value.id) {
      // 编辑客户
      const index = customers.value.findIndex(c => c.id === customerForm.value.id)
      if (index !== -1) {
        customers.value[index] = {
          ...customers.value[index],
          name: customerForm.value.name,
          phone: customerForm.value.phone,
          note: customerForm.value.note,
          tag: customerForm.value.tag,
          tagText: tagTextMap[customerForm.value.tag]
        }
        alert('客户编辑成功')
      }
    } else {
      // 添加客户
      const newCustomer = {
        id: customers.value.length + 1,
        name: customerForm.value.name,
        phone: customerForm.value.phone,
        note: customerForm.value.note,
        tag: customerForm.value.tag,
        tagText: tagTextMap[customerForm.value.tag],
        lastContact: new Date().toLocaleString('zh-CN')
      }
      customers.value.push(newCustomer)
      alert('客户添加成功')
    }
    
    dialogVisible.value = false
    loading.value = false
  }, 1000)
}

// 查看客户详情
const viewCustomerDetail = (customer) => {
  // 填充查看表单数据
  viewForm.value = {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    note: customer.note,
    tag: customer.tag,
    tagText: customer.tagText,
    lastContact: customer.lastContact
  }
  viewDialogVisible.value = true
}

// 加载更多
const onLoad = () => {
  // 模拟加载
  setTimeout(() => {
    // 模拟加载更多数据
    const newCustomers = [
      {
        id: 7,
        name: '刘女士',
        phone: '133****6789',
        note: '办公室装修，需要办公家具',
        tag: 'hot',
        tagText: '热门',
        lastContact: '2026-03-26 10:00'
      },
      {
        id: 8,
        name: '孙先生',
        phone: '132****1234',
        note: '商铺装修，需要展示柜',
        tag: 'new',
        tagText: '新客户',
        lastContact: '2026-03-25 14:30'
      }
    ]
    customers.value.push(...newCustomers)
    loading.value = false
    finished.value = true
  }, 1000)
}

// 导航到对应页面
const navigateTo = (path) => {
  const pathMap = {
    '订单': '/guide/payment/records',
    '工单': '/guide/tickets/list',
    '转介绍': '/guide/referral/rules',
    '标签': '/guide/tags/manage'
  }
  router.push(pathMap[path] || '/guide/customers')
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
.guide-customers {
  width: 375px;
  min-height: 100vh;
  padding-bottom: 20px;
  margin: 0 auto;
  overflow-x: hidden;
  background-color: #f5f5f5;
}

.top-nav {
  width: 375px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #667eea;
  color: white;
  margin: 0 auto;
}

.nav-icons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-nav h1 {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

/* 导航图标 */
.nav-icon {
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}

.nav-icon.plus {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>');
}

.nav-icon.order {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>');
}

.nav-icon.ticket {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>');
}

.nav-icon.referral {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>');
}

.nav-icon.tag {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h7V2H7v5z"/></svg>');
}

.search-bar {
  width: 375px;
  padding: 10px 15px;
  background-color: white;
  margin: 0 auto;
}

.search-input {
  display: flex;
  align-items: center;
  background-color: #F5F7FA;
  border-radius: 8px;
  height: 36px;
  padding: 0 12px;
}

.search-icon {
  width: 16px;
  height: 16px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#969799"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 8px;
}

.search-input-field {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #333;
  outline: none;
}

.search-input-field::placeholder {
  color: #999;
}

.search-cancel {
  margin-left: 12px;
  background: none;
  border: none;
  font-size: 14px;
  color: #667eea;
  cursor: pointer;
  padding: 0;
}

.customer-list {
  background-color: #f5f5f5;
}

.loading,
.finished {
  text-align: center;
  padding: 16px;
  font-size: 14px;
  color: #999;
}

.customer-item {
  background-color: white;
  margin-bottom: 10px;
  padding: 15px;
  display: flex;
  align-items: flex-start;
  position: relative;
}

.customer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
}

.customer-info {
  flex: 1;
  margin-left: 15px;
  cursor: pointer;
}

.customer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.customer-name {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.customer-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  color: white;
}

.customer-tag.hot {
  background-color: #f56c6c;
}

.customer-tag.new {
  background-color: #67c23a;
}

.customer-tag.normal {
  background-color: #909399;
}

.customer-phone {
  font-size: 14px;
  color: #666;
  margin: 0 0 5px 0;
}

.customer-note {
  font-size: 14px;
  color: #666;
  margin: 0 0 5px 0;
  line-height: 1.4;
}

.customer-time {
  font-size: 12px;
  color: #909399;
}

/* 操作按钮 */
.customer-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 10px;
}

.action-icon {
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}

.action-icon.edit {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#667eea"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>');
}

.action-icon.delete {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f56c6c"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>');
}

/* 弹窗样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.dialog-header h2 {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.dialog-close {
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.dialog-content {
  padding: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  margin-top: 16px;
}

.btn-cancel {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background-color: white;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  color: #333;
}

.btn-submit {
  padding: 8px 16px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #5a6fe4;
}

/* 查看详情弹窗样式 */
.info-group {
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
}

.info-group label {
  width: 100px;
  font-weight: 500;
  color: #333;
  margin-right: 16px;
}

.info-group span {
  flex: 1;
  color: #666;
  word-break: break-word;
}

.no-data {
  text-align: center;
  padding: 32px;
  color: #999;
  font-size: 14px;
}
</style>