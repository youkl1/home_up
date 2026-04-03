<template>
  <div class="login bg-gradient">
    <div class="container">
      <div class="login-header text-center mb-5">
        <h1 class="text-3xl font-bold text-white">登录</h1>
        <p class="text-white text-opacity-80 mt-2">{{ terminalName }}</p>
      </div>
      <div class="login-form card">
        <!-- 登录方式切换 -->
        <div class="login-tabs border-b border-color">
          <div 
            :class="['tab', { active: loginType === 'password' }]"
            @click="loginType = 'password'"
          >
            密码登录
          </div>
          <div 
            :class="['tab', { active: loginType === 'code' }]"
            @click="loginType = 'code'"
          >
            验证码登录
          </div>
        </div>
        
        <!-- 手机号输入 -->
        <div class="form-item mt-4">
          <label class="form-label">手机号</label>
          <van-field
            v-model="form.phone"
            type="tel"
            placeholder="请输入手机号"
            :rules="[{ required: true, message: '请输入手机号' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]"
            class="form-input"
          />
        </div>
        
        <!-- 密码输入 -->
        <div class="form-item mt-4" v-if="loginType === 'password'">
          <label class="form-label">密码</label>
          <van-field
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
            class="form-input"
          />
        </div>
        
        <!-- 验证码输入 -->
        <div class="form-item mt-4" v-else>
          <label class="form-label">验证码</label>
          <van-field
            v-model="form.code"
            type="text"
            placeholder="请输入验证码"
            :rules="[{ required: true, message: '请输入验证码' }]"
            class="form-input"
          >
            <template #button>
              <van-button 
                size="small" 
                :disabled="countdown > 0"
                @click="getCode"
                :class="{ 'countdown': countdown > 0 }"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </van-button>
            </template>
          </van-field>
        </div>
        
        <!-- 登录按钮 -->
        <van-button 
          type="primary" 
          class="login-btn mt-5"
          :loading="loading"
          @click="handleLogin"
          block
          size="large"
        >
          登录
        </van-button>
        
        <!-- 忘记密码 -->
        <div class="login-footer mt-3 text-right">
          <a href="#" @click.prevent="forgotPassword" class="text-primary">忘记密码？</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '../../store/user'

const router = useRouter()
const userStore = useUserStore()

// 登录类型：password 或 code
const loginType = ref('password')
// 表单数据
const form = ref({
  phone: '13800138000',
  password: '123456',
  code: ''
})
// 加载状态
const loading = ref(false)
// 倒计时
const countdown = ref(0)
// 定时器
let timer = null

// 获取终端名称
const terminalName = computed(() => {
  const terminal = localStorage.getItem('selectedTerminal')
  const terminalMap = {
    headquarters: '总部运营端',
    store: '门店管理端',
    guide: '导购移动端'
  }
  return terminalMap[terminal] || '泛家居营销SAAS平台'
})

// 获取验证码
const getCode = () => {
  // 验证手机号
  if (!/^1[3-9]\d{9}$/.test(form.value.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  
  // 模拟获取验证码
  showToast('验证码已发送')
  
  // 开始倒计时
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 处理登录
const handleLogin = async () => {
  // 验证表单
  if (!form.value.phone) {
    showToast('请输入手机号')
    return
  }
  if (!/^1[3-9]\d{9}$/.test(form.value.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  if (loginType.value === 'password' && !form.value.password) {
    showToast('请输入密码')
    return
  }
  if (loginType.value === 'code' && !form.value.code) {
    showToast('请输入验证码')
    return
  }
  
  loading.value = true
  
  try {
    // 模拟登录接口调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 登录成功，存储用户信息
    const userInfo = {
      id: 1,
      name: '测试用户',
      phone: form.value.phone,
      terminal: localStorage.getItem('selectedTerminal'),
      role: 'admin'
    }
    
    // 调用userStore的login方法更新状态
    userStore.login(userInfo, 'mock-token')
    
    // 根据终端类型跳转对应首页
    const terminal = userInfo.terminal
    let homePath = '/'
    switch (terminal) {
      case 'headquarters':
        homePath = '/headquarters/home'
        break
      case 'store':
        homePath = '/store/home'
        break
      case 'guide':
        homePath = '/guide/dashboard'
        break
      default:
        homePath = '/'
    }
    
    router.push(homePath)
  } catch (error) {
    showToast('登录失败，请重试')
  } finally {
    loading.value = false
  }
}

// 忘记密码
const forgotPassword = () => {
  // 预留忘记密码功能
  showToast('忘记密码功能开发中')
}

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: var(--spacing-xl) 0;
}

.container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.login-form {
  padding: var(--spacing-lg);
  animation: slide-up 0.5s ease-out;
}

.login-tabs {
  display: flex;
  margin-bottom: var(--spacing-md);
}

.tab {
  flex: 1;
  text-align: center;
  padding: var(--spacing-sm) 0;
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
}

.tab.active {
  color: var(--primary-color);
  font-weight: 500;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  width: 60%;
  height: 2px;
  background-color: var(--primary-color);
  border-radius: 1px;
}

.form-item {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-title);
  margin-bottom: var(--spacing-xs);
}

.form-input {
  --van-field-input-height: 44px;
  --van-field-label-width: 0;
  --van-field-input-font-size: var(--font-size-base);
}

.login-btn {
  --van-button-height: 48px;
  --van-button-font-size: var(--font-size-base);
  --van-button-border-radius: var(--border-radius-md);
}

.countdown {
  --van-button-color: var(--text-secondary);
  --van-button-border-color: var(--border-color);
}

.login-footer a {
  font-size: var(--font-size-sm);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.login-footer a:hover {
  color: var(--primary-hover);
}

/* 动画 */
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

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .login {
    padding: var(--spacing-lg) 0;
  }
  
  .container {
    padding: 0 var(--spacing-sm);
  }
  
  .login-header h1 {
    font-size: var(--font-size-2xl);
  }
  
  .login-form {
    padding: var(--spacing-md);
  }
}
</style>