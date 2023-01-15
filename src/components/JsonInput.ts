import { QField, QFieldProps, QFieldSlots } from 'quasar';
import {
  FunctionalComponent, h,
} from 'vue';
import JsonEditorVue from 'json-editor-vue';

export const JsonInput:FunctionalComponent<QFieldProps> = (props:QFieldProps, ctx) => h(
  QField,
  props,
  {
    control: (
      ...[{
        floatingLabel, emitValue, modelValue, id, editable,
      }]: Parameters<QFieldSlots['control']>
    ) => floatingLabel && h(
      [JsonEditorVue],
      {
        id,
        modelValue,
        mode: 'text',
        mainMenuBar: false,
        readOnly: !editable,
        'onUpdate:modelValue': (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          v:any,
        ) => {
          if (typeof v === 'string') {
            emitValue(JSON.parse(v));
          } else {
            emitValue(v);
          }
        },
      },
    ),
    ...ctx.slots,
  },
);

export default JsonInput;
