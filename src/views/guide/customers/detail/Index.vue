<template>
  <div class="customer-detail">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="nav-icon back" @click="goBack"></div>
      <h1 class="text-lg font-semibold text-white">客户详情</h1>
      <div class="nav-icon more" @click="showMore"></div>
    </div>
    
    <!-- 客户信息 -->
    <div class="customer-info card mt-4">
      <div class="customer-header flex items-center">
        <div class="customer-avatar">{{ customer.name.charAt(0) }}</div>
        <div class="customer-basic ml-4 flex-1">
          <div class="flex justify-between items-center">
            <h2 class="customer-name font-semibold">{{ customer.name }}</h2>
            <span class="customer-tag" :class="customer.tag">{{ customer.tagText }}</span>
          </div>
          <p class="customer-phone mt-2">{{ customer.phone }}</p>
          <p class="customer-note mt-1">{{ customer.note }}</p>
        </div>
      </div>
      
      <!-- 客户详情信息 -->
      <div class="customer-details mt-6">
        <div class="detail-item">
          <span class="detail-label">上次联系</span>
          <span class="detail-value">{{ customer.lastContact }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">客户来源</span>
          <span class="detail-value">{{ customer.source || '自然到访' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">意向产品</span>
          <span class="detail-value">{{ customer.interestedProducts || '橱柜、衣柜' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">预算范围</span>
          <span class="detail-value">{{ customer.budget || '10-20万' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">备注</span>
          <span class="detail-value">{{ customer.remarks || '无' }}</span>
        </div>
      </div>
    </div>
    
    <!-- 历史记录 -->
    <div class="history card mt-4">
      <h3 class="history-title font-semibold mb-4">历史记录</h3>
      <div class="history-items">
        <div v-for="record in customer.history" :key="record.id" class="history-item">
          <div class="history-time">{{ record.time }}</div>
          <div class="history-content">{{ record.content }}</div>
        </div>
        <div v-if="customer.history.length === 0" class="no-history">
          <div class="no-history-icon"></div>
          <div class="no-history-text">暂无历史记录</div>
        </div>
      </div>
    </div>
    
    <!-- 底部操作栏 -->
    <div class="bottom-bar">
      <button class="action-button call-button" @click="callCustomer">
        <div class="action-icon phone"></div>
        <span>电话</span>
      </button>
      <button class="action-button message-button" @click="messageCustomer">
        <div class="action-icon message"></div>
        <span>短信</span>
      </button>
      <button class="action-button edit-button" @click="editCustomer">
        <div class="action-icon edit"></div>
        <span>编辑</span>
      </button>
      <button class="action-button add-record-button" @click="addRecord">
        <div class="action-icon add"></div>
        <span>记录</span>
      </button>
    </div>
    
    <!-- 编辑客户信息弹窗 -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">编辑客户信息</h3>
          <div class="modal-close" @click="closeEditModal"></div>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">客户姓名</label>
            <input type="text" v-model="editForm.name" class="form-input" placeholder="请输入客户姓名">
          </div>
          <div class="form-group">
            <label class="form-label">联系电话</label>
            <input type="text" v-model="editForm.phone" class="form-input" placeholder="请输入联系电话">
          </div>
          <div class="form-group">
            <label class="form-label">客户标签</label>
            <select v-model="editForm.tag" class="form-select">
              <option value="hot">热门</option>
              <option value="new">新客户</option>
              <option value="normal">普通</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">意向产品</label>
            <input type="text" v-model="editForm.interestedProducts" class="form-input" placeholder="请输入意向产品">
          </div>
          <div class="form-group">
            <label class="form-label">预算范围</label>
            <input type="text" v-model="editForm.budget" class="form-input" placeholder="请输入预算范围">
          </div>
          <div class="form-group">
            <label class="form-label">备注</label>
            <textarea v-model="editForm.remarks" class="form-textarea" rows="3" placeholder="请输入备注"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="closeEditModal">取消</button>
          <button class="btn btn-confirm" @click="saveCustomer">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 添加记录弹窗 -->
    <div v-if="showRecordModal" class="modal-overlay" @click.self="closeRecordModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">添加联系记录</h3>
          <div class="modal-close" @click="closeRecordModal"></div>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">联系时间</label>
            <input type="text" v-model="recordForm.time" class="form-input" placeholder="请输入联系时间">
          </div>
          <div class="form-group">
            <label class="form-label">联系内容</label>
            <textarea v-model="recordForm.content" class="form-textarea" rows="4" placeholder="请输入联系内容"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="closeRecordModal">取消</button>
          <button class="btn btn-confirm" @click="saveRecord">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 客户数据
const customer = ref({
  id: 1,
  name: '张女士',
  phone: '138****1234',
  note: '意向橱柜定制，预算15万',
  tag: 'hot',
  tagText: '热门',
  lastContact: '2026-04-01 10:30',
  source: '自然到访',
  interestedProducts: '橱柜、衣柜',
  budget: '10-20万',
  remarks: '客户对现代简约风格比较感兴趣',
  history: [
    {
      id: 1,
      time: '2026-04-01 10:30',
      content: '客户到店咨询橱柜定制，了解了现代简约风格的产品'
    },
    {
      id: 2,
      time: '2026-03-30 14:20',
      content: '电话沟通，确认客户预算和需求'
    }
  ]
})

// 编辑弹窗显示状态
const showEditModal = ref(false)
// 添加记录弹窗显示状态
const showRecordModal = ref(false)

// 编辑表单数据
const editForm = ref({
  name: '',
  phone: '',
  tag: 'normal',
  interestedProducts: '',
  budget: '',
  remarks: ''
})

// 记录表单数据
const recordForm = ref({
  time: '',
  content: ''
})

// 客户列表数据
const customers = [
  {
    id: 1,
    name: '张女士',
    phone: '138****1234',
    note: '意向橱柜定制，预算15万',
    tag: 'hot',
    tagText: '热门',
    lastContact: '2026-04-01 10:30',
    source: '自然到访',
    interestedProducts: '橱柜、衣柜',
    budget: '10-20万',
    remarks: '客户对现代简约风格比较感兴趣',
    history: [
      {
        id: 1,
        time: '2026-04-01 10:30',
        content: '客户到店咨询橱柜定制，了解了现代简约风格的产品'
      },
      {
        id: 2,
        time: '2026-03-30 14:20',
        content: '电话沟通，确认客户预算和需求'
      }
    ]
  },
  {
    id: 2,
    name: '李先生',
    phone: '139****5678',
    note: '新房装修，需要全屋定制',
    tag: 'new',
    tagText: '新客户',
    lastContact: '2026-03-31 14:20',
    source: '朋友介绍',
    interestedProducts: '全屋定制',
    budget: '20-30万',
    remarks: '新房面积120㎡，需要整体设计方案',
    history: [
      {
        id: 1,
        time: '2026-03-31 14:20',
        content: '电话咨询全屋定制服务'
      }
    ]
  },
  {
    id: 3,
    name: '王女士',
    phone: '137****9012',
    note: '老客户介绍，关注衣柜产品',
    tag: 'normal',
    tagText: '普通',
    lastContact: '2026-03-30 09:15',
    source: '老客户介绍',
    interestedProducts: '衣柜',
    budget: '5-10万',
    remarks: '需要定制衣柜，空间有限',
    history: [
      {
        id: 1,
        time: '2026-03-30 09:15',
        content: '到店了解衣柜产品'
      }
    ]
  },
  {
    id: 4,
    name: '赵先生',
    phone: '136****3456',
    note: '别墅装修，需要整体方案',
    tag: 'hot',
    tagText: '热门',
    lastContact: '2026-03-29 16:45',
    source: '网络咨询',
    interestedProducts: '全屋定制',
    budget: '50万以上',
    remarks: '别墅面积300㎡，需要高端定制方案',
    history: [
      {
        id: 1,
        time: '2026-03-29 16:45',
        content: '电话咨询别墅整体定制方案'
      }
    ]
  }
]

// 标签映射
const tagMap = {
  hot: '热门',
  new: '新客户',
  normal: '普通'
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 显示更多选项
const showMore = () => {
  const options = ['删除客户', '标记为重要', '分享客户']
  const choice = prompt(`请选择操作:\n1. ${options[0]}\n2. ${options[1]}\n3. ${options[2]}`, '1')
  if (choice === '1') {
    if (confirm('确定要删除该客户吗？')) {
      alert('客户已删除')
      router.back()
    }
  } else if (choice === '2') {
    alert('已标记为重要客户')
  } else if (choice === '3') {
    alert('分享功能开发中')
  }
}

// 电话联系客户
const callCustomer = () => {
  if (confirm(`是否拨打客户电话: ${customer.value.phone}`)) {
    alert(`正在拨打 ${customer.value.phone}`)
    // 更新最后联系时间
    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    customer.value.lastContact = timeStr
  }
}

// 短信联系客户
const messageCustomer = () => {
  const message = prompt('请输入短信内容:', '您好，我是金牌厨柜的销售顾问，想跟您确认一下定制方案的细节。')
  if (message) {
    alert(`短信已发送给客户:\n${message}`)
    // 添加到历史记录
    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    customer.value.history.unshift({
      id: Date.now(),
      time: timeStr,
      content: `发送短信: ${message}`
    })
    customer.value.lastContact = timeStr
  }
}

// 编辑客户信息
const editCustomer = () => {
  editForm.value = {
    name: customer.value.name,
    phone: customer.value.phone,
    tag: customer.value.tag,
    interestedProducts: customer.value.interestedProducts,
    budget: customer.value.budget,
    remarks: customer.value.remarks
  }
  showEditModal.value = true
}

// 关闭编辑弹窗
const closeEditModal = () => {
  showEditModal.value = false
}

// 保存客户信息
const saveCustomer = () => {
  if (!editForm.value.name.trim()) {
    alert('请输入客户姓名')
    return
  }
  
  customer.value.name = editForm.value.name
  customer.value.phone = editForm.value.phone
  customer.value.tag = editForm.value.tag
  customer.value.tagText = tagMap[editForm.value.tag]
  customer.value.interestedProducts = editForm.value.interestedProducts
  customer.value.budget = editForm.value.budget
  customer.value.remarks = editForm.value.remarks
  
  alert('客户信息已保存')
  closeEditModal()
}

// 添加联系记录
const addRecord = () => {
  const now = new Date()
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  recordForm.value.time = timeStr
  recordForm.value.content = ''
  showRecordModal.value = true
}

// 关闭记录弹窗
const closeRecordModal = () => {
  showRecordModal.value = false
}

// 保存联系记录
const saveRecord = () => {
  if (!recordForm.value.content.trim()) {
    alert('请输入联系内容')
    return
  }
  
  customer.value.history.unshift({
    id: Date.now(),
    time: recordForm.value.time,
    content: recordForm.value.content
  })
  
  customer.value.lastContact = recordForm.value.time
  
  alert('联系记录已添加')
  closeRecordModal()
}

// 组件挂载
onMounted(() => {
  // 获取客户ID
  const customerId = parseInt(route.params.id)
  // 查找客户数据
  const foundCustomer = customers.find(c => c.id === customerId)
  if (foundCustomer) {
    customer.value = foundCustomer
  }
})
</script>

<style scoped>
/* 全局样式变量 */
:root {
  --primary-color: #667eea;
  --primary-color-dark: #5a6fd8;
  --success-color: #00B42A;
  --warning-color: #FF7D00;
  --danger-color: #F53F3F;
  --text-primary: #1D2129;
  --text-secondary: #646A73;
  --text-tertiary: #86909C;
  --border-color: #E5E6EB;
  --border-color-light: #F2F3F5;
  --bg-color: #F7F8FA;
  --white: #FFFFFF;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.16);
  --border-radius-sm: 8px;
  --border-radius-md: 12px;
  --border-radius-lg: 16px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --transition-fast: 0.2s ease;
}

.customer-detail {
  width: 375px;
  min-height: 100vh;
  background-color: var(--bg-color);
  margin: 0 auto;
  overflow-x: hidden;
  padding-bottom: 88px;
}

.top-nav {
  width: 375px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;
  margin: 0 auto;
}

/* 导航图标 */
.nav-icon {
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.nav-icon:hover {
  transform: scale(1.1);
}

.nav-icon.back {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>');
}

.nav-icon.more {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>');
}

/* 客户信息 */
.customer-info {
  padding: 24px;
  margin: 0 auto;
  width: 375px;
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  margin-top: 16px;
}

.customer-header {
  display: flex;
  align-items: center;
}

.customer-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.customer-basic {
  flex: 1;
  margin-left: 16px;
}

.customer-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
  line-height: 1.2;
}

.customer-tag {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 16px;
  color: white;
  font-weight: 500;
}

.customer-tag.hot {
  background-color: var(--danger-color);
}

.customer-tag.new {
  background-color: var(--success-color);
}

.customer-tag.normal {
  background-color: var(--text-tertiary);
}

.customer-phone {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 8px 0 4px 0;
  line-height: 1.4;
}

.customer-note {
  font-size: 14px;
  color: var(--text-tertiary);
  margin: 0;
  line-height: 1.5;
}

.customer-details {
  margin-top: 24px;
  border-top: 1px solid var(--border-color-light);
  padding-top: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color-light);
}

.detail-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.detail-label {
  font-size: 14px;
  color: var(--text-tertiary);
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  color: var(--text-primary);
  text-align: right;
  flex: 1;
  margin-left: 16px;
  font-weight: 400;
}

/* 历史记录 */
.history {
  padding: 24px;
  margin: 0 auto;
  width: 375px;
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  margin-top: 16px;
}

.history-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--text-primary);
  display: flex;
  align-items: center;
}

.history-items {
  padding-top: 8px;
}

.history-item {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color-light);
  position: relative;
}

.history-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.history-time {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-bottom: 8px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.history-content {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.5;
  background-color: #F7F8FA;
  padding: 12px 16px;
  border-radius: var(--border-radius-md);
  border-left: 3px solid var(--primary-color);
}

.no-history {
  text-align: center;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.no-history-icon {
  width: 64px;
  height: 64px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23C9CDD4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>');
  background-size: 40px;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.6;
}

.no-history-text {
  font-size: 14px;
  color: var(--text-tertiary);
  font-weight: 500;
}

/* 底部操作栏 */
.bottom-bar {
  width: 375px;
  display: flex;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--white);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  padding: 16px;
  z-index: 101;
  margin: 0 auto;
  border-top: 1px solid var(--border-color-light);
  border-radius: 20px 20px 0 0;
}

.action-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px;
  margin: 0 8px;
  transition: all var(--transition-fast);
  border-radius: var(--border-radius-md);
}

.action-button:hover {
  background-color: #F0F2FF;
  transform: translateY(-2px);
}

.action-icon {
  width: 28px;
  height: 28px;
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: center;
  margin-bottom: 4px;
}

.action-icon.phone {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>');
}

.action-icon.message {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2300B42A"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>');
}

.action-icon.edit {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF7D00"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>');
}

.action-icon.add {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23F53F3F"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>');
}

.call-button {
  color: var(--primary-color);
}

.message-button {
  color: var(--success-color);
}

.edit-button {
  color: var(--warning-color);
}

.add-record-button {
  color: var(--danger-color);
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  width: 90%;
  max-width: 340px;
  background-color: white;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color-light);
  background-color: #F9FAFC;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.modal-close {
  width: 24px;
  height: 24px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23969799"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.modal-close:hover {
  transform: rotate(90deg);
}

.modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color-light);
  gap: 12px;
  background-color: #F9FAFC;
}

.form-group {
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-weight: 500;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: 16px;
  color: var(--text-primary);
  background-color: white;
  outline: none;
  transition: all var(--transition-fast);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

.btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: center;
}

.btn-cancel {
  background-color: #F2F3F5;
  color: var(--text-primary);
}

.btn-cancel:hover {
  background-color: #E5E6EB;
  transform: translateY(-1px);
}

.btn-confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media screen and (max-width: 375px) {
  .customer-detail {
    width: 100%;
  }
  
  .top-nav {
    width: 100%;
  }
  
  .customer-info,
  .history {
    width: 100%;
    margin-left: 16px;
    margin-right: 16px;
  }
  
  .bottom-bar {
    width: 100%;
    border-radius: 16px 16px 0 0;
  }
  
  .customer-avatar {
    width: 64px;
    height: 64px;
    font-size: 24px;
  }
  
  .customer-name {
    font-size: 18px;
  }
}
</style>