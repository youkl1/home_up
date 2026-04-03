<template>
  <div class="store-settings">
    <div class="page-header">
      <h1>门店基础配置</h1>
    </div>

    <el-tabs v-model="activeTab" type="border-card">
      <!-- 门店信息 -->
      <el-tab-pane label="门店信息" name="info">
        <el-form :model="storeForm" label-width="120px" class="settings-form">
          <el-form-item label="门店名称">
            <el-input v-model="storeForm.name" />
          </el-form-item>
          <el-form-item label="门店编号">
            <el-input v-model="storeForm.code" disabled />
          </el-form-item>
          <el-form-item label="门店地址">
            <el-input v-model="storeForm.address" type="textarea" :rows="2" />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="storeForm.phone" />
          </el-form-item>
          <el-form-item label="营业时间">
            <el-time-picker
              v-model="storeForm.openTime"
              format="HH:mm"
              placeholder="开始时间"
            />
            <span class="time-separator">至</span>
            <el-time-picker
              v-model="storeForm.closeTime"
              format="HH:mm"
              placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="门店简介">
            <el-input v-model="storeForm.introduction" type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveStoreInfo">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 二维码下载 -->
      <el-tab-pane label="二维码下载" name="qrcode">
        <div class="qrcode-section">
          <el-row :gutter="40">
            <el-col :span="8" v-for="qr in qrcodeList" :key="qr.type">
              <div class="qrcode-card">
                <div class="qrcode-image">
                  <img :src="qr.image" :alt="qr.name" />
                </div>
                <div class="qrcode-info">
                  <h4>{{ qr.name }}</h4>
                  <p>{{ qr.description }}</p>
                  <el-button type="primary" @click="downloadQrcode(qr)">
                    <el-icon><Download /></el-icon>
                    下载二维码
                  </el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <!-- 消息配置 -->
      <el-tab-pane label="消息配置" name="message">
        <el-form :model="messageForm" label-width="150px" class="settings-form">
          <el-divider>短信通知</el-divider>
          <el-form-item label="订单状态变更">
            <el-switch v-model="messageForm.orderSms" />
          </el-form-item>
          <el-form-item label="客户预约提醒">
            <el-switch v-model="messageForm.appointmentSms" />
          </el-form-item>
          <el-form-item label="安装服务提醒">
            <el-switch v-model="messageForm.installSms" />
          </el-form-item>

          <el-divider>站内消息</el-divider>
          <el-form-item label="新订单提醒">
            <el-switch v-model="messageForm.newOrderNotify" />
          </el-form-item>
          <el-form-item label="售后申请提醒">
            <el-switch v-model="messageForm.aftersaleNotify" />
          </el-form-item>
          <el-form-item label="系统公告">
            <el-switch v-model="messageForm.systemNotify" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="saveMessageSettings">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 安装服务配置 -->
      <el-tab-pane label="安装服务配置" name="install">
        <el-form :model="installForm" label-width="150px" class="settings-form">
          <el-form-item label="安装服务范围">
            <el-checkbox-group v-model="installForm.serviceTypes">
              <el-checkbox label="furniture">家具安装</el-checkbox>
              <el-checkbox label="custom">定制安装</el-checkbox>
              <el-checkbox label="lighting">灯具安装</el-checkbox>
              <el-checkbox label="curtain">窗帘安装</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="服务区域">
            <el-select v-model="installForm.serviceArea" multiple placeholder="选择服务区域">
              <el-option label="本市市区" value="urban" />
              <el-option label="本市郊区" value="suburb" />
              <el-option label="周边县市" value="county" />
            </el-select>
          </el-form-item>
          <el-form-item label="基础安装费">
            <el-input-number v-model="installForm.baseFee" :min="0" :precision="2" />
            <span class="form-unit">元</span>
          </el-form-item>
          <el-form-item label="上门测量费">
            <el-input-number v-model="installForm.measureFee" :min="0" :precision="2" />
            <span class="form-unit">元</span>
          </el-form-item>
          <el-form-item label="预约提前时间">
            <el-input-number v-model="installForm.advanceHours" :min="1" :max="72" />
            <span class="form-unit">小时</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveInstallSettings">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 收款账户管理 -->
      <el-tab-pane label="收款账户管理" name="payment">
        <div class="payment-accounts">
          <div class="account-header">
            <el-button type="primary" @click="showAddAccountDialog">
              <el-icon><Plus /></el-icon>
              添加收款账户
            </el-button>
          </div>
          <el-table :data="paymentAccounts" stripe>
            <el-table-column prop="accountName" label="账户名称" />
            <el-table-column prop="accountType" label="账户类型">
              <template #default="{ row }">
                <el-tag>{{ row.accountType }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="accountNo" label="账号" />
            <el-table-column prop="bankName" label="开户行" />
            <el-table-column prop="isDefault" label="默认账户">
              <template #default="{ row }">
                <el-tag v-if="row.isDefault" type="success">是</el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button link type="primary" @click="setDefaultAccount(row)" v-if="!row.isDefault">
                  设为默认
                </el-button>
                <el-button link type="primary" @click="editAccount(row)">编辑</el-button>
                <el-button link type="danger" @click="deleteAccount(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加/编辑账户弹窗 -->
    <el-dialog
      v-model="accountDialogVisible"
      :title="isEditing ? '编辑收款账户' : '添加收款账户'"
      width="500px"
    >
      <el-form :model="accountForm" label-width="100px" :rules="accountRules" ref="accountFormRef">
        <el-form-item label="账户类型" prop="accountType">
          <el-radio-group v-model="accountForm.accountType">
            <el-radio-button label="bank">银行账户</el-radio-button>
            <el-radio-button label="alipay">支付宝</el-radio-button>
            <el-radio-button label="wechat">微信支付</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账户名称" prop="accountName">
          <el-input v-model="accountForm.accountName" placeholder="请输入账户名称" />
        </el-form-item>
        <el-form-item label="账号" prop="accountNo">
          <el-input v-model="accountForm.accountNo" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="开户行" prop="bankName" v-if="accountForm.accountType === 'bank'">
          <el-input v-model="accountForm.bankName" placeholder="请输入开户行" />
        </el-form-item>
        <el-form-item label="设为默认">
          <el-switch v-model="accountForm.isDefault" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="accountDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAccount">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Plus } from '@element-plus/icons-vue'

