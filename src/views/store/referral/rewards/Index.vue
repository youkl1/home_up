<template>
  <div class="referral-rewards">
    <div class="page-header">
      <h1>礼品/佣金核算管理</h1>
    </div>
    
    <!-- 奖励规则查看 -->
    <div class="rule-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>奖励规则查看</span>
          </div>
        </template>
        <div class="rule-content">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="基础奖励规则">
              <div class="rule-item">
                <h4>转介绍奖励规则</h4>
                <ul>
                  <li>转介绍新客户成功下单，转介绍人可获得订单金额5%的佣金奖励</li>
                  <li>转介绍新客户下单金额满5000元，额外奖励200元礼品卡</li>
                  <li>每月转介绍成功3单及以上，额外奖励500元现金红包</li>
                  <li>佣金奖励在客户确认收货后3个工作日内发放</li>
                </ul>
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-card>
    </div>
    
    <!-- 奖励核算列表 -->
    <div class="table-section">
      <el-card shadow="hover">
        <div class="table-header">
          <el-button size="small" type="primary" @click="exportRewards">导出奖励清单</el-button>
        </div>
        <el-table :data="rewards" style="width: 100%">
          <el-table-column prop="id" label="奖励ID" width="120"></el-table-column>
          <el-table-column prop="referrer" label="转介绍人"></el-table-column>
          <el-table-column prop="referee" label="被介绍人"></el-table-column>
          <el-table-column prop="orderId" label="关联订单" width="180"></el-table-column>
          <el-table-column prop="orderAmount" label="订单金额" width="120"></el-table-column>
          <el-table-column prop="rewardAmount" label="奖励金额" width="120"></el-table-column>
          <el-table-column prop="rewardType" label="奖励类型" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.rewardType === 'commission' ? 'primary' : 'success'">
                {{ scope.row.rewardType === 'commission' ? '佣金' : '礼品' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="发放状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="viewRewardDetail(scope.row.id)">查看详情</el-button>
              <el-button size="small" type="primary" v-if="scope.row.status === 'pending'" @click="markIssued(scope.row)">标记发放</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-card>
    </div>
    
    <!-- 标记发放弹窗 -->
    <el-dialog
      v-model="issueDialogVisible"
      title="标记奖励发放"
      width="600px"
    >
      <div class="issue-form">
        <el-form :model="issueForm" label-width="120px">
          <el-form-item label="奖励ID">
            <el-input v-model="issueForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="转介绍人">
            <el-input v-model="issueForm.referrer" disabled></el-input>
          </el-form-item>
          <el-form-item label="奖励金额">
            <el-input v-model="issueForm.rewardAmount" disabled></el-input>
          </el-form-item>
          <el-form-item label="发放时间">
            <el-date-picker
              v-model="issueForm.issueTime"
              type="datetime"
              placeholder="选择发放时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="发放凭证">
            <el-upload
              class="upload-demo"
              action="#"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="issueForm.attachments"
              :auto-upload="false"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  只能上传图片文件，且不超过5MB
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="issueForm.remark" :rows="3" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="issueDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitIssue">提交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 奖励详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="奖励详情"
      width="700px"
    >
      <div class="reward-detail">
        <el-descriptions :column="1" border class="mb-4">
          <el-descriptions-item label="奖励基本信息">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">奖励ID：</span>
                <span class="value">{{ rewardDetail.id }}</span>
              </div>
              <div class="detail-item">
                <span class="label">奖励类型：</span>
                <el-tag :type="rewardDetail.rewardType === 'commission' ? 'primary' : 'success'">
                  {{ rewardDetail.rewardType === 'commission' ? '佣金' : '礼品' }}
                </el-tag>
              </div>
              <div class="detail-item">
                <span class="label">发放状态：</span>
                <el-tag :type="getStatusType(rewardDetail.status)">
                  {{ getStatusText(rewardDetail.status) }}
                </el-tag>
              </div>
              <div class="detail-item">
                <span class="label">创建时间：</span>
                <span class="value">{{ rewardDetail.createTime }}</span>
              </div>
            </div>
          </el-descriptions-item>
          
          <el-descriptions-item label="转介绍信息">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">转介绍人：</span>
                <span class="value">{{ rewardDetail.referrer }}</span>
              </div>
              <div class="detail-item">
                <span class="label">被介绍人：</span>
                <span class="value">{{ rewardDetail.referee }}</span>
              </div>
            </div>
          </el-descriptions-item>
          
          <el-descriptions-item label="订单信息">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">关联订单：</span>
                <span class="value">{{ rewardDetail.orderId }}</span>
              </div>
              <div class="detail-item">
                <span class="label">订单金额：</span>
                <span class="value">{{ rewardDetail.orderAmount }}</span>
              </div>
              <div class="detail-item">
                <span class="label">奖励金额：</span>
                <span class="value text-primary font-bold">{{ rewardDetail.rewardAmount }}</span>
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 发放记录 -->
        <div v-if="rewardDetail.issueRecords && rewardDetail.issueRecords.length > 0" class="issue-records">
          <h4 class="mb-2">发放记录</h4>
          <el-timeline>
            <el-timeline-item
              v-for="(record, index) in rewardDetail.issueRecords"
              :key="index"
              :timestamp="record.time"
              :type="record.type"
              :color="record.color"
            >
              <div class="timeline-content">
                <div class="timeline-title">{{ record.title }}</div>
                <div class="timeline-desc">{{ record.description }}</div>
                <div v-if="record.attachments && record.attachments.length > 0" class="timeline-attachments">
                  <el-image
                    v-for="(attachment, idx) in record.attachments"
                    :key="idx"
                    :src="attachment.url"
                    :preview-src-list="[attachment.url]"
                    style="width: 80px; height: 80px; margin-right: 10px"
                  />
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>

        <!-- 备注信息 -->
        <div v-if="rewardDetail.remark" class="remark-section">
          <h4 class="mb-2">备注信息</h4>
          <el-card shadow="hover" class="remark-card">
            <p>{{ rewardDetail.remark }}</p>
          </el-card>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(80)

// 奖励列表
const rewards = ref([
  { id: 'REW20260401001', referrer: '张女士', referee: '陈女士', orderId: 'ORD20260401001', orderAmount: '¥8,900', rewardAmount: '¥445', rewardType: 'commission', status: 'pending', createTime: '2026-04-02 14:30' },
  { id: 'REW20260401002', referrer: '李先生', referee: '周先生', orderId: 'ORD20260401002', orderAmount: '¥6,500', rewardAmount: '¥325', rewardType: 'commission', status: 'processing', createTime: '2026-04-02 10:15' },
  { id: 'REW20260331001', referrer: '王女士', referee: '吴女士', orderId: 'ORD20260331001', orderAmount: '¥12,000', rewardAmount: '¥600', rewardType: 'commission', status: 'issued', createTime: '2026-03-31 16:45' },
  { id: 'REW20260331002', referrer: '赵先生', referee: '郑先生', orderId: 'ORD20260331002', orderAmount: '¥5,200', rewardAmount: '¥260', rewardType: 'commission', status: 'issued', createTime: '2026-03-31 14:20' },
  { id: 'REW20260330001', referrer: '刘女士', referee: '孙女士', orderId: 'ORD20260330001', orderAmount: '¥8,000', rewardAmount: '¥200', rewardType: 'gift', status: 'pending', createTime: '2026-03-30 11:00' }
])

// 标记发放弹窗
const issueDialogVisible = ref(false)
const issueForm = ref({
  id: '',
  referrer: '',
  rewardAmount: '',
  issueTime: '',
  attachments: [],
  remark: ''
})

// 奖励详情弹窗
const detailDialogVisible = ref(false)
const rewardDetail = ref({
  id: '',
  referrer: '',
  referee: '',
  orderId: '',
  orderAmount: '',
  rewardAmount: '',
  rewardType: '',
  status: '',
  createTime: '',
  issueRecords: [],
  remark: ''
})

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    processing: 'info',
    issued: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    pending: '待发放',
    processing: '处理中',
    issued: '已发放'
  }
  return textMap[status] || status
}

