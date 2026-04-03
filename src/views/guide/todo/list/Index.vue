<template>
  <div class="todo-list-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">待办事项</h1>
      <div class="header-right">
        <div class="add-button" @click="showAddForm = true">
          <svg class="add-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </div>
      </div>
    </div>
    
    <!-- 待办事项列表 -->
    <div class="todo-list">
      <div 
        v-for="(item, index) in todoItems" 
        :key="item.id"
        class="todo-item"
      >
        <div class="todo-checkbox" :class="{ checked: item.checked }" @click="toggleTodo(item.id)">
          <svg v-if="item.checked" class="check-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
        <div class="todo-content">
          <div class="todo-title" :class="{ checked: item.checked }">{{ item.title }}</div>
          <div class="todo-description">{{ item.description }}</div>
        </div>
        <div class="todo-time">{{ item.time }}</div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="todoItems.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      </div>
      <p class="empty-text">暂无待办事项</p>
      <div class="empty-action" @click="showAddForm = true">添加待办</div>
    </div>
    
    <!-- 添加待办表单 -->
    <div v-if="showAddForm" class="add-form-overlay" @click="closeAddForm">
      <div class="add-form" @click.stop>
        <div class="form-header">
          <h2 class="form-title">添加待办事项</h2>
          <div class="form-close" @click="closeAddForm">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </div>
        </div>
        <div class="form-content">
          <div class="form-group">
            <label class="form-label">标题</label>
            <input 
              type="text" 
              v-model="newTodo.title" 
              class="form-input" 
              placeholder="请输入待办事项标题"
              maxlength="50"
            />
          </div>
          <div class="form-group">
            <label class="form-label">描述</label>
            <textarea 
              v-model="newTodo.description" 
              class="form-textarea" 
              placeholder="请输入待办事项描述"
              maxlength="200"
              rows="3"
            ></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">时间</label>
            <input 
              type="time" 
              v-model="newTodo.time" 
              class="form-input"
            />
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="form-button cancel" @click="closeAddForm">取消</button>
          <button type="button" class="form-button confirm" @click="saveTodo" :disabled="!newTodo.title.trim()">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 待办事项数据
const todoItems = ref([
  {
    id: 1,
    title: '跟进客户张女士',
    description: '确认橱柜定制需求',
    time: '10:30',
    checked: false
  },
  {
    id: 2,
    title: '整理产品资料',
    description: '更新产品价格表',
    time: '14:00',
    checked: false
  },
  {
    id: 3,
    title: '参加销售培训',
    description: '学习新的销售技巧',
    time: '16:00',
    checked: false
  },
  {
    id: 4,
    title: '跟进客户李先生',
    description: '确认衣柜定制需求',
    time: '09:30',
    checked: false
  },
  {
    id: 5,
    title: '准备销售方案',
    description: '为新客户制定销售方案',
    time: '11:00',
    checked: false
  }
])

// 新待办事项
const newTodo = ref({
  title: '',
  description: '',
  time: ''
})

// 显示添加表单
const showAddForm = ref(false)

// 返回上一页
const goBack = () => {
  router.back()
}

// 切换待办状态
const toggleTodo = (id) => {
  const todo = todoItems.value.find(item => item.id === id)
  if (todo) {
    todo.checked = !todo.checked
  }
}

// 关闭添加表单
const closeAddForm = () => {
  showAddForm.value = false
  // 重置表单
  newTodo.value = {
    title: '',
    description: '',
    time: ''
  }
}

// 保存待办事项
const saveTodo = () => {
  if (!newTodo.value.title.trim()) return
  
  // 生成新的待办事项ID
  const newId = Math.max(...todoItems.value.map(item => item.id)) + 1
  
  // 添加新待办事项
  todoItems.value.unshift({
    id: newId,
    title: newTodo.value.title.trim(),
    description: newTodo.value.description.trim(),
    time: newTodo.value.time || '00:00',
    checked: false
  })
  
  // 关闭表单
  closeAddForm()
}

