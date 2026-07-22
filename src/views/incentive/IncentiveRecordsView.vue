<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="page-header">
          <span class="page-title">激励发放记录</span>
          <el-button type="primary" @click="openAddDialog">
            <el-icon><Plus /></el-icon> 新增发放
          </el-button>
        </div>
      </template>

      <!-- Filters -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="激励方案">
          <el-select v-model="searchForm.planId" placeholder="全部" clearable style="width:200px">
            <el-option
              v-for="p in incentiveStore.plans"
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
            <el-option label="待审批" value="pending" />
            <el-option label="已审批" value="approved" />
            <el-option label="已发放" value="paid" />
            <el-option label="已驳回" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="page = 1">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- Summary -->
      <div class="summary-bar">
        <span>共 <strong>{{ totalFiltered }}</strong> 条记录</span>
        <span style="margin-left:24px">
          待发放合计：<strong style="color:#1890ff">
            ¥{{ pendingTotal.toLocaleString() }}
          </strong>
        </span>
        <span style="margin-left:24px">
          已发放合计：<strong style="color:#52c41a">
            ¥{{ paidTotal.toLocaleString() }}
          </strong>
        </span>
      </div>

      <el-table :data="pagedRecords" stripe border>
        <el-table-column prop="planName" label="激励方案" min-width="160" show-overflow-tooltip />
        <el-table-column prop="employeeName" label="员工" width="90" />
        <el-table-column prop="employeeNo" label="工号" width="90" />
        <el-table-column prop="department" label="部门" width="110" />
        <el-table-column prop="period" label="期次" width="100" align="center" />
        <el-table-column prop="grade" label="等级" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="gradeTagType(row.grade)" size="small">{{ row.grade }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="baseAmount" label="基数" width="110" align="right">
          <template #default="{ row }">¥{{ row.baseAmount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="multiplier" label="倍数" width="70" align="center">
          <template #default="{ row }">{{ row.multiplier }}x</template>
        </el-table-column>
        <el-table-column prop="incentiveAmount" label="激励金额" width="120" align="right">
          <template #default="{ row }">
            <strong style="color:#1890ff">¥{{ row.incentiveAmount.toLocaleString() }}</strong>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)" size="small">
              {{ statusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="approver" label="审批人" width="90">
          <template #default="{ row }">{{ row.approver || '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'pending'"
              type="success" link size="small"
              @click="openApproveDialog(row)"
            >审批</el-button>
            <el-button
              v-if="row.status === 'approved'"
              type="primary" link size="small"
              @click="handleMarkPaid(row)"
            >标记发放</el-button>
            <el-button
              v-if="row.status === 'pending'"
              type="danger" link size="small"
              @click="handleReject(row)"
            >驳回</el-button>
            <el-button type="info" link size="small" @click="openDetailDialog(row)">详情</el-button>
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

    <!-- Add Record Dialog -->
    <el-dialog
      v-model="addDialogVisible"
      title="新增激励发放"
      width="560px"
      @close="resetAddForm"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="100px">
        <el-form-item label="激励方案" prop="planId">
          <el-select v-model="addForm.planId" placeholder="选择方案" style="width:100%" @change="onPlanChange">
            <el-option
              v-for="p in activePlans"
              :key="p.id"
              :label="p.name"
              :value="p.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="员工" prop="employeeId">
          <el-select v-model="addForm.employeeId" placeholder="选择员工" style="width:100%" @change="onEmployeeChange">
            <el-option
              v-for="e in activeEmployees"
              :key="e.id"
              :label="`${e.name}（${e.department}）`"
              :value="e.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="考核等级" prop="grade">
          <el-select v-model="addForm.grade" placeholder="选择等级" style="width:100%" @change="onGradeChange">
            <el-option v-for="g in ['S','A','B','C','D']" :key="g" :label="g" :value="g" />
          </el-select>
        </el-form-item>
        <el-form-item label="激励基数" prop="baseAmount">
          <el-input-number v-model="addForm.baseAmount" :min="0" :step="1000" style="width:100%" />
        </el-form-item>
        <el-form-item label="考核期次" prop="period">
          <el-input v-model="addForm.period" placeholder="如 2025-Q3" />
        </el-form-item>
        <el-form-item label="奖金倍数">
          <span style="font-size:16px; font-weight:bold; color:#1890ff">{{ addForm.multiplier }}x</span>
        </el-form-item>
        <el-form-item label="激励金额">
          <span style="font-size:18px; font-weight:bold; color:#f5222d">
            ¥{{ (addForm.baseAmount * addForm.multiplier).toLocaleString() }}
          </span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddSubmit">保存</el-button>
      </template>
    </el-dialog>

    <!-- Detail Dialog -->
    <el-dialog v-model="detailDialogVisible" title="发放详情" width="480px">
      <template v-if="viewingRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="员工">{{ viewingRecord.employeeName }}</el-descriptions-item>
          <el-descriptions-item label="工号">{{ viewingRecord.employeeNo }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ viewingRecord.department }}</el-descriptions-item>
          <el-descriptions-item label="职位">{{ viewingRecord.position }}</el-descriptions-item>
          <el-descriptions-item label="考核等级">
            <el-tag :type="gradeTagType(viewingRecord.grade)">{{ viewingRecord.grade }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="考核期">{{ viewingRecord.period }}</el-descriptions-item>
          <el-descriptions-item label="激励基数">¥{{ viewingRecord.baseAmount.toLocaleString() }}</el-descriptions-item>
          <el-descriptions-item label="奖金倍数">{{ viewingRecord.multiplier }}x</el-descriptions-item>
          <el-descriptions-item label="激励金额" :span="2">
            <strong style="color:#f5222d; font-size:18px">¥{{ viewingRecord.incentiveAmount.toLocaleString() }}</strong>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="statusTagType(viewingRecord.status)">{{ statusLabel(viewingRecord.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="审批人">{{ viewingRecord.approver || '-' }}</el-descriptions-item>
          <el-descriptions-item label="审批时间">{{ viewingRecord.approvedAt || '-' }}</el-descriptions-item>
          <el-descriptions-item label="发放时间">{{ viewingRecord.paidAt || '-' }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ viewingRecord.remark || '-' }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </el-dialog>

    <!-- Approve Dialog -->
    <el-dialog v-model="approveDialogVisible" title="审批激励发放" width="400px">
      <el-form label-width="80px">
        <el-form-item label="审批人">
          <el-input v-model="approverName" placeholder="请输入审批人姓名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitApprove">确认审批</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useIncentiveStore } from '@/stores/incentive'
import { useEmployeeStore } from '@/stores/employee'
import type { IncentiveRecord, IncentivePlan, Employee } from '@/types'

const incentiveStore = useIncentiveStore()
const employeeStore = useEmployeeStore()

const page = ref(1)
const pageSize = ref(10)
const searchForm = reactive({ planId: undefined as number | undefined, department: '', status: '' })
const departments = ['研发部', '产品部', '市场部', '人力资源部', '财务部', '运营部']

const addDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const approveDialogVisible = ref(false)
const viewingRecord = ref<IncentiveRecord | null>(null)
const approvingRecord = ref<IncentiveRecord | null>(null)
const approverName = ref('')
const addFormRef = ref<FormInstance>()

const activeEmployees = computed(() => employeeStore.employees.filter((e: Employee) => e.status === 'active'))
const activePlans = computed(() => incentiveStore.plans.filter((p: IncentivePlan) => p.status === 'active'))

const addForm = reactive({
  planId: undefined as number | undefined,
  planName: '',
  employeeId: undefined as number | undefined,
  employeeName: '',
  employeeNo: '',
  department: '',
  position: '',
  grade: 'B' as IncentiveRecord['grade'],
  baseAmount: 10000,
  multiplier: 1.0,
  incentiveAmount: 10000,
  period: '',
  remark: '',
})

const addRules = {
  planId: [{ required: true, message: '请选择激励方案', trigger: 'change' }],
  employeeId: [{ required: true, message: '请选择员工', trigger: 'change' }],
  grade: [{ required: true, message: '请选择考核等级', trigger: 'change' }],
  period: [{ required: true, message: '请输入考核期次', trigger: 'blur' }],
}

function onPlanChange(planId: number) {
  const plan = incentiveStore.plans.find((p: IncentivePlan) => p.id === planId)
  if (plan) {
    addForm.planName = plan.name
    onGradeChange(addForm.grade)
  }
}

function onEmployeeChange(empId: number) {
  const emp = employeeStore.getById(empId)
  if (emp) {
    addForm.employeeName = emp.name
    addForm.employeeNo = emp.employeeNo
    addForm.department = emp.department
    addForm.position = emp.position
  }
}

function onGradeChange(grade: string) {
  if (!addForm.planId) return
  const plan = incentiveStore.plans.find((p: IncentivePlan) => p.id === addForm.planId)
  if (plan) {
    const rule = plan.gradeRules.find((r: IncentivePlan['gradeRules'][0]) => r.grade === grade)
    addForm.multiplier = rule?.multiplier ?? 1.0
  }
}

function resetAddForm() {
  Object.assign(addForm, {
    planId: undefined, planName: '', employeeId: undefined,
    employeeName: '', employeeNo: '', department: '', position: '',
    grade: 'B', baseAmount: 10000, multiplier: 1.0, period: '', remark: ''
  })
  addFormRef.value?.clearValidate()
}

const filtered = computed(() => {
  return incentiveStore.records.filter((r: IncentiveRecord) => {
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

const pendingTotal = computed(() =>
  filtered.value.filter((r: IncentiveRecord) => r.status === 'pending' || r.status === 'approved')
    .reduce((sum: number, r: IncentiveRecord) => sum + r.incentiveAmount, 0)
)

const paidTotal = computed(() =>
  filtered.value.filter((r: IncentiveRecord) => r.status === 'paid')
    .reduce((sum: number, r: IncentiveRecord) => sum + r.incentiveAmount, 0)
)

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
  return { pending: '待审批', approved: '已审批', paid: '已发放', rejected: '已驳回' }[status] ?? status
}

function statusTagType(status: string): '' | 'success' | 'warning' | 'danger' | 'info' {
  return ({ pending: 'warning', approved: '', paid: 'success', rejected: 'danger' } as Record<string, '' | 'success' | 'warning' | 'danger' | 'info'>)[status] ?? 'info'
}

function openDetailDialog(record: IncentiveRecord) {
  viewingRecord.value = record
  detailDialogVisible.value = true
}

function openApproveDialog(record: IncentiveRecord) {
  approvingRecord.value = record
  approverName.value = ''
  approveDialogVisible.value = true
}

function submitApprove() {
  if (!approverName.value.trim()) {
    ElMessage.warning('请输入审批人姓名')
    return
  }
  if (approvingRecord.value) {
    incentiveStore.approveRecord(approvingRecord.value.id, approverName.value)
    ElMessage.success('审批成功')
    approveDialogVisible.value = false
  }
}

function handleReject(record: IncentiveRecord) {
  ElMessageBox.prompt('请输入驳回原因', '驳回', {
    confirmButtonText: '确认驳回',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入驳回原因',
  }).then(({ value }) => {
    incentiveStore.rejectRecord(record.id, value || '已驳回')
    ElMessage.success('已驳回')
  }).catch(() => {})
}

function handleMarkPaid(record: IncentiveRecord) {
  ElMessageBox.confirm(`确认标记员工 ${record.employeeName} 的激励 ¥${record.incentiveAmount.toLocaleString()} 已发放？`, '提示', {
    type: 'warning'
  }).then(() => {
    incentiveStore.markAsPaid(record.id)
    ElMessage.success('已标记为已发放')
  }).catch(() => {})
}

function openAddDialog() {
  resetAddForm()
  addDialogVisible.value = true
}

async function handleAddSubmit() {
  const valid = await addFormRef.value?.validate().catch(() => false)
  if (!valid) return
  const now = new Date().toISOString().split('T')[0]
  const incentiveAmount = addForm.baseAmount * addForm.multiplier
  incentiveStore.addRecord({
    planId: addForm.planId!,
    planName: addForm.planName,
    assessmentId: 0,
    employeeId: addForm.employeeId!,
    employeeName: addForm.employeeName,
    employeeNo: addForm.employeeNo,
    department: addForm.department,
    position: addForm.position,
    period: addForm.period,
    grade: addForm.grade,
    baseAmount: addForm.baseAmount,
    multiplier: addForm.multiplier,
    incentiveAmount,
    status: 'pending',
    remark: addForm.remark,
    createdAt: now,
  })
  ElMessage.success('激励记录已创建')
  addDialogVisible.value = false
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
  margin-bottom: 12px;
}
.summary-bar {
  padding: 8px 12px;
  margin-bottom: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 13px;
  color: #555;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
