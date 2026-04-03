<template>
  <div class="guide-accounts">
    <div class="page-header">
      <h1>导购账号管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="showAddDialog">
          <el-icon><Plus /></el-icon>
          添加导购
        </el-button>
        <el-button @click="showBatchDialog">
          <el-icon><FolderOpened /></el-icon>
          批量操作
        </el-button>
      </div>
    </div>
    
    <!-- 统计卡片 -->
    <div class="stats-row">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">导购总数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card active">
            <div class="stat-value">{{ stats.active }}</div>
            <div class="stat-label">在职导购</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card inactive">
            <div class="stat-value">{{ stats.inactive }}</div>
            <div class="stat-label">已离职</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ stats.newThisMonth }}</div>
            <div class="stat-label">本月新增</div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input 
              v-model="searchForm.keyword" 
              placeholder="搜索姓名/电话/工号" 
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="5">
            <el-select v-model="searchForm.status" placeholder="账号状态" clearable>
              <el-option label="在职" value="active" />
              <el-option label="已离职" value="inactive" />
              <el-option label="禁用" value="disabled" />
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-select v-model="searchForm.role" placeholder="角色权限" clearable>
              <el-option label="高级导购" value="senior" />
              <el-option label="普通导购" value="normal" />
              <el-option label="实习导购" value="intern" />
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-select v-model="searchForm.hasInstaller" placeholder="师傅关联" clearable>
              <el-option label="已关联师傅" value="yes" />
              <el-option label="未关联师傅" value="no" />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 导购列表 -->
    <div class="guide-list">
      <el-card shadow="hover">
        <el-table 
          :data="guides" 
          style="width: 100%"
          v-loading="loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="employeeNo" label="工号" width="100" />
          <el-table-column label="导购信息" min-width="180">
            <template #default="{ row }">
              <div class="guide-info">
                <el-avatar :size="40" :src="row.avatar">{{ row.name.charAt(0) }}</el-avatar>
                <div class="info-detail">
                  <div class="name">{{ row.name }}</div>
                  <div class="phone">{{ row.phone }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="role" label="角色" width="120">
            <template #default="{ row }">
              <el-tag :type="getRoleType(row.role)">{{ getRoleText(row.role) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="关联师傅" width="150">
            <template #default="{ row }">
              <div v-if="row.installers && row.installers.length > 0">
                <el-tag 
                  v-for="installer in row.installers.slice(0, 2)" 
                  :key="installer.id"
                  size="small"
                  class="installer-tag"
                >
                  {{ installer.name }}
                </el-tag>
                <el-tag v-if="row.installers.length > 2" size="small">+{{ row.installers.length - 2 }}</el-tag>
              </div>
              <span v-else class="no-data">未关联</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerCount" label="客户数" width="100" align="center" />
          <el-table-column prop="orderCount" label="订单数" width="100" align="center" />
          <el-table-column prop="createTime" label="入职时间" width="160" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-switch
                v-model="row.status"
                active-value="active"
                inactive-value="disabled"
                @change="(val) => handleStatusChange(row, val)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button link type="primary" @click="handlePermission(row)">权限</el-button>
              <el-button link type="primary" @click="handleInstaller(row)">关联师傅</el-button>
              <el-button 
                link 
                type="danger" 
                v-if="row.status === 'active'"
                @click="handleResignation(row)"
              >
                离职
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </el-card>
    </div>
    
    <!-- 添加/编辑导购弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑导购' : '添加导购'"
      width="700px"
      destroy-on-close
    >
      <el-form 
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formData.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号" prop="employeeNo">
              <el-input 
                v-model="formData.employeeNo" 
                placeholder="系统自动生成"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色" prop="role">
              <el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%">
                <el-option label="高级导购" value="senior" />
                <el-option label="普通导购" value="normal" />
                <el-option label="实习导购" value="intern" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期" prop="entryDate">
              <el-date-picker 
                v-model="formData.entryDate" 
                type="date" 
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="权限配置" prop="permissions">
          <el-checkbox-group v-model="formData.permissions">
            <el-checkbox label="customer_view">查看客户</el-checkbox>
            <el-checkbox label="customer_edit">编辑客户</el-checkbox>
            <el-checkbox label="order_view">查看订单</el-checkbox>
            <el-checkbox label="order_edit">编辑订单</el-checkbox>
            <el-checkbox label="product_view">查看产品</el-checkbox>
            <el-checkbox label="report_view">查看报表</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input 
            v-model="formData.remark" 
            type="textarea" 
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
    
    <!-- 权限配置弹窗 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="权限配置"
      width="600px"
    >
      <div class="permission-config">
        <h4>{{ currentGuide.name }} - 权限设置</h4>
        <el-divider />
        <el-form :model="permissionForm" label-width="120px">
          <el-form-item label="角色模板">
            <el-select v-model="permissionForm.roleTemplate" placeholder="选择角色模板" @change="applyRoleTemplate">
              <el-option label="高级导购" value="senior" />
              <el-option label="普通导购" value="normal" />
              <el-option label="实习导购" value="intern" />
              <el-option label="自定义" value="custom" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="permission-groups">
          <div class="permission-group" v-for="group in permissionGroups" :key="group.key">
            <div class="group-title">{{ group.name }}</div>
            <el-checkbox-group v-model="permissionForm.permissions">
              <el-checkbox 
                v-for="perm in group.permissions" 
                :key="perm.key"
                :label="perm.key"
              >
                {{ perm.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermissions" :loading="submitting">保存</el-button>
      </template>
    </el-dialog>
    
    <!-- 关联安装师傅弹窗 -->
    <el-dialog
      v-model="installerDialogVisible"
      title="关联安装师傅"
      width="800px"
    >
      <div class="installer-assign">
        <div class="current-guide">
          <span>当前导购：{{ currentGuide.name }}</span>
          <el-tag v-if="currentGuide.installers && currentGuide.installers.length > 0">
            已关联 {{ currentGuide.installers.length }} 位师傅
          </el-tag>
        </div>
        
        <!-- 已关联师傅列表 -->
        <div class="assigned-installers" v-if="currentGuide.installers && currentGuide.installers.length > 0">
          <div class="section-title">已关联师傅</div>
          <el-table :data="currentGuide.installers" size="small">
            <el-table-column prop="name" label="师傅姓名" />
            <el-table-column prop="phone" label="联系电话" />
            <el-table-column prop="serviceArea" label="服务区域" />
            <el-table-column prop="relationType" label="关联类型">
              <template #default="{ row }">
                <el-tag :type="row.relationType === 'exclusive' ? 'success' : 'info'">
                  {{ row.relationType === 'exclusive' ? '专属师傅' : '合作师傅' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button link type="danger" @click="removeInstaller(row)">解除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <!-- 添加关联 -->
        <div class="add-installer">
          <div class="section-title">添加关联</div>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-select 
                v-model="installerForm.installerId" 
                placeholder="选择安装师傅"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="installer in availableInstallers"
                  :key="installer.id"
                  :label="installer.name + ' - ' + installer.serviceArea"
                  :value="installer.id"
                />
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-radio-group v-model="installerForm.relationType">
                <el-radio-button label="exclusive">专属师傅</el-radio-button>
                <el-radio-button label="cooperation">合作师傅</el-radio-button>
              </el-radio-group>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="addInstaller">添加关联</el-button>
            </el-col>
          </el-row>
        </div>
        
        <!-- 批量关联 -->
        <div class="batch-assign">
          <div class="section-title">批量关联</div>
          <el-button @click="showBatchAssignDialog">
            <el-icon><Connection /></el-icon>
            批量绑定师傅
          </el-button>
        </div>
      </div>
    </el-dialog>
    
    <!-- 离职交接弹窗 -->
    <el-dialog
      v-model="resignationDialogVisible"
      title="离职交接"
      width="900px"
    >
      <div class="resignation-handover">
        <div class="guide-info">
          <el-descriptions :column="3" border>
            <el-descriptions-item label="导购姓名">{{ currentGuide.name }}</el-descriptions-item>
            <el-descriptions-item label="工号">{{ currentGuide.employeeNo }}</el-descriptions-item>
            <el-descriptions-item label="客户数">{{ currentGuide.customerCount || 0 }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <el-steps :active="handoverStep" finish-status="success" class="handover-steps">
          <el-step title="客户资源交接" />
          <el-step title="订单交接" />
          <el-step title="确认完成" />
        </el-steps>
        
        <!-- 步骤1：客户资源交接 -->
        <div v-if="handoverStep === 0" class="step-content">
          <div class="step-header">
            <span>待交接客户：{{ handoverData.customers.length }}人</span>
            <div class="step-actions">
              <el-button size="small" @click="autoAssignCustomers">自动分配</el-button>
              <el-button size="small" type="primary" @click="manualAssignCustomers">手动分配</el-button>
            </div>
          </div>
          <el-table :data="handoverData.customers" size="small" height="300">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="客户姓名" />
            <el-table-column prop="phone" label="联系电话" />
            <el-table-column prop="level" label="客户等级">
              <template #default="{ row }">
                <el-tag :type="row.level === 'A' ? 'danger' : row.level === 'B' ? 'warning' : 'info'">
                  {{ row.level }}级
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="followStatus" label="跟进状态" />
            <el-table-column label="接收人" width="150">
              <template #default="{ row }">
                <el-select v-model="row.receiverId" placeholder="选择" size="small">
                  <el-option 
                    v-for="guide in activeGuides.filter(g => g.id !== currentGuide.id)" 
                    :key="guide.id"
                    :label="guide.name"
                    :value="guide.id"
                  />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <!-- 步骤2：订单交接 -->
        <div v-if="handoverStep === 1" class="step-content">
          <div class="step-header">
            <span>待交接订单：{{ handoverData.orders.length }}个</span>
          </div>
          <el-table :data="handoverData.orders" size="small" height="300">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="orderNo" label="订单号" />
            <el-table-column prop="customerName" label="客户姓名" />
            <el-table-column prop="amount" label="订单金额" />
            <el-table-column prop="status" label="订单状态" />
            <el-table-column label="接收人" width="150">
              <template #default="{ row }">
                <el-select v-model="row.receiverId" placeholder="选择" size="small">
                  <el-option 
                    v-for="guide in activeGuides.filter(g => g.id !== currentGuide.id)" 
                    :key="guide.id"
                    :label="guide.name"
                    :value="guide.id"
                  />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <!-- 步骤3：确认完成 -->
        <div v-if="handoverStep === 2" class="step-content">
          <div class="confirm-content">
            <el-result icon="success" title="交接清单">
              <template #sub-title>
                <div class="handover-summary">
                  <p>交接客户：{{ handoverData.customers.filter(c => c.receiverId).length }}人</p>
                  <p>交接订单：{{ handoverData.orders.filter(o => o.receiverId).length }}个</p>
                  <p>权限回收：{{ currentGuide.permissions ? currentGuide.permissions.length : 0 }}项</p>
                </div>
              </template>
            </el-result>
            <el-form :model="handoverConfirm" label-width="120px">
              <el-form-item label="离职日期" required>
                <el-date-picker v-model="handoverConfirm.resignDate" type="date" placeholder="选择日期" />
              </el-form-item>
              <el-form-item label="交接人">
                <el-input v-model="handoverConfirm.handoverPerson" disabled />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="handoverConfirm.remark" type="textarea" :rows="3" />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button v-if="handoverStep > 0" @click="handoverStep--">上一步</el-button>
        <el-button v-if="handoverStep < 2" type="primary" @click="handoverStep++">下一步</el-button>
        <el-button v-if="handoverStep === 2" type="success" @click="completeHandover" :loading="submitting">
          确认交接
        </el-button>
      </template>
    </el-dialog>
    
    <!-- 批量操作弹窗 -->
    <el-dialog
      v-model="batchDialogVisible"
      title="批量操作"
      width="500px"
    >
      <div class="batch-operation">
        <p>已选择 {{ selectedGuides.length }} 位导购</p>
        <el-form label-width="100px">
          <el-form-item label="操作类型">
            <el-radio-group v-model="batchForm.operation">
              <el-radio-button label="status">修改状态</el-radio-button>
              <el-radio-button label="role">修改角色</el-radio-button>
              <el-radio-button label="delete">批量删除</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="新状态" v-if="batchForm.operation === 'status'">
            <el-select v-model="batchForm.status">
              <el-option label="启用" value="active" />
              <el-option label="禁用" value="disabled" />
            </el-select>
          </el-form-item>
          <el-form-item label="新角色" v-if="batchForm.operation === 'role'">
            <el-select v-model="batchForm.role">
              <el-option label="高级导购" value="senior" />
              <el-option label="普通导购" value="normal" />
              <el-option label="实习导购" value="intern" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="batchDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="executeBatch" :loading="submitting">执行</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, FolderOpened, Search, Connection } from '@element-plus/icons-vue'

// 统计数据
const stats = reactive({
  total: 12,
  active: 10,
  inactive: 2,
  newThisMonth: 3
})

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: '',
  role: '',
  hasInstaller: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 12
})

// 加载状态
const loading = ref(false)
const submitting = ref(false)

// 导购列表
const guides = ref([
  {
    id: 1,
    employeeNo: 'GD001',
    name: '张小明',
    phone: '138****1234',
    avatar: '',
    role: 'senior',
    installers: [
      { id: 1, name: '李师傅', phone: '139****5678', serviceArea: '朝阳区', relationType: 'exclusive' },
      { id: 2, name: '王师傅', phone: '137****9012', serviceArea: '海淀区', relationType: 'cooperation' }
    ],
    customerCount: 45,
    orderCount: 28,
    createTime: '2024-01-15',
    status: 'active',
    permissions: ['customer_view', 'customer_edit', 'order_view', 'order_edit', 'product_view', 'report_view']
  },
  {
    id: 2,
    employeeNo: 'GD002',
    name: '李小红',
    phone: '139****5678',
    avatar: '',
    role: 'normal',
    installers: [],
    customerCount: 32,
    orderCount: 18,
    createTime: '2024-03-20',
    status: 'active',
    permissions: ['customer_view', 'order_view', 'product_view']
  },
  {
    id: 3,
    employeeNo: 'GD003',
    name: '王小强',
    phone: '137****9012',
    avatar: '',
    role: 'intern',
    installers: [{ id: 3, name: '赵师傅', phone: '136****3456', serviceArea: '东城区', relationType: 'cooperation' }],
    customerCount: 15,
    orderCount: 8,
    createTime: '2024-06-01',
    status: 'active',
    permissions: ['customer_view', 'product_view']
  }
])

// 在职导购列表（用于交接）
const activeGuides = computed(() => guides.value.filter(g => g.status === 'active'))

// 安装师傅列表
const installers = ref([
  { id: 1, name: '李师傅', phone: '139****5678', serviceArea: '朝阳区' },
  { id: 2, name: '王师傅', phone: '137****9012', serviceArea: '海淀区' },
  { id: 3, name: '赵师傅', phone: '136****3456', serviceArea: '东城区' },
  { id: 4, name: '刘师傅', phone: '135****7890', serviceArea: '西城区' },
  { id: 5, name: '陈师傅', phone: '134****2468', serviceArea: '丰台区' }
])

// 可用师傅（未关联的）
const availableInstallers = computed(() => {
  const assignedIds = currentGuide.value.installers?.map(i => i.id) || []
  return installers.value.filter(i => !assignedIds.includes(i.id))
})

// 弹窗控制
const dialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const installerDialogVisible = ref(false)
const resignationDialogVisible = ref(false)
const batchDialogVisible = ref(false)
const isEditing = ref(false)

// 当前操作对象
const currentGuide = ref({})
const selectedGuides = ref([])

// 表单引用
const formRef = ref(null)

// 表单数据
const formData = reactive({
  id: null,
  name: '',
  employeeNo: '',
  phone: '',
  email: '',
  role: 'normal',
  entryDate: '',
  permissions: [],
  remark: ''
})

// 表单校验规则
const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  entryDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }]
}

// 权限配置
const permissionForm = reactive({
  roleTemplate: '',
  permissions: []
})

const permissionGroups = [
  {
    key: 'customer',
    name: '客户管理',
    permissions: [
      { key: 'customer_view', name: '查看客户' },
      { key: 'customer_edit', name: '编辑客户' },
      { key: 'customer_delete', name: '删除客户' },
      { key: 'customer_assign', name: '分配客户' }
    ]
  },
  {
    key: 'order',
    name: '订单管理',
    permissions: [
      { key: 'order_view', name: '查看订单' },
      { key: 'order_edit', name: '编辑订单' },
      { key: 'order_create', name: '创建订单' },
      { key: 'order_cancel', name: '取消订单' }
    ]
  },
  {
    key: 'product',
    name: '产品管理',
    permissions: [
      { key: 'product_view', name: '查看产品' },
      { key: 'product_recommend', name: '产品推荐' }
    ]
  },
  {
    key: 'report',
    name: '报表统计',
    permissions: [
      { key: 'report_view', name: '查看报表' },
      { key: 'report_export', name: '导出报表' }
    ]
  }
]

// 关联师傅表单
const installerForm = reactive({
  installerId: '',
  relationType: 'exclusive'
})

// 离职交接
const handoverStep = ref(0)
const handoverData = reactive({
  customers: [],
  orders: []
})
const handoverConfirm = reactive({
  resignDate: '',
  handoverPerson: '当前用户',
  remark: ''
})

// 批量操作
const batchForm = reactive({
  operation: 'status',
  status: '',
  role: ''
})

// 角色相关
const getRoleType = (role) => {
  const map = { senior: 'danger', normal: 'primary', intern: 'info' }
  return map[role] || 'info'
}

const getRoleText = (role) => {
  const map = { senior: '高级导购', normal: '普通导购', intern: '实习导购' }
  return map[role] || role
}

// 搜索和重置
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('搜索完成')
  }, 500)
}

