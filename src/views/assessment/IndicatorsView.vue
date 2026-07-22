<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="page-header">
          <span class="page-title">考核指标管理</span>
          <el-button type="primary" @click="openAddDialog">
            <el-icon><Plus /></el-icon> 新增指标
          </el-button>
        </div>
      </template>

      <el-table :data="store.indicators" stripe border>
        <el-table-column prop="name" label="指标名称" min-width="140" />
        <el-table-column prop="category" label="指标类别" width="120">
          <template #default="{ row }">
            <el-tag :type="categoryTagType(row.category)" size="small">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="权重(%)" width="90" align="center" />
        <el-table-column prop="maxScore" label="满分" width="80" align="center" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="scoringCriteria" label="评分标准" min-width="300" show-overflow-tooltip />
        <el-table-column label="操作" width="130" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openEditDialog(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Weight total reminder -->
      <div class="weight-summary">
        <span>当前指标权重合计：
          <strong :class="totalWeight === 100 ? 'text-success' : 'text-warning'">
            {{ totalWeight }}%
          </strong>
          <span v-if="totalWeight !== 100" style="color:#faad14; margin-left:8px">
            （权重应合计为100%）
          </span>
        </span>
      </div>
    </el-card>

    <!-- Add/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingIndicator ? '编辑指标' : '新增指标'"
      width="560px"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="指标名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入指标名称" />
        </el-form-item>
        <el-form-item label="指标类别" prop="category">
          <el-select v-model="form.category" placeholder="选择类别" style="width:100%">
            <el-option label="工作绩效" value="工作绩效" />
            <el-option label="工作态度" value="工作态度" />
            <el-option label="工作能力" value="工作能力" />
            <el-option label="创新贡献" value="创新贡献" />
          </el-select>
        </el-form-item>
        <el-form-item label="权重(%)" prop="weight">
          <el-input-number v-model="form.weight" :min="1" :max="100" style="width:100%" />
        </el-form-item>
        <el-form-item label="满分" prop="maxScore">
          <el-input-number v-model="form.maxScore" :min="10" :max="100" :step="10" style="width:100%" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="指标描述" />
        </el-form-item>
        <el-form-item label="评分标准" prop="scoringCriteria">
          <el-input v-model="form.scoringCriteria" type="textarea" :rows="3" placeholder="请描述各分段的评分标准" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useAssessmentStore } from '@/stores/assessment'
import type { KpiIndicator } from '@/types'

const store = useAssessmentStore()

const dialogVisible = ref(false)
const editingIndicator = ref<KpiIndicator | null>(null)
const formRef = ref<FormInstance>()

const form = reactive<Omit<KpiIndicator, 'id'>>({
  name: '', category: '工作绩效', description: '', weight: 10, maxScore: 100, scoringCriteria: ''
})

const rules = {
  name: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择类别', trigger: 'change' }],
  weight: [{ required: true, message: '请设置权重', trigger: 'change' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
}

const totalWeight = computed(() =>
  store.indicators.reduce((sum: number, i: KpiIndicator) => sum + i.weight, 0)
)

function categoryTagType(cat: string): '' | 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    '工作绩效': '',
    '工作态度': 'success',
    '工作能力': 'warning',
    '创新贡献': 'info'
  }
  return map[cat] ?? 'info'
}

function openAddDialog() {
  editingIndicator.value = null
  resetForm()
  dialogVisible.value = true
}

function openEditDialog(indicator: KpiIndicator) {
  editingIndicator.value = indicator
  Object.assign(form, { ...indicator })
  dialogVisible.value = true
}

function resetForm() {
  Object.assign(form, {
    name: '', category: '工作绩效', description: '', weight: 10, maxScore: 100, scoringCriteria: ''
  })
  formRef.value?.clearValidate()
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  if (editingIndicator.value) {
    store.updateIndicator(editingIndicator.value.id, { ...form })
    ElMessage.success('更新成功')
  } else {
    store.addIndicator({ ...form })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
}

function handleDelete(indicator: KpiIndicator) {
  ElMessageBox.confirm(`确认删除指标"${indicator.name}"吗？`, '提示', { type: 'warning' }).then(() => {
    store.deleteIndicator(indicator.id)
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
.weight-summary {
  margin-top: 12px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 13px;
}
.text-success { color: #52c41a; }
.text-warning { color: #faad14; }
</style>
