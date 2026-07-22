<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="page-header">
          <span class="page-title">员工管理</span>
          <el-button type="primary" @click="openAddDialog">
            <el-icon><Plus /></el-icon> 新增员工
          </el-button>
        </div>
      </template>

      <!-- Search Bar -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="员工姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="searchForm.department" placeholder="全部部门" clearable>
            <el-option v-for="d in departments" :key="d" :label="d" :value="d" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable>
            <el-option label="在职" value="active" />
            <el-option label="离职" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- Table -->
      <el-table :data="filteredEmployees" stripe border>
        <el-table-column prop="employeeNo" label="工号" width="100" />
        <el-table-column prop="name" label="姓名" width="90" />
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="position" label="职位" width="140" />
        <el-table-column prop="level" label="职级" width="80" align="center" />
        <el-table-column prop="entryDate" label="入职日期" width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column prop="status" label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === 'active' ? '在职' : '离职' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openEditDialog(row)">编辑</el-button>
            <el-button
              :type="row.status === 'active' ? 'warning' : 'success'"
              link size="small"
              @click="toggleStatus(row)"
            >
              {{ row.status === 'active' ? '离职' : '复职' }}
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
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

    <!-- Add/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingEmployee ? '编辑员工' : '新增员工'"
      width="560px"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="员工姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号" prop="employeeNo">
              <el-input v-model="form.employeeNo" placeholder="如 EMP013" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="department">
              <el-select v-model="form.department" placeholder="选择部门" style="width:100%">
                <el-option v-for="d in departments" :key="d" :label="d" :value="d" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-input v-model="form.position" placeholder="请输入职位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职级" prop="level">
              <el-select v-model="form.level" placeholder="选择职级" style="width:100%">
                <el-option v-for="l in levels" :key="l" :label="l" :value="l" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期" prop="entryDate">
              <el-date-picker
                v-model="form.entryDate"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入电话" />
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
import { ref, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useEmployeeStore } from '@/stores/employee'
import type { Employee } from '@/types'

const store = useEmployeeStore()

const page = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const editingEmployee = ref<Employee | null>(null)
const formRef = ref<FormInstance>()

const searchForm = reactive({ name: '', department: '', status: '' })

const departments = ['研发部', '产品部', '市场部', '人力资源部', '财务部', '运营部']
const levels = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'M1', 'M2', 'M3', 'M4']

const form = reactive<Omit<Employee, 'id'>>({
  name: '', employeeNo: '', department: '', position: '',
  level: '', entryDate: '', status: 'active', email: '', phone: ''
})

const rules = {
  name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  employeeNo: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  department: [{ required: true, message: '请选择部门', trigger: 'change' }],
  position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
  level: [{ required: true, message: '请选择职级', trigger: 'change' }],
  entryDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
}

const searchFiltered = computed(() => {
  return store.employees.filter((e: Employee) => {
    const nameMatch = !searchForm.name || e.name.includes(searchForm.name)
    const deptMatch = !searchForm.department || e.department === searchForm.department
    const statusMatch = !searchForm.status || e.status === searchForm.status
    return nameMatch && deptMatch && statusMatch
  })
})

const totalFiltered = computed(() => searchFiltered.value.length)

const filteredEmployees = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return searchFiltered.value.slice(start, start + pageSize.value)
})

function handleSearch() { page.value = 1 }
function resetSearch() {
  searchForm.name = ''
  searchForm.department = ''
  searchForm.status = ''
  page.value = 1
}

function openAddDialog() {
  editingEmployee.value = null
  resetForm()
  dialogVisible.value = true
}

function openEditDialog(emp: Employee) {
  editingEmployee.value = emp
  Object.assign(form, { ...emp })
  dialogVisible.value = true
}

function resetForm() {
  Object.assign(form, {
    name: '', employeeNo: '', department: '', position: '',
    level: '', entryDate: '', status: 'active', email: '', phone: ''
  })
  formRef.value?.clearValidate()
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  if (editingEmployee.value) {
    store.update(editingEmployee.value.id, { ...form })
    ElMessage.success('更新成功')
  } else {
    store.add({ ...form })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
}

function toggleStatus(emp: Employee) {
  const newStatus = emp.status === 'active' ? 'inactive' : 'active'
  const label = newStatus === 'inactive' ? '办理离职' : '恢复在职'
  ElMessageBox.confirm(`确认要${label}吗？`, '提示', { type: 'warning' }).then(() => {
    store.update(emp.id, { status: newStatus })
    ElMessage.success('操作成功')
  }).catch(() => {})
}

function handleDelete(emp: Employee) {
  ElMessageBox.confirm(`确认删除员工 ${emp.name} 吗？此操作不可撤销。`, '警告', {
    type: 'error'
  }).then(() => {
    store.remove(emp.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style scoped>
.page-container {
  padding: 0;
}

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
</style>
