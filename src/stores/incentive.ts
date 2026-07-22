import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IncentivePlan, IncentiveRecord } from '@/types'
import { mockIncentivePlans, mockIncentiveRecords } from '@/mock/data'

export const useIncentiveStore = defineStore('incentive', () => {
  const plans = ref<IncentivePlan[]>([...mockIncentivePlans])
  const records = ref<IncentiveRecord[]>([...mockIncentiveRecords])
  const loading = ref(false)

  function getPlanById(id: number) {
    return plans.value.find((p: IncentivePlan) => p.id === id)
  }

  function addPlan(plan: Omit<IncentivePlan, 'id'>) {
    const newId = Math.max(...plans.value.map((p: IncentivePlan) => p.id)) + 1
    plans.value.push({ ...plan, id: newId })
  }

  function updatePlan(id: number, data: Partial<IncentivePlan>) {
    const idx = plans.value.findIndex((p: IncentivePlan) => p.id === id)
    if (idx !== -1) {
      plans.value[idx] = { ...plans.value[idx], ...data }
    }
  }

  function deletePlan(id: number) {
    plans.value = plans.value.filter((p: IncentivePlan) => p.id !== id)
  }

  function updateRecord(id: number, data: Partial<IncentiveRecord>) {
    const idx = records.value.findIndex((r: IncentiveRecord) => r.id === id)
    if (idx !== -1) {
      records.value[idx] = { ...records.value[idx], ...data }
    }
  }

  function approveRecord(id: number, approver: string) {
    const now = new Date().toISOString().split('T')[0]
    updateRecord(id, { status: 'approved', approver, approvedAt: now })
  }

  function rejectRecord(id: number, remark: string) {
    updateRecord(id, { status: 'rejected', remark })
  }

  function markAsPaid(id: number) {
    const now = new Date().toISOString().split('T')[0]
    updateRecord(id, { status: 'paid', paidAt: now })
  }

  function addRecord(record: Omit<IncentiveRecord, 'id'>) {
    const newId = records.value.length ? Math.max(...records.value.map((r: IncentiveRecord) => r.id)) + 1 : 1
    records.value.push({ ...record, id: newId })
  }

  return {
    plans, records, loading,
    getPlanById, addPlan, updatePlan, deletePlan,
    updateRecord, approveRecord, rejectRecord, markAsPaid, addRecord
  }
})
