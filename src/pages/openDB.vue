<template>
  <QPage padding>
    <QCard>
      <QCardSection>
        <h2 class="q-ma-none">
          {{ db?.dbname }}
        </h2>
        <QInput
          label="address"
          readonly
          :model-value="address"
        />
        <QSelect
          label="type"
          readonly
          :model-value="db?.type"
        />
      </QCardSection>
      <QCardSection v-if="db">
        <EditCounter
          v-if="dbInc"
          @inc="dbInc"
        />
        <EditEventlog
          v-else-if="db.type==='eventlog'"
          @add="add"
        />
        <EditFeed
          v-else-if="db.type==='feed'"
          @add="add"
          @remove="remove"
        />
        <EditDocStore
          v-else-if="db.type==='docstore'"
          @put="put"
          @del="del"
        />
        <EditKeyvalue
          v-else-if="db.type==='keyvalue'"
          @put="put"
          @del="del"
        />
      </QCardSection>
      <QCardSection>
        <QTabs
          v-model="tab"
          align="left"
        >
          <QTab
            label="Value"
            name="dataBaseValue"
            icon="inventory_2"
          />
          <QTab
            label="Events"
            name="events"
            icon="event_note"
          >
            <QBadge
              floating
            >
              {{ eventLog.length }}
            </QBadge>
          </QTab>
        </QTabs>
        <QTabPanels
          v-model="tab"
          animated
        >
          <QTabPanel name="dataBaseValue">
            <JsonEditorVue
              :model-value="dataBaseValue"
              read-only
              mode="tree"
              :status-bar="false"
            />
          </QTabPanel>
          <QTabPanel name="events">
            <QList>
              <EventItem
                v-for="(event, i) in eventLog"
                :key="i"
                :event="event"
              />
            </QList>
          </QTabPanel>
        </QTabPanels>
      </QCardSection>
    </QCard>
  </QPage>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, ref, watch,
} from 'vue';
import { useInstance } from 'stores/instance';
import { useQuasar } from 'quasar';
import JsonEditorVue from 'json-editor-vue';
import { useDBStorage } from 'stores/DBStorage';
import EditCounter from 'components/EditCounter.vue';
import { isCounterStoreInstance } from 'src/types/counterStore';
import { cloneDeep } from 'lodash-es';
import EventItem, { PropEventItem } from 'components/EventItem.vue';
import EditEventlog from 'components/EditEventlog.vue';
import { isEventStoreInstance } from 'src/types/eventstore';
import { isFeedStoreInstance } from 'src/types/feedStore';
import EditFeed from 'components/EditFeed.vue';
import { isDocStoreInstance } from 'src/types/docStore';
import EditDocStore from 'components/EditDocStore.vue';
import { isKeyvalueStoreInstance } from 'src/types/keyvalueStore';
import { DatabaseInstance } from 'src/types/orbit-db';
import EditKeyvalue from 'components/EditKeyvalue.vue';

