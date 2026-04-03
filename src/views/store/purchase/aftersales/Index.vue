<template>
  <div class="purchase-aftersales">
    <div class="page-header">
      <h1>采购售后</h1>
      <el-button type="primary" @click="showApplyDialog">
        <el-icon><Plus /></el-icon>
        申请售后
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">售后总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value warning">{{ stats.pending }}</div>
        <div class="stat-label">待处理</div>
      </div>
      <div class="stat-card">
        <div class="stat-value success">{{ stats.resolved }}</div>
        <div class="stat-label">已解决</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">¥{{ stats.refundAmount }}</div>
        <div class="stat-label">退款金额</div>
      </div>
    </div>

    <!-- 搜索筛选 -->
    <div class="search-filter">
      <el-input
        v-model="searchQuery"
        placeholder="搜索订单号/商品名称"
        clearable
        style="width: 250px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select v-model="filterStatus" placeholder="售后状态" clearable>
        <el-option label="待审核" value="pending" />
        <el-option label="处理中" value="processing" />
        <el-option label="待退货" value="wait_return" />
        <el-option label="已退货" value="returned" />
        <el-option label="已退款" value="refunded" />
        <el-option label="已拒绝" value="rejected" />
        <el-option label="已关闭" value="closed" />
      </el-select>
      <el-select v-model="filterType" placeholder="售后类型" clearable>
        <el-option label="退货退款" value="return_refund" />
        <el-option label="仅退款" value="refund_only" />
        <el-option label="换货" value="exchange" />
        <el-option label="补发" value="resend" />
      </el-select>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
      />
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="resetFilter">重置</el-button>
    </div>

    <!-- 售后列表 -->
    <div class="aftersales-list">
      <el-table :data="aftersalesList" v-loading="loading" stripe>
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="aftersales-detail">
              <div class="detail-section">
                <h4>售后信息</h4>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="label">售后单号：</span>
                    <span class="value">{{ row.aftersaleNo }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">申请时间：</span>
                    <span class="value">{{ row.applyTime }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">售后类型：</span>
                    <span class="value">{{ getAftersaleTypeText(row.type) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">退款金额：</span>
                    <span class="value price">¥{{ row.refundAmount }}</span>
                  </div>
                </div>
              </div>
              <div class="detail-section">
                <h4>问题描述</h4>
                <p class="description">{{ row.problemDesc }}</p>
                <div class="images" v-if="row.problemImages?.length">
                  <el-image
                    v-for="(img, index) in row.problemImages"
                    :key="index"
                    :src="img"
                    :preview-src-list="row.problemImages"
                    fit="cover"
                    class="problem-image"
                  />
                </div>
              </div>
              <div class="detail-section" v-if="row.logistics">
                <h4>退货物流</h4>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="label">快递公司：</span>
                    <span class="value">{{ row.logistics.company }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">快递单号：</span>
                    <span class="value">{{ row.logistics.trackingNo }}</span>
                    <el-button link type="primary" @click="copyTrackingNo(row.logistics.trackingNo)">
                      复制
                    </el-button>
                  </div>
                  <div class="detail-item">
                    <span class="label">发货时间：</span>
                    <span class="value">{{ row.logistics.sendTime }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品信息" min-width="280">
          <template #default="{ row }">
            <div class="product-info">
              <el-image :src="row.productImage" fit="cover" class="product-image" />
              <div class="product-detail">
                <div class="product-name">{{ row.productName }}</div>
                <div class="product-spec">{{ row.productSpec }}</div>
                <div class="product-price">¥{{ row.productPrice }} × {{ row.quantity }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="关联订单" width="180">
          <template #default="{ row }">
            <div class="order-info">
              <div class="order-no">{{ row.orderNo }}</div>
              <el-button link type="primary" @click="viewOrder(row.orderId)">
                查看订单
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="售后类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getAftersaleTypeType(row.type)">
              {{ getAftersaleTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="退款金额" width="120">
          <template #default="{ row }">
            <span class="price">¥{{ row.refundAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="160">
          <template #default="{ row }">
            {{ row.applyTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
            <el-button 
              v-if="row.status === 'wait_return'" 
              link 
              type="primary" 
              @click="fillLogistics(row)"
            >
              填写物流
            </el-button>
            <el-button 
              v-if="['pending', 'processing'].includes(row.status)" 
              link 
              type="danger" 
              @click="cancelAftersale(row)"
            >
              撤销
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 申请售后弹窗 -->
    <el-dialog
      v-model="applyDialogVisible"
      title="申请售后"
      width="700px"
      destroy-on-close
    >
      <el-form
        ref="applyFormRef"
        :model="applyForm"
        :rules="applyRules"
        label-width="100px"
      >
        <el-form-item label="选择订单" prop="orderId">
          <el-select
            v-model="applyForm.orderId"
            placeholder="请选择要申请售后的订单"
            filterable
            style="width: 100%"
            @change="onOrderChange"
          >
            <el-option
              v-for="order in availableOrders"
              :key="order.id"
              :label="`${order.orderNo} - ${order.productName}`"
              :value="order.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="售后类型" prop="type">
          <el-radio-group v-model="applyForm.type">
            <el-radio-button label="return_refund">退货退款</el-radio-button>
            <el-radio-button label="refund_only">仅退款</el-radio-button>
            <el-radio-button label="exchange">换货</el-radio-button>
            <el-radio-button label="resend">补发</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="售后数量" prop="quantity">
          <el-input-number v-model="applyForm.quantity" :min="1" :max="maxQuantity" />
          <span class="form-tip">最多可申请 {{ maxQuantity }} 件</span>
        </el-form-item>

        <el-form-item label="退款金额" prop="refundAmount" v-if="applyForm.type !== 'exchange' && applyForm.type !== 'resend'">
          <el-input-number 
            v-model="applyForm.refundAmount" 
            :min="0" 
            :max="maxRefundAmount"
            :precision="2"
          />
          <span class="form-tip">最多可退 ¥{{ maxRefundAmount }}</span>
        </el-form-item>

        <el-form-item label="问题描述" prop="problemDesc">
          <el-input
            v-model="applyForm.problemDesc"
            type="textarea"
            :rows="4"
            placeholder="请详细描述商品问题，以便客服快速处理"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="问题图片">
          <el-upload
            action="/api/upload"
            list-type="picture-card"
            :file-list="applyForm.images"
            :on-success="handleUploadSuccess"
            :on-remove="handleRemove"
            :limit="6"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">最多上传6张图片，单张不超过5MB</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="applyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitApply" :loading="submitting">
          提交申请
        </el-button>
      </template>
    </el-dialog>

    <!-- 填写物流弹窗 -->
    <el-dialog
      v-model="logisticsDialogVisible"
      title="填写退货物流"
      width="500px"
    >
      <el-form
        ref="logisticsFormRef"
        :model="logisticsForm"
        :rules="logisticsRules"
        label-width="100px"
      >
        <el-form-item label="快递公司" prop="company">
          <el-select v-model="logisticsForm.company" placeholder="请选择快递公司" filterable>
            <el-option
              v-for="company in expressCompanies"
              :key="company.code"
              :label="company.name"
              :value="company.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="trackingNo">
          <el-input v-model="logisticsForm.trackingNo" placeholder="请输入快递单号" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="logisticsForm.remark"
            type="textarea"
            :rows="3"
            placeholder="可选填"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="logisticsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitLogistics" :loading="submitting">
          确认提交
        </el-button>
      </template>
    </el-dialog>

    <!-- 售后详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="`售后详情 - ${selectedAftersale.aftersaleNo || ''}`"
      width="800px"
    >
      <div class="aftersale-detail-dialog">
        <!-- 基本信息 -->
        <div class="detail-section">
          <h4>基本信息</h4>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="售后单号">{{ selectedAftersale.aftersaleNo }}</el-descriptions-item>
            <el-descriptions-item label="关联订单">{{ selectedAftersale.orderNo }}</el-descriptions-item>
            <el-descriptions-item label="售后类型">
              <el-tag :type="getStatusType(selectedAftersale.status)">
                {{ getAftersaleTypeText(selectedAftersale.type) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="退款金额">
              <span class="price">¥{{ selectedAftersale.refundAmount }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="申请时间">{{ selectedAftersale.applyTime }}</el-descriptions-item>
            <el-descriptions-item label="处理状态">
              <el-tag :type="getStatusType(selectedAftersale.status)">
                {{ getStatusText(selectedAftersale.status) }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 商品信息 -->
        <div class="detail-section">
          <h4>商品信息</h4>
          <div class="product-info">
            <el-image :src="selectedAftersale.productImage" fit="cover" class="product-image" />
            <div class="product-detail">
              <div class="product-name">{{ selectedAftersale.productName }}</div>
              <div class="product-spec">{{ selectedAftersale.productSpec }}</div>
              <div class="product-price">¥{{ selectedAftersale.productPrice }} × {{ selectedAftersale.quantity }}</div>
            </div>
          </div>
        </div>

        <!-- 问题描述 -->
        <div class="detail-section">
          <h4>问题描述</h4>
          <p class="description">{{ selectedAftersale.problemDesc }}</p>
          <div class="images" v-if="selectedAftersale.problemImages?.length">
            <el-image
              v-for="(img, index) in selectedAftersale.problemImages"
              :key="index"
              :src="img"
              :preview-src-list="selectedAftersale.problemImages"
              fit="cover"
              class="problem-image"
            />
          </div>
        </div>

        <!-- 退货物流 -->
        <div class="detail-section" v-if="selectedAftersale.logistics">
          <h4>退货物流</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="快递公司">{{ selectedAftersale.logistics.company }}</el-descriptions-item>
            <el-descriptions-item label="快递单号">
              {{ selectedAftersale.logistics.trackingNo }}
              <el-button link type="primary" @click="copyTrackingNo(selectedAftersale.logistics.trackingNo)">
                复制
              </el-button>
            </el-descriptions-item>
            <el-descriptions-item label="发货时间">{{ selectedAftersale.logistics.sendTime }}</el-descriptions-item>
            <el-descriptions-item label="备注">{{ selectedAftersale.logistics.remark || '无' }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 处理记录 -->
        <div class="detail-section">
          <h4>处理记录</h4>
          <el-timeline>
            <el-timeline-item
              v-for="(record, index) in selectedAftersale.processRecords || []"
              :key="index"
              :timestamp="record.time"
              :type="record.type || 'primary'"
            >
              <div class="record-content">
                <div class="record-title">{{ record.title }}</div>
                <div class="record-desc">{{ record.content }}</div>
                <div class="record-operator">操作人：{{ record.operator }}</div>
              </div>
            </el-timeline-item>
            <el-timeline-item
              v-if="!(selectedAftersale.processRecords && selectedAftersale.processRecords.length)"
              timestamp="-"
            >
              <div class="record-content">
                <div class="record-desc">暂无处理记录</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'

import placeholderImage from '../../../../assets/images/placeholder.png'

const router = useRouter()

// 统计数据
const stats = reactive({
  total: 12,
  pending: 3,
  resolved: 8,
  refundAmount: '15,800'
})

// 搜索筛选
const searchQuery = ref('')
const filterStatus = ref('')
const filterType = ref('')
const dateRange = ref([])

// 列表数据
const loading = ref(false)
const aftersalesList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 弹窗控制
const applyDialogVisible = ref(false)
const logisticsDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const submitting = ref(false)

// 表单引用
const applyFormRef = ref(null)
const logisticsFormRef = ref(null)

// 申请售后表单
const applyForm = reactive({
  orderId: '',
  type: 'return_refund',
  quantity: 1,
  refundAmount: 0,
  problemDesc: '',
  images: []
})

const maxQuantity = ref(1)
const maxRefundAmount = ref(0)

// 物流表单
const logisticsForm = reactive({
  aftersaleId: '',
  company: '',
  trackingNo: '',
  remark: ''
})

// 当前选中的售后申请详情
const selectedAftersale = ref({})

// 可选订单
const availableOrders = ref([
  { id: 1, orderNo: 'PO20241201001', productName: '现代简约布艺沙发', productPrice: 3999 },
  { id: 2, orderNo: 'PO20241201002', productName: '北欧实木餐桌', productPrice: 2899 },
  { id: 3, orderNo: 'PO20241201003', productName: '智能床垫', productPrice: 5999 }
])

// 快递公司
const expressCompanies = ref([
  { code: 'sf', name: '顺丰速运' },
  { code: 'jd', name: '京东物流' },
  { code: 'ems', name: 'EMS' },
  { code: 'yt', name: '圆通速递' },
  { code: 'zt', name: '中通快递' },
  { code: 'st', name: '申通快递' },
  { code: 'yd', name: '韵达速递' }
])

// 表单校验规则
const applyRules = {
  orderId: [{ required: true, message: '请选择订单', trigger: 'change' }],
  type: [{ required: true, message: '请选择售后类型', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  refundAmount: [{ required: true, message: '请输入退款金额', trigger: 'blur' }],
  problemDesc: [{ required: true, message: '请描述问题', trigger: 'blur' }]
}

const logisticsRules = {
  company: [{ required: true, message: '请选择快递公司', trigger: 'change' }],
  trackingNo: [{ required: true, message: '请输入快递单号', trigger: 'blur' }]
}

// 获取售后列表
const fetchAftersalesList = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取售后列表
    // const res = await axios.get('/api/purchase/aftersales', {
    //   params: {
    //     page: currentPage.value,
    //     pageSize: pageSize.value,
    //     keyword: searchQuery.value,
    //     status: filterStatus.value,
    //     type: filterType.value,
    //     startDate: dateRange.value?.[0],
    //     endDate: dateRange.value?.[1]
    //   }
    // })
    
    // 模拟数据
    setTimeout(() => {
      aftersalesList.value = [
        {
          id: 1,
          aftersaleNo: 'AS20241201001',
          orderId: 1,
          orderNo: 'PO20241201001',
          productName: '现代简约布艺沙发',
          productImage: placeholderImage,
          productSpec: '三人位/灰色',
          productPrice: 3999,
          quantity: 1,
          type: 'return_refund',
          refundAmount: 3999,
          status: 'pending',
          applyTime: '2024-12-01 10:30:00',
          problemDesc: '收到的商品颜色与描述不符，申请退货退款',
          problemImages: [placeholderImage]
        },
        {
          id: 2,
          aftersaleNo: 'AS20241201002',
          orderId: 2,
          orderNo: 'PO20241201002',
          productName: '北欧实木餐桌',
          productImage: placeholderImage,
          productSpec: '1.4米/原木色',
          productPrice: 2899,
          quantity: 1,
          type: 'exchange',
          refundAmount: 0,
          status: 'processing',
          applyTime: '2024-12-01 09:15:00',
          problemDesc: '桌面有轻微划痕，申请换货',
          problemImages: []
        },
        {
          id: 3,
          aftersaleNo: 'AS20241128001',
          orderId: 3,
          orderNo: 'PO20241128001',
          productName: '智能床垫',
          productImage: placeholderImage,
          productSpec: '1.8米/软硬可调',
          productPrice: 5999,
          quantity: 1,
          type: 'return_refund',
          refundAmount: 5999,
          status: 'wait_return',
          applyTime: '2024-11-28 14:20:00',
          problemDesc: '尺寸不合适，申请退货',
          problemImages: [],
          logistics: null
        },
        {
          id: 4,
          aftersaleNo: 'AS20241125001',
          orderId: 4,
          orderNo: 'PO20241125001',
          productName: 'LED护眼台灯',
          productImage: placeholderImage,
          productSpec: '白色/可调光',
          productPrice: 299,
          quantity: 2,
          type: 'refund_only',
          refundAmount: 598,
          status: 'refunded',
          applyTime: '2024-11-25 16:45:00',
          problemDesc: '未收到货，申请仅退款',
          problemImages: []
        }
      ]
      total.value = 12
      loading.value = false
    }, 500)
  } catch (error) {
    loading.value = false
    ElMessage.error('获取售后列表失败')
  }
}

// 获取状态文本和类型
const getStatusText = (status) => {
  const map = {
    pending: '待审核',
    processing: '处理中',
    wait_return: '待退货',
    returned: '已退货',
    refunded: '已退款',
    rejected: '已拒绝',
    closed: '已关闭'
  }
  return map[status] || status
}

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    processing: 'primary',
    wait_return: 'info',
    returned: 'success',
    refunded: 'success',
    rejected: 'danger',
    closed: 'info'
  }
  return map[status] || ''
}

const getAftersaleTypeText = (type) => {
  const map = {
    return_refund: '退货退款',
    refund_only: '仅退款',
    exchange: '换货',
    resend: '补发'
  }
  return map[type] || type
}

const getAftersaleTypeType = (type) => {
  const map = {
    return_refund: 'danger',
    refund_only: 'warning',
    exchange: 'primary',
    resend: 'success'
  }
  return map[type] || ''
}

// 搜索和重置
const handleSearch = () => {
  currentPage.value = 1
  fetchAftersalesList()
}

const resetFilter = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterType.value = ''
  dateRange.value = []
  handleSearch()
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchAftersalesList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchAftersalesList()
}

// 显示申请弹窗
const showApplyDialog = () => {
  applyDialogVisible.value = true
  // 重置表单
  Object.assign(applyForm, {
    orderId: '',
    type: 'return_refund',
    quantity: 1,
    refundAmount: 0,
    problemDesc: '',
    images: []
  })
}

// 订单选择变化
const onOrderChange = (orderId) => {
  const order = availableOrders.value.find(o => o.id === orderId)
  if (order) {
    maxQuantity.value = order.quantity || 1
    maxRefundAmount.value = order.productPrice * maxQuantity.value
    applyForm.quantity = 1
    applyForm.refundAmount = order.productPrice
  }
}

// 图片上传
const handleUploadSuccess = (response, file) => {
  applyForm.images.push({
    name: file.name,
    url: response.url
  })
}

const handleRemove = (file) => {
  const index = applyForm.images.findIndex(img => img.uid === file.uid)
  if (index > -1) {
    applyForm.images.splice(index, 1)
  }
}

// 提交申请
const submitApply = async () => {
  const valid = await applyFormRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    // TODO: 调用API提交售后申请
    // await axios.post('/api/purchase/aftersales', applyForm)
    
    setTimeout(() => {
      ElMessage.success('售后申请提交成功')
      applyDialogVisible.value = false
      fetchAftersalesList()
      submitting.value = false
    }, 1000)
  } catch (error) {
    submitting.value = false
    ElMessage.error('提交失败')
  }
}

// 查看详情
const viewDetail = (row) => {
  // 模拟处理记录数据
  const processRecords = [
    {
      time: row.applyTime,
      title: '售后申请提交',
      content: '客户提交了售后申请',
      operator: '系统',
      type: 'primary'
    }
  ]
  
  // 根据状态添加不同的处理记录
  if (row.status === 'processing') {
    processRecords.push({
      time: '2024-12-01 11:00:00',
      title: '售后审核通过',
      content: '售后申请已通过审核，进入处理流程',
      operator: '客服人员',
      type: 'success'
    })
  } else if (row.status === 'wait_return') {
    processRecords.push(
      {
        time: '2024-11-28 15:00:00',
        title: '售后审核通过',
        content: '售后申请已通过审核，进入处理流程',
        operator: '客服人员',
        type: 'success'
      },
      {
        time: '2024-11-28 16:00:00',
        title: '等待退货',
        content: '请尽快将商品寄回指定地址',
        operator: '客服人员',
        type: 'info'
      }
    )
  } else if (row.status === 'refunded') {
    processRecords.push(
      {
        time: '2024-11-25 17:00:00',
        title: '售后审核通过',
        content: '售后申请已通过审核，进入处理流程',
        operator: '客服人员',
        type: 'success'
      },
      {
        time: '2024-11-26 10:00:00',
        title: '退款完成',
        content: '退款已成功打入您的账户',
        operator: '系统',
        type: 'success'
      }
    )
  }
  
  // 设置选中的售后申请详情
  selectedAftersale.value = {
    ...row,
    processRecords
  }
  
  // 显示详情弹窗
  detailDialogVisible.value = true
}

// 查看订单
const viewOrder = (orderId) => {
  router.push(`/store/purchase/orders?id=${orderId}`)
}

// 填写物流
const fillLogistics = (row) => {
  logisticsForm.aftersaleId = row.id
  logisticsForm.company = ''
  logisticsForm.trackingNo = ''
  logisticsForm.remark = ''
  logisticsDialogVisible.value = true
}

// 提交物流
const submitLogistics = async () => {
  const valid = await logisticsFormRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    // TODO: 调用API提交物流信息
    // await axios.post(`/api/purchase/aftersales/${logisticsForm.aftersaleId}/logistics`, logisticsForm)
    
    setTimeout(() => {
      ElMessage.success('物流信息提交成功')
      logisticsDialogVisible.value = false
      fetchAftersalesList()
      submitting.value = false
    }, 1000)
  } catch (error) {
    submitting.value = false
    ElMessage.error('提交失败')
  }
}

// 撤销售后
const cancelAftersale = (row) => {
  ElMessageBox.confirm('确定要撤销该售后申请吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // TODO: 调用API撤销售后
      // await axios.post(`/api/purchase/aftersales/${row.id}/cancel`)
      
      ElMessage.success('撤销成功')
      fetchAftersalesList()
    } catch (error) {
      ElMessage.error('撤销失败')
    }
  })
}

// 复制快递单号
const copyTrackingNo = (trackingNo) => {
  navigator.clipboard.writeText(trackingNo).then(() => {
    ElMessage.success('已复制到剪贴板')
  })
}

onMounted(() => {
  fetchAftersalesList()
})
</script>

<style scoped lang="scss">
.purchase-aftersales {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h1 {
      margin: 0;
      font-size: 24px;
      color: #303133;
    }
  }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 20px;

    .stat-card {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      text-align: center;

      .stat-value {
        font-size: 28px;
        font-weight: bold;
        color: #409eff;
        margin-bottom: 8px;

        &.warning {
          color: #e6a23c;
        }

        &.success {
          color: #67c23a;
        }
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
      }
    }
  }

  .search-filter {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .aftersales-list {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);

    .product-info {
      display: flex;
      gap: 12px;

      .product-image {
        width: 60px;
        height: 60px;
        border-radius: 4px;
      }

      .product-detail {
        flex: 1;

        .product-name {
          font-size: 14px;
          color: #303133;
          margin-bottom: 4px;
        }

        .product-spec {
          font-size: 12px;
          color: #909399;
          margin-bottom: 4px;
        }

        .product-price {
          font-size: 13px;
          color: #f56c6c;
        }
      }
    }

    .order-info {
      .order-no {
        font-size: 13px;
        color: #606266;
        margin-bottom: 4px;
      }
    }

    .price {
      color: #f56c6c;
      font-weight: bold;
    }

    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }

  .aftersales-detail {
    padding: 20px;
    background: #f5f7fa;
    border-radius: 4px;

    .detail-section {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: #303133;
        border-left: 3px solid #409eff;
        padding-left: 10px;
      }

      .detail-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;

        .detail-item {
          .label {
            color: #909399;
            font-size: 13px;
          }

          .value {
            color: #606266;
            font-size: 13px;

            &.price {
              color: #f56c6c;
              font-weight: bold;
            }
          }
        }
      }

      .description {
        color: #606266;
        font-size: 13px;
        line-height: 1.6;
        margin: 0 0 12px 0;
      }

      .images {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;

        .problem-image {
          width: 80px;
          height: 80px;
          border-radius: 4px;
          cursor: pointer;
        }
      }
    }
  }

  .form-tip {
    margin-left: 10px;
    color: #909399;
    font-size: 13px;
  }

  .upload-tip {
    margin-top: 8px;
    color: #909399;
    font-size: 12px;
  }

  .aftersale-detail-dialog {
    .detail-section {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }

      h4 {
        margin: 0 0 16px 0;
        font-size: 16px;
        color: #303133;
        border-left: 3px solid #409eff;
        padding-left: 12px;
      }

      .product-info {
        display: flex;
        gap: 16px;
        padding: 16px;
        background: #f5f7fa;
        border-radius: 4px;

        .product-image {
          width: 100px;
          height: 100px;
          border-radius: 4px;
        }

        .product-detail {
          flex: 1;

          .product-name {
            font-size: 16px;
            font-weight: bold;
            color: #303133;
            margin-bottom: 8px;
          }

          .product-spec {
            font-size: 14px;
            color: #909399;
            margin-bottom: 8px;
          }

          .product-price {
            font-size: 16px;
            color: #f56c6c;
            font-weight: bold;
          }
        }
      }

      .description {
        color: #606266;
        font-size: 14px;
        line-height: 1.6;
        margin: 0 0 16px 0;
        padding: 16px;
        background: #f5f7fa;
        border-radius: 4px;
      }

      .images {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        .problem-image {
          width: 100px;
          height: 100px;
          border-radius: 4px;
          cursor: pointer;
        }
      }

      .record-content {
        .record-title {
          font-size: 14px;
          font-weight: bold;
          color: #303133;
          margin-bottom: 4px;
        }

        .record-desc {
          font-size: 14px;
          color: #606266;
          margin-bottom: 4px;
        }

        .record-operator {
          font-size: 12px;
          color: #909399;
        }
      }

      .price {
        color: #f56c6c;
        font-weight: bold;
      }
    }
  }
}
</style>
