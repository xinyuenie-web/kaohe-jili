import type {
  Employee, KpiIndicator, AssessmentPlan, AssessmentRecord,
  IncentivePlan, IncentiveRecord, DashboardStats
} from '@/types'

export const mockEmployees: Employee[] = [
  { id: 1, name: '张伟', employeeNo: 'EMP001', department: '研发部', position: '高级工程师', level: 'P6', entryDate: '2020-03-15', status: 'active', email: 'zhangwei@company.com', phone: '13800138001' },
  { id: 2, name: '李娜', employeeNo: 'EMP002', department: '产品部', position: '产品经理', level: 'P7', entryDate: '2019-06-01', status: 'active', email: 'lina@company.com', phone: '13800138002' },
  { id: 3, name: '王磊', employeeNo: 'EMP003', department: '研发部', position: '技术总监', level: 'M3', entryDate: '2018-01-10', status: 'active', email: 'wanglei@company.com', phone: '13800138003' },
  { id: 4, name: '赵敏', employeeNo: 'EMP004', department: '市场部', position: '市场专员', level: 'P4', entryDate: '2021-09-01', status: 'active', email: 'zhaomin@company.com', phone: '13800138004' },
  { id: 5, name: '刘洋', employeeNo: 'EMP005', department: '人力资源部', position: 'HR经理', level: 'M2', entryDate: '2019-03-20', status: 'active', email: 'liuyang@company.com', phone: '13800138005' },
  { id: 6, name: '陈静', employeeNo: 'EMP006', department: '财务部', position: '财务主管', level: 'M2', entryDate: '2017-07-01', status: 'active', email: 'chenjing@company.com', phone: '13800138006' },
  { id: 7, name: '吴强', employeeNo: 'EMP007', department: '研发部', position: '前端工程师', level: 'P5', entryDate: '2021-04-12', status: 'active', email: 'wuqiang@company.com', phone: '13800138007' },
  { id: 8, name: '周梅', employeeNo: 'EMP008', department: '市场部', position: '销售经理', level: 'M1', entryDate: '2020-08-15', status: 'active', email: 'zhoumei@company.com', phone: '13800138008' },
  { id: 9, name: '徐杰', employeeNo: 'EMP009', department: '研发部', position: '后端工程师', level: 'P4', entryDate: '2022-01-05', status: 'active', email: 'xujie@company.com', phone: '13800138009' },
  { id: 10, name: '孙艳', employeeNo: 'EMP010', department: '产品部', position: '产品专员', level: 'P3', entryDate: '2022-06-20', status: 'active', email: 'sunyan@company.com', phone: '13800138010' },
  { id: 11, name: '马超', employeeNo: 'EMP011', department: '市场部', position: '市场总监', level: 'M3', entryDate: '2016-05-01', status: 'active', email: 'machao@company.com', phone: '13800138011' },
  { id: 12, name: '朱华', employeeNo: 'EMP012', department: '财务部', position: '会计', level: 'P3', entryDate: '2021-11-01', status: 'inactive', email: 'zhuhua@company.com', phone: '13800138012' },
]

export const mockKpiIndicators: KpiIndicator[] = [
  { id: 1, name: '工作目标完成率', category: '工作绩效', description: '本周期内工作目标的完成情况', weight: 40, maxScore: 100, scoringCriteria: '完成率≥120%得100分，100%-119%得90分，80%-99%得70分，60%-79%得50分，60%以下得0分' },
  { id: 2, name: '工作质量', category: '工作绩效', description: '工作成果的质量和准确性', weight: 20, maxScore: 100, scoringCriteria: '优秀100分，良好80分，一般60分，较差40分，差20分' },
  { id: 3, name: '工作效率', category: '工作绩效', description: '完成工作任务的效率和速度', weight: 15, maxScore: 100, scoringCriteria: '优秀100分，良好80分，一般60分，较差40分，差20分' },
  { id: 4, name: '工作态度', category: '工作态度', description: '对工作的积极性、责任心和敬业精神', weight: 10, maxScore: 100, scoringCriteria: '优秀100分，良好80分，一般60分，较差40分，差20分' },
  { id: 5, name: '团队协作', category: '工作态度', description: '与团队成员的协作和沟通能力', weight: 5, maxScore: 100, scoringCriteria: '优秀100分，良好80分，一般60分，较差40分，差20分' },
  { id: 6, name: '学习成长', category: '工作能力', description: '持续学习和提升个人能力的表现', weight: 5, maxScore: 100, scoringCriteria: '优秀100分，良好80分，一般60分，较差40分，差20分' },
  { id: 7, name: '创新能力', category: '创新贡献', description: '在工作中提出创新想法和解决方案', weight: 5, maxScore: 100, scoringCriteria: '优秀100分，良好80分，一般60分，较差40分，差20分' },
]

