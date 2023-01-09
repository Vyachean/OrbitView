<template>
  <QLayout view="hHh LpR lFf">
    <QHeader elevated>
      <QToolbar>
        <QBtn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <QToolbarTitle>
          OrbitView
        </QToolbarTitle>
      </QToolbar>
    </QHeader>

    <QDrawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <QList>
        <QItem
          v-for="(item, i) in linksList"
          :key="i"
          clickable
          :to="item.to"
        >
          <QItemSection
            v-if="item.icon"
            avatar
          >
            <QIcon :name="item.icon" />
          </QItemSection>

          <QItemSection>
            <QItemLabel>{{ item.title }}</QItemLabel>
            <QItemLabel caption>
              {{ item.caption }}
            </QItemLabel>
          </QItemSection>
        </QItem>
      </QList>
    </QDrawer>

    <QPageContainer>
      <RouterView />
    </QPageContainer>
  </QLayout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import { RouterNames } from 'src/router/routes';

const linksList:{
  title: string;
  caption?: string;
  icon?: string;
  to?: RouteLocationRaw
}[] = [
  {
    title: 'Активировать orbit-db',
    icon: 'settings',
    to: {
      name: RouterNames.ipfsSettings,
    },
  },
  {
    title: 'Создать базу',
    icon: 'create',
    to: {
      name: RouterNames.createDB,
    },
  },
  {
    title: 'Список баз',
    icon: 'list',
    to: {
      name: RouterNames.listDB,
    },
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
