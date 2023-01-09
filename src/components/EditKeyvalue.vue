<template>
  <QForm
    class="EditKeyvalue column gap-md"
    @submit.prevent
  >
    <div class="row gap-sm items-center">
      <QInput
        v-model="key"
        label="key"
      />
      <JsonInput
        v-model="value"
        label="value"
        class="col-grow"
      />
      <QBtn
        icon="send"
        label="put"
        @click="put"
      />
    </div>
    <QInput
      v-model="key"
      label="del key"
      @keydown.enter="del"
    >
      <template #after>
        <QBtn
          icon="delete"
          fab
          flat
          @click="del"
        >
          <QTooltip>
            remove
          </QTooltip>
        </QBtn>
      </template>
    </QInput>
  </QForm>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { JsonInput } from 'components/JsonInput';

export default defineComponent({
  components: { JsonInput },
  emits: ['put', 'del'],
  setup(props, { emit }) {
    const value = ref<object>();

    const key = ref();

    const put = () => {
      emit('put', key.value, value.value);
      value.value = undefined;
      key.value = undefined;
    };
    const del = () => {
      emit('del', key.value);
      key.value = undefined;
    };

    return {
      value,
      put,
      del,
      key,
    };
  },
});
</script>