export const mockAssessmentPlans: AssessmentPlan[] = [
  {
    id: 1, name: '2025年Q2绩效考核', year: 2025, quarter: 2,
    startDate: '2025-04-01', endDate: '2025-06-30', status: 'completed',
    description: '2025年第二季度全员绩效考核',
    indicators: [
      { indicatorId: 1, indicatorName: '工作目标完成率', weight: 40, maxScore: 100 },
      { indicatorId: 2, indicatorName: '工作质量', weight: 20, maxScore: 100 },
      { indicatorId: 3, indicatorName: '工作效率', weight: 15, maxScore: 100 },
      { indicatorId: 4, indicatorName: '工作态度', weight: 10, maxScore: 100 },
      { indicatorId: 5, indicatorName: '团队协作', weight: 5, maxScore: 100 },
      { indicatorId: 6, indicatorName: '学习成长', weight: 5, maxScore: 100 },
      { indicatorId: 7, indicatorName: '创新能力', weight: 5, maxScore: 100 },
    ]
  },
  {
    id: 2, name: '2025年Q3绩效考核', year: 2025, quarter: 3,
    startDate: '2025-07-01', endDate: '2025-09-30', status: 'active',
    description: '2025年第三季度全员绩效考核',
    indicators: [
      { indicatorId: 1, indicatorName: '工作目标完成率', weight: 40, maxScore: 100 },
      { indicatorId: 2, indicatorName: '工作质量', weight: 20, maxScore: 100 },
      { indicatorId: 3, indicatorName: '工作效率', weight: 15, maxScore: 100 },
      { indicatorId: 4, indicatorName: '工作态度', weight: 10, maxScore: 100 },
      { indicatorId: 5, indicatorName: '团队协作', weight: 5, maxScore: 100 },
      { indicatorId: 6, indicatorName: '学习成长', weight: 5, maxScore: 100 },
      { indicatorId: 7, indicatorName: '创新能力', weight: 5, maxScore: 100 },
    ]
  },
  {
    id: 3, name: '2025年Q4绩效考核', year: 2025, quarter: 4,
    startDate: '2025-10-01', endDate: '2025-12-31', status: 'draft',
    description: '2025年第四季度全员绩效考核',
    indicators: []
  },
]

