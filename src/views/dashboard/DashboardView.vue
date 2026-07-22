<template>
  <div class="dashboard">
    <!-- Stats Cards -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #1890ff, #40a9ff)">
              <el-icon size="28" color="#fff"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalEmployees }}</div>
              <div class="stat-label">在职员工</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #52c41a, #73d13d)">
              <el-icon size="28" color="#fff"><DataAnalysis /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.activeAssessments }}</div>
              <div class="stat-label">进行中考核</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #faad14, #ffc53d)">
              <el-icon size="28" color="#fff"><Bell /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.pendingIncentives }}</div>
              <div class="stat-label">待发放激励</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #eb2f96, #f759ab)">
              <el-icon size="28" color="#fff"><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ (stats.totalIncentiveAmount / 10000).toFixed(1) }}万</div>
              <div class="stat-label">本年累计激励</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px;">
      <!-- Grade Distribution -->
      <el-col :xs="24" :lg="10">
        <el-card title="考核等级分布" shadow="hover">
          <template #header>
            <span class="card-title">考核等级分布</span>
          </template>
          <div class="grade-chart">
            <div
              v-for="item in stats.gradeDistribution"
              :key="item.grade"
              class="grade-bar-item"
            >
              <div class="grade-label">
                <el-tag :type="gradeTagType(item.grade)" size="small">{{ item.grade }}</el-tag>
              </div>
              <div class="grade-bar-wrap">
                <div
                  class="grade-bar"
                  :style="{
                    width: item.percentage + '%',
                    backgroundColor: gradeColor(item.grade)
                  }"
                ></div>
              </div>
              <div class="grade-count">{{ item.count }}人 ({{ item.percentage }}%)</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- Department Stats -->
      <el-col :xs="24" :lg="14">
        <el-card shadow="hover">
          <template #header>
            <span class="card-title">部门绩效概览</span>
          </template>
          <el-table :data="stats.departmentStats" size="small" stripe>
            <el-table-column prop="department" label="部门" />
            <el-table-column prop="employeeCount" label="人数" width="70" align="center" />
            <el-table-column prop="avgScore" label="平均分" width="80" align="center">
              <template #default="{ row }">
                <el-tag :type="scoreTagType(row.avgScore)" size="small">{{ row.avgScore }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="incentiveAmount" label="激励金额" align="right">
              <template #default="{ row }">
                ¥{{ row.incentiveAmount.toLocaleString() }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- Recent Assessments -->
    <el-row :gutter="16" style="margin-top: 16px;">
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">最新考核记录</span>
              <el-button type="primary" link size="small" @click="$router.push('/assessment/records')">
                查看全部
              </el-button>
            </div>
          </template>
          <el-table :data="recentAssessments" size="small">
            <el-table-column prop="employeeName" label="员工" width="80" />
            <el-table-column prop="period" label="考核期" width="100" />
            <el-table-column prop="finalScore" label="最终得分" align="center" width="90">
              <template #default="{ row }">
                <span v-if="row.status === 'completed'">{{ row.finalScore }}</span>
                <span v-else class="text-muted">-</span>
              </template>
            </el-table-column>
            <el-table-column prop="grade" label="等级" align="center" width="70">
              <template #default="{ row }">
                <el-tag v-if="row.status === 'completed'" :type="gradeTagType(row.grade)" size="small">{{ row.grade }}</el-tag>
                <span v-else class="text-muted">-</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="assessmentStatusTag(row.status)" size="small">
                  {{ assessmentStatusLabel(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- Recent Incentives -->
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">最新激励记录</span>
              <el-button type="primary" link size="small" @click="$router.push('/incentive/records')">
                查看全部
              </el-button>
            </div>
          </template>
          <el-table :data="recentIncentives" size="small">
            <el-table-column prop="employeeName" label="员工" width="80" />
            <el-table-column prop="period" label="期次" width="100" />
            <el-table-column prop="incentiveAmount" label="金额" align="right" width="100">
              <template #default="{ row }">
                ¥{{ row.incentiveAmount.toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="incentiveStatusTag(row.status)" size="small">
                  {{ incentiveStatusLabel(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAssessmentStore } from '@/stores/assessment'
import { useIncentiveStore } from '@/stores/incentive'
import { mockDashboardStats } from '@/mock/data'

const assessmentStore = useAssessmentStore()
const incentiveStore = useIncentiveStore()

const stats = mockDashboardStats

const recentAssessments = computed(() =>
  [...assessmentStore.records].slice(-5).reverse()
)

const recentIncentives = computed(() =>
  [...incentiveStore.records].slice(-5).reverse()
)

function gradeColor(grade: string) {
  const map: Record<string, string> = { S: '#722ed1', A: '#1890ff', B: '#52c41a', C: '#faad14', D: '#ff4d4f' }
  return map[grade] ?? '#999'
}

function gradeTagType(grade: string): '' | 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    S: '', A: 'success', B: 'info', C: 'warning', D: 'danger'
  }
  return map[grade] ?? 'info'
}

function scoreTagType(score: number): '' | 'success' | 'warning' | 'danger' | 'info' {
  if (score >= 90) return ''
  if (score >= 80) return 'success'
  if (score >= 70) return 'info'
  if (score >= 60) return 'warning'
  return 'danger'
}

function assessmentStatusLabel(status: string) {
  const map: Record<string, string> = {
    pending: '待开始', self_evaluating: '自评中', leader_evaluating: '上级评', completed: '已完成'
  }
  return map[status] ?? status
}

function assessmentStatusTag(status: string): '' | 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    pending: 'info', self_evaluating: 'warning', leader_evaluating: '', completed: 'success'
  }
  return map[status] ?? 'info'
}

function incentiveStatusLabel(status: string) {
  const map: Record<string, string> = {
    pending: '待审批', approved: '已审批', paid: '已发放', rejected: '已驳回'
  }
  return map[status] ?? status
}

function incentiveStatusTag(status: string): '' | 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    pending: 'warning', approved: '', paid: 'success', rejected: 'danger'
  }
  return map[status] ?? 'info'
}
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stats-row .el-col {
  margin-bottom: 0;
}

.stat-card {
  border-radius: 8px;
}

.stat-card :deep(.el-card__body) {
  padding: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #1a1a1a;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: #888;
  margin-top: 6px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.grade-chart {
  padding: 8px 0;
}

.grade-bar-item {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  gap: 8px;
}

.grade-label {
  width: 32px;
  flex-shrink: 0;
  text-align: center;
}

.grade-bar-wrap {
  flex: 1;
  height: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.grade-bar {
  height: 100%;
  border-radius: 8px;
  transition: width 0.5s ease;
}

.grade-count {
  width: 110px;
  flex-shrink: 0;
  font-size: 12px;
  color: #666;
  text-align: right;
}

.text-muted {
  color: #bbb;
}
</style>
