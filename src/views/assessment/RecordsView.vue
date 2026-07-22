<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="page-header">
          <span class="page-title">考核记录</span>
        </div>
      </template>

      <!-- Filters -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="考核方案">
          <el-select v-model="searchForm.planId" placeholder="全部" clearable style="width: 200px">
            <el-option
              v-for="p in assessmentStore.plans"
              :key="p.id"
              :label="p.name"
              :value="p.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="searchForm.department" placeholder="全部部门" clearable>
            <el-option v-for="d in departments" :key="d" :label="d" :value="d" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable>
            <el-option label="待开始" value="pending" />
            <el-option label="自评中" value="self_evaluating" />
            <el-option label="上级评" value="leader_evaluating" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="page = 1">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="pagedRecords" stripe border>
        <el-table-column prop="planName" label="考核方案" min-width="160" show-overflow-tooltip />
        <el-table-column prop="employeeName" label="员工" width="90" />
        <el-table-column prop="department" label="部门" width="110" />
        <el-table-column prop="position" label="职位" width="130" show-overflow-tooltip />
        <el-table-column prop="period" label="考核期" width="100" align="center" />
        <el-table-column prop="selfScore" label="自评分" width="80" align="center">
          <template #default="{ row }">
            <span v-if="row.selfScore > 0">{{ row.selfScore }}</span>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="leaderScore" label="上级评分" width="90" align="center">
          <template #default="{ row }">
            <span v-if="row.leaderScore > 0">{{ row.leaderScore }}</span>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="finalScore" label="最终得分" width="90" align="center">
          <template #default="{ row }">
            <span v-if="row.status === 'completed'">{{ row.finalScore }}</span>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="等级" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'completed'" :type="gradeTagType(row.grade)" size="small">
              {{ row.grade }}
            </el-tag>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)" size="small">
              {{ statusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="viewDetail(row.id)">详情</el-button>
            <el-button
              v-if="row.status !== 'completed'"
              type="success" link size="small"
              @click="openEvaluateDialog(row)"
            >评分</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="totalFiltered"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          background
        />
      </div>
    </el-card>

    <!-- Evaluate Dialog -->
    <el-dialog v-model="evaluateDialogVisible" title="绩效评分" width="700px">
      <template v-if="evaluatingRecord">
        <div class="eval-header">
          <span><strong>员工：</strong>{{ evaluatingRecord.employeeName }}</span>
          <span><strong>考核期：</strong>{{ evaluatingRecord.period }}</span>
          <span><strong>当前状态：</strong>{{ statusLabel(evaluatingRecord.status) }}</span>
        </div>
        <el-table :data="evalDetails" border size="small" style="margin-top: 12px;">
          <el-table-column prop="indicatorName" label="考核指标" min-width="120" />
          <el-table-column prop="weight" label="权重(%)" width="80" align="center" />
          <el-table-column prop="maxScore" label="满分" width="70" align="center" />
          <el-table-column label="自评分" width="110">
            <template #default="{ row }">
              <el-input-number
                v-if="evaluatingRecord.status === 'self_evaluating' || evaluatingRecord.status === 'pending'"
                v-model="row.selfScore"
                :min="0"
                :max="row.maxScore"
                size="small"
                style="width:90px"
              />
              <span v-else>{{ row.selfScore }}</span>
            </template>
          </el-table-column>
          <el-table-column label="上级评分" width="110">
            <template #default="{ row }">
              <el-input-number
                v-if="evaluatingRecord.status === 'leader_evaluating'"
                v-model="row.leaderScore"
                :min="0"
                :max="row.maxScore"
                size="small"
                style="width:90px"
              />
              <span v-else>{{ row.leaderScore || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="120">
            <template #default="{ row }">
              <el-input v-model="row.comment" size="small" placeholder="备注" />
            </template>
          </el-table-column>
        </el-table>
        <el-form style="margin-top: 12px;">
          <el-form-item label="综合评语">
            <el-input v-model="evalComments" type="textarea" :rows="2" placeholder="请输入综合评语" />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="evaluateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEvaluation">提交评分</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAssessmentStore } from '@/stores/assessment'
import type { AssessmentRecord, AssessmentDetail } from '@/types'

const router = useRouter()
const assessmentStore = useAssessmentStore()

const page = ref(1)
const pageSize = ref(10)
const searchForm = reactive({ planId: undefined as number | undefined, department: '', status: '' })
const departments = ['研发部', '产品部', '市场部', '人力资源部', '财务部', '运营部']

const evaluateDialogVisible = ref(false)
const evaluatingRecord = ref<AssessmentRecord | null>(null)
const evalDetails = ref<AssessmentDetail[]>([])
const evalComments = ref('')

const filtered = computed(() => {
  return assessmentStore.records.filter((r: AssessmentRecord) => {
    const planMatch = !searchForm.planId || r.planId === searchForm.planId
    const deptMatch = !searchForm.department || r.department === searchForm.department
    const statusMatch = !searchForm.status || r.status === searchForm.status
    return planMatch && deptMatch && statusMatch
  })
})

const totalFiltered = computed(() => filtered.value.length)
const pagedRecords = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

function resetSearch() {
  searchForm.planId = undefined
  searchForm.department = ''
  searchForm.status = ''
  page.value = 1
}

function gradeTagType(grade: string): '' | 'success' | 'warning' | 'danger' | 'info' {
  return ({ S: '', A: 'success', B: 'info', C: 'warning', D: 'danger' } as Record<string, '' | 'success' | 'warning' | 'danger' | 'info'>)[grade] ?? 'info'
}

function statusLabel(status: string) {
  return { pending: '待开始', self_evaluating: '自评中', leader_evaluating: '上级评', completed: '已完成' }[status] ?? status
}

function statusTagType(status: string): '' | 'success' | 'warning' | 'danger' | 'info' {
  return ({ pending: 'info', self_evaluating: 'warning', leader_evaluating: '', completed: 'success' } as Record<string, '' | 'success' | 'warning' | 'danger' | 'info'>)[status] ?? 'info'
}

function viewDetail(id: number) {
  router.push(`/assessment/records/${id}`)
}

function openEvaluateDialog(record: AssessmentRecord) {
  evaluatingRecord.value = record
  evalDetails.value = record.details.map((d: AssessmentDetail) => ({ ...d }))
  evalComments.value = record.comments
  evaluateDialogVisible.value = true
}

function submitEvaluation() {
  if (!evaluatingRecord.value) return
  const record = evaluatingRecord.value

  let nextStatus: AssessmentRecord['status'] = record.status
  let finalScore = 0
  let grade: AssessmentRecord['grade'] = 'B'

  if (record.status === 'pending' || record.status === 'self_evaluating') {
    const selfTotal = evalDetails.value.reduce((sum: number, d: AssessmentDetail) => sum + (d.selfScore * d.weight / 100), 0)
    nextStatus = 'leader_evaluating'
    assessmentStore.updateRecord(record.id, {
      status: nextStatus,
      selfScore: Math.round(selfTotal),
      details: evalDetails.value,
      comments: evalComments.value
    })
  } else if (record.status === 'leader_evaluating') {
    const leaderTotal = evalDetails.value.reduce((sum: number, d: AssessmentDetail) => sum + (d.leaderScore * d.weight / 100), 0)
    finalScore = Math.round((record.selfScore * 0.4 + leaderTotal * 0.6))
    grade = assessmentStore.getGradeByScore(finalScore)
    nextStatus = 'completed'
    assessmentStore.updateRecord(record.id, {
      status: nextStatus,
      leaderScore: Math.round(leaderTotal),
      finalScore,
      grade,
      details: evalDetails.value,
      comments: evalComments.value,
      completedAt: new Date().toISOString().split('T')[0]
    })
  }

  ElMessage.success('评分已提交')
  evaluateDialogVisible.value = false
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.page-title {
  font-size: 16px;
  font-weight: 600;
}
.search-form {
  margin-bottom: 16px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
.eval-header {
  display: flex;
  gap: 24px;
  padding: 8px 0;
  font-size: 14px;
}
.text-muted {
  color: #bbb;
}
</style>