export const mockAssessmentRecords: AssessmentRecord[] = [
  {
    id: 1, planId: 1, planName: '2025年Q2绩效考核', employeeId: 1, employeeName: '张伟',
    department: '研发部', position: '高级工程师', period: '2025-Q2',
    totalScore: 92, grade: 'S', selfScore: 90, leaderScore: 94, finalScore: 92,
    status: 'completed', comments: '本季度表现优秀，完成了多个重要项目',
    createdAt: '2025-07-01', completedAt: '2025-07-10',
    details: [
      { indicatorId: 1, indicatorName: '工作目标完成率', weight: 40, maxScore: 100, selfScore: 95, leaderScore: 95, finalScore: 95, comment: '超额完成工作目标' },
      { indicatorId: 2, indicatorName: '工作质量', weight: 20, maxScore: 100, selfScore: 88, leaderScore: 92, finalScore: 90, comment: '代码质量高' },
      { indicatorId: 3, indicatorName: '工作效率', weight: 15, maxScore: 100, selfScore: 85, leaderScore: 90, finalScore: 87, comment: '效率较高' },
      { indicatorId: 4, indicatorName: '工作态度', weight: 10, maxScore: 100, selfScore: 90, leaderScore: 95, finalScore: 93, comment: '态度积极' },
      { indicatorId: 5, indicatorName: '团队协作', weight: 5, maxScore: 100, selfScore: 88, leaderScore: 92, finalScore: 90, comment: '协作良好' },
      { indicatorId: 6, indicatorName: '学习成长', weight: 5, maxScore: 100, selfScore: 85, leaderScore: 88, finalScore: 87, comment: '持续学习' },
      { indicatorId: 7, indicatorName: '创新能力', weight: 5, maxScore: 100, selfScore: 88, leaderScore: 90, finalScore: 89, comment: '有创新思维' },
    ]
  },
  {
    id: 2, planId: 1, planName: '2025年Q2绩效考核', employeeId: 2, employeeName: '李娜',
    department: '产品部', position: '产品经理', period: '2025-Q2',
    totalScore: 85, grade: 'A', selfScore: 83, leaderScore: 87, finalScore: 85,
    status: 'completed', comments: '产品规划清晰，用户反馈良好',
    createdAt: '2025-07-01', completedAt: '2025-07-08',
    details: [
      { indicatorId: 1, indicatorName: '工作目标完成率', weight: 40, maxScore: 100, selfScore: 85, leaderScore: 88, finalScore: 87, comment: '完成目标' },
      { indicatorId: 2, indicatorName: '工作质量', weight: 20, maxScore: 100, selfScore: 82, leaderScore: 85, finalScore: 84, comment: '产品质量稳定' },
      { indicatorId: 3, indicatorName: '工作效率', weight: 15, maxScore: 100, selfScore: 80, leaderScore: 83, finalScore: 82, comment: '效率正常' },
      { indicatorId: 4, indicatorName: '工作态度', weight: 10, maxScore: 100, selfScore: 85, leaderScore: 90, finalScore: 88, comment: '认真负责' },
      { indicatorId: 5, indicatorName: '团队协作', weight: 5, maxScore: 100, selfScore: 88, leaderScore: 88, finalScore: 88, comment: '沟通顺畅' },
      { indicatorId: 6, indicatorName: '学习成长', weight: 5, maxScore: 100, selfScore: 80, leaderScore: 85, finalScore: 83, comment: '积极进取' },
      { indicatorId: 7, indicatorName: '创新能力', weight: 5, maxScore: 100, selfScore: 78, leaderScore: 82, finalScore: 80, comment: '有想法' },
    ]
  },
  {
    id: 3, planId: 1, planName: '2025年Q2绩效考核', employeeId: 3, employeeName: '王磊',
    department: '研发部', position: '技术总监', period: '2025-Q2',
    totalScore: 95, grade: 'S', selfScore: 93, leaderScore: 97, finalScore: 95,
    status: 'completed', comments: '技术引领，带领团队取得突破性进展',
    createdAt: '2025-07-01', completedAt: '2025-07-05',
    details: [
      { indicatorId: 1, indicatorName: '工作目标完成率', weight: 40, maxScore: 100, selfScore: 95, leaderScore: 98, finalScore: 97, comment: '超额完成目标' },
      { indicatorId: 2, indicatorName: '工作质量', weight: 20, maxScore: 100, selfScore: 92, leaderScore: 95, finalScore: 94, comment: '质量卓越' },
      { indicatorId: 3, indicatorName: '工作效率', weight: 15, maxScore: 100, selfScore: 90, leaderScore: 95, finalScore: 93, comment: '极高效率' },
      { indicatorId: 4, indicatorName: '工作态度', weight: 10, maxScore: 100, selfScore: 95, leaderScore: 98, finalScore: 97, comment: '以身作则' },
      { indicatorId: 5, indicatorName: '团队协作', weight: 5, maxScore: 100, selfScore: 95, leaderScore: 98, finalScore: 97, comment: '优秀领导力' },
      { indicatorId: 6, indicatorName: '学习成长', weight: 5, maxScore: 100, selfScore: 90, leaderScore: 95, finalScore: 93, comment: '持续引领技术' },
      { indicatorId: 7, indicatorName: '创新能力', weight: 5, maxScore: 100, selfScore: 92, leaderScore: 98, finalScore: 95, comment: '推动技术创新' },
    ]
  },
  {
    id: 4, planId: 1, planName: '2025年Q2绩效考核', employeeId: 4, employeeName: '赵敏',
    department: '市场部', position: '市场专员', period: '2025-Q2',
    totalScore: 72, grade: 'B', selfScore: 70, leaderScore: 74, finalScore: 72,
    status: 'completed', comments: '基础工作完成，需要加强主动性',
    createdAt: '2025-07-01', completedAt: '2025-07-12',
    details: [
      { indicatorId: 1, indicatorName: '工作目标完成率', weight: 40, maxScore: 100, selfScore: 72, leaderScore: 75, finalScore: 74, comment: '完成大部分目标' },
      { indicatorId: 2, indicatorName: '工作质量', weight: 20, maxScore: 100, selfScore: 68, leaderScore: 72, finalScore: 70, comment: '质量有待提升' },
      { indicatorId: 3, indicatorName: '工作效率', weight: 15, maxScore: 100, selfScore: 70, leaderScore: 73, finalScore: 72, comment: '效率一般' },
      { indicatorId: 4, indicatorName: '工作态度', weight: 10, maxScore: 100, selfScore: 75, leaderScore: 78, finalScore: 77, comment: '态度正面' },
      { indicatorId: 5, indicatorName: '团队协作', weight: 5, maxScore: 100, selfScore: 72, leaderScore: 75, finalScore: 74, comment: '合作正常' },
      { indicatorId: 6, indicatorName: '学习成长', weight: 5, maxScore: 100, selfScore: 68, leaderScore: 70, finalScore: 69, comment: '需加强学习' },
      { indicatorId: 7, indicatorName: '创新能力', weight: 5, maxScore: 100, selfScore: 65, leaderScore: 68, finalScore: 67, comment: '需要提升' },
    ]
  },
  {
    id: 5, planId: 2, planName: '2025年Q3绩效考核', employeeId: 1, employeeName: '张伟',
    department: '研发部', position: '高级工程师', period: '2025-Q3',
    totalScore: 0, grade: 'B', selfScore: 0, leaderScore: 0, finalScore: 0,
    status: 'self_evaluating', comments: '',
    createdAt: '2025-10-01',
    details: [
      { indicatorId: 1, indicatorName: '工作目标完成率', weight: 40, maxScore: 100, selfScore: 0, leaderScore: 0, finalScore: 0, comment: '' },
      { indicatorId: 2, indicatorName: '工作质量', weight: 20, maxScore: 100, selfScore: 0, leaderScore: 0, finalScore: 0, comment: '' },
      { indicatorId: 3, indicatorName: '工作效率', weight: 15, maxScore: 100, selfScore: 0, leaderScore: 0, finalScore: 0, comment: '' },
      { indicatorId: 4, indicatorName: '工作态度', weight: 10, maxScore: 100, selfScore: 0, leaderScore: 0, finalScore: 0, comment: '' },
      { indicatorId: 5, indicatorName: '团队协作', weight: 5, maxScore: 100, selfScore: 0, leaderScore: 0, finalScore: 0, comment: '' },
      { indicatorId: 6, indicatorName: '学习成长', weight: 5, maxScore: 100, selfScore: 0, leaderScore: 0, finalScore: 0, comment: '' },
      { indicatorId: 7, indicatorName: '创新能力', weight: 5, maxScore: 100, selfScore: 0, leaderScore: 0, finalScore: 0, comment: '' },
    ]
  },
  {
    id: 6, planId: 2, planName: '2025年Q3绩效考核', employeeId: 5, employeeName: '刘洋',
    department: '人力资源部', position: 'HR经理', period: '2025-Q3',
    totalScore: 0, grade: 'B', selfScore: 88, leaderScore: 0, finalScore: 0,
    status: 'leader_evaluating', comments: '',
    createdAt: '2025-10-01',
    details: [
      { indicatorId: 1, indicatorName: '工作目标完成率', weight: 40, maxScore: 100, selfScore: 90, leaderScore: 0, finalScore: 0, comment: '' },
      { indicatorId: 2, indicatorName: '工作质量', weight: 20, maxScore: 100, selfScore: 85, leaderScore: 0, finalScore: 0, comment: '' },
      { indicatorId: 3, indicatorName: '工作效率', weight: 15, maxScore: 100, selfScore: 88, leaderScore: 0, finalScore: 0, comment: '' },
      { indicatorId: 4, indicatorName: '工作态度', weight: 10, maxScore: 100, selfScore: 90, leaderScore: 0, finalScore: 0, comment: '' },
      { indicatorId: 5, indicatorName: '团队协作', weight: 5, maxScore: 100, selfScore: 88, leaderScore: 0, finalScore: 0, comment: '' },
      { indicatorId: 6, indicatorName: '学习成长', weight: 5, maxScore: 100, selfScore: 85, leaderScore: 0, finalScore: 0, comment: '' },
      { indicatorId: 7, indicatorName: '创新能力', weight: 5, maxScore: 100, selfScore: 82, leaderScore: 0, finalScore: 0, comment: '' },
    ]
  },
]

