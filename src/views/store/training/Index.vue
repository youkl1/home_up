<template>
  <div class="training-management">
    <div class="page-header">
      <h1>团队培训与业绩管理</h1>
      <el-radio-group v-model="activeTab" size="small">
        <el-radio-button label="courses">课程学习</el-radio-button>
        <el-radio-button label="targets">业绩目标</el-radio-button>
        <el-radio-button label="commission">提成核算</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 课程学习模块 -->
    <div v-if="activeTab === 'courses'" class="tab-content">
      <div class="stats-row">
        <div class="stat-card" v-for="stat in courseStats" :key="stat.label">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>

      <div class="course-filters">
        <el-input v-model="courseSearch" placeholder="搜索课程" clearable style="width: 250px">
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-select v-model="courseCategory" placeholder="课程分类" clearable>
          <el-option label="产品知识" value="product" />
          <el-option label="销售技巧" value="sales" />
          <el-option label="服务规范" value="service" />
        </el-select>
      </div>

      <el-row :gutter="20" class="course-list">
        <el-col :span="8" v-for="course in courseList" :key="course.id">
          <el-card class="course-card" :body-style="{ padding: '0' }">
            <img :src="course.cover" class="course-cover" />
            <div class="course-info">
              <h4>{{ course.title }}</h4>
              <p>{{ course.description }}</p>
              <el-progress v-if="course.progress > 0" :percentage="course.progress" />
              <el-button type="primary" size="small" @click="startLearning(course)">{{ course.progress > 0 ? '继续学习' : '开始学习' }}</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 业绩目标模块 -->
    <div v-if="activeTab === 'targets'" class="tab-content">
      <el-row :gutter="20" class="target-overview">
        <el-col :span="6" v-for="target in targetList" :key="target.label">
          <el-card>
            <div class="target-label">{{ target.label }}</div>
            <div class="target-value">{{ target.value }}</div>
            <el-progress :percentage="target.progress" :color="progressColors" />
          </el-card>
        </el-col>
      </el-row>

      <el-card class="staff-targets">
        <template #header>员工业绩目标完成情况</template>
        <el-table :data="staffTargets" stripe>
          <el-table-column prop="name" label="员工" />
          <el-table-column prop="revenueTarget" label="销售目标" />
          <el-table-column prop="revenueAchieved" label="已完成" />
          <el-table-column label="完成率">
            <template #default="{ row }">
              <el-progress :percentage="row.completionRate" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 提成核算模块 -->
    <div v-if="activeTab === 'commission'" class="tab-content">
      <el-card>
        <template #header>
          <div class="commission-header">
            <span>提成核算明细</span>
            <el-radio-group v-model="commissionPeriod" size="small">
              <el-radio-button label="month">本月</el-radio-button>
              <el-radio-button label="quarter">本季</el-radio-button>
            </el-radio-group>
          </div>
        </template>
        <el-table :data="commissionList" stripe>
          <el-table-column prop="name" label="员工" />
          <el-table-column prop="revenue" label="销售业绩" />
          <el-table-column prop="commissionRate" label="提成比例" />
          <el-table-column prop="commission" label="提成金额" />
          <el-table-column prop="bonus" label="奖金" />
          <el-table-column prop="total" label="合计" />
        </el-table>
      </el-card>
    </div>

    <!-- 学习弹窗 -->
    <el-dialog
      v-model="learningDialogVisible"
      :title="currentCourse.title"
      width="800px"
    >
      <div class="learning-dialog">
        <div class="learning-content">
          <img :src="currentCourse.cover" class="learning-cover" />
          <div class="learning-info">
            <h3>{{ currentCourse.title }}</h3>
            <p>{{ currentCourse.description }}</p>
            <div class="learning-progress-section">
              <div class="progress-header">
                <span>学习进度</span>
                <span>{{ learningProgress }}%</span>
              </div>
              <el-progress :percentage="learningProgress" :stroke-width="15" />
            </div>
          </div>
        </div>
        <div class="learning-actions">
          <el-button @click="closeLearningDialog">暂停学习</el-button>
          <el-button type="primary" @click="closeLearningDialog">完成学习</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import placeholderImage from '../../../assets/images/placeholder.png'

const activeTab = ref('courses')
const isManager = ref(true)
const currentPeriod = ref('2024年12月')
const commissionPeriod = ref('month')

// 课程统计数据
const courseStats = reactive([
  { value: 24, label: '课程总数' },
  { value: 18, label: '已完成课程' },
  { value: 36, label: '学习时长(小时)' },
  { value: '75%', label: '完成率' }
])

// 课程搜索和筛选
const courseSearch = ref('')
const courseCategory = ref('')

