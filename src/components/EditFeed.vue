<template>
  <QForm
    class="EditEventlog column gap-md"
    @submit.prevent
  >
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
    <QInput
      v-model="hash"
      label="remove hash"
      @keydown.enter="remove"
    >
      <template #after>
        <QBtn
          icon="delete"
          fab
          flat
          @click="remove"
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
import { JsonInput } from 'components/JsonInput.js';

export default defineComponent({
  components: { JsonInput },
  emits: ['add', 'remove'],
  setup(props, { emit }) {
    const event = ref<object>();

    const hash = ref();

    const add = () => {
      emit('add', event.value);
      event.value = undefined;
    };
    const remove = () => {
      emit('remove', hash.value);
      hash.value = undefined;
    };

    return {
      event,
      add,
      remove,
      hash,
    };
  },
});
</script>
