import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Employee } from '@/types'
import { mockEmployees } from '@/mock/data'

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([...mockEmployees])
  const loading = ref(false)

  function getAll() {
    return employees.value
  }

  function getById(id: number) {
    return employees.value.find((e: Employee) => e.id === id)
  }

  function add(employee: Omit<Employee, 'id'>) {
    const newId = Math.max(...employees.value.map((e: Employee) => e.id)) + 1
    employees.value.push({ ...employee, id: newId })
  }

  function update(id: number, data: Partial<Employee>) {
    const idx = employees.value.findIndex((e: Employee) => e.id === id)
    if (idx !== -1) {
      employees.value[idx] = { ...employees.value[idx], ...data }
    }
  }

  function remove(id: number) {
    employees.value = employees.value.filter((e: Employee) => e.id !== id)
  }

  return { employees, loading, getAll, getById, add, update, remove }
})
