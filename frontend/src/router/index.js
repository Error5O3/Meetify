import { createRouter, createWebHistory } from 'vue-router';
import EventForm from '@/components/EventForm.vue';

import EventDetails from '@/components/EventDetails.vue'; 

const routes = [
  {
    path: '/',
    name: 'CreateEvent',
    component: EventForm,

    meta: { title: 'Meetify' } 
  },
  {

    path: '/event/:id',
    name: 'EventDetails',
    component: EventDetails, 
    meta: { title: 'Meetify' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Meetify';
  next();
});

export default router;