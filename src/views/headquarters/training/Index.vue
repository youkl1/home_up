<template>
  <div class="headquarters-training">
    <div class="page-header">
      <h1>培训赋能管理</h1>
    </div>
    
    <!-- 学习数据概览 -->
    <div class="data-overview">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ totalCourses }}</div>
              <div class="data-label">总课程数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ totalLearners }}</div>
              <div class="data-label">总学习人数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ totalCompleted }}</div>
              <div class="data-label">完成课程数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ averageScore }}</div>
              <div class="data-label">平均得分</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 学习数据统计 -->
    <div class="learning-stats">
      <el-row :gutter="20">
        <!-- 学习完成率 -->
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>学习完成率统计</span>
              </div>
            </template>
            <div class="chart-container">
              <div ref="completionChartRef" class="chart"></div>
            </div>
          </el-card>
        </el-col>
        
        <!-- 课程评分分布 -->
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>课程评分分布</span>
              </div>
            </template>
            <div class="chart-container">
              <div ref="ratingChartRef" class="chart"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 热门课程 -->
    <div class="popular-courses">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>热门课程</span>
            <el-button type="primary" size="small" @click="viewAllCourses">查看全部</el-button>
          </div>
        </template>
        <el-table :data="popularCourses" style="width: 100%">
          <el-table-column prop="courseId" label="课程ID" width="100"></el-table-column>
          <el-table-column prop="courseName" label="课程名称"></el-table-column>
          <el-table-column prop="category" label="分类" width="120"></el-table-column>
          <el-table-column prop="enrollCount" label="报名人数" width="100"></el-table-column>
          <el-table-column prop="completionRate" label="完成率" width="100">
            <template #default="scope">
              <el-tag type="success">{{ scope.row.completionRate }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="averageScore" label="平均评分" width="100"></el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewCourseDetails(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
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
                <el-input v-model="currentCourse.courseId" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="课程名称">
                <el-input v-model="currentCourse.courseName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="分类">
                <el-input v-model="currentCourse.category" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报名人数">
                <el-input v-model="currentCourse.enrollCount" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="完成率">
                <el-input v-model="currentCourse.completionRate" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="平均评分">
                <el-input v-model="currentCourse.averageScore" disabled></el-input>
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
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()

// 数据概览
const totalCourses = ref('128')
const totalLearners = ref('1,560')
const totalCompleted = ref('896')
const averageScore = ref('4.6')

// 热门课程
const popularCourses = ref([
  { courseId: 'C001', courseName: '产品知识培训', category: '产品', enrollCount: 356, completionRate: '92%', averageScore: '4.8', description: '全面介绍公司产品的功能、特点和优势', content: '包括产品基础概念、核心功能详解、应用场景分析等内容' },
  { courseId: 'C002', courseName: '销售技巧提升', category: '销售', enrollCount: 289, completionRate: '85%', averageScore: '4.7', description: '提升销售团队的销售技巧和沟通能力', content: '包括客户需求分析、产品演示技巧、异议处理、成交技巧等内容' },
  { courseId: 'C003', courseName: '安装服务规范', category: '服务', enrollCount: 215, completionRate: '95%', averageScore: '4.9', description: '规范安装服务流程，提升服务质量', content: '包括安装前准备、安装流程、调试方法、客户验收标准等内容' },
  { courseId: 'C004', courseName: '客户沟通技巧', category: '销售', enrollCount: 187, completionRate: '88%', averageScore: '4.6', description: '提升与客户的沟通能力和服务水平', content: '包括有效倾听、表达技巧、情绪管理、冲突处理等内容' },
  { courseId: 'C005', courseName: '品牌文化培训', category: '企业文化', enrollCount: 156, completionRate: '90%', averageScore: '4.5', description: '了解公司品牌文化和价值观', content: '包括品牌历史、核心价值观、企业使命、发展愿景等内容' }
])

// 图表引用
const completionChartRef = ref(null)
const ratingChartRef = ref(null)

// 加载状态
const loading = ref(false)

// 课程详情弹窗
const courseDetailDialogVisible = ref(false)
const currentCourse = ref({})

// 查看全部课程
const viewAllCourses = () => {
  router.push('/headquarters/training/courses')
}

// 查看课程详情
const viewCourseDetails = (course) => {
  loading.value = true
  // 模拟API调用获取课程详情
  setTimeout(() => {
    currentCourse.value = { ...course }
    courseDetailDialogVisible.value = true
    loading.value = false
  }, 500)
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 学习完成率图表
    if (completionChartRef.value) {
      const completionChart = echarts.init(completionChartRef.value)
      const completionOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['产品', '销售', '服务', '企业文化', '技术']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          }
        },
        series: [
          {
            name: '完成率',
            type: 'bar',
            data: [92, 85, 95, 90, 88],
            itemStyle: {
              color: '#409EFF'
            }
          }
        ]
      }
      completionChart.setOption(completionOption)
    }

    // 课程评分分布图表
    if (ratingChartRef.value) {
      const ratingChart = echarts.init(ratingChartRef.value)
      const ratingOption = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '评分分布',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 45, name: '5星' },
              { value: 30, name: '4星' },
              { value: 15, name: '3星' },
              { value: 8, name: '2星' },
              { value: 2, name: '1星' }
            ]
          }
        ]
      }
      ratingChart.setOption(ratingOption)
    }
  })
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  loading.value = true
  setTimeout(() => {
    // 数据加载完成
    console.log('培训数据加载完成')
    loading.value = false
    // 初始化图表
    initCharts()
  }, 500)
})
</script>

<style scoped>
.headquarters-training {
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

.data-overview {
  margin-bottom: 20px;
}

.data-item {
  text-align: center;
  padding: 20px 0;
}

.data-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.data-label {
  font-size: 14px;
  color: #666;
}

.learning-stats {
  margin-bottom: 20px;
}

.chart-container {
  height: 200px;
  margin: 20px 0;
}

.chart {
  width: 100%;
  height: 100%;
}

.popular-courses {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>