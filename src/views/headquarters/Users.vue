<template>
  <div class="headquarters-users">
    <div class="page-header">
      <h1>用户管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="addUser">添加用户</el-button>
        <el-button type="success" @click="batchEnable" :disabled="selectedUsers.length === 0">批量启用</el-button>
        <el-button type="danger" @click="batchDisable" :disabled="selectedUsers.length === 0">批量禁用</el-button>
        <el-button type="warning" @click="batchDelete" :disabled="selectedUsers.length === 0">批量删除</el-button>
      </div>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索用户姓名或电话" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="roleId" placeholder="选择角色">
              <el-option label="全部" value=""></el-option>
              <el-option label="超级管理员" value="1"></el-option>
              <el-option label="门店管理员" value="2"></el-option>
              <el-option label="导购员" value="3"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 用户列表 -->
    <div class="user-list">
      <el-card shadow="hover">
        <el-table :data="users" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="用户ID" width="80"></el-table-column>
          <el-table-column prop="name" label="用户姓名"></el-table-column>
          <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
          <el-table-column prop="role" label="角色" width="120"></el-table-column>
          <el-table-column prop="store" label="所属门店" width="150"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === '启用' ? 'success' : 'danger'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewUser(scope.row)">查看</el-button>
              <el-button type="success" size="small" @click="editUser(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteUser(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-card>
    </div>
    
    <!-- 添加/编辑用户弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form :model="userForm" label-width="100px">
        <el-form-item label="用户姓名">
          <el-input v-model="userForm.name" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="userForm.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="userForm.roleId">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="门店管理员" value="2"></el-option>
            <el-option label="导购员" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属门店">
          <el-select v-model="userForm.store">
            <el-option label="总部" value="总部"></el-option>
            <el-option label="北京旗舰店" value="北京旗舰店"></el-option>
            <el-option label="上海中心店" value="上海中心店"></el-option>
            <el-option label="广州天河店" value="广州天河店"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="userForm.status" active-text="启用" inactive-text="禁用"></el-switch>
        </el-form-item>
        <el-form-item label="密码" v-if="!userForm.id">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUser">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 查看用户详情弹窗 -->
    <el-dialog
      v-model="viewDialogVisible"
      :title="viewForm.name || '用户详情'"
      width="600px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户ID">{{ viewForm.id }}</el-descriptions-item>
        <el-descriptions-item label="用户姓名">{{ viewForm.name }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ viewForm.phone }}</el-descriptions-item>
        <el-descriptions-item label="角色">{{ viewForm.role }}</el-descriptions-item>
        <el-descriptions-item label="所属门店">{{ viewForm.store }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ viewForm.status }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const roleId = ref('')

// 弹窗相关
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const dialogTitle = ref('添加用户')

// 用户表单
const userForm = ref({
  id: null,
  name: '',
  phone: '',
  roleId: '3',
  store: '总部',
  status: true,
  password: ''
})

// 查看表单
const viewForm = ref({
  id: null,
  name: '',
  phone: '',
  role: '',
  store: '',
  status: ''
})

// 多选用户
const selectedUsers = ref([])

// 处理选择变化
const handleSelectionChange = (val) => {
  selectedUsers.value = val
}

// 角色映射
const roleMap = {
  '1': '超级管理员',
  '2': '门店管理员',
  '3': '导购员'
}

// 用户数据
const users = ref([
  { id: 1, name: '管理员', phone: '138****1234', role: '超级管理员', store: '总部', status: '启用' },
  { id: 2, name: '张三', phone: '139****5678', role: '门店管理员', store: '北京旗舰店', status: '启用' },
  { id: 3, name: '李四', phone: '137****9012', role: '导购员', store: '上海中心店', status: '启用' },
  { id: 4, name: '王五', phone: '136****3456', role: '导购员', store: '广州天河店', status: '禁用' }
])

// 分页
const total = ref(4)
const pageSize = ref(10)
const currentPage = ref(1)

// 搜索
const search = () => {
  // 模拟搜索过程
  const loading = ElLoading.service({ text: '正在搜索用户...' })
  
  setTimeout(() => {
    // 过滤数据
    const filteredUsers = users.value.filter(user => {
      const keywordMatch = user.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) || user.phone.toLowerCase().includes(searchKeyword.value.toLowerCase())
      const roleMatch = !roleId.value || (user.role === roleMap[roleId.value])
      return keywordMatch && roleMatch
    })
    
    // 更新显示数据
    total.value = filteredUsers.length
    
    if (filteredUsers.length > 0) {
      ElMessage.success(`找到 ${filteredUsers.length} 个用户`)
    } else {
      ElMessage.info('未找到匹配的用户')
    }
    loading.close()
  }, 500)
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  roleId.value = ''
  ElMessage.info('搜索条件已重置')
}

// 查看用户
const viewUser = (user) => {
  // 填充查看表单数据
  viewForm.value = {
    id: user.id,
    name: user.name,
    phone: user.phone,
    role: user.role,
    store: user.store,
    status: user.status
  }
  viewDialogVisible.value = true
}