const handleReset = () => {
  Object.keys(searchForm).forEach(key => searchForm[key] = '')
}

// 分页
const handleSizeChange = (size) => {
  pagination.pageSize = size
  handleSearch()
}

const handlePageChange = (page) => {
  pagination.page = page
  handleSearch()
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedGuides.value = selection
}

// 添加/编辑
const showAddDialog = () => {
  isEditing.value = false
  Object.assign(formData, {
    id: null,
    name: '',
    employeeNo: '',
    phone: '',
    email: '',
    role: 'normal',
    entryDate: '',
    permissions: [],
    remark: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEditing.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    dialogVisible.value = false
    ElMessage.success(isEditing.value ? '编辑成功' : '添加成功')
  }, 500)
}

// 状态变更
const handleStatusChange = (row, val) => {
  const action = val === 'active' ? '启用' : '禁用'
  ElMessageBox.confirm(`确定要${action}该账号吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success(`${action}成功`)
  }).catch(() => {
    row.status = val === 'active' ? 'disabled' : 'active'
  })
}

// 权限配置
const handlePermission = (row) => {
  currentGuide.value = row
  permissionForm.roleTemplate = row.role
  permissionForm.permissions = row.permissions || []
  permissionDialogVisible.value = true
}

const applyRoleTemplate = (template) => {
  const templatePermissions = {
    senior: ['customer_view', 'customer_edit', 'customer_delete', 'customer_assign', 'order_view', 'order_edit', 'order_create', 'order_cancel', 'product_view', 'product_recommend', 'report_view', 'report_export'],
    normal: ['customer_view', 'customer_edit', 'order_view', 'order_edit', 'product_view', 'report_view'],
    intern: ['customer_view', 'order_view', 'product_view']
  }
  permissionForm.permissions = templatePermissions[template] || []
}

const savePermissions = () => {
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    permissionDialogVisible.value = false
    ElMessage.success('权限保存成功')
  }, 500)
}

// 关联师傅
const handleInstaller = (row) => {
  currentGuide.value = row
  installerForm.installerId = ''
  installerForm.relationType = 'exclusive'
  installerDialogVisible.value = true
}

const addInstaller = () => {
  if (!installerForm.installerId) {
    ElMessage.warning('请选择师傅')
    return
  }
  const installer = installers.value.find(i => i.id === installerForm.installerId)
  if (installer) {
    if (!currentGuide.value.installers) currentGuide.value.installers = []
    currentGuide.value.installers.push({
      ...installer,
      relationType: installerForm.relationType
    })
    ElMessage.success('关联成功')
    installerForm.installerId = ''
  }
}

const removeInstaller = (installer) => {
  const index = currentGuide.value.installers.findIndex(i => i.id === installer.id)
  if (index > -1) {
    currentGuide.value.installers.splice(index, 1)
    ElMessage.success('已解除关联')
  }
}

const showBatchAssignDialog = () => {
  ElMessage.info('批量关联功能开发中')
}

// 离职交接
const handleResignation = (row) => {
  currentGuide.value = row
  handoverStep.value = 0
  handoverData.customers = [
    { id: 1, name: '客户A', phone: '138****1111', level: 'A', followStatus: '意向强烈', receiverId: '' },
    { id: 2, name: '客户B', phone: '139****2222', level: 'B', followStatus: '考虑中', receiverId: '' },
    { id: 3, name: '客户C', phone: '137****3333', level: 'C', followStatus: '初步接触', receiverId: '' }
  ]
  handoverData.orders = [
    { id: 1, orderNo: 'ORD2024001', customerName: '客户A', amount: '¥15,000', status: '待签约', receiverId: '' },
    { id: 2, orderNo: 'ORD2024002', customerName: '客户B', amount: '¥28,000', status: '生产中', receiverId: '' }
  ]
  resignationDialogVisible.value = true
}

const autoAssignCustomers = () => {
  const activeGuideList = activeGuides.value.filter(g => g.id !== currentGuide.value.id)
  handoverData.customers.forEach((customer, index) => {
    customer.receiverId = activeGuideList[index % activeGuideList.length]?.id
  })
  ElMessage.success('已自动分配')
}

const manualAssignCustomers = () => {
  ElMessage.info('请在下拉框中选择接收人')
}

const completeHandover = () => {
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    resignationDialogVisible.value = false
    ElMessage.success('离职交接完成')
  }, 500)
}

// 批量操作
const showBatchDialog = () => {
  if (selectedGuides.value.length === 0) {
    ElMessage.warning('请先选择要操作的导购')
    return
  }
  batchDialogVisible.value = true
}

const executeBatch = () => {
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    batchDialogVisible.value = false
    ElMessage.success('批量操作完成')
  }, 500)
}

onMounted(() => {
  handleSearch()
})
</script>

<style scoped lang="scss">
.guide-accounts {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h1 {
      margin: 0;
      font-size: 24px;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }
  }

  .stats-row {
    margin-bottom: 20px;

    .stat-card {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);

      .stat-value {
        font-size: 28px;
        font-weight: bold;
        color: #409eff;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
      }

      &.active .stat-value {
        color: #67c23a;
      }

      &.inactive .stat-value {
        color: #f56c6c;
      }
    }
  }

  .search-filter {
    margin-bottom: 20px;
  }

  .guide-list {
    .guide-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .info-detail {
        .name {
          font-weight: 500;
          color: #303133;
        }

        .phone {
          font-size: 12px;
          color: #909399;
        }
      }
    }

    .installer-tag {
      margin-right: 5px;
    }

    .no-data {
      color: #909399;
      font-size: 13px;
    }

    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }

  .permission-config {
    h4 {
      margin: 0 0 10px 0;
    }

    .permission-groups {
      .permission-group {
        margin-bottom: 20px;

        .group-title {
          font-weight: 500;
          margin-bottom: 10px;
          color: #303133;
        }
      }
    }
  }

  .installer-assign {
    .current-guide {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
      padding: 15px;
      background: #f5f7fa;
      border-radius: 4px;
    }

    .section-title {
      font-weight: 500;
      margin-bottom: 15px;
      color: #303133;
    }

    .assigned-installers {
      margin-bottom: 20px;
    }

    .add-installer {
      margin-bottom: 20px;
    }
  }

  .resignation-handover {
    .guide-info {
      margin-bottom: 20px;
    }

    .handover-steps {
      margin-bottom: 30px;
    }

    .step-content {
      .step-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;

        .step-actions {
          display: flex;
          gap: 10px;
        }
      }
    }

    .confirm-content {
      .handover-summary {
        text-align: left;
        padding: 0 20px;

        p {
          margin: 5px 0;
          color: #606266;
        }
      }
    }
  }

  .batch-operation {
    p {
      margin-bottom: 20px;
      color: #606266;
    }
  }
}
</style>
