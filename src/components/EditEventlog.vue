<template>
  <QForm class="EditEventlog">
    <JsonInput
      v-model="event"
      label="add event"
    >
      <template #after>
        <QBtn
          icon="send"
          flat
          fab
          @click="add"
        />
      </template>
    </JsonInput>
  </QForm>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { JsonInput } from 'components/JsonInput.js';

export default defineComponent({
  components: { JsonInput },
  emits: ['add'],
  setup(props, { emit }) {
    const event = ref<object>({});

    const add = () => {
      emit('add', event.value);
    };

    return { event, add };
  },
});
</script>
