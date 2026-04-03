<template>
  <div class="settings-page">
    <!-- 顶部导航 -->
    <div class="top-nav bg-gradient">
      <div class="nav-icon back" @click="goBack"></div>
      <h1 class="text-lg font-bold text-white">设置</h1>
    </div>
    
    <!-- 账号设置 -->
    <div class="settings-section card mt-4 px-4">
      <h3 class="section-title">账号设置</h3>
      <div class="settings-items">
        <div class="settings-item" @click="changePassword">
          <div class="item-icon password"></div>
          <div class="item-label">修改密码</div>
          <div class="item-arrow"></div>
        </div>
        <div class="settings-item" @click="bindPhone">
          <div class="item-icon phone"></div>
          <div class="item-label">绑定手机</div>
          <div class="item-value">138****1234</div>
          <div class="item-arrow"></div>
        </div>
        <div class="settings-item" @click="bindEmail">
          <div class="item-icon email"></div>
          <div class="item-label">绑定邮箱</div>
          <div class="item-value">未绑定</div>
          <div class="item-arrow"></div>
        </div>
      </div>
    </div>
    
    <!-- 消息通知 -->
    <div class="settings-section card mt-4 px-4">
      <h3 class="section-title">消息通知</h3>
      <div class="settings-items">
        <div class="settings-item switch-item">
          <div class="item-icon notification"></div>
          <div class="item-label">推送通知</div>
          <div class="item-switch">
            <input type="checkbox" v-model="settings.pushNotification" id="push" class="switch-input">
            <label for="push" class="switch-label"></label>
          </div>
        </div>
        <div class="settings-item switch-item">
          <div class="item-icon sound"></div>
          <div class="item-label">声音提醒</div>
          <div class="item-switch">
            <input type="checkbox" v-model="settings.soundAlert" id="sound" class="switch-input">
            <label for="sound" class="switch-label"></label>
          </div>
        </div>
        <div class="settings-item switch-item">
          <div class="item-icon vibration"></div>
          <div class="item-label">震动提醒</div>
          <div class="item-switch">
            <input type="checkbox" v-model="settings.vibration" id="vibration" class="switch-input">
            <label for="vibration" class="switch-label"></label>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 通用设置 -->
    <div class="settings-section card mt-4 px-4">
      <h3 class="section-title">通用设置</h3>
      <div class="settings-items">
        <div class="settings-item" @click="clearCache">
          <div class="item-icon cache"></div>
          <div class="item-label">清除缓存</div>
          <div class="item-value">{{ cacheSize }}</div>
          <div class="item-arrow"></div>
        </div>
        <div class="settings-item" @click="checkUpdate">
          <div class="item-icon update"></div>
          <div class="item-label">检查更新</div>
          <div class="item-value">{{ version }}</div>
          <div class="item-arrow"></div>
        </div>
        <div class="settings-item" @click="privacyPolicy">
          <div class="item-icon privacy"></div>
          <div class="item-label">隐私政策</div>
          <div class="item-arrow"></div>
        </div>
        <div class="settings-item" @click="userAgreement">
          <div class="item-icon agreement"></div>
          <div class="item-label">用户协议</div>
          <div class="item-arrow"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 设置数据
const settings = ref({
  pushNotification: true,
  soundAlert: true,
  vibration: false
})

// 缓存大小
const cacheSize = ref('12.5MB')
// 版本号
const version = ref('v1.2.0')

// 返回上一页
const goBack = () => {
  router.back()
}

// 修改密码
const changePassword = () => {
  const oldPwd = prompt('请输入原密码:')
  if (oldPwd) {
    const newPwd = prompt('请输入新密码:')
    if (newPwd) {
      const confirmPwd = prompt('请确认新密码:')
      if (confirmPwd === newPwd) {
        alert('密码修改成功')
      } else {
        alert('两次输入的密码不一致')
      }
    }
  }
}

// 绑定手机
const bindPhone = () => {
  alert('当前已绑定手机: 138****1234')
}

// 绑定邮箱
const bindEmail = () => {
  const email = prompt('请输入邮箱地址:')
  if (email) {
    alert(`验证邮件已发送至 ${email}，请查收`)
  }
}

// 清除缓存
const clearCache = () => {
  if (confirm('确定要清除缓存吗？')) {
    cacheSize.value = '0MB'
    alert('缓存已清除')
  }
}

// 检查更新
const checkUpdate = () => {
  alert('当前已是最新版本')
}

// 隐私政策
const privacyPolicy = () => {
  alert('隐私政策:\n\n1. 我们重视您的隐私保护\n2. 不会向第三方泄露您的个人信息\n3. 仅在必要情况下收集使用数据\n4. 您有权随时删除您的账户数据')
}

// 用户协议
const userAgreement = () => {
  alert('用户协议:\n\n1. 请遵守相关法律法规\n2. 不得利用本应用进行违法活动\n3. 尊重知识产权和商业秘密\n4. 违反协议将承担相应责任')
}
</script>

<style scoped>
.settings-page {
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

.settings-section {
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

.settings-items {
  padding: 0;
  margin: 0;
  list-style: none;
}

.settings-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-color-light);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-item.switch-item {
  cursor: default;
}

.item-icon {
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: var(--spacing-md);
}

.item-icon.password {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>');
}

.item-icon.phone {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>');
}

.item-icon.email {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>');
}

.item-icon.notification {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>');
}

.item-icon.sound {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>');
}

.item-icon.vibration {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M0 15h2V9H0v6zm3 2h2V7H3v10zm19-8v6h2V9h-2zm-3 8h2V7h-2v10zM16.5 3h-9C6.67 3 6 3.67 6 4.5v15c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-15c0-.83-.67-1.5-1.5-1.5zM16 19H8V5h8v14z"/></svg>');
}

.item-icon.cache {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>');
}

.item-icon.update {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>');
}

.item-icon.privacy {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>');
}

.item-icon.agreement {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>');
}

.item-label {
  flex: 1;
  font-size: var(--font-size-base);
  color: var(--text-primary);
}

.item-value {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-right: var(--spacing-sm);
}

.item-arrow {
  width: 16px;
  height: 16px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23969799"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/* 开关样式 */
.item-switch {
  position: relative;
}

.switch-input {
  display: none;
}

.switch-label {
  display: block;
  width: 44px;
  height: 24px;
  background-color: var(--border-color);
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.switch-label::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: transform var(--transition-fast);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.switch-input:checked + .switch-label {
  background-color: var(--primary-color);
}

.switch-input:checked + .switch-label::after {
  transform: translateX(20px);
}

@media screen and (max-width: 375px) {
  .settings-section {
    width: 100%;
  }
}
</style>