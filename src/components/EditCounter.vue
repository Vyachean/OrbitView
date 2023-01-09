<template>
  <QForm
    class="EditCounter"
    @submit="$emit('inc', value)"
  >
    <QInput
      v-model.number="value"
      type="number"
      label="value"
    >
      <template #after>
        <QBtn
          type="submit"
          flat
          icon="send"
          fab
          @click="$emit('inc', value)"
        />
      </template>
    </QInput>
  </QForm>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  emits: ['inc'],
  setup() {
    const value = ref(0);

    return {
      value,
    };
  },
});
</script>

<style scoped lang="scss">
.EditCounter {

}
</style>
