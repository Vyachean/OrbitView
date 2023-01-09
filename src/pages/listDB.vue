<template>
  <QPage padding>
    <QList>
      <QItem>
        <QItemSection>
          <QForm @submit="onOpen">
            <QInput
              v-model="openAddress"
              label="Address"
              :rules="[required]"
              hint="address to open DB"
            >
              <template #after>
                <QBtn
                  icon="open_in_new"
                  flat
                  fab
                  type="submit"
                  @click="onOpen"
                >
                  <QTooltip>
                    Open database
                  </QTooltip>
                </QBtn>
              </template>
            </QInput>
          </QForm>
        </QItemSection>
      </QItem>
      <QSeparator spaced />
      <template
        v-for="([address, name], i) in list"
        :key="i"
      >
        <QItem>
          <QItemSection>
            <QItemLabel>{{ name }}</QItemLabel>
            <QItemLabel caption>
              {{ address }}
            </QItemLabel>
          </QItemSection>
          <QItemSection
            side
          >
            <div class="text-grey-8 q-gutter-xs">
              <QBtn
                flat
                round
                icon="open_in_new"
                :to="{
                  name: RouterNames.openDB,
                  query:{
                    address: address
                  }
                }"
              />
            </div>
          </QItemSection>
        </QItem>
        <QSeparator spaced />
      </template>
    </QList>
  </QPage>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useDBStorage } from 'stores/DBStorage';
import { RouterNames } from 'src/router/routes';
import { useRouter } from 'vue-router';
import { required } from 'src/rules';

export default defineComponent({
  setup() {
    const DBStorage = useDBStorage();
    const list = computed(() => DBStorage.list);

    const openAddress = ref();

    const router = useRouter();
    const onOpen = () => {
      router.push({
        name: RouterNames.openDB,
        query: {
          address: openAddress.value,
        },
      });
    };

    return {
      list,
      openAddress,
      onOpen,
    };
  },
  computed: {
    RouterNames() {
      return RouterNames;
    },
  },
  methods: { required },
});
</script>
