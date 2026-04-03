<template>
  <div class="contract-detail">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">合同详情</h1>
      <div class="header-right">
        <van-button size="small" @click="moreOptions">更多</van-button>
      </div>
    </div>
    
    <!-- 合同状态 -->
    <div class="status-section">
      <div class="status-badge" :class="contractStatusClass">
        {{ contract.status }}
      </div>
      <p class="status-desc">{{ contract.statusDesc }}</p>
    </div>
    
    <!-- 合同基本信息 -->
    <div class="info-section">
      <h3 class="section-title">基本信息</h3>
      <div class="info-item">
        <span class="info-label">合同编号</span>
        <span class="info-value">{{ contract.contractNumber }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">合同名称</span>
        <span class="info-value">{{ contract.contractName }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">订单编号</span>
        <span class="info-value">{{ contract.orderNumber }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">合同金额</span>
        <span class="info-value price">{{ contract.totalAmount }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">签署日期</span>
        <span class="info-value">{{ contract.signDate }}</span>
      </div>
    </div>
    
    <!-- 客户信息 -->
    <div class="info-section">
      <h3 class="section-title">客户信息</h3>
      <div class="info-item">
        <span class="info-label">客户姓名</span>
        <span class="info-value">{{ contract.customerName }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">联系电话</span>
        <span class="info-value">{{ contract.customerPhone }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">联系地址</span>
        <span class="info-value">{{ contract.customerAddress }}</span>
      </div>
    </div>
    
    <!-- 合同内容 -->
    <div class="content-section">
      <h3 class="section-title">合同内容</h3>
      <div class="contract-content">
        {{ contract.content }}
      </div>
      <div v-if="contract.supplementary" class="supplementary-content">
        <h4 class="supplementary-title">补充条款</h4>
        {{ contract.supplementary }}
      </div>
    </div>
    
    <!-- 产品明细 -->
    <div class="info-section">
      <h3 class="section-title">产品明细</h3>
      <div class="product-list">
        <div class="product-item" v-for="(product, index) in contract.products" :key="index">
          <div class="product-info">
            <h4 class="product-name">{{ product.name }}</h4>
            <p class="product-spec">{{ product.spec }}</p>
          </div>
          <div class="product-price">¥{{ product.price }}</div>
        </div>
        <div class="total-row">
          <span class="total-label">总计</span>
          <span class="total-price">¥{{ contract.totalAmount }}</span>
        </div>
      </div>
    </div>
    
    <!-- 签署记录 -->
    <div class="info-section">
      <h3 class="section-title">签署记录</h3>
      <div class="sign-record" v-for="(record, index) in contract.signRecords" :key="index">
        <div class="record-time">{{ record.time }}</div>
        <div class="record-content">{{ record.content }}</div>
      </div>
    </div>
    
    <!-- 底部操作栏 -->
    <div class="bottom-action">
      <van-button type="default" class="secondary-btn" @click="downloadContract">下载PDF</van-button>
      <van-button type="primary" class="primary-btn" @click="shareContract">分享合同</van-button>
    </div>
    
    <!-- 分享弹窗 -->
    <van-popup v-model:show="sharePopupShow" position="bottom" round>
      <div class="share-popup">
        <h3 class="popup-title">分享合同</h3>
        <div class="share-options">
          <div class="share-item" @click="shareToWechat">
            <div class="share-icon wechat"></div>
            <span>微信好友</span>
          </div>
          <div class="share-item" @click="shareToWechatMoments">
            <div class="share-icon moments"></div>
            <span>朋友圈</span>
          </div>
          <div class="share-item" @click="downloadContract">
            <div class="share-icon download"></div>
            <span>下载PDF</span>
          </div>
        </div>
        <van-button type="default" class="cancel-btn" @click="sharePopupShow = false">取消</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 分享弹窗显示状态
const sharePopupShow = ref(false)

// 合同数据
const contract = ref({
  id: route.params.id || 1,
  contractNumber: 'HT20240101001',
  contractName: '标准销售合同',
  orderNumber: 'ORD20240101001',
  totalAmount: '14000',
  signDate: '2024-01-01',
  status: '已签署',
  statusDesc: '客户已完成签署，合同生效',
  customerName: '张三',
  customerPhone: '13800138000',
  customerAddress: '北京市朝阳区某某街道123号',
  content: '甲方（卖方）：HomeUp家居有限公司\n乙方（买方）：张三\n\n根据《中华人民共和国合同法》及相关法律法规，甲乙双方经友好协商，就乙方购买甲方产品事宜达成如下协议：\n\n1. 产品名称、规格、数量、单价及总价\n定制衣柜：2.4m×2.6m，单价8000元，数量1件\n定制书柜：1.8m×2.4m，单价6000元，数量1件\n总计：14000元\n\n2. 交货时间及地点\n交货时间：2024年02月01日\n交货地点：北京市朝阳区某某街道123号\n\n3. 付款方式\n合同签署后3日内支付50%预付款，货到现场验收后支付剩余50%\n\n4. 质量保证\n甲方保证所提供的产品符合国家相关标准，质保期为1年\n\n5. 违约责任\n任何一方违约，应承担相应的违约责任\n\n6. 争议解决\n如发生争议，双方应协商解决，协商不成可向当地法院提起诉讼\n\n7. 其他约定\n本合同一式两份，甲乙双方各执一份，具有同等法律效力',
  supplementary: '补充条款：乙方需在安装完成后3日内进行验收，逾期视为验收合格',
  products: [
    {
      name: '定制衣柜',
      spec: '2.4m×2.6m',
      price: '8000'
    },
    {
      name: '定制书柜',
      spec: '1.8m×2.4m',
      price: '6000'
    }
  ],
  signRecords: [
    {
      time: '2024-01-01 10:00',
      content: '系统生成合同'
    },
    {
      time: '2024-01-01 10:30',
      content: '导购分享合同给客户'
    },
    {
      time: '2024-01-01 11:00',
      content: '客户完成签署'
    }
  ]
})

// 合同状态样式
const contractStatusClass = computed(() => {
  switch (contract.value.status) {
    case '待签署':
      return 'status-pending'
    case '已签署':
      return 'status-signed'
    case '已过期':
      return 'status-expired'
    default:
      return ''
  }
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 更多选项
const moreOptions = () => {
  // 这里可以实现更多选项功能
  console.log('更多选项')
}

// 下载合同PDF
const downloadContract = () => {
  // 这里可以实现下载合同PDF功能
  console.log('下载合同PDF')
  sharePopupShow.value = false
}

// 分享合同
const shareContract = () => {
  sharePopupShow.value = true
}

// 分享到微信
const shareToWechat = () => {
  // 这里可以实现分享到微信功能
  console.log('分享到微信')
  sharePopupShow.value = false
}

// 分享到朋友圈
const shareToWechatMoments = () => {
  // 这里可以实现分享到朋友圈功能
  console.log('分享到朋友圈')
  sharePopupShow.value = false
}
</script>

<style scoped>
.contract-detail {
  width: 375px;
  min-height: 100vh;
  background-color: #f5f5f5;
  margin: 0 auto;
  padding-bottom: 60px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  background-color: white;
  padding: 0 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 20px;
  height: 20px;
  color: #333;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-right {
  width: 60px;
}

.status-section {
  background-color: white;
  padding: 20px;
  margin-bottom: 10px;
  text-align: center;
}

.status-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-signed {
  background-color: #d4edda;
  color: #155724;
}

.status-expired {
  background-color: #f8d7da;
  color: #721c24;
}

.status-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.info-section {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-label {
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 14px;
  color: #333;
  text-align: right;
  flex: 1;
  margin-left: 10px;
}

.info-value.price {
  font-weight: 500;
  color: #ff6b6b;
}

.content-section {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
}

.contract-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
}

.supplementary-content {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.supplementary-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
}

.product-list {
  margin-bottom: 10px;
}

.product-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 4px 0;
}

.product-spec {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.product-price {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  margin-top: 10px;
  border-top: 2px solid #f0f0f0;
}

.total-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.total-price {
  font-size: 16px;
  font-weight: 600;
  color: #ff6b6b;
}

.sign-record {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.record-time {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.record-content {
  font-size: 14px;
  color: #333;
}

.bottom-action {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 375px;
  background-color: white;
  padding: 10px 15px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
  display: flex;
  gap: 10px;
}

.secondary-btn {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
}

.primary-btn {
  flex: 2;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
}

.share-popup {
  padding: 20px;
}

.popup-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  text-align: center;
}

.share-options {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
}

.share-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.share-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-size: 60%;
  background-repeat: no-repeat;
  background-position: center;
}

.share-icon.wechat {
  background-color: #07C160;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>');
}

.share-icon.moments {
  background-color: #FFC107;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>');
}

.share-icon.download {
  background-color: #667eea;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>');
}

.share-item span {
  font-size: 12px;
  color: #666;
}

.cancel-btn {
  width: 100%;
  height: 44px;
  border-radius: 22px;
}
</style>