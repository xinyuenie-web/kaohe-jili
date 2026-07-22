import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AssessmentPlan, AssessmentRecord, KpiIndicator } from '@/types'
import { mockAssessmentPlans, mockAssessmentRecords, mockKpiIndicators } from '@/mock/data'

export const useAssessmentStore = defineStore('assessment', () => {
  const plans = ref<AssessmentPlan[]>([...mockAssessmentPlans])
  const records = ref<AssessmentRecord[]>([...mockAssessmentRecords])
  const indicators = ref<KpiIndicator[]>([...mockKpiIndicators])
  const loading = ref(false)

  function getGradeByScore(score: number): AssessmentRecord['grade'] {
    if (score >= 90) return 'S'
    if (score >= 80) return 'A'
    if (score >= 70) return 'B'
    if (score >= 60) return 'C'
    return 'D'
  }

  function getPlanById(id: number) {
    return plans.value.find((p: AssessmentPlan) => p.id === id)
  }

  function getRecordById(id: number) {
    return records.value.find((r: AssessmentRecord) => r.id === id)
  }

  function addPlan(plan: Omit<AssessmentPlan, 'id'>) {
    const newId = Math.max(...plans.value.map((p: AssessmentPlan) => p.id)) + 1
    plans.value.push({ ...plan, id: newId })
  }

  function updatePlan(id: number, data: Partial<AssessmentPlan>) {
    const idx = plans.value.findIndex((p: AssessmentPlan) => p.id === id)
    if (idx !== -1) {
      plans.value[idx] = { ...plans.value[idx], ...data }
    }
  }

  function deletePlan(id: number) {
    plans.value = plans.value.filter((p: AssessmentPlan) => p.id !== id)
  }

  function updateRecord(id: number, data: Partial<AssessmentRecord>) {
    const idx = records.value.findIndex((r: AssessmentRecord) => r.id === id)
    if (idx !== -1) {
      records.value[idx] = { ...records.value[idx], ...data }
    }
  }

  function addIndicator(indicator: Omit<KpiIndicator, 'id'>) {
    const newId = Math.max(...indicators.value.map((i: KpiIndicator) => i.id)) + 1
    indicators.value.push({ ...indicator, id: newId })
  }

  function updateIndicator(id: number, data: Partial<KpiIndicator>) {
    const idx = indicators.value.findIndex((i: KpiIndicator) => i.id === id)
    if (idx !== -1) {
      indicators.value[idx] = { ...indicators.value[idx], ...data }
    }
  }

  function deleteIndicator(id: number) {
    indicators.value = indicators.value.filter((i: KpiIndicator) => i.id !== id)
  }

  return {
    plans, records, indicators, loading,
    getGradeByScore, getPlanById, getRecordById,
    addPlan, updatePlan, deletePlan,
    updateRecord,
    addIndicator, updateIndicator, deleteIndicator
  }
})