// 组件挂载
onMounted(() => {
  // 模拟获取待办事项数据
  setTimeout(() => {
    // 数据加载完成
  }, 500)
})
</script>

<style scoped>
.todo-list-page {
  width: 375px;
  min-height: 100vh;
  background-color: var(--bg-color);
  margin: 0 auto;
  padding-bottom: var(--spacing-xl);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  background-color: var(--white);
  padding: 0 var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;
  border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
}

.header-left {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-full);
  transition: all var(--transition-fast);
}

.header-left:hover {
  background-color: var(--bg-color);
}

.back-icon {
  width: 24px;
  height: 24px;
  color: var(--text-primary);
}

.header-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.header-right {
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-full);
  transition: all var(--transition-fast);
}

.add-button:hover {
  background-color: var(--bg-color);
}

.add-icon {
  width: 24px;
  height: 24px;
  color: var(--primary-color);
}

.todo-list {
  padding: var(--spacing-sm);
}

.todo-item {
  display: flex;
  align-items: flex-start;
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  transition: all var(--transition-normal);
}

.todo-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.todo-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-right: var(--spacing-sm);
  margin-top: 2px;
  background-color: var(--white);
  flex-shrink: 0;
}

.todo-checkbox:hover {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.todo-checkbox.checked {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.check-icon {
  width: 16px;
  height: 16px;
  color: var(--white);
}

.todo-content {
  flex: 1;
  padding-right: var(--spacing-sm);
}

.todo-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  transition: all var(--transition-fast);
}

.todo-title.checked {
  color: var(--text-tertiary);
  text-decoration: line-through;
}

.todo-description {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-xs);
}

.todo-time {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  background-color: var(--bg-color);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  flex-shrink: 0;
  align-self: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) var(--spacing-md);
  text-align: center;
  margin: var(--spacing-sm);
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: var(--text-disabled);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon svg {
  width: 48px;
  height: 48px;
}

.empty-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-md) 0;
}

.empty-action {
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: var(--primary-color);
  color: var(--white);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.empty-action:hover {
  background-color: var(--primary-color-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 响应式设计 */
@media screen and (max-width: 375px) {
  .todo-list-page {
    width: 100%;
  }
  
  .todo-list {
    padding: var(--spacing-xs);
  }
  
  .todo-item {
    padding: var(--spacing-sm);
  }
}

/* 无障碍 */
@media (prefers-reduced-motion: reduce) {
  .todo-item:hover,
  .empty-action:hover {
    transform: none;
  }
}

/* 添加待办表单 */
.add-form-overlay {
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
  animation: fade-in 0.3s ease;
}

.add-form {
  background-color: var(--white);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  width: 90%;
  max-width: 320px;
  animation: slide-up 0.3s ease;
  overflow: hidden;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.form-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.form-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-full);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.form-close:hover {
  background-color: var(--bg-color);
}

.form-close svg {
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
}

.form-content {
  padding: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  color: var(--text-primary);
  background-color: var(--white);
  transition: all var(--transition-fast);
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  gap: var(--spacing-sm);
}

.form-button {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.form-button.cancel {
  background-color: var(--bg-color);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.form-button.cancel:hover {
  background-color: var(--border-color-light);
}

.form-button.confirm {
  background-color: var(--primary-color);
  color: var(--white);
}

.form-button.confirm:hover {
  background-color: var(--primary-color-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.form-button.confirm:disabled {
  background-color: var(--text-disabled);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 动画 */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .todo-item {
    background-color: var(--white);
  }
  
  .empty-state {
    background-color: var(--white);
  }
  
  .todo-time {
    background-color: var(--bg-color);
  }
  
  .add-form {
    background-color: var(--white);
  }
  
  .form-input,
  .form-textarea {
    background-color: var(--white);
  }
  
  .form-button.cancel {
    background-color: var(--bg-color);
  }
}
</style>