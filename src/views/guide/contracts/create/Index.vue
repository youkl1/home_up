<template>
  <div class="contract-create">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">创建合同</h1>
      <div class="header-right">
        <van-button size="small" @click="previewContract">预览</van-button>
      </div>
    </div>
    
    <!-- 合同基本信息 -->
    <div class="form-section">
      <h3 class="section-title">基本信息</h3>
      <van-form @submit="onSubmit">
        <van-field
          v-model="contractForm.customerName"
          label="客户姓名"
          placeholder="请输入客户姓名"
          required
        />
        <van-field
          v-model="contractForm.customerPhone"
          label="联系电话"
          placeholder="请输入联系电话"
          required
        />
        <van-field
          v-model="contractForm.orderNumber"
          label="订单编号"
          placeholder="请输入订单编号"
          required
        />
        <van-field
          v-model="contractForm.totalAmount"
          label="合同金额"
          placeholder="请输入合同金额"
          type="number"
          required
        />
        <van-field
          v-model="contractForm.signDate"
          label="签署日期"
          placeholder="请选择签署日期"
          required
        >
          <template #input>
            <van-popup
              v-model:show="datePickerShow"
              position="bottom"
            >
              <van-datetime-picker
                v-model="contractForm.signDate"
                type="date"
                @confirm="datePickerShow = false"
                @cancel="datePickerShow = false"
              />
            </van-popup>
            <div class="field-value" @click="datePickerShow = true">
              {{ contractForm.signDate || '请选择' }}
            </div>
          </template>
        </van-field>
      </van-form>
    </div>
    
    <!-- 合同内容 -->
    <div class="form-section">
      <h3 class="section-title">合同内容</h3>
      <div class="contract-content">
        <van-field
          v-model="contractForm.content"
          label="合同条款"
          type="textarea"
          placeholder="请输入合同条款"
          rows="5"
          required
        />
        <van-field
          v-model="contractForm.supplementary"
          label="补充条款"
          type="textarea"
          placeholder="请输入补充条款"
          rows="3"
        />
      </div>
    </div>
    
    <!-- 产品明细 -->
    <div class="form-section">
      <h3 class="section-title">产品明细</h3>
      <div class="product-list">
        <van-cell 
          v-for="(product, index) in contractForm.products" 
          :key="index"
          class="product-item"
        >
          <div class="product-info">
            <h4 class="product-name">{{ product.name }}</h4>
            <p class="product-spec">{{ product.spec }}</p>
          </div>
          <div class="product-price">¥{{ product.price }}</div>
        </van-cell>
        <van-button type="default" size="small" class="add-product-btn" @click="addProduct">
          + 添加产品
        </van-button>
      </div>
    </div>
    
    <!-- 底部操作栏 -->
    <div class="bottom-action">
      <van-button type="default" class="secondary-btn" @click="saveDraft">保存草稿</van-button>
      <van-button type="primary" class="primary-btn" @click="generateContract">生成合同</van-button>
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
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 日期选择器显示状态
const datePickerShow = ref(false)
// 分享弹窗显示状态
const sharePopupShow = ref(false)

// 合同表单数据
const contractForm = ref({
  customerName: '',
  customerPhone: '',
  orderNumber: '',
  totalAmount: '',
  signDate: '',
  content: '甲方（卖方）：____________________\n乙方（买方）：____________________\n\n根据《中华人民共和国合同法》及相关法律法规，甲乙双方经友好协商，就乙方购买甲方产品事宜达成如下协议：\n\n1. 产品名称、规格、数量、单价及总价\n2. 交货时间及地点\n3. 付款方式\n4. 质量保证\n5. 违约责任\n6. 争议解决\n7. 其他约定',
  supplementary: '',
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
  ]
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 预览合同
const previewContract = () => {
  // 这里可以实现合同预览功能
  console.log('预览合同')
}

// 添加产品
const addProduct = () => {
  contractForm.value.products.push({
    name: '',
    spec: '',
    price: ''
  })
}

// 保存草稿
const saveDraft = () => {
  // 这里可以实现保存草稿功能
  console.log('保存草稿')
}

// 生成合同
const generateContract = () => {
  // 这里可以实现生成合同功能
  console.log('生成合同')
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

// 下载合同PDF
const downloadContract = () => {
  // 这里可以实现下载合同PDF功能
  console.log('下载合同PDF')
  sharePopupShow.value = false
}

// 表单提交
const onSubmit = (values) => {
  console.log('表单提交', values)
}
</script>

<style scoped>
.contract-create {
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

.form-section {
  background-color: white;
  margin-bottom: 10px;
  padding: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
}

.contract-content {
  margin-bottom: 10px;
}

.product-list {
  margin-bottom: 10px;
}

.product-item {
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
  color: #ff6b6b;
}

.add-product-btn {
  width: 100%;
  margin-top: 10px;
  border-radius: 20px;
}

.field-value {
  width: 100%;
  height: 34px;
  line-height: 34px;
  color: #999;
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