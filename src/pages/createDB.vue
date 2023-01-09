<template>
  <QPage padding>
    <QCard>
      <QForm @submit="create">
        <QCardSection>
          <h4 class="q-ma-none">
            Create DB
          </h4>
          <QInput
            v-model="name"
            label="name"
            :rules="[rules.required]"
          />
          <QSelect
            v-model="type"
            label="type"
            :options="databaseTypes"
            :rules="[rules.required]"
          />
        </QCardSection>
        <QCardSection>
          <h5 class="q-ma-none">
            Options
          </h5>
          <div class="row gap-md q-mt-sm">
            <QToggle
              label="allow everyone to write"
              :model-value="everyoneIsAllowedToWrite"
              @update:model-value="onAccessControllerAll"
            />
            <QToggle
              label="allow me to write"
              :model-value="imAllowedToWrite"
              @update:model-value="onAllowMeToWrite"
            />
            <QToggle
              v-model="options.overwrite"
              label="Overwrite an existing database (Default: false)"
            />
          </div>
          <QField
            v-model="modelMeta"
            type="textarea"
            label="meta"
            hint="An optional object in database manifest.
             Immutably stores any JSON-serializable value.
              Readable via db.options.meta. Default: undefined."
            class="q-mt-sm"
          >
            <template #control="{ id, floatingLabel, modelValue, emitValue }">
              <JsonEditorVue
                v-if="floatingLabel"
                :id="id"
                :model-value="modelValue"
                :mode="'text'"
                :main-menu-bar="false"
                @update:model-value="emitValue"
              />
            </template>
          </QField>
        </QCardSection>
        <QCardActions>
          <QBtn
            label="create"
            type="submit"
            :loading="!!loading"
          />
        </QCardActions>
      </QForm>
    </QCard>
  </QPage>
</template>

<script lang="ts">
import {
  computed, defineComponent, reactive, ref,
} from 'vue';
import { useInstance } from 'stores/instance';
import { DBCreateOptions, DBType } from 'src/types/orbit-db';
import { useQuasar } from 'quasar';
import { required } from 'src/rules';
import JsonEditorVue from 'json-editor-vue';
import { useDBStorage } from 'stores/DBStorage';
import { RouterNames } from 'src/router/routes';

export default defineComponent({
  components: { JsonEditorVue },
  setup() {
    const q = useQuasar();

    const instance = useInstance();
    const databaseTypes = computed(() => instance.databaseTypes);
    const identity = computed(() => instance.identity);

    const loading = ref(0);

    const name = ref<string>();
    const type = ref<DBType>();
    const options = reactive<DBCreateOptions>({
      overwrite: false,
    });

    const DBStorage = useDBStorage();

    const create = async () => {
      loading.value += 1;
      try {
        const orbitdb = await instance.getOrbitDB();

        if (!type.value) {
          throw new Error('Не указан тип базы');
        }
        if (!name.value) {
          throw new Error('Не указано название базы');
        }
        const base = await orbitdb.create(name.value, type.value, options);
        DBStorage.set(base.address, base.dbname);

        q.notify({
          type: 'positive',
          message: 'База создана',
          caption: base.address.toString(),
          actions: [{
            icon: 'open_in_new',
            to: {
              name: RouterNames.openDB,
              query: {
                address: base.address.toString(),
              },
            },
            color: 'white',
          }],
        });
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
        loading.value -= 1;
      }
    };

    const onAccessControllerAll = (v:boolean) => {
      if (v) {
        options.accessController = {
          write: ['*'],
        };
      } else {
        const index = options.accessController?.write?.indexOf('*');
        if (index !== undefined && index >= 0) {
          options.accessController?.write?.splice(index, 1);
        }
      }
    };
    const onAllowMeToWrite = (v:boolean) => {
      const id = identity.value?.id;
      if (!id) {
        return;
      }
      if (v) {
        if (id) {
          options.accessController = {
            write: [...((options.accessController || {}).write || []), id],
          };
        }
      } else {
        const index = options.accessController?.write?.indexOf(id);
        if (index !== undefined && index >= 0) {
          options.accessController?.write?.splice(index, 1);
        }
      }
    };

    const imAllowedToWrite = computed(() => !!(identity.value
      && options.accessController?.write?.includes(identity.value.id)));

    const everyoneIsAllowedToWrite = computed(() => options.accessController?.write?.includes('*'));

    return {
      create,
      databaseTypes,
      name,
      type,
      loading,
      options,
      rules: {
        required,
      },
      modelMeta: computed({
        get() {
          return JSON.stringify(options.meta);
        },
        set(v:string) {
          try {
            options.meta = JSON.parse(v);
          } catch {
            options.meta = undefined;
          }
        },
      }),
      onAccessControllerAll,
      everyoneIsAllowedToWrite,
      imAllowedToWrite,
      onAllowMeToWrite,
    };
  },
});
</script>
