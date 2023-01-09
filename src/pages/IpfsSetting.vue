<template>
  <QPage padding>
    <QCard>
      <QCardSection>
        <QForm />
      </QCardSection>
      <QCardActions>
        <QBtn
          label="create"
          @click="create"
        />
      </QCardActions>
    </QCard>
  </QPage>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useInstance } from 'stores/instance';

export default defineComponent({
  setup() {
    const instance = useInstance();

    const create = async () => {
      await instance.instance();
    };

    return {
      create,
    };
  },
});
</script>