export const mockIncentivePlans: IncentivePlan[] = [
  {
    id: 1, name: '2025年Q2季度奖金方案', year: 2025, type: '季度奖金',
    status: 'completed', totalBudget: 500000,
    description: '基于Q2绩效考核结果发放季度奖金',
    createdAt: '2025-07-01',
    gradeRules: [
      { grade: 'S', multiplier: 3.0, description: 'S级：月薪3倍' },
      { grade: 'A', multiplier: 2.0, description: 'A级：月薪2倍' },
      { grade: 'B', multiplier: 1.0, description: 'B级：月薪1倍' },
      { grade: 'C', multiplier: 0.5, description: 'C级：月薪0.5倍' },
      { grade: 'D', multiplier: 0.0, description: 'D级：无奖金' },
    ]
  },
  {
    id: 2, name: '2025年Q3季度奖金方案', year: 2025, type: '季度奖金',
    status: 'active', totalBudget: 520000,
    description: '基于Q3绩效考核结果发放季度奖金',
    createdAt: '2025-10-01',
    gradeRules: [
      { grade: 'S', multiplier: 3.0, description: 'S级：月薪3倍' },
      { grade: 'A', multiplier: 2.0, description: 'A级：月薪2倍' },
      { grade: 'B', multiplier: 1.0, description: 'B级：月薪1倍' },
      { grade: 'C', multiplier: 0.5, description: 'C级：月薪0.5倍' },
      { grade: 'D', multiplier: 0.0, description: 'D级：无奖金' },
    ]
  },
]

