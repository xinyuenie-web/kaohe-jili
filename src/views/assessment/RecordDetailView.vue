<template>
  <div class="page-container">
    <el-button style="margin-bottom: 16px" @click="$router.back()">
      <el-icon><ArrowLeft /></el-icon> 返回
    </el-button>

    <template v-if="record">
      <!-- Basic Info -->
      <el-card shadow="never" style="margin-bottom: 16px">
        <template #header>
          <span class="card-title">考核基本信息</span>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="员工姓名">{{ record.employeeName }}</el-descriptions-item>
          <el-descriptions-item label="所在部门">{{ record.department }}</el-descriptions-item>
          <el-descriptions-item label="职位">{{ record.position }}</el-descriptions-item>
          <el-descriptions-item label="考核方案">{{ record.planName }}</el-descriptions-item>
          <el-descriptions-item label="考核期">{{ record.period }}</el-descriptions-item>
          <el-descriptions-item label="考核状态">
            <el-tag :type="statusTagType(record.status)" size="small">
              {{ statusLabel(record.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="自评分">
            {{ record.selfScore > 0 ? record.selfScore : '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="上级评分">
            {{ record.leaderScore > 0 ? record.leaderScore : '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="最终得分">
            <strong v-if="record.status === 'completed'" style="color:#1890ff; font-size:18px">
              {{ record.finalScore }}
            </strong>
            <span v-else>-</span>
          </el-descriptions-item>
          <el-descriptions-item label="考核等级">
            <el-tag v-if="record.status === 'completed'" :type="gradeTagType(record.grade)" size="default">
              {{ record.grade }}
            </el-tag>
            <span v-else>-</span>
          </el-descriptions-item>
          <el-descriptions-item label="完成日期">
            {{ record.completedAt || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="综合评语" :span="3">
            {{ record.comments || '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- Score Details -->
      <el-card shadow="never">
        <template #header>
          <span class="card-title">指标评分明细</span>
        </template>
        <el-table :data="record.details" border stripe>
          <el-table-column prop="indicatorName" label="考核指标" min-width="140" />
          <el-table-column prop="weight" label="权重(%)" width="90" align="center" />
          <el-table-column prop="maxScore" label="满分" width="70" align="center" />
          <el-table-column prop="selfScore" label="自评分" width="90" align="center">
            <template #default="{ row }">
              <span v-if="row.selfScore > 0">{{ row.selfScore }}</span>
              <span v-else class="text-muted">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="leaderScore" label="上级评分" width="100" align="center">
            <template #default="{ row }">
              <span v-if="row.leaderScore > 0">{{ row.leaderScore }}</span>
              <span v-else class="text-muted">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="finalScore" label="得分小计" width="100" align="center">
            <template #default="{ row }">
              <span v-if="record.status === 'completed'" style="color:#1890ff; font-weight:bold">
                {{ (row.finalScore * row.weight / 100).toFixed(1) }}
              </span>
              <span v-else class="text-muted">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="comment" label="备注" min-width="200" show-overflow-tooltip />
        </el-table>

        <div v-if="record.status === 'completed'" class="score-summary">
          <el-tag type="" size="large">
            综合得分：{{ record.finalScore }} 分 | 等级：{{ record.grade }}
          </el-tag>
        </div>
      </el-card>
    </template>

    <el-empty v-else description="考核记录不存在" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAssessmentStore } from '@/stores/assessment'
import type { AssessmentRecord } from '@/types'

const route = useRoute()
const assessmentStore = useAssessmentStore()

const record = computed(() => {
  const id = parseInt(route.params.id as string)
  return assessmentStore.records.find((r: AssessmentRecord) => r.id === id)
})

function statusLabel(status: string) {
  return { pending: '待开始', self_evaluating: '自评中', leader_evaluating: '上级评', completed: '已完成' }[status] ?? status
}

function statusTagType(status: string): '' | 'success' | 'warning' | 'danger' | 'info' {
  return ({ pending: 'info', self_evaluating: 'warning', leader_evaluating: '', completed: 'success' } as Record<string, '' | 'success' | 'warning' | 'danger' | 'info'>)[status] ?? 'info'
}

function gradeTagType(grade: string): '' | 'success' | 'warning' | 'danger' | 'info' {
  return ({ S: '', A: 'success', B: 'info', C: 'warning', D: 'danger' } as Record<string, '' | 'success' | 'warning' | 'danger' | 'info'>)[grade] ?? 'info'
}
</script>

<style scoped>
.card-title {
  font-size: 15px;
  font-weight: 600;
}
.text-muted {
  color: #bbb;
}
.score-summary {
  margin-top: 16px;
  text-align: right;
}
</style>
