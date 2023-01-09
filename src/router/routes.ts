import { RouteRecordRaw } from 'vue-router';

export enum RouterNames {
  ipfsSettings='ipfs-settings',
  createDB='create-db',
  listDB='list-db',
  openDB='open-db'
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: {
      name: RouterNames.ipfsSettings,
    },
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: RouterNames.ipfsSettings,
        name: RouterNames.ipfsSettings,
        component: () => import('pages/IpfsSetting.vue'),
      },
      {
        path: RouterNames.createDB,
        name: RouterNames.createDB,
        component: () => import('pages/createDB.vue'),
      },
      {
        path: RouterNames.listDB,
        name: RouterNames.listDB,
        component: () => import('pages/listDB.vue'),
      },
      {
        path: RouterNames.openDB,
        name: RouterNames.openDB,
        props: ({ query }) => ({ address: query.address }),
        component: () => import('pages/openDB.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