// 导出奖励清单
const exportRewards = () => {
  // 导出奖励清单
  console.log('导出奖励清单')
}

// 查看奖励详情
const viewRewardDetail = (id) => {
  // 模拟获取奖励详情
  rewardDetail.value = {
    id: id,
    referrer: '张女士',
    referee: '陈女士',
    orderId: 'ORD20260401001',
    orderAmount: '¥8,900',
    rewardAmount: '¥445',
    rewardType: 'commission',
    status: 'pending',
    createTime: '2026-04-02 14:30',
    issueRecords: [
      {
        time: '2026-04-02 14:30',
        type: 'primary',
        color: '',
        title: '奖励创建',
        description: '系统自动创建奖励记录',
        attachments: []
      },
      {
        time: '2026-04-02 16:00',
        type: 'info',
        color: '',
        title: '审核通过',
        description: '奖励申请已审核通过',
        attachments: []
      }
    ],
    remark: '该奖励为转介绍新客户成功下单的佣金奖励'
  }
  detailDialogVisible.value = true
}

// 标记发放
const markIssued = (reward) => {
  issueForm.value = {
    id: reward.id,
    referrer: reward.referrer,
    rewardAmount: reward.rewardAmount,
    issueTime: new Date(),
    attachments: [],
    remark: ''
  }
  issueDialogVisible.value = true
}

// 提交发放
const submitIssue = () => {
  // 提交发放记录
  console.log('提交发放记录:', issueForm.value)
  issueDialogVisible.value = false
}

// 上传预览
const handlePreview = (file) => {
  console.log(file)
}

// 上传移除
const handleRemove = (file, fileList) => {
  console.log(file, fileList)
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  // 加载对应页数据
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
  }, 500)
})
</script>

<style scoped>
.referral-rewards {
  padding: 20px 0;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.rule-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rule-content {
  margin-top: 10px;
}

.rule-item h4 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}

.rule-item ul {
  padding-left: 20px;
}

.rule-item li {
  margin-bottom: 5px;
  line-height: 1.5;
}

.table-section {
  margin-bottom: 20px;
}

.table-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.issue-form {
  padding: 20px 0;
}

.upload-demo {
  margin-top: 10px;
}

/* 奖励详情样式 */
.reward-detail {
  padding: 10px 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 10px;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-item .label {
  font-weight: bold;
  color: #666;
  margin-right: 10px;
  min-width: 100px;
}

.detail-item .value {
  color: #333;
  flex: 1;
}

.text-primary {
  color: #409eff;
}

.font-bold {
  font-weight: bold;
}

.issue-records {
  margin-top: 20px;
}

.issue-records h4 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.timeline-content {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-top: 5px;
}

.timeline-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.timeline-desc {
  color: #666;
  margin-bottom: 10px;
}

.timeline-attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.remark-section {
  margin-top: 20px;
}

.remark-section h4 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.remark-card {
  margin-top: 5px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .detail-item .label {
    min-width: auto;
  }
}
</style>