export default defineComponent({
  components: {
    EditKeyvalue,
    EditDocStore,
    EditFeed,
    EditEventlog,
    EventItem,
    EditCounter,
    JsonEditorVue,
  },
  props: {
    address: String,
  },
  setup(props) {
    const q = useQuasar();
    const instance = useInstance();

    const db = ref<DatabaseInstance>();
    const DBStorage = useDBStorage();

    const fetch = async () => {
      q.loadingBar.start();
      try {
        if (!props.address) {
          throw new Error('Не указан адрес БД');
        }
        const orbitdb = await instance.getOrbitDB();

        const opened = await orbitdb.open(props.address, { timeout: 600e3 });

        db.value = opened;
        if (db.value) {
          DBStorage.set(opened.address, opened.dbname);
        }
        await opened.load();
      } catch (e) {
        if (e instanceof Error) {
          q.notify({
            type: 'negative',
            message: e.message,
            progress: true,
          });
        }
        throw e;
      } finally {
        q.loadingBar.stop();
      }
    };

    watch(() => props.address, fetch);

    fetch();

    const dataBaseValue = ref();

    const eventLog = ref<PropEventItem[]>([]);

    const eventNames:string[] = [
      'replicated',
      'replicate',
      'replicate.progress',
      'load',
      'load.progress',
      'ready',
      'write',
      'peer',
      'closed',
      'peer.exchanged',
    ];

    const pushEvents = eventNames.reduce((prev, name) => ({
      ...prev,
      [name]: (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...payload:any[]
      ) => {
        // eslint-disable-next-line no-console
        console.log('event', name, payload);
        eventLog.value.unshift({ name, payload });
      },
    }), <Record<string, ()=>void>>{});

    watch(db, (v, old) => {
      if (v) {
        eventNames.forEach((name) => {
          v.events.on(name, pushEvents[name]);
        });
      }
      if (old && v !== old) {
        eventNames.forEach((name) => {
          old.events.off(name, pushEvents[name]);
        });
      }
    }, { immediate: true });

    watch(
      () => eventLog.value.length,
      () => {
        if (isCounterStoreInstance(db.value)) {
          dataBaseValue.value = cloneDeep(db.value.value);
        } else if (isEventStoreInstance(db.value) || isFeedStoreInstance(db.value)) {
          const list = db.value.iterator({ limit: -1 }).collect();
          dataBaseValue.value = cloneDeep(list);
        } else if (isDocStoreInstance(db.value)) {
          dataBaseValue.value = db.value.query(() => true);
        } else if (isKeyvalueStoreInstance(db.value)) {
          dataBaseValue.value = cloneDeep(db.value.all);
        }
      },
      { immediate: true },
    );

    const dbInc = computed(() => {
      const counter = db.value;
      if (isCounterStoreInstance(counter)) {
        return async (v:number) => {
          q.loadingBar.start();
          try {
            await counter.inc(v);
          } finally {
            q.loadingBar.stop();
          }
        };
      }

      return undefined;
    });

    return {
      db,
      dataBaseValue,
      dbInc,
      eventLog,
      tab: ref('dataBaseValue'),
      add: async (event: object) => {
        q.loadingBar.start();
        try {
          if (db.value && 'add' in db.value) {
            await db.value.add(event);
          }
        } catch (e) {
          if (e instanceof Error) {
            q.notify({
              type: 'negative',
              message: e.message,
            });
          }
          throw e;
        } finally {
          q.loadingBar.stop();
        }
      },
      remove: async (hash: string) => {
        q.loadingBar.start();
        try {
          if (db.value && 'remove' in db.value) {
            await db.value.remove(hash);
          }
        } catch (e) {
          if (e instanceof Error) {
            q.notify({
              type: 'negative',
              message: e.message,
            });
          }
          throw e;
        } finally {
          q.loadingBar.stop();
        }
      },
      put: async (keyOrDoc: string|object, value?:object) => {
        q.loadingBar.start();
        try {
          if (isDocStoreInstance(db.value) && typeof keyOrDoc === 'object') {
            await db.value.put(keyOrDoc);
          } else if (isKeyvalueStoreInstance(db.value) && typeof keyOrDoc === 'string' && value) {
            await db.value.put(keyOrDoc, value);
          }
        } catch (e) {
          if (e instanceof Error) {
            q.notify({
              type: 'negative',
              message: e.message,
            });
          }
          throw e;
        } finally {
          q.loadingBar.stop();
        }
      },
      del: async (key: string) => {
        q.loadingBar.start();
        try {
          if (isDocStoreInstance(db.value) || isKeyvalueStoreInstance(db.value)) {
            await db.value.del(key);
          }
        } catch (e) {
          if (e instanceof Error) {
            q.notify({
              type: 'negative',
              message: e.message,
            });
          }
          throw e;
        } finally {
          q.loadingBar.stop();
        }
      },
    };
  },
});
</script>
