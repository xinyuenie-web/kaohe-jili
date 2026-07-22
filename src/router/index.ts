import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
          meta: { title: '工作台', icon: 'Odometer' }
        },
        {
          path: 'employee',
          name: 'Employee',
          component: () => import('@/views/employee/EmployeeView.vue'),
          meta: { title: '员工管理', icon: 'User' }
        },
        {
          path: 'assessment',
          name: 'Assessment',
          meta: { title: '绩效考核', icon: 'DataAnalysis' },
          children: [
            {
              path: 'indicators',
              name: 'Indicators',
              component: () => import('@/views/assessment/IndicatorsView.vue'),
              meta: { title: '考核指标', icon: 'List' }
            },
            {
              path: 'plans',
              name: 'AssessmentPlans',
              component: () => import('@/views/assessment/PlansView.vue'),
              meta: { title: '考核方案', icon: 'Document' }
            },
            {
              path: 'records',
              name: 'AssessmentRecords',
              component: () => import('@/views/assessment/RecordsView.vue'),
              meta: { title: '考核记录', icon: 'Memo' }
            },
            {
              path: 'records/:id',
              name: 'AssessmentDetail',
              component: () => import('@/views/assessment/RecordDetailView.vue'),
              meta: { title: '考核详情', hidden: true }
            }
          ]
        },
        {
          path: 'incentive',
          name: 'Incentive',
          meta: { title: '激励发放', icon: 'Money' },
          children: [
            {
              path: 'plans',
              name: 'IncentivePlans',
              component: () => import('@/views/incentive/IncentivePlansView.vue'),
              meta: { title: '激励方案', icon: 'Document' }
            },
            {
              path: 'records',
              name: 'IncentiveRecords',
              component: () => import('@/views/incentive/IncentiveRecordsView.vue'),
              meta: { title: '发放记录', icon: 'Ticket' }
            }
          ]
        }
      ]
    }
  ]
})

export default router
