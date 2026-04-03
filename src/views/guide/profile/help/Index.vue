<template>
  <div class="help-page">
    <!-- 顶部导航 -->
    <div class="top-nav bg-gradient">
      <div class="nav-icon back" @click="goBack"></div>
      <h1 class="text-lg font-bold text-white">帮助与反馈</h1>
    </div>
    
    <!-- 常见问题 -->
    <div class="faq-section card mt-4 px-4">
      <h3 class="section-title">常见问题</h3>
      <div class="faq-list">
        <div v-for="faq in faqList" :key="faq.id" class="faq-item" @click="toggleFaq(faq.id)">
          <div class="faq-question">
            <div class="question-text">{{ faq.question }}</div>
            <div class="question-arrow" :class="{ expanded: expandedFaq === faq.id }"></div>
          </div>
          <div class="faq-answer" v-show="expandedFaq === faq.id">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- 反馈表单 -->
    <div class="feedback-section card mt-4 px-4">
      <h3 class="section-title">问题反馈</h3>
      <div class="feedback-form">
        <div class="form-group">
          <label class="form-label">反馈类型</label>
          <div class="feedback-types">
            <div 
              v-for="type in feedbackTypes" 
              :key="type.id"
              class="type-item"
              :class="{ active: selectedType === type.id }"
              @click="selectType(type.id)"
            >
              {{ type.name }}
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">问题描述</label>
          <textarea 
            v-model="feedbackContent" 
            class="form-textarea" 
            rows="4" 
            placeholder="请详细描述您遇到的问题..."
          ></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">联系方式（选填）</label>
          <input 
            v-model="contactInfo" 
            type="text" 
            class="form-input" 
            placeholder="手机号或邮箱"
          >
        </div>
        <button class="submit-btn" @click="submitFeedback">提交反馈</button>
      </div>
    </div>
    
    <!-- 客服热线 -->
    <div class="contact-section card mt-4 px-4">
      <h3 class="section-title">联系客服</h3>
      <div class="contact-info">
        <div class="contact-item" @click="callService">
          <div class="contact-icon phone"></div>
          <div class="contact-detail">
            <div class="contact-title">客服热线</div>
            <div class="contact-value">400-123-4567</div>
          </div>
        </div>
        <div class="contact-item">
          <div class="contact-icon time"></div>
          <div class="contact-detail">
            <div class="contact-title">服务时间</div>
            <div class="contact-value">周一至周日 9:00-21:00</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 展开的FAQ
const expandedFaq = ref(null)

// FAQ列表
const faqList = ref([
  {
    id: 1,
    question: '如何添加客户信息？',
    answer: '在客户管理页面，点击右上角的"+"按钮，填写客户姓名、电话、意向产品等信息后保存即可。'
  },
  {
    id: 2,
    question: '如何创建产品方案？',
    answer: '在产品库页面选择需要的产品，点击"加入方案"按钮，然后在"我的方案"页面查看和编辑方案详情。'
  },
  {
    id: 3,
    question: '如何查看我的业绩？',
    answer: '在个人中心页面点击"我的业绩"，可以查看本月销售额、订单数量、新增客户等业绩数据。'
  },
  {
    id: 4,
    question: '忘记密码怎么办？',
    answer: '请联系管理员重置密码，或拨打客服热线400-123-4567寻求帮助。'
  },
  {
    id: 5,
    question: '如何参加培训课程？',
    answer: '在个人中心页面点击"我的培训"，选择感兴趣的课程开始学习。培训记录会自动保存。'
  }
])

// 反馈类型
const feedbackTypes = [
  { id: 'bug', name: '功能异常' },
  { id: 'suggestion', name: '产品建议' },
  { id: 'complaint', name: '投诉反馈' },
  { id: 'other', name: '其他问题' }
]

// 选中的反馈类型
const selectedType = ref('bug')
// 反馈内容
const feedbackContent = ref('')
// 联系方式
const contactInfo = ref('')

// 返回上一页
const goBack = () => {
  router.back()
}

// 切换FAQ展开状态
const toggleFaq = (faqId) => {
  if (expandedFaq.value === faqId) {
    expandedFaq.value = null
  } else {
    expandedFaq.value = faqId
  }
}

// 选择反馈类型
const selectType = (typeId) => {
  selectedType.value = typeId
}

// 提交反馈
const submitFeedback = () => {
  if (!feedbackContent.value.trim()) {
    alert('请输入问题描述')
    return
  }
  
  alert('感谢您的反馈，我们会尽快处理！')
  feedbackContent.value = ''
  contactInfo.value = ''
}

// 拨打客服电话
const callService = () => {
  if (confirm('是否拨打客服热线：400-123-4567？')) {
    alert('正在拨打客服电话...')
  }
}
</script>

<style scoped>
.help-page {
  width: 375px;
  min-height: 100vh;
  background-color: var(--bg-color);
  margin: 0 auto;
  overflow-x: hidden;
  padding-bottom: 20px;
}

.top-nav {
  width: 375px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;
  margin: 0 auto;
}

.nav-icon {
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}

.nav-icon.back {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>');
}

.faq-section,
.feedback-section,
.contact-section {
  padding: var(--spacing-md);
  margin: 0 auto;
  width: 375px;
}

.section-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-primary);
}

.faq-list {
  padding-top: var(--spacing-sm);
}

.faq-item {
  border-bottom: 1px solid var(--border-color-light);
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  cursor: pointer;
}

.question-text {
  flex: 1;
  font-size: var(--font-size-base);
  color: var(--text-primary);
  padding-right: var(--spacing-sm);
}

.question-arrow {
  width: 20px;
  height: 20px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23969799"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.3s ease;
}

.question-arrow.expanded {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.6;
}

.feedback-form {
  padding-top: var(--spacing-sm);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.feedback-types {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.type-item {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: #F9FAFC;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.type-item.active {
  background-color: var(--primary-color);
  color: white;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  color: var(--text-primary);
  background-color: white;
  outline: none;
  transition: border-color var(--transition-fast);
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--primary-color);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.submit-btn {
  width: 100%;
  padding: var(--spacing-sm);
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.submit-btn:hover {
  background-color: var(--primary-color-dark);
}

.contact-info {
  padding-top: var(--spacing-sm);
}

.contact-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-color-light);
  cursor: pointer;
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-icon {
  width: 40px;
  height: 40px;
  background-size: 24px;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #F0F2FF;
  border-radius: 50%;
  margin-right: var(--spacing-md);
}

.contact-icon.phone {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>');
}

.contact-icon.time {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>');
}

.contact-detail {
  flex: 1;
}

.contact-title {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: 2px;
}

.contact-value {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  font-weight: 500;
}

@media screen and (max-width: 375px) {
  .faq-section,
  .feedback-section,
  .contact-section {
    width: 100%;
  }
}
</style>