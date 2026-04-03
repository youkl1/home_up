<template>
  <div class="case-detail">
    <!-- 顶部导航 -->
    <div class="top-nav bg-gradient">
      <div class="nav-icon back" @click="goBack"></div>
      <h1 class="text-lg font-bold text-white">案例详情</h1>
      <div class="nav-icon share" @click="shareCase"></div>
    </div>
    
    <!-- 案例图片 -->
    <div class="case-image-container">
      <img :src="caseItem.image" :alt="caseItem.title" class="case-image" />
    </div>
    
    <!-- 案例信息 -->
    <div class="case-info">
      <h2 class="case-title">{{ caseItem.title }}</h2>
      <p class="case-description">{{ caseItem.description }}</p>
      
      <!-- 案例标签 -->
      <div class="case-tags">
        <span v-for="tag in caseItem.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      
      <!-- 案例详情 -->
      <div class="case-details">
        <h3 class="details-title">案例详情</h3>
        <div class="details-content">
          <p>{{ caseItem.detail || '本案例展示了一个精心设计的家居空间，融合了现代设计理念和实用功能，为用户打造了一个舒适、美观的居住环境。' }}</p>
          <div class="case-features">
            <h4 class="features-title">设计特点</h4>
            <ul class="features-list">
              <li v-for="(feature, index) in caseItem.features" :key="index">{{ feature }}</li>
            </ul>
          </div>
          <div class="case-params">
            <h4 class="params-title">项目参数</h4>
            <div class="param-item">
              <span class="param-label">项目面积：</span>
              <span class="param-value">{{ caseItem.area || '89㎡' }}</span>
            </div>
            <div class="param-item">
              <span class="param-label">装修风格：</span>
              <span class="param-value">{{ caseItem.style }}</span>
            </div>
            <div class="param-item">
              <span class="param-label">项目类型：</span>
              <span class="param-value">{{ caseItem.type || '住宅' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部操作栏 -->
    <div class="bottom-bar">
      <button class="contact-button" @click="contactService">
        <div class="nav-icon phone"></div>
        <span>联系客服</span>
      </button>
      <button class="save-button" @click="saveCase">
        收藏案例
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 案例数据
const caseItem = ref({
  id: 1,
  title: '现代简约三居室',
  description: '89㎡现代简约风格装修案例',
  style: '现代简约',
  image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20simple%20three%20bedroom%20apartment&image_size=landscape_4_3',
  tags: ['现代简约', '三居室', '89㎡']
})

// 案例列表数据
const cases = [
  {
    id: 1,
    title: '现代简约三居室',
    description: '89㎡现代简约风格装修案例',
    style: '现代简约',
    area: '89㎡',
    type: '住宅',
    detail: '本案例展示了一个89㎡的现代简约风格三居室，通过简洁的线条、中性的色彩和实用的功能布局，打造了一个舒适、美观的居住环境。客厅采用开放式设计，与餐厅相连，增加了空间的通透感。卧室则注重私密性和舒适度，通过合理的家具布置和灯光设计，创造了宁静的休息环境。',
    features: [
      '开放式客厅与餐厅设计',
      '简洁的线条和中性色彩',
      '实用的功能布局',
      '舒适的卧室环境',
      '合理的灯光设计'
    ],
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20simple%20three%20bedroom%20apartment&image_size=landscape_4_3',
    tags: ['现代简约', '三居室', '89㎡']
  },
  {
    id: 2,
    title: '欧式古典别墅',
    description: '200㎡欧式古典风格装修案例',
    style: '欧式古典',
    area: '200㎡',
    type: '别墅',
    detail: '本案例展示了一个200㎡的欧式古典风格别墅，通过华丽的装饰、丰富的色彩和精致的家具，打造了一个典雅、奢华的居住环境。客厅采用挑高设计，搭配水晶吊灯和古典家具，彰显贵族气质。卧室则注重舒适性和私密性，通过华丽的帷幔和精致的装饰，创造了浪漫的休息环境。',
    features: [
      '挑高客厅设计',
      '华丽的装饰和丰富的色彩',
      '精致的古典家具',
      '水晶吊灯和华丽帷幔',
      '典雅奢华的整体风格'
    ],
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=european%20classical%20villa&image_size=landscape_4_3',
    tags: ['欧式古典', '别墅', '200㎡']
  },
  {
    id: 3,
    title: '中式风格复式',
    description: '150㎡中式风格装修案例',
    style: '中式风格',
    area: '150㎡',
    type: '复式',
    detail: '本案例展示了一个150㎡的中式风格复式，通过传统的中式元素、木质家具和典雅的色彩，打造了一个宁静、文化底蕴深厚的居住环境。客厅采用开放式设计，搭配中式家具和传统装饰品，彰显东方文化魅力。卧室则注重舒适性和私密性，通过木质家具和柔和的灯光，创造了宁静的休息环境。',
    features: [
      '传统中式元素',
      '木质家具和典雅色彩',
      '开放式客厅设计',
      '传统装饰品',
      '宁静的居住环境'
    ],
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20style%20duplex%20apartment&image_size=landscape_4_3',
    tags: ['中式风格', '复式', '150㎡']
  },
  {
    id: 4,
    title: '北欧风格两居室',
    description: '60㎡北欧风格装修案例',
    style: '北欧风格',
    area: '60㎡',
    type: '住宅',
    detail: '本案例展示了一个60㎡的北欧风格两居室，通过简约的设计、自然的材质和明亮的色彩，打造了一个温馨、舒适的居住环境。客厅采用开放式设计，与餐厅相连，增加了空间的通透感。卧室则注重舒适性和私密性，通过简约的家具和柔和的灯光，创造了宁静的休息环境。',
    features: [
      '简约的设计风格',
      '自然的材质和明亮的色彩',
      '开放式客厅与餐厅设计',
      '舒适的卧室环境',
      '通透的空间布局'
    ],
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=nordic%20style%20two%20bedroom%20apartment&image_size=landscape_4_3',
    tags: ['北欧风格', '两居室', '60㎡']
  },
  {
    id: 5,
    title: '现代简约公寓',
    description: '45㎡现代简约风格装修案例',
    style: '现代简约',
    area: '45㎡',
    type: '公寓',
    detail: '本案例展示了一个45㎡的现代简约风格公寓，通过巧妙的空间布局、多功能家具和简约的设计，打造了一个紧凑、实用的居住环境。客厅与卧室采用开放式设计，通过家具和隔断进行功能分区，增加了空间的利用率。厨房和卫生间则注重实用性和舒适性，通过合理的布局和现代的设备，创造了便捷的生活环境。',
    features: [
      '巧妙的空间布局',
      '多功能家具',
      '开放式设计',
      '紧凑实用的空间',
      '现代的设备和设施'
    ],
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20simple%20apartment&image_size=landscape_4_3',
    tags: ['现代简约', '公寓', '45㎡']
  },
  {
    id: 6,
    title: '北欧风格别墅',
    description: '180㎡北欧风格装修案例',
    style: '北欧风格',
    area: '180㎡',
    type: '别墅',
    detail: '本案例展示了一个180㎡的北欧风格别墅，通过自然的材质、简约的设计和明亮的色彩，打造了一个温馨、舒适的居住环境。客厅采用挑高设计，搭配大面积落地窗，增加了空间的通透感和自然光线。卧室则注重舒适性和私密性，通过简约的家具和柔和的灯光，创造了宁静的休息环境。',
    features: [
      '挑高客厅设计',
      '大面积落地窗',
      '自然的材质和简约的设计',
      '明亮的色彩',
      '温馨舒适的整体风格'
    ],
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=nordic%20style%20villa&image_size=landscape_4_3',
    tags: ['北欧风格', '别墅', '180㎡']
  }
]

// 返回上一页
const goBack = () => {
  router.back()
}

// 分享案例
const shareCase = () => {
  alert('分享功能开发中')
}

// 联系客服
const contactService = () => {
  alert('联系客服：400-123-4567')
}

// 收藏案例
const saveCase = () => {
  alert('案例已收藏')
}

// 组件挂载
onMounted(() => {
  // 获取案例ID
  const caseId = parseInt(route.params.id)
  // 查找案例数据
  const foundCase = cases.find(c => c.id === caseId)
  if (foundCase) {
    caseItem.value = foundCase
  }
})
</script>

<style scoped>
.case-detail {
  width: 375px;
  min-height: 100vh;
  background-color: var(--bg-color);
  margin: 0 auto;
  overflow-x: hidden;
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

/* 导航图标 */
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

.nav-icon.share {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>');
}

.nav-icon.phone {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>');
}

.case-image-container {
  width: 375px;
  height: 200px;
  overflow: hidden;
  margin: 0 auto;
  background-color: #f5f5f5;
}

.case-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.case-info {
  padding: var(--spacing-md);
  padding-bottom: 80px;
  background-color: var(--white);
  margin: 0 auto;
  width: 375px;
}

.case-title {
  font-size: var(--font-size-xl);
  font-weight: bold;
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
}

.case-description {
  font-size: var(--font-size-base);
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.case-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 var(--spacing-md) 0;
}

.tag {
  font-size: var(--font-size-xs);
  padding: 4px 12px;
  background-color: #F0F2FF;
  border-radius: 12px;
  color: var(--primary-color);
}

.case-details {
  margin: 0 0 var(--spacing-md) 0;
}

.details-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
}

.details-content {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;
}

.details-content p {
  margin: 0 0 var(--spacing-md) 0;
}

.case-features {
  margin: 0 0 var(--spacing-md) 0;
}

.features-title {
  font-size: var(--font-size-sm);
  font-weight: 500;
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
}

.features-list {
  margin: 0;
  padding-left: var(--spacing-md);
}

.features-list li {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.case-params {
  margin: 0 0 var(--spacing-md) 0;
}

.params-title {
  font-size: var(--font-size-sm);
  font-weight: 500;
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
}

.param-item {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.param-label {
  width: 80px;
  display: inline-block;
}

.bottom-bar {
  width: 375px;
  display: flex;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--white);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  padding: var(--spacing-sm);
  z-index: 101;
}

.contact-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  color: var(--text-primary);
  font-size: var(--font-size-xs);
  cursor: pointer;
  padding: var(--spacing-xs);
  margin-right: var(--spacing-sm);
}

.save-button {
  flex: 2;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.save-button:hover {
  background-color: var(--primary-color-dark);
}

.no-data {
  text-align: center;
  padding: var(--spacing-xl);
  font-size: var(--font-size-base);
  color: var(--text-secondary);
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
@media screen and (max-width: 375px) {
  .case-image-container {
    width: 100%;
    height: 180px;
  }
  
  .case-info {
    width: 100%;
  }
  
  .bottom-bar {
    width: 100%;
  }
}
</style>