// 课程列表
const courseList = reactive([
  {
    id: 1,
    title: '全屋定制产品销售技巧',
    description: '学习如何向客户推荐全屋定制产品，提升成交率',
    cover: placeholderImage,
    progress: 80,
    category: '销售技巧'
  },
  {
    id: 2,
    title: '新品沙发系列培训',
    description: '了解2024年新品沙发系列特点及卖点',
    cover: placeholderImage,
    progress: 0,
    category: '产品知识'
  },
  {
    id: 3,
    title: '客户服务标准流程',
    description: '掌握标准客户服务流程，提升客户满意度',
    cover: placeholderImage,
    progress: 100,
    category: '服务规范'
  }
])

// 业绩目标数据
const targetList = reactive([
  { label: '门店销售目标', value: '¥200万', progress: 65 },
  { label: '门店订单目标', value: '150单', progress: 72 },
  { label: '新增客户目标', value: '100人', progress: 58 },
  { label: '转介绍目标', value: '30单', progress: 80 }
])

const progressColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
]

// 员工业绩目标
const staffTargets = reactive([
  { name: '张小明', revenueTarget: '¥50万', revenueAchieved: '¥38万', completionRate: 76 },
  { name: '李小红', revenueTarget: '¥40万', revenueAchieved: '¥32万', completionRate: 80 },
  { name: '王小强', revenueTarget: '¥35万', revenueAchieved: '¥25万', completionRate: 71 },
  { name: '赵小芳', revenueTarget: '¥35万', revenueAchieved: '¥28万', completionRate: 80 }
])

// 提成核算数据
const commissionList = reactive([
  { name: '张小明', revenue: '¥38万', commissionRate: '3%', commission: '¥11,400', bonus: '¥2,000', total: '¥13,400' },
  { name: '李小红', revenue: '¥32万', commissionRate: '3%', commission: '¥9,600', bonus: '¥1,500', total: '¥11,100' },
  { name: '王小强', revenue: '¥25万', commissionRate: '2.5%', commission: '¥6,250', bonus: '¥0', total: '¥6,250' },
  { name: '赵小芳', revenue: '¥28万', commissionRate: '2.5%', commission: '¥7,000', bonus: '¥1,000', total: '¥8,000' }
])

// 学习弹窗
const learningDialogVisible = ref(false)
const currentCourse = ref({})
const learningProgress = ref(0)
const learningTimer = ref(null)

// 方法
const startLearning = (course) => {
  currentCourse.value = course
  learningProgress.value = course.progress
  learningDialogVisible.value = true
  
  // 模拟学习进度
  if (learningTimer.value) {
    clearInterval(learningTimer.value)
  }
  
  learningTimer.value = setInterval(() => {
    if (learningProgress.value < 100) {
      learningProgress.value += 1
    } else {
      clearInterval(learningTimer.value)
      ElMessage.success('课程学习完成！')
    }
  }, 1000)
}

const viewCourseDetail = (course) => {
  console.log('查看课程详情:', course.title)
}

const showTargetSettingDialog = () => {
  console.log('设置目标')
}

// 关闭学习弹窗
const closeLearningDialog = () => {
  if (learningTimer.value) {
    clearInterval(learningTimer.value)
    learningTimer.value = null
  }
  learningDialogVisible.value = false
}
</script>

<style scoped lang="scss">
.training-management {
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
    }
  }

  .course-filters {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .course-list {
    .course-card {
      margin-bottom: 20px;

      .course-cover {
        width: 100%;
        height: 180px;
        object-fit: cover;
      }

      .course-info {
        padding: 15px;

        h4 {
          margin: 0 0 10px 0;
          font-size: 16px;
        }

        p {
          font-size: 13px;
          color: #666;
          margin-bottom: 15px;
          line-height: 1.5;
        }
      }
    }
  }

  .target-overview {
    margin-bottom: 20px;

    .target-label {
      font-size: 14px;
      color: #909399;
      margin-bottom: 10px;
    }

    .target-value {
      font-size: 24px;
      font-weight: bold;
      color: #303133;
      margin-bottom: 15px;
    }
  }

  .staff-targets {
    margin-top: 20px;
  }

  .commission-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .learning-dialog {
    .learning-content {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;

      .learning-cover {
        width: 300px;
        height: 180px;
        object-fit: cover;
        border-radius: 8px;
      }

      .learning-info {
        flex: 1;

        h3 {
          margin: 0 0 10px 0;
          font-size: 18px;
          font-weight: bold;
        }

        p {
          margin: 0 0 20px 0;
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }

        .learning-progress-section {
          .progress-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
          }
        }
      }
    }

    .learning-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  }
}
</style>
