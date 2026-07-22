<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="page-header">
          <span class="page-title">激励方案管理</span>
          <el-button type="primary" @click="openAddDialog">
            <el-icon><Plus /></el-icon> 新建方案
          </el-button>
        </div>
      </template>

      <el-table :data="incentiveStore.plans" stripe border>
        <el-table-column prop="name" label="方案名称" min-width="180" />
        <el-table-column prop="year" label="年度" width="80" align="center" />
        <el-table-column prop="type" label="类型" width="110">
          <template #default="{ row }">
            <el-tag type="info" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalBudget" label="预算金额" width="130" align="right">
          <template #default="{ row }">¥{{ row.totalBudget.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="planStatusTag(row.status)" size="small">{{ planStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openDetailDialog(row)">查看规则</el-button>
            <el-button type="primary" link size="small" @click="openEditDialog(row)">编辑</el-button>
            <el-button
              v-if="row.status === 'draft'"
              type="success" link size="small"
              @click="activatePlan(row)"
            >启动</el-button>
            <el-button
              v-if="row.status === 'draft'"
              type="danger" link size="small"
              @click="handleDelete(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- View Rules Dialog -->
    <el-dialog v-model="detailDialogVisible" :title="viewingPlan?.name" width="500px">
      <template v-if="viewingPlan">
        <p style="margin-bottom:12px; color:#666">{{ viewingPlan.description }}</p>
        <el-table :data="viewingPlan.gradeRules" border size="small">
          <el-table-column prop="grade" label="考核等级" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="gradeTagType(row.grade)">{{ row.grade }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="multiplier" label="奖金倍数" width="100" align="center">
            <template #default="{ row }">{{ row.multiplier }}x</template>
          </el-table-column>
          <el-table-column prop="description" label="说明" />
        </el-table>
      </template>
    </el-dialog>

    <!-- Add/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingPlan ? '编辑方案' : '新建方案'"
      width="640px"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="方案名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入方案名称" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="年度" prop="year">
              <el-input-number v-model="form.year" :min="2020" :max="2030" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="激励类型" prop="type">
              <el-select v-model="form.type" style="width:100%">
                <el-option label="季度奖金" value="季度奖金" />
                <el-option label="年度奖金" value="年度奖金" />
                <el-option label="专项奖励" value="专项奖励" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="预算金额" prop="totalBudget">
          <el-input-number v-model="form.totalBudget" :min="0" :step="10000" style="width:100%" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="form.description" type="textarea" :rows="2" />
        </el-form-item>
        <el-divider>等级奖金规则</el-divider>
        <el-table :data="form.gradeRules" border size="small">
          <el-table-column prop="grade" label="等级" width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="gradeTagType(row.grade)">{{ row.grade }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="奖金倍数(月薪)" min-width="140">
            <template #default="{ row }">
              <el-input-number v-model="row.multiplier" :min="0" :max="10" :step="0.5" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="说明" min-width="160">
            <template #default="{ row }">
              <el-input v-model="row.description" size="small" />
            </template>
          </el-table-column>
        </el-table>
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
import { useIncentiveStore } from '@/stores/incentive'
import type { IncentivePlan } from '@/types'

const incentiveStore = useIncentiveStore()

const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const editingPlan = ref<IncentivePlan | null>(null)
const viewingPlan = ref<IncentivePlan | null>(null)
const formRef = ref<FormInstance>()

const defaultGradeRules = () => [
  { grade: 'S' as const, multiplier: 3.0, description: 'S级：月薪3倍' },
  { grade: 'A' as const, multiplier: 2.0, description: 'A级：月薪2倍' },
  { grade: 'B' as const, multiplier: 1.0, description: 'B级：月薪1倍' },
  { grade: 'C' as const, multiplier: 0.5, description: 'C级：月薪0.5倍' },
  { grade: 'D' as const, multiplier: 0.0, description: 'D级：无奖金' },
]

const form = reactive({
  name: '',
  year: new Date().getFullYear(),
  type: '季度奖金' as IncentivePlan['type'],
  totalBudget: 100000,
  status: 'draft' as IncentivePlan['status'],
  description: '',
  createdAt: '',
  gradeRules: defaultGradeRules()
})

const rules = {
  name: [{ required: true, message: '请输入方案名称', trigger: 'blur' }],
  year: [{ required: true, message: '请输入年度', trigger: 'change' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
}

function planStatusLabel(status: string) {
  return { draft: '草稿', active: '进行中', completed: '已完成' }[status] ?? status
}

function planStatusTag(status: string): '' | 'success' | 'warning' | 'danger' | 'info' {
  return ({ draft: 'info', active: 'success', completed: '' } as Record<string, '' | 'success' | 'warning' | 'danger' | 'info'>)[status] ?? 'info'
}

function gradeTagType(grade: string): '' | 'success' | 'warning' | 'danger' | 'info' {
  return ({ S: '', A: 'success', B: 'info', C: 'warning', D: 'danger' } as Record<string, '' | 'success' | 'warning' | 'danger' | 'info'>)[grade] ?? 'info'
}

function openDetailDialog(plan: IncentivePlan) {
  viewingPlan.value = plan
  detailDialogVisible.value = true
}

function openAddDialog() {
  editingPlan.value = null
  resetForm()
  dialogVisible.value = true
}

function openEditDialog(plan: IncentivePlan) {
  editingPlan.value = plan
  Object.assign(form, {
    ...plan,
    gradeRules: plan.gradeRules.map((r: IncentivePlan['gradeRules'][0]) => ({ ...r }))
  })
  dialogVisible.value = true
}

function resetForm() {
  Object.assign(form, {
    name: '', year: new Date().getFullYear(), type: '季度奖金',
    totalBudget: 100000, status: 'draft', description: '',
    createdAt: '', gradeRules: defaultGradeRules()
  })
  formRef.value?.clearValidate()
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  const now = new Date().toISOString().split('T')[0]
  if (editingPlan.value) {
    incentiveStore.updatePlan(editingPlan.value.id, { ...form })
    ElMessage.success('更新成功')
  } else {
    incentiveStore.addPlan({ ...form, createdAt: now })
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
}

function activatePlan(plan: IncentivePlan) {
  ElMessageBox.confirm('确认启动此激励方案？', '提示', { type: 'warning' }).then(() => {
    incentiveStore.updatePlan(plan.id, { status: 'active' })
    ElMessage.success('方案已启动')
  }).catch(() => {})
}

function handleDelete(plan: IncentivePlan) {
  ElMessageBox.confirm(`确认删除方案"${plan.name}"吗？`, '警告', { type: 'error' }).then(() => {
    incentiveStore.deletePlan(plan.id)
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
