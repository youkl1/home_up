<template>
  <div class="purchase-cart">
    <div class="page-header">
      <h1>采购车</h1>
      <el-button @click="goBack">继续采购</el-button>
    </div>

    <!-- 采购车列表 -->
    <div class="cart-list">
      <el-card shadow="hover">
        <el-table :data="cartItems" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="商品信息" min-width="300">
            <template #default="scope">
              <div class="product-info">
                <div class="product-image">
                  <el-image :src="scope.row.image" fit="cover" :alt="scope.row.name" @error="handleImageError">
                    <template #error>
                      <div class="image-placeholder">
                        <el-icon><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                </div>
                <div class="product-details">
                  <h4 class="product-name">{{ scope.row.name }}</h4>
                  <p class="product-category">{{ scope.row.category }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="150">
            <template #default="scope">
              <span class="price">¥{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" width="200">
            <template #default="scope">
              <el-input-number v-model="scope.row.quantity" :min="1" :max="99" size="small" @change="updateQuantity(scope.row)"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="小计" width="150">
            <template #default="scope">
              <span class="subtotal">¥{{ scope.row.price * scope.row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button type="danger" size="small" @click="removeItem(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 空状态 -->
        <el-empty v-if="cartItems.length === 0" description="采购车是空的，快去选购商品吧">
          <el-button type="primary" @click="goBack">去采购</el-button>
        </el-empty>

        <!-- 结算栏 -->
        <div class="cart-footer" v-if="cartItems.length > 0">
          <div class="footer-left">
            <el-checkbox v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
            <el-button type="danger" size="small" @click="removeSelected">删除选中</el-button>
          </div>
          <div class="footer-right">
            <div class="total-info">
              <span class="selected-count">已选 {{ selectedItems.length }} 件商品</span>
              <span class="total-price">合计: <strong>¥{{ totalPrice }}</strong></span>
            </div>
            <el-button type="primary" size="large" @click="submitOrder">提交采购订单</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 提交订单弹窗 -->
    <el-dialog v-model="orderDialogVisible" title="提交采购订单" width="600px">
      <el-form :model="orderForm" label-width="120px">
        <el-form-item label="收货人" required>
          <el-input v-model="orderForm.receiver" placeholder="请输入收货人姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" required>
          <el-input v-model="orderForm.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" required>
          <el-input type="textarea" v-model="orderForm.address" :rows="3" placeholder="请输入详细收货地址"></el-input>
        </el-form-item>
        <el-form-item label="期望到货时间">
          <el-date-picker
            v-model="orderForm.expectedDate"
            type="date"
            placeholder="选择期望到货日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="orderForm.remark" :rows="2" placeholder="请输入备注信息"></el-input>
        </el-form-item>
        <el-form-item label="订单金额">
          <div class="order-amount">¥{{ totalPrice }}</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="orderDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmOrder">确认提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import { handleImageError } from '../../../../utils/imageUtils'

const router = useRouter()
const cartItems = ref([])

// 从本地存储加载采购车数据
const loadCartItems = () => {
  const storedItems = localStorage.getItem('purchaseCart')
  if (storedItems) {
    cartItems.value = JSON.parse(storedItems)
  } else {
    // 默认数据
    cartItems.value = [
      { id: 'PROD001', name: '现代简约沙发', category: '沙发', price: 2999, quantity: 2, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20minimalist%20sofa%20living%20room%20furniture&image_size=square_hd' },
      { id: 'PROD002', name: '实木茶几', category: '茶几', price: 899, quantity: 1, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=solid%20wood%20coffee%20table%20modern%20living%20room&image_size=square_hd' },
      { id: 'PROD003', name: '北欧风格双人床', category: '床', price: 1899, quantity: 1, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=nordic%20style%20double%20bed%20modern%20bedroom&image_size=square_hd' }
    ]
    localStorage.setItem('purchaseCart', JSON.stringify(cartItems.value))
  }
}

const selectedItems = ref([])
const selectAll = ref(false)
const orderDialogVisible = ref(false)
const orderForm = ref({
  receiver: '',
  phone: '',
  address: '',
  expectedDate: '',
  remark: ''
})

const totalPrice = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
})

const handleSelectionChange = (selection) => {
  selectedItems.value = selection
  selectAll.value = selection.length === cartItems.value.length && cartItems.value.length > 0
}

const handleSelectAll = (val) => {
  // 这里需要通过表格的 toggleAllSelection 方法来实现
}

const updateQuantity = (item) => {
  ElMessage.success(`已更新 ${item.name} 的数量为 ${item.quantity}`)
  // 更新本地存储
  localStorage.setItem('purchaseCart', JSON.stringify(cartItems.value))
}

const removeItem = (id) => {
  ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = cartItems.value.findIndex(item => item.id === id)
    if (index > -1) {
      cartItems.value.splice(index, 1)
      // 更新本地存储
      localStorage.setItem('purchaseCart', JSON.stringify(cartItems.value))
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

const removeSelected = () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请先选择要删除的商品')
    return
  }
  ElMessageBox.confirm(`确定要删除选中的 ${selectedItems.value.length} 件商品吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const selectedIds = selectedItems.value.map(item => item.id)
    cartItems.value = cartItems.value.filter(item => !selectedIds.includes(item.id))
    selectedItems.value = []
    // 更新本地存储
    localStorage.setItem('purchaseCart', JSON.stringify(cartItems.value))
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const submitOrder = () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请先选择要采购的商品')
    return
  }
  orderDialogVisible.value = true
}

const confirmOrder = () => {
  ElMessage.success('采购订单提交成功')
  orderDialogVisible.value = false
  // 清空已选商品
  const selectedIds = selectedItems.value.map(item => item.id)
  cartItems.value = cartItems.value.filter(item => !selectedIds.includes(item.id))
  selectedItems.value = []
  // 更新本地存储
  localStorage.setItem('purchaseCart', JSON.stringify(cartItems.value))
}

const goBack = () => {
  router.push('/store/purchase/products')
}

onMounted(() => {
  console.log('[PurchaseCart] 组件挂载')
  // 加载采购车数据
  loadCartItems()
})
</script>

<style scoped>
.purchase-cart {
  padding: 20px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
}

.product-image .el-image {
  width: 100%;
  height: 100%;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 24px;
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.product-category {
  font-size: 14px;
  color: #666;
}

.price {
  font-size: 16px;
  font-weight: bold;
  color: #f56c6c;
}

.subtotal {
  font-size: 16px;
  font-weight: bold;
  color: #f56c6c;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.selected-count {
  font-size: 14px;
  color: #666;
}

.total-price {
  font-size: 16px;
  color: #333;
}

.total-price strong {
  font-size: 24px;
  color: #f56c6c;
}

.order-amount {
  font-size: 24px;
  font-weight: bold;
  color: #f56c6c;
}
</style>
