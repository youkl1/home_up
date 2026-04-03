<template>
  <div class="share-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <div class="back-icon"></div>
      </div>
      <h1 class="header-title">分享</h1>
      <div class="header-right"></div>
    </div>
    
    <!-- 分享内容 -->
    <div class="share-content">
      <div class="share-card">
        <div class="share-logo">
          <div class="logo-icon"></div>
          <h2 class="logo-text">泛家居营销SAAS平台</h2>
        </div>
        <p class="share-description">
          专业的泛家居行业营销工具，帮助您提升销售效率，管理客户关系，实现业务增长。
        </p>
        
        <!-- 分享选项 -->
        <div class="share-options">
          <div class="share-option" @click="shareToWechat">
            <div class="option-icon wechat"></div>
            <div class="option-text">微信好友</div>
          </div>
          <div class="share-option" @click="shareToMoments">
            <div class="option-icon moments"></div>
            <div class="option-text">朋友圈</div>
          </div>
          <div class="share-option" @click="shareToWeibo">
            <div class="option-icon weibo"></div>
            <div class="option-text">微博</div>
          </div>
          <div class="share-option" @click="copyLink">
            <div class="option-icon link"></div>
            <div class="option-text">复制链接</div>
          </div>
        </div>
        
        <!-- 分享二维码 -->
        <div class="qrcode-section">
          <h3 class="section-title">扫码分享</h3>
          <div class="qrcode-container">
            <div class="qrcode-placeholder">
              <div class="qrcode-icon"></div>
              <p class="qrcode-text">二维码</p>
            </div>
            <p class="qrcode-hint">扫描二维码，立即体验</p>
          </div>
        </div>
      </div>
      
      <!-- 分享统计 -->
      <div class="share-stats">
        <h3 class="section-title">分享统计</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ shareCount }}</div>
            <div class="stat-label">分享次数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ clickCount }}</div>
            <div class="stat-label">点击次数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ conversionCount }}</div>
            <div class="stat-label">转化次数</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 分享统计数据
const shareCount = ref(128)
const clickCount = ref(356)
const conversionCount = ref(42)

// 返回上一页
const goBack = () => {
  router.back()
}

// 分享到微信
const shareToWechat = () => {
  if (navigator.share) {
    navigator.share({
      title: '泛家居营销SAAS平台',
      text: '专业的泛家居行业营销工具，提升销售效率',
      url: window.location.href
    })
  } else {
    alert('请使用微信扫码分享')
  }
}

// 分享到朋友圈
const shareToMoments = () => {
  alert('请使用微信扫码分享到朋友圈')
}

// 分享到微博
const shareToWeibo = () => {
  const shareUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(window.location.href)}&title=泛家居营销SAAS平台&appkey=`
  window.open(shareUrl, '_blank', 'width=600,height=400')
}

// 复制链接
const copyLink = () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    alert('链接已复制到剪贴板')
  }).catch(err => {
    console.error('复制失败:', err)
    alert('复制失败，请手动复制')
  })
}

// 组件挂载
onMounted(() => {
  // 模拟获取分享统计数据
  setTimeout(() => {
    // 数据加载完成
  }, 500)
})
</script>

<style scoped>
.share-page {
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
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%231f2329"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.header-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.header-right {
  width: 44px;
}

.share-content {
  padding: var(--spacing-md);
}

.share-card {
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.share-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.logo-icon {
  width: 80px;
  height: 80px;
  background-color: var(--primary-color);
  border-radius: var(--border-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-sm);
  box-shadow: var(--shadow-lg);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>');
  background-size: 40px 40px;
  background-repeat: no-repeat;
  background-position: center;
}

.logo-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
}

.share-description {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0 0 var(--spacing-lg) 0;
}

.share-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.share-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
  cursor: pointer;
  background-color: var(--bg-color);
}

.share-option:hover {
  background-color: rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.option-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-xs);
  box-shadow: var(--shadow-sm);
  background-size: 24px 24px;
  background-repeat: no-repeat;
  background-position: center;
}

.option-icon.wechat {
  background-color: #07C160;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M16.16 13.09c.33-.12.66-.21 1.01-.29.34-.08.67-.12 1-.12 1.59 0 2.88 1.29 2.88 2.88s-1.29 2.88-2.88 2.88c-.33 0-.66-.04-1-.12-.35-.08-.68-.17-1.01-.29l-1.57.69c.19.38.33.78.41 1.21.09.44.14.89.14 1.34 0 2.35-1.9 4.25-4.25 4.25s-4.25-1.9-4.25-4.25c0-.45.05-.9.14-1.34.08-.43.22-.83.41-1.21l-1.57-.69c-.33.12-.66.21-1.01.29-.34.08-.67.12-1 .12-1.59 0-2.88-1.29-2.88-2.88S4.26 15.97 5.85 15.97c.33 0 .66.04 1 .12.35.08.68.17 1.01.29l1.57-.69c-.19-.38-.33-.78-.41-1.21-.09-.44-.14-.89-.14-1.34 0-2.35 1.9-4.25 4.25-4.25s4.25 1.9 4.25 4.25c0 .45-.05.9-.14 1.34-.08.43-.22.83-.41 1.21l1.57.69zM8.99 9.17c-1.72 0-3.12 1.4-3.12 3.12s1.4 3.12 3.12 3.12 3.12-1.4 3.12-3.12-1.4-3.12-3.12-3.12zm6.12 0c-1.72 0-3.12 1.4-3.12 3.12s1.4 3.12 3.12 3.12 3.12-1.4 3.12-3.12-1.4-3.12-3.12-3.12z"/></svg>');
}

.option-icon.moments {
  background-color: #FFC107;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>');
}

.option-icon.weibo {
  background-color: #E6162D;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>');
}

.option-icon.link {
  background-color: var(--primary-color);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>');
}

.option-text {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.qrcode-section {
  margin-top: var(--spacing-lg);
}

.section-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  text-align: center;
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qrcode-placeholder {
  width: 160px;
  height: 160px;
  background-color: var(--bg-color);
  border-radius: var(--border-radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-sm);
  border: 2px dashed var(--border-color);
}

.qrcode-icon {
  width: 48px;
  height: 48px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-bottom: var(--spacing-xs);
}

.qrcode-text {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  margin: 0;
}

.qrcode-hint {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin: 0;
}

.share-stats {
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-lg);
  background-color: var(--bg-color);
  transition: all var(--transition-normal);
}

.stat-item:hover {
  background-color: rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

/* 响应式设计 */
@media screen and (max-width: 375px) {
  .share-page {
    width: 100%;
  }
  
  .share-content {
    padding: var(--spacing-sm);
  }
  
  .share-card,
  .share-stats {
    padding: var(--spacing-md);
  }
  
  .logo-icon {
    width: 64px;
    height: 64px;
    background-size: 32px 32px;
  }
  
  .qrcode-placeholder {
    width: 140px;
    height: 140px;
  }
}

/* 无障碍 */
@media (prefers-reduced-motion: reduce) {
  .share-option:hover {
    transform: none;
  }
  
  .stat-item:hover {
    transform: none;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .share-card,
  .share-stats {
    background-color: var(--white);
  }
  
  .share-option,
  .qrcode-placeholder,
  .stat-item {
    background-color: var(--bg-color);
  }
  
  .share-option:hover,
  .stat-item:hover {
    background-color: rgba(102, 126, 234, 0.1);
  }
}
</style>