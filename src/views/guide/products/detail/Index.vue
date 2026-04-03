<template>
  <div class="product-detail">
    <!-- 顶部导航 -->
    <div class="top-nav bg-gradient">
      <div class="nav-icon back" @click="goBack"></div>
      <h1 class="text-lg font-bold text-white">产品详情</h1>
      <div class="nav-icon share" @click="shareProduct"></div>
    </div>
    
    <!-- 产品图片 -->
    <div class="product-image-container">
      <img :src="product.image" :alt="product.name" class="product-image" />
    </div>
    
    <!-- 产品信息 -->
    <div class="product-info">
      <h2 class="product-name">{{ product.name }}</h2>
      <p class="product-price">{{ product.price }}</p>
      <p class="product-description">{{ product.description }}</p>
      
      <!-- 产品规格 -->
      <div class="product-specs">
        <h3 class="specs-title">产品规格</h3>
        <div class="spec-item">
          <span class="spec-label">分类：</span>
          <span class="spec-value">{{ product.category }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">材质：</span>
          <span class="spec-value">{{ product.material || '环保材质' }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">风格：</span>
          <span class="spec-value">{{ product.style || '现代简约' }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">尺寸：</span>
          <span class="spec-value">{{ product.size || '定制' }}</span>
        </div>
      </div>
      
      <!-- 产品详情 -->
      <div class="product-details">
        <h3 class="details-title">产品详情</h3>
        <p class="details-content">
          {{ product.detail || '本产品采用优质材料制作，工艺精湛，设计美观，符合现代家居风格。' }}
        </p>
      </div>
    </div>
    
    <!-- 底部操作栏 -->
    <div class="bottom-bar">
      <button class="contact-button" @click="contactService">
        <div class="nav-icon phone"></div>
        <span>联系客服</span>
      </button>
      <button class="add-plan-button" @click="addToPlan">
        加入方案
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 产品数据
const product = ref({
  id: 1,
  name: '现代简约橱柜',
  price: '¥12,800',
  description: '环保材质，现代简约风格',
  category: '橱柜',
  image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20simple%20kitchen%20cabinet&image_size=square'
})

// 产品列表数据
const products = [
  {
    id: 1,
    name: '现代简约橱柜',
    price: '¥12,800',
    description: '环保材质，现代简约风格',
    category: '橱柜',
    material: '环保板材',
    style: '现代简约',
    size: '定制',
    detail: '本产品采用环保板材制作，甲醛释放量符合国家标准，现代简约设计风格，适合各种家居装修风格。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20simple%20kitchen%20cabinet&image_size=square'
  },
  {
    id: 2,
    name: '欧式衣柜',
    price: '¥18,600',
    description: '实木材质，欧式古典风格',
    category: '衣柜',
    material: '实木',
    style: '欧式古典',
    size: '定制',
    detail: '本产品采用优质实木制作，欧式古典设计风格，做工精细，储物空间大，适合各种家居装修风格。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=european%20style%20wardrobe&image_size=square'
  },
  {
    id: 3,
    name: '智能卫浴柜',
    price: '¥8,900',
    description: '智能感应，防潮防水',
    category: '卫浴',
    material: '防潮板材',
    style: '现代简约',
    size: '定制',
    detail: '本产品采用防潮板材制作，智能感应设计，防潮防水性能好，适合各种卫浴空间。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20bathroom%20cabinet&image_size=square'
  },
  {
    id: 4,
    name: '不锈钢五金件',
    price: '¥1,200',
    description: '304不锈钢，耐用 corrosion-resistant',
    category: '五金',
    material: '304不锈钢',
    style: '现代简约',
    size: '标准',
    detail: '本产品采用304不锈钢制作，耐腐蚀，耐用性强，适合各种家具使用。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=stainless%20steel%20hardware%20parts&image_size=square'
  },
  {
    id: 5,
    name: '现代简约餐桌',
    price: '¥5,800',
    description: '环保材质，现代简约风格',
    category: '橱柜',
    material: '环保板材',
    style: '现代简约',
    size: '定制',
    detail: '本产品采用环保板材制作，现代简约设计风格，适合各种家居装修风格。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20simple%20dining%20table&image_size=square'
  },
  {
    id: 6,
    name: '欧式沙发',
    price: '¥12,600',
    description: '真皮材质，欧式古典风格',
    category: '衣柜',
    material: '真皮',
    style: '欧式古典',
    size: '定制',
    detail: '本产品采用优质真皮制作，欧式古典设计风格，做工精细，舒适耐用，适合各种家居装修风格。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=european%20style%20sofa&image_size=square'
  }
]

// 返回上一页
const goBack = () => {
  router.back()
}

// 分享产品
const shareProduct = () => {
  alert('分享功能开发中')
}

// 联系客服
const contactService = () => {
  alert('联系客服：400-123-4567')
}

// 加入方案
const addToPlan = () => {
  // 模拟加入方案功能
  const planItems = JSON.parse(localStorage.getItem('planItems') || '[]')
  const existingItem = planItems.find(item => item.id === product.value.id)
  
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1
  } else {
    planItems.push({ ...product.value, quantity: 1 })
  }
  
  localStorage.setItem('planItems', JSON.stringify(planItems))
  alert(`已将 ${product.value.name} 加入方案`)
}

// 组件挂载
onMounted(() => {
  // 获取产品ID
  const productId = parseInt(route.params.id)
  // 查找产品数据
  const foundProduct = products.find(p => p.id === productId)
  if (foundProduct) {
    product.value = foundProduct
  }
})
</script>

<style scoped>
.product-detail {
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

.product-image-container {
  width: 375px;
  height: 375px;
  overflow: hidden;
  margin: 0 auto;
  background-color: #f5f5f5;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: var(--spacing-md);
  padding-bottom: 80px;
  background-color: var(--white);
  margin: 0 auto;
  width: 375px;
}

.product-name {
  font-size: var(--font-size-xl);
  font-weight: bold;
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
}

.product-price {
  font-size: var(--font-size-lg);
  font-weight: bold;
  margin: 0 0 var(--spacing-md) 0;
  color: var(--danger-color);
}

.product-description {
  font-size: var(--font-size-base);
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.product-specs {
  margin: 0 0 var(--spacing-md) 0;
}

.specs-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
}

.spec-item {
  display: flex;
  margin: 0 0 var(--spacing-xs) 0;
}

.spec-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  width: 60px;
}

.spec-value {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  flex: 1;
}

.product-details {
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
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
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

.add-plan-button {
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

.add-plan-button:hover {
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
  .product-image-container {
    width: 100%;
    height: 100vw;
  }
  
  .product-info {
    width: 100%;
  }
  
  .bottom-bar {
    width: 100%;
  }
}
</style>