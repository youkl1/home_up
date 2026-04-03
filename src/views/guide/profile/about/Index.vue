<template>
  <div class="about-page">
    <!-- 顶部导航 -->
    <div class="top-nav bg-gradient">
      <div class="nav-icon back" @click="goBack"></div>
      <h1 class="text-lg font-bold text-white">关于我们</h1>
    </div>
    
    <!-- 应用信息 -->
    <div class="app-info card mt-4 px-4">
      <div class="app-logo">
        <div class="logo-icon">金</div>
      </div>
      <div class="app-name">金店涨</div>
      <div class="app-version">版本 {{ version }}</div>
      <div class="app-slogan">金牌厨柜 · 家居营销助手</div>
    </div>
    
    <!-- 公司介绍 -->
    <div class="company-section card mt-4 px-4">
      <h3 class="section-title">公司介绍</h3>
      <div class="company-content">
        <p>金牌厨柜家居科技股份有限公司创立于1999年，是国内高端整体厨柜及定制家居的专业服务商。</p>
        <p>公司专业从事整体厨柜及定制家居的研发、设计、生产、销售、安装及售后整体服务，打造家居产品的全屋智能定制。</p>
        <p>金店涨APP是专为金牌厨柜导购员打造的移动营销工具，帮助导购员更好地服务客户，提升销售业绩。</p>
      </div>
    </div>
    
    <!-- 功能特点 -->
    <div class="features-section card mt-4 px-4">
      <h3 class="section-title">功能特点</h3>
      <div class="features-list">
        <div class="feature-item">
          <div class="feature-icon product"></div>
          <div class="feature-info">
            <div class="feature-title">产品库管理</div>
            <div class="feature-desc">全面了解产品信息，快速创建客户方案</div>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon customer"></div>
          <div class="feature-info">
            <div class="feature-title">客户管理</div>
            <div class="feature-desc">记录客户信息，跟进客户需求</div>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon case"></div>
          <div class="feature-info">
            <div class="feature-title">案例展示</div>
            <div class="feature-desc">丰富的装修案例，助力销售转化</div>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon performance"></div>
          <div class="feature-info">
            <div class="feature-title">业绩统计</div>
            <div class="feature-desc">实时查看业绩数据，掌握销售动态</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 联系方式 -->
    <div class="contact-section card mt-4 px-4">
      <h3 class="section-title">联系我们</h3>
      <div class="contact-list">
        <div class="contact-item">
          <div class="contact-label">官方网站</div>
          <div class="contact-value">www.goldenhome.com</div>
        </div>
        <div class="contact-item">
          <div class="contact-label">客服热线</div>
          <div class="contact-value">400-123-4567</div>
        </div>
        <div class="contact-item">
          <div class="contact-label">公司地址</div>
          <div class="contact-value">福建省厦门市同安区</div>
        </div>
      </div>
    </div>
    
    <!-- 版权信息 -->
    <div class="copyright">
      <p>© 2026 金牌厨柜家居科技股份有限公司</p>
      <p>All Rights Reserved</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 版本号
const version = ref('1.2.0')

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.about-page {
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

.app-info {
  padding: var(--spacing-xl);
  margin: 0 auto;
  width: 375px;
  text-align: center;
}

.app-logo {
  margin-bottom: var(--spacing-md);
}

.logo-icon {
  width: 80px;
  height: 80px;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  margin: 0 auto;
  box-shadow: var(--shadow-md);
}

.app-name {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.app-version {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.app-slogan {
  font-size: var(--font-size-base);
  color: var(--primary-color);
  font-weight: 500;
}

.company-section,
.features-section,
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

.company-content {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.8;
}

.company-content p {
  margin: 0 0 var(--spacing-sm) 0;
}

.company-content p:last-child {
  margin-bottom: 0;
}

.features-list {
  padding-top: var(--spacing-sm);
}

.feature-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-color-light);
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-icon {
  width: 48px;
  height: 48px;
  background-size: 28px;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #F0F2FF;
  border-radius: 50%;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
}

.feature-icon.product {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>');
}

.feature-icon.customer {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>');
}

.feature-icon.case {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>');
}

.feature-icon.performance {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>');
}

.feature-info {
  flex: 1;
}

.feature-title {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.feature-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.contact-list {
  padding-top: var(--spacing-sm);
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-color-light);
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.contact-value {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  font-weight: 500;
}

.copyright {
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-md);
  margin: 0 auto;
  width: 375px;
}

.copyright p {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-xs) 0;
}

.copyright p:last-child {
  margin-bottom: 0;
}

@media screen and (max-width: 375px) {
  .app-info,
  .company-section,
  .features-section,
  .contact-section,
  .copyright {
    width: 100%;
  }
}
</style>