import placeholderImage from '../../../assets/images/placeholder.png'

const activeTab = ref('info')
const isEditing = ref(false)
const accountDialogVisible = ref(false)
const accountFormRef = ref(null)

// 门店信息表单
const storeForm = reactive({
  name: 'HomeUp旗舰店',
  code: 'STORE001',
  address: '北京市朝阳区建国路88号',
  phone: '010-12345678',
  openTime: new Date(2024, 0, 1, 9, 0),
  closeTime: new Date(2024, 0, 1, 18, 0),
  introduction: 'HomeUp家居旗舰店，提供全屋定制、家具销售、安装服务一站式服务。'
})

// 二维码列表
const qrcodeList = reactive([
  {
    type: 'store',
    name: '门店主页二维码',
    description: '客户扫码可查看门店主页和产品信息',
    image: placeholderImage
  },
  {
    type: 'appointment',
    name: '预约到店二维码',
    description: '客户扫码可预约到店时间和咨询',
    image: placeholderImage
  },
  {
    type: 'referral',
    name: '转介绍二维码',
    description: '客户扫码可进行转介绍推荐',
    image: placeholderImage
  }
])

// 消息配置表单
const messageForm = reactive({
  orderSms: true,
  appointmentSms: true,
  installSms: true,
  newOrderNotify: true,
  aftersaleNotify: true,
  systemNotify: true
})