export const mockIncentiveRecords: IncentiveRecord[] = [
  {
    id: 1, planId: 1, planName: '2025年Q2季度奖金方案', assessmentId: 3,
    employeeId: 3, employeeName: '王磊', employeeNo: 'EMP003',
    department: '研发部', position: '技术总监', period: '2025-Q2',
    grade: 'S', baseAmount: 35000, multiplier: 3.0, incentiveAmount: 105000,
    status: 'paid', approver: '总经理', approvedAt: '2025-07-15', paidAt: '2025-07-20',
    remark: '优秀表现，予以奖励', createdAt: '2025-07-12'
  },
  {
    id: 2, planId: 1, planName: '2025年Q2季度奖金方案', assessmentId: 1,
    employeeId: 1, employeeName: '张伟', employeeNo: 'EMP001',
    department: '研发部', position: '高级工程师', period: '2025-Q2',
    grade: 'S', baseAmount: 25000, multiplier: 3.0, incentiveAmount: 75000,
    status: 'paid', approver: '总经理', approvedAt: '2025-07-15', paidAt: '2025-07-20',
    remark: '', createdAt: '2025-07-12'
  },
  {
    id: 3, planId: 1, planName: '2025年Q2季度奖金方案', assessmentId: 2,
    employeeId: 2, employeeName: '李娜', employeeNo: 'EMP002',
    department: '产品部', position: '产品经理', period: '2025-Q2',
    grade: 'A', baseAmount: 22000, multiplier: 2.0, incentiveAmount: 44000,
    status: 'paid', approver: '总经理', approvedAt: '2025-07-15', paidAt: '2025-07-20',
    remark: '', createdAt: '2025-07-12'
  },
  {
    id: 4, planId: 1, planName: '2025年Q2季度奖金方案', assessmentId: 4,
    employeeId: 4, employeeName: '赵敏', employeeNo: 'EMP004',
    department: '市场部', position: '市场专员', period: '2025-Q2',
    grade: 'B', baseAmount: 12000, multiplier: 1.0, incentiveAmount: 12000,
    status: 'paid', approver: '总经理', approvedAt: '2025-07-15', paidAt: '2025-07-20',
    remark: '', createdAt: '2025-07-12'
  },
  {
    id: 5, planId: 2, planName: '2025年Q3季度奖金方案', assessmentId: 6,
    employeeId: 5, employeeName: '刘洋', employeeNo: 'EMP005',
    department: '人力资源部', position: 'HR经理', period: '2025-Q3',
    grade: 'A', baseAmount: 20000, multiplier: 2.0, incentiveAmount: 40000,
    status: 'approved', approver: '总经理', approvedAt: '2025-10-18',
    remark: '', createdAt: '2025-10-15'
  },
  {
    id: 6, planId: 2, planName: '2025年Q3季度奖金方案', assessmentId: 5,
    employeeId: 1, employeeName: '张伟', employeeNo: 'EMP001',
    department: '研发部', position: '高级工程师', period: '2025-Q3',
    grade: 'B', baseAmount: 25000, multiplier: 1.0, incentiveAmount: 25000,
    status: 'pending', remark: '', createdAt: '2025-10-15'
  },
]

