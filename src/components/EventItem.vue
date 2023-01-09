<template>
  <QItem
    clickable
    dense
    @click="open=!open"
  >
    <QItemSection>
      <QItemLabel>{{ event.name }}</QItemLabel>
    </QItemSection>
  </QItem>
  <QDialog
    v-model="open"
    full-width
  >
    <QCard>
      <QCardSection class="row items-center q-pb-none">
        <div class="text-h6">
          Event
        </div>
        <QSpace />
        <QBtn
          v-close-popup
          icon="close"
          flat
          round
          dense
        />
      </QCardSection>
      <QCardSection>
        <JsonEditorVue
          :model-value="event.payload"
          read-only
        />
      </QCardSection>
    </QCard>
  </QDialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import JsonEditorVue from 'json-editor-vue';

export interface PropEventItem {
  name: string
  payload: any
}

export default defineComponent({
  components: { JsonEditorVue },
  props: {
    value: Object as PropType<PropEventItem>,
  },
  setup() {
    const open = ref(false);
    return {
      open,
    };
  },
});
</script>