// 安装服务配置
const installForm = reactive({
  serviceTypes: ['furniture', 'custom'],
  serviceArea: ['urban', 'suburb'],
  baseFee: 100,
  measureFee: 50,
  advanceHours: 24
})

// 收款账户列表
const paymentAccounts = reactive([
  {
    id: 1,
    accountName: '门店对公账户',
    accountType: '银行账户',
    accountNo: '6222 **** **** 8888',
    bankName: '中国工商银行',
    isDefault: true
  },
  {
    id: 2,
    accountName: '门店支付宝',
    accountType: '支付宝',
    accountNo: 'store@homeup.com',
    bankName: '-',
    isDefault: false
  }
])

// 账户表单
const accountForm = reactive({
  accountType: 'bank',
  accountName: '',
  accountNo: '',
  bankName: '',
  isDefault: false
})

const accountRules = {
  accountType: [{ required: true, message: '请选择账户类型', trigger: 'change' }],
  accountName: [{ required: true, message: '请输入账户名称', trigger: 'blur' }],
  accountNo: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  bankName: [{ required: true, message: '请输入开户行', trigger: 'blur' }]
}

// 方法
const saveStoreInfo = () => {
  ElMessage.success('门店信息保存成功')
}

const downloadQrcode = (qr) => {
  ElMessage.success(`正在下载 ${qr.name}`)
}

const saveMessageSettings = () => {
  ElMessage.success('消息配置保存成功')
}

const saveInstallSettings = () => {
  ElMessage.success('安装服务配置保存成功')
}

const showAddAccountDialog = () => {
  isEditing.value = false
  Object.assign(accountForm, {
    accountType: 'bank',
    accountName: '',
    accountNo: '',
    bankName: '',
    isDefault: false
  })
  accountDialogVisible.value = true
}

const editAccount = (row) => {
  isEditing.value = true
  Object.assign(accountForm, row)
  accountDialogVisible.value = true
}

const saveAccount = async () => {
  const valid = await accountFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  if (isEditing.value) {
    ElMessage.success('账户更新成功')
  } else {
    paymentAccounts.push({
      id: Date.now(),
      ...accountForm,
      accountType: accountForm.accountType === 'bank' ? '银行账户' : accountForm.accountType === 'alipay' ? '支付宝' : '微信支付'
    })
    ElMessage.success('账户添加成功')
  }
  accountDialogVisible.value = false
}

const setDefaultAccount = (row) => {
  paymentAccounts.forEach(acc => acc.isDefault = false)
  row.isDefault = true
  ElMessage.success('默认账户设置成功')
}

const deleteAccount = (row) => {
  const index = paymentAccounts.findIndex(acc => acc.id === row.id)
  if (index > -1) {
    paymentAccounts.splice(index, 1)
    ElMessage.success('账户删除成功')
  }
}
</script>

<style scoped lang="scss">
.store-settings {
  padding: 20px;

  .page-header {
    margin-bottom: 20px;

    h1 {
      margin: 0;
      font-size: 24px;
    }
  }

  .settings-form {
    max-width: 600px;
    padding: 20px;

    .time-separator {
      margin: 0 10px;
      color: #909399;
    }

    .form-unit {
      margin-left: 10px;
      color: #909399;
    }
  }

  .qrcode-section {
    padding: 40px 20px;

    .qrcode-card {
      text-align: center;
      padding: 30px;
      background: #f5f7fa;
      border-radius: 8px;

      .qrcode-image {
        width: 200px;
        height: 200px;
        margin: 0 auto 20px;
        background: #fff;
        padding: 10px;
        border-radius: 8px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      h4 {
        margin: 0 0 10px 0;
        font-size: 16px;
      }

      p {
        font-size: 13px;
        color: #909399;
        margin-bottom: 20px;
      }
    }
  }

  .payment-accounts {
    padding: 20px;

    .account-header {
      margin-bottom: 20px;
    }
  }
}
</style>