export const mockDashboardStats: DashboardStats = {
  totalEmployees: 12,
  activeAssessments: 2,
  pendingIncentives: 2,
  totalIncentiveAmount: 236000,
  gradeDistribution: [
    { grade: 'S', count: 2, percentage: 20 },
    { grade: 'A', count: 3, percentage: 30 },
    { grade: 'B', count: 4, percentage: 40 },
    { grade: 'C', count: 1, percentage: 10 },
    { grade: 'D', count: 0, percentage: 0 },
  ],
  departmentStats: [
    { department: '研发部', avgScore: 86, employeeCount: 4, incentiveAmount: 180000 },
    { department: '产品部', avgScore: 82, employeeCount: 2, incentiveAmount: 44000 },
    { department: '市场部', avgScore: 78, employeeCount: 3, incentiveAmount: 12000 },
    { department: '人力资源部', avgScore: 84, employeeCount: 1, incentiveAmount: 0 },
    { department: '财务部', avgScore: 80, employeeCount: 2, incentiveAmount: 0 },
  ],
  monthlyTrend: [
    { month: '2025-01', assessmentCount: 10, avgScore: 82, incentiveAmount: 180000 },
    { month: '2025-02', assessmentCount: 0, avgScore: 0, incentiveAmount: 0 },
    { month: '2025-03', assessmentCount: 0, avgScore: 0, incentiveAmount: 0 },
    { month: '2025-04', assessmentCount: 11, avgScore: 84, incentiveAmount: 210000 },
    { month: '2025-05', assessmentCount: 0, avgScore: 0, incentiveAmount: 0 },
    { month: '2025-06', assessmentCount: 0, avgScore: 0, incentiveAmount: 0 },
    { month: '2025-07', assessmentCount: 11, avgScore: 85, incentiveAmount: 236000 },
    { month: '2025-08', assessmentCount: 0, avgScore: 0, incentiveAmount: 0 },
    { month: '2025-09', assessmentCount: 0, avgScore: 0, incentiveAmount: 0 },
    { month: '2025-10', assessmentCount: 6, avgScore: 86, incentiveAmount: 65000 },
    { month: '2025-11', assessmentCount: 0, avgScore: 0, incentiveAmount: 0 },
    { month: '2025-12', assessmentCount: 0, avgScore: 0, incentiveAmount: 0 },
  ]
}
