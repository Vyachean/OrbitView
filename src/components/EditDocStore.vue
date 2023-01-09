<template>
  <QForm
    class="EditEventlog column gap-md"
    @submit.prevent
  >
    <JsonInput
      v-model="doc"
      label="add doc"
    >
      <template #after>
        <QBtn
          icon="send"
          flat
          fab
          @click="put"
        />
      </template>
    </JsonInput>
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
import JsonInput from 'components/JsonInput';

export default defineComponent({
  components: { JsonInput },
  emits: ['put', 'del'],
  setup(props, { emit }) {
    const doc = ref<object>();

    const key = ref();

    const put = () => {
      emit('put', doc.value);
      doc.value = undefined;
    };
    const del = () => {
      emit('del', key.value);
      key.value = undefined;
    };

    return {
      doc,
      put,
      del,
      key,
    };
  },
});
</script>
