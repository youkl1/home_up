<template>
  <div class="customer-behavior">
    <div class="page-header">
      <h1>行为轨迹</h1>
    </div>
    <el-card>
      <el-timeline>
        <el-timeline-item
          v-for="track in behaviorTracks"
          :key="track.id"
          :timestamp="track.time"
        >
          {{ track.description }}
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const behaviorTracks = ref([
  { id: 1, time: '2024-12-01 14:30', description: '电话沟通 - 确认橱柜尺寸' },
  { id: 2, time: '2024-11-30 10:15', description: '到店参观 - 样板间' },
  { id: 3, time: '2024-11-28 16:00', description: '微信咨询 - 报价方案' }
])
</script>

<style scoped lang="scss">
.customer-behavior {
  padding: 20px;

  .page-header {
    margin-bottom: 20px;

    h1 {
      margin: 0;
      font-size: 24px;
    }
  }
}
</style>
