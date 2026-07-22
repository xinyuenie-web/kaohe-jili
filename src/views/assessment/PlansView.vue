<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="page-header">
          <span class="page-title">考核方案管理</span>
          <el-button type="primary" @click="openAddDialog">
            <el-icon><Plus /></el-icon> 新建方案
          </el-button>
        </div>
      </template>

      <el-table :data="store.plans" stripe border>
        <el-table-column prop="name" label="方案名称" min-width="180" />
        <el-table-column prop="year" label="年度" width="80" align="center" />
        <el-table-column prop="quarter" label="季度" width="80" align="center">
          <template #default="{ row }">Q{{ row.quarter }}</template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="结束日期" width="120" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="planStatusTag(row.status)" size="small">
              {{ planStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openEditDialog(row)">编辑</el-button>
            <el-button
              v-if="row.status === 'draft'"
              type="success" link size="small"
              @click="activatePlan(row)"
            >启动</el-button>
            <el-button
              v-if="row.status === 'active'"
              type="warning" link size="small"
              @click="completePlan(row)"
            >完成</el-button>
            <el-button
              v-if="row.status === 'draft'"
              type="danger" link size="small"
              @click="handleDelete(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Add/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingPlan ? '编辑方案' : '新建方案'"
      width="640px"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="方案名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入方案名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年度" prop="year">
              <el-input-number v-model="form.year" :min="2020" :max="2030" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="季度" prop="quarter">
              <el-select v-model="form.quarter" style="width:100%">
                <el-option label="第一季度" :value="1" />
                <el-option label="第二季度" :value="2" />
                <el-option label="第三季度" :value="3" />
                <el-option label="第四季度" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker
                v-model="form.startDate"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="考核指标">
              <el-checkbox-group v-model="selectedIndicatorIds">
                <el-checkbox
                  v-for="ind in assessmentStore.indicators"
                  :key="ind.id"
                  :value="ind.id"
                >
                  {{ ind.name }}（权重{{ ind.weight }}%）
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="说明" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="2" placeholder="方案说明" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useAssessmentStore } from '@/stores/assessment'
import type { AssessmentPlan, KpiIndicator } from '@/types'

const store = useAssessmentStore()
const assessmentStore = useAssessmentStore()

const dialogVisible = ref(false)
const editingPlan = ref<AssessmentPlan | null>(null)
const formRef = ref<FormInstance>()
const selectedIndicatorIds = ref<number[]>([])

const form = reactive({
  name: '',
  year: new Date().getFullYear(),
  quarter: 1,
  startDate: '',
  endDate: '',
  description: '',
  status: 'draft' as AssessmentPlan['status'],
  indicators: [] as AssessmentPlan['indicators']
})

const rules = {
  name: [{ required: true, message: '请输入方案名称', trigger: 'blur' }],
  year: [{ required: true, message: '请输入年度', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
}

function planStatusLabel(status: string) {
  return { draft: '草稿', active: '进行中', completed: '已完成' }[status] ?? status
}

function planStatusTag(status: string): '' | 'success' | 'warning' | 'danger' | 'info' {
  return ({ draft: 'info', active: 'success', completed: '' } as Record<string, '' | 'success' | 'warning' | 'danger' | 'info'>)[status] ?? 'info'
}

function openAddDialog() {
  editingPlan.value = null
  resetForm()
  dialogVisible.value = true
}

function openEditDialog(plan: AssessmentPlan) {
  editingPlan.value = plan
  Object.assign(form, { ...plan })
  selectedIndicatorIds.value = plan.indicators.map((i: { indicatorId: number }) => i.indicatorId)
  dialogVisible.value = true
}

function resetForm() {
  Object.assign(form, {
    name: '', year: new Date().getFullYear(), quarter: 1,
    startDate: '', endDate: '', description: '', status: 'draft', indicators: []
  })
  selectedIndicatorIds.value = []
  formRef.value?.clearValidate()
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  const indicators = selectedIndicatorIds.value.map((id: number) => {
    const ind = assessmentStore.indicators.find((i: KpiIndicator) => i.id === id)!
    return { indicatorId: ind.id, indicatorName: ind.name, weight: ind.weight, maxScore: ind.maxScore }
  })

  if (editingPlan.value) {
    store.updatePlan(editingPlan.value.id, { ...form, indicators })
    ElMessage.success('更新成功')
  } else {
    store.addPlan({ ...form, indicators })
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
}

function activatePlan(plan: AssessmentPlan) {
  ElMessageBox.confirm('确认启动此考核方案？启动后将开始考核流程。', '提示', { type: 'warning' }).then(() => {
    store.updatePlan(plan.id, { status: 'active' })
    ElMessage.success('方案已启动')
  }).catch(() => {})
}

function completePlan(plan: AssessmentPlan) {
  ElMessageBox.confirm('确认完成此考核方案？', '提示', { type: 'warning' }).then(() => {
    store.updatePlan(plan.id, { status: 'completed' })
    ElMessage.success('方案已完成')
  }).catch(() => {})
}

function handleDelete(plan: AssessmentPlan) {
  ElMessageBox.confirm(`确认删除方案"${plan.name}"吗？`, '警告', { type: 'error' }).then(() => {
    store.deletePlan(plan.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
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
</style>
