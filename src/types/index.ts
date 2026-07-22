// 员工信息
export interface Employee {
  id: number
  name: string
  employeeNo: string
  department: string
  position: string
  level: string
  entryDate: string
  status: 'active' | 'inactive'
  email: string
  phone: string
}

// 考核指标
export interface KpiIndicator {
  id: number
  name: string
  category: '工作绩效' | '工作态度' | '工作能力' | '创新贡献'
  description: string
  weight: number
  maxScore: number
  scoringCriteria: string
}

// 考核方案
export interface AssessmentPlan {
  id: number
  name: string
  year: number
  quarter: number
  startDate: string
  endDate: string
  status: 'draft' | 'active' | 'completed'
  indicators: AssessmentPlanIndicator[]
  description: string
}

export interface AssessmentPlanIndicator {
  indicatorId: number
  indicatorName: string
  weight: number
  maxScore: number
}

// 考核记录
export interface AssessmentRecord {
  id: number
  planId: number
  planName: string
  employeeId: number
  employeeName: string
  department: string
  position: string
  period: string
  totalScore: number
  grade: 'S' | 'A' | 'B' | 'C' | 'D'
  selfScore: number
  leaderScore: number
  finalScore: number
  status: 'pending' | 'self_evaluating' | 'leader_evaluating' | 'completed'
  details: AssessmentDetail[]
  comments: string
  createdAt: string
  completedAt?: string
}

export interface AssessmentDetail {
  indicatorId: number
  indicatorName: string
  weight: number
  maxScore: number
  selfScore: number
  leaderScore: number
  finalScore: number
  comment: string
}

// 激励方案
export interface IncentivePlan {
  id: number
  name: string
  year: number
  type: '季度奖金' | '年度奖金' | '专项奖励' | '其他'
  gradeRules: IncentiveGradeRule[]
  status: 'draft' | 'active' | 'completed'
  totalBudget: number
  description: string
  createdAt: string
}

export interface IncentiveGradeRule {
  grade: 'S' | 'A' | 'B' | 'C' | 'D'
  multiplier: number
  description: string
}

// 激励发放记录
export interface IncentiveRecord {
  id: number
  planId: number
  planName: string
  assessmentId: number
  employeeId: number
  employeeName: string
  employeeNo: string
  department: string
  position: string
  period: string
  grade: 'S' | 'A' | 'B' | 'C' | 'D'
  baseAmount: number
  multiplier: number
  incentiveAmount: number
  status: 'pending' | 'approved' | 'paid' | 'rejected'
  approver?: string
  approvedAt?: string
  paidAt?: string
  remark: string
  createdAt: string
}

// 统计数据
export interface DashboardStats {
  totalEmployees: number
  activeAssessments: number
  pendingIncentives: number
  totalIncentiveAmount: number
  gradeDistribution: GradeDistribution[]
  departmentStats: DepartmentStat[]
  monthlyTrend: MonthlyTrend[]
}

export interface GradeDistribution {
  grade: string
  count: number
  percentage: number
}

export interface DepartmentStat {
  department: string
  avgScore: number
  employeeCount: number
  incentiveAmount: number
}

export interface MonthlyTrend {
  month: string
  assessmentCount: number
  avgScore: number
  incentiveAmount: number
}
