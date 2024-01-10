import { createRouter, createWebHistory } from 'vue-router';
import { current } from '@/data';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { path: `/${current.getFullYear()}` },
    },
    {
      path: '/:year(\\d{4})',
      name: 'year',
      component: () => import('@/views/CalendarView.vue')
    },
    {
      path: '/:year(\\d{4})/:month(0[1-9]|1[0|1|2])',
      name: 'month',
      component: () => import('@/views/MonthView.vue')
    },
    {
      path: '/:year(\\d{4})/:month(0[1-9]|1[0|1|2])/:day(\\d{1,2})',
      name: 'day',
      component: () => import('@/views/DayView.vue'),
      beforeEnter(to, from) {
        let dateNumber = Date.parse(to.fullPath);
        if (isNaN(dateNumber) || Number(to.params.month) !== new Date(dateNumber).getMonth() + 1) return from.fullPath;
      }
    },
  ]
})

export default router;