// 编辑用户
const editUser = (user) => {
  // 填充表单数据
  userForm.value = {
    id: user.id,
    name: user.name,
    phone: user.phone,
    roleId: Object.keys(roleMap).find(key => roleMap[key] === user.role),
    store: user.store,
    status: user.status === '启用',
    password: ''
  }
  dialogTitle.value = '编辑用户'
  dialogVisible.value = true
}

// 删除用户
const deleteUser = (userId) => {
  // 确认删除
  ElMessageBox.confirm('确定要删除该用户吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除过程
    const loading = ElLoading.service({ text: '正在删除用户...' })
    
    setTimeout(() => {
      // 模拟删除逻辑
      const index = users.value.findIndex(u => u.id === userId)
      if (index !== -1) {
        users.value.splice(index, 1)
        total.value--
        ElMessage.success('用户删除成功')
      } else {
        ElMessage.error('用户不存在或已被删除')
      }
      loading.close()
    }, 500)
  }).catch(() => {
    // 取消删除
    ElMessage.info('已取消删除操作')
  })
}

// 提交用户表单
const submitUser = () => {
  // 表单验证
  if (!userForm.value.name) {
    ElMessage.error('请输入用户姓名')
    return
  }
  if (!userForm.value.phone) {
    ElMessage.error('请输入联系电话')
    return
  }
  if (!userForm.value.roleId) {
    ElMessage.error('请选择角色')
    return
  }
  if (!userForm.value.store) {
    ElMessage.error('请选择所属门店')
    return
  }
  if (!userForm.value.id && !userForm.value.password) {
    ElMessage.error('请输入密码')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在保存用户信息...' })
  
  setTimeout(() => {
    if (userForm.value.id) {
      // 编辑用户
      const index = users.value.findIndex(u => u.id === userForm.value.id)
      if (index !== -1) {
        users.value[index] = {
          ...users.value[index],
          name: userForm.value.name,
          phone: userForm.value.phone,
          role: roleMap[userForm.value.roleId],
          store: userForm.value.store,
          status: userForm.value.status ? '启用' : '禁用'
        }
        ElMessage.success('用户编辑成功')
      }
    } else {
      // 添加用户
      const newUser = {
        id: users.value.length + 1,
        name: userForm.value.name,
        phone: userForm.value.phone,
        role: roleMap[userForm.value.roleId],
        store: userForm.value.store,
        status: userForm.value.status ? '启用' : '禁用'
      }
      users.value.push(newUser)
      total.value++
      ElMessage.success('用户添加成功')
    }
    
    dialogVisible.value = false
    loading.close()
  }, 1000)
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  // 模拟API调用延迟
  const loading = ElLoading.service({ text: '正在加载数据...' })
  
  setTimeout(() => {
    // 实际项目中这里应该调用API获取对应页的数据
    ElMessage.success(`切换到第 ${page} 页`)
    loading.close()
  }, 300)
}

// 批量启用
const batchEnable = () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('请选择要启用的用户')
    return
  }
  
  // 模拟批量启用逻辑
  const loading = ElLoading.service({ text: '正在批量启用用户...' })
  
  setTimeout(() => {
    selectedUsers.value.forEach(user => {
      const index = users.value.findIndex(u => u.id === user.id)
      if (index !== -1) {
        users.value[index].status = '启用'
      }
    })
    
    ElMessage.success(`已批量启用 ${selectedUsers.value.length} 个用户`)
    selectedUsers.value = []
    loading.close()
  }, 500)
}

// 批量禁用
const batchDisable = () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('请选择要禁用的用户')
    return
  }
  
  // 模拟批量禁用逻辑
  const loading = ElLoading.service({ text: '正在批量禁用用户...' })
  
  setTimeout(() => {
    selectedUsers.value.forEach(user => {
      const index = users.value.findIndex(u => u.id === user.id)
      if (index !== -1) {
        users.value[index].status = '禁用'
      }
    })
    
    ElMessage.success(`已批量禁用 ${selectedUsers.value.length} 个用户`)
    selectedUsers.value = []
    loading.close()
  }, 500)
}

// 批量删除
const batchDelete = () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('请选择要删除的用户')
    return
  }
  
  // 确认删除
  ElMessageBox.confirm(`确定要删除选中的 ${selectedUsers.value.length} 个用户吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟批量删除逻辑
    const loading = ElLoading.service({ text: '正在批量删除用户...' })
    
    setTimeout(() => {
      selectedUsers.value.forEach(user => {
        const index = users.value.findIndex(u => u.id === user.id)
        if (index !== -1) {
          users.value.splice(index, 1)
          total.value--
        }
      })
      
      ElMessage.success(`已批量删除 ${selectedUsers.value.length} 个用户`)
      selectedUsers.value = []
      loading.close()
    }, 500)
  }).catch(() => {
    // 取消删除
    ElMessage.info('已取消删除操作')
  })
}

// 添加用户
const addUser = () => {
  // 重置表单
  userForm.value = {
    id: null,
    name: '',
    phone: '',
    roleId: '3',
    store: '总部',
    status: true,
    password: ''
  }
  dialogTitle.value = '添加用户'
  dialogVisible.value = true
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
    console.log('用户数据加载完成')
  }, 500)
})
</script>

<style scoped>
.headquarters-users {
  padding: 20px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.search-filter {
  margin-bottom: 20px;
}

.user-list {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>