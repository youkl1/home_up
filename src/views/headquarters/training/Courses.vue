<template>
  <div class="headquarters-training-courses">
    <div class="page-header">
      <h1>线上课程管理</h1>
      <el-button type="primary" @click="addCourse">添加课程</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索课程名称" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="courseType" placeholder="选择课程类型">
              <el-option label="全部" value=""></el-option>
              <el-option label="产品知识" value="产品知识"></el-option>
              <el-option label="销售技巧" value="销售技巧"></el-option>
              <el-option label="服务规范" value="服务规范"></el-option>
              <el-option label="企业文化" value="企业文化"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 课程列表 -->
    <div class="course-list">
      <el-card shadow="hover">
        <el-table :data="courses" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="课程ID" width="100"></el-table-column>
          <el-table-column prop="name" label="课程名称"></el-table-column>
          <el-table-column prop="type" label="课程类型" width="120"></el-table-column>
          <el-table-column prop="duration" label="时长" width="100"></el-table-column>
          <el-table-column prop="level" label="难度级别" width="100"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'published' ? 'success' : 'info'">
                {{ scope.row.status === 'published' ? '已发布' : '未发布' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewCourse(scope.row)">查看</el-button>
              <el-button type="warning" size="small" @click="editCourse(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteCourse(scope.row.id)">删除</el-button>
              <el-button type="info" size="small" @click="toggleStatus(scope.row)">
                {{ scope.row.status === 'published' ? '下线' : '上线' }}
              </el-button>
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
    
    <!-- 课程详情弹窗 -->
    <el-dialog
      v-model="courseDetailDialogVisible"
      title="课程详情"
      width="600px"
    >
      <el-form label-position="top" v-loading="loading">
        <el-form-item label="课程信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="课程ID">
                <el-input v-model="currentCourse.id" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="课程名称">
                <el-input v-model="currentCourse.name" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="课程类型">
                <el-input v-model="currentCourse.type" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="时长">
                <el-input v-model="currentCourse.duration" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="难度级别">
                <el-input v-model="currentCourse.level" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态">
                <el-input v-model="currentCourse.statusText" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="课程描述">
          <el-input
            v-model="currentCourse.description"
            type="textarea"
            :rows="4"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="课程内容">
          <el-input
            v-model="currentCourse.content"
            type="textarea"
            :rows="4"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="courseDetailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 添加/编辑课程弹窗 -->
    <el-dialog
      v-model="courseFormDialogVisible"
      :title="isEdit ? '编辑课程' : '添加课程'"
      width="600px"
    >
      <el-form
        :model="courseForm"
        :rules="courseFormRules"
        ref="courseFormRef"
        label-position="top"
        v-loading="loading"
      >
        <el-form-item label="课程信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="课程名称" prop="name">
                <el-input v-model="courseForm.name" placeholder="请输入课程名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="课程类型" prop="type">
                <el-select v-model="courseForm.type" placeholder="请选择课程类型">
                  <el-option label="产品知识" value="产品知识"></el-option>
                  <el-option label="销售技巧" value="销售技巧"></el-option>
                  <el-option label="服务规范" value="服务规范"></el-option>
                  <el-option label="企业文化" value="企业文化"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="时长" prop="duration">
                <el-input v-model="courseForm.duration" placeholder="请输入时长，如：45分钟"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="难度级别" prop="level">
                <el-select v-model="courseForm.level" placeholder="请选择难度级别">
                  <el-option label="初级" value="初级"></el-option>
                  <el-option label="中级" value="中级"></el-option>
                  <el-option label="高级" value="高级"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="courseForm.status" placeholder="请选择状态">
                  <el-option label="已发布" value="published"></el-option>
                  <el-option label="未发布" value="unpublished"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="课程描述" prop="description">
          <el-input
            v-model="courseForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入课程描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="课程内容" prop="content">
          <el-input
            v-model="courseForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入课程内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="courseFormDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitCourseForm">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const courseType = ref('')

// 加载状态
const loading = ref(false)

// 课程数据
const courses = ref([
  { id: 1, name: '产品知识基础', type: '产品知识', duration: '45分钟', level: '初级', status: 'published', description: '全面介绍公司产品的基础知识', content: '包括产品概念、功能特点、应用场景等内容' },
  { id: 2, name: '销售技巧提升', type: '销售技巧', duration: '60分钟', level: '中级', status: 'published', description: '提升销售团队的销售能力', content: '包括客户需求分析、产品演示、异议处理等技巧' },
  { id: 3, name: '服务规范培训', type: '服务规范', duration: '30分钟', level: '初级', status: 'published', description: '规范服务流程，提升服务质量', content: '包括服务标准、沟通技巧、问题处理等内容' },
  { id: 4, name: '企业文化培训', type: '企业文化', duration: '40分钟', level: '初级', status: 'published', description: '了解公司企业文化和价值观', content: '包括公司历史、核心价值观、发展愿景等内容' },
  { id: 5, name: '高级销售策略', type: '销售技巧', duration: '90分钟', level: '高级', status: 'unpublished', description: '高级销售策略和方法', content: '包括大客户销售、谈判技巧、团队管理等内容' }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗状态
const courseDetailDialogVisible = ref(false)
const courseFormDialogVisible = ref(false)
const isEdit = ref(false)

// 当前课程
const currentCourse = ref({})

// 课程表单
const courseForm = ref({
  name: '',
  type: '',
  duration: '',
  level: '',
  status: 'unpublished',
  description: '',
  content: ''
})

// 表单验证规则
const courseFormRules = {
  name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择课程类型', trigger: 'change' }],
  duration: [{ required: true, message: '请输入时长', trigger: 'blur' }],
  level: [{ required: true, message: '请选择难度级别', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  description: [{ required: true, message: '请输入课程描述', trigger: 'blur' }],
  content: [{ required: true, message: '请输入课程内容', trigger: 'blur' }]
}

// 表单引用
const courseFormRef = ref(null)

// 搜索
const search = () => {
  loading.value = true
  // 模拟搜索逻辑
  const keyword = searchKeyword.value.toLowerCase()
  const type = courseType.value
  
  // 模拟API调用
  setTimeout(() => {
    // 实际项目中这里应该调用API获取数据
    console.log(`搜索课程：${keyword}，类型：${type}`)
    ElMessage.success(`搜索课程：${keyword}，类型：${type}`)
    loading.value = false
  }, 500)
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  courseType.value = ''
  ElMessage.info('搜索条件已重置')
}

// 查看课程
const viewCourse = (course) => {
  loading.value = true
  // 模拟API调用获取课程详情
  setTimeout(() => {
    currentCourse.value = {
      ...course,
      statusText: course.status === 'published' ? '已发布' : '未发布'
    }
    courseDetailDialogVisible.value = true
    loading.value = false
  }, 500)
}

// 编辑课程
const editCourse = (course) => {
  isEdit.value = true
  Object.assign(courseForm.value, course)
  courseFormDialogVisible.value = true
}

// 删除课程
const deleteCourse = (courseId) => {
  // 确认删除
  ElMessageBox.confirm('确定要删除该课程吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true
    // 模拟删除逻辑
    setTimeout(() => {
      const index = courses.value.findIndex(c => c.id === courseId)
      if (index !== -1) {
        courses.value.splice(index, 1)
        total.value--
        ElMessage.success('课程删除成功')
      }
      loading.value = false
    }, 500)
  }).catch(() => {
    // 取消删除
    ElMessage.info('已取消删除操作')
  })
}

// 切换课程状态
const toggleStatus = (course) => {
  loading.value = true
  // 模拟状态切换逻辑
  setTimeout(() => {
    course.status = course.status === 'published' ? 'unpublished' : 'published'
    ElMessage.success(`课程已${course.status === 'published' ? '上线' : '下线'}`)
    loading.value = false
  }, 500)
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  // 实际项目中这里应该调用API获取对应页的数据
  console.log(`切换到第 ${page} 页`)
  ElMessage.info(`切换到第 ${page} 页`)
}

// 添加课程
const addCourse = () => {
  isEdit.value = false
  courseForm.value = {
    name: '',
    type: '',
    duration: '',
    level: '',
    status: 'unpublished',
    description: '',
    content: ''
  }
  courseFormDialogVisible.value = true
}

// 提交课程表单
const submitCourseForm = () => {
  if (!courseFormRef.value) return
  
  courseFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟API调用
      setTimeout(() => {
        if (isEdit.value) {
          // 编辑课程
          const index = courses.value.findIndex(c => c.id === courseForm.value.id)
          if (index !== -1) {
            courses.value[index] = { ...courseForm.value }
            ElMessage.success('课程编辑成功')
          }
        } else {
          // 添加课程
          const newCourse = {
            ...courseForm.value,
            id: courses.value.length + 1
          }
          courses.value.unshift(newCourse)
          total.value++
          ElMessage.success('课程添加成功')
        }
        courseFormDialogVisible.value = false
        loading.value = false
      }, 500)
    }
  })
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  loading.value = true
  setTimeout(() => {
    // 数据加载完成
    console.log('课程数据加载完成')
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.headquarters-training-courses {
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

.course-list {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>