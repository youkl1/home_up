<template>
  <div class="store-users">
    <div class="page-header">
      <h1>员工管理</h1>
      <el-button type="primary" @click="showAddDialog">添加员工</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索员工姓名或电话" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="roleId" placeholder="选择角色">
              <el-option label="全部" value=""></el-option>
              <el-option label="门店管理员" value="1"></el-option>
              <el-option label="导购员" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 员工列表 -->
    <div class="user-list">
      <el-card shadow="hover">
        <el-table :data="users" style="width: 100%">
          <el-table-column prop="id" label="员工ID" width="80"></el-table-column>
          <el-table-column prop="name" label="员工姓名"></el-table-column>
          <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
          <el-table-column prop="role" label="角色" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === '启用' ? 'success' : 'danger'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editUser(scope.row.id)">编辑</el-button>
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

    <!-- 添加/编辑员工弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form
        :model="userForm"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="员工姓名" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="门店管理员" value="门店管理员"></el-option>
            <el-option label="导购员" value="导购员"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="userForm.status">
            <el-option label="启用" value="启用"></el-option>
            <el-option label="禁用" value="禁用"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const roleId = ref('')

// 员工数据
const users = ref([
  { id: 1, name: '张三', phone: '138****1234', role: '门店管理员', status: '启用' },
  { id: 2, name: '李四', phone: '139****5678', role: '导购员', status: '启用' },
  { id: 3, name: '王五', phone: '137****9012', role: '导购员', status: '禁用' },
  { id: 4, name: '赵六', phone: '136****3456', role: '导购员', status: '启用' }
])

// 分页
const total = ref(4)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('添加员工')
const submitting = ref(false)

// 员工表单
const userForm = reactive({
  id: '',
  name: '',
  phone: '',
  role: '',
  status: '启用'
})

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

// 搜索
const search = () => {
  ElMessage.success('搜索功能开发中')
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  roleId.value = ''
}

// 显示添加员工弹窗
const showAddDialog = () => {
  dialogTitle.value = '添加员工'
  Object.assign(userForm, {
    id: '',
    name: '',
    phone: '',
    role: '',
    status: '启用'
  })
  dialogVisible.value = true
}

// 编辑员工
const editUser = (userId) => {
  const user = users.value.find(u => u.id === userId)
  if (user) {
    dialogTitle.value = '编辑员工'
    Object.assign(userForm, {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      status: user.status
    })
    dialogVisible.value = true
  }
}

// 提交表单
const submitForm = async () => {
  // 简单的表单验证
  if (!userForm.name) {
    ElMessage.error('请输入员工姓名')
    return
  }
  if (!userForm.phone) {
    ElMessage.error('请输入联系电话')
    return
  }
  if (!userForm.role) {
    ElMessage.error('请选择角色')
    return
  }

  submitting.value = true
  try {
    if (userForm.id) {
      // 编辑员工
      const index = users.value.findIndex(u => u.id === userForm.id)
      if (index > -1) {
        users.value[index] = {
          ...users.value[index],
          name: userForm.name,
          phone: userForm.phone,
          role: userForm.role,
          status: userForm.status
        }
        ElMessage.success('员工信息更新成功')
      }
    } else {
      // 添加员工
      const newUser = {
        id: users.value.length + 1,
        name: userForm.name,
        phone: userForm.phone,
        role: userForm.role,
        status: userForm.status
      }
      users.value.push(newUser)
      total.value++
      ElMessage.success('员工添加成功')
    }
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    submitting.value = false
  }
}

// 删除员工
const deleteUser = (userId) => {
  ElMessageBox.confirm('确定要删除该员工吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = users.value.findIndex(u => u.id === userId)
    if (index > -1) {
      users.value.splice(index, 1)
      total.value--
      ElMessage.success('员工删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
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
.store-users {
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