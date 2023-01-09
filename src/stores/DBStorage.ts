import { defineStore } from 'pinia';
import {
  ref,
} from 'vue';
import { isEqual } from 'lodash-es';
import { OrbitDBAddress } from 'orbit-db';
import { OrbitDBAddressInstance } from 'src/types/orbit-db';
import { parse, stringify } from 'zipson';

/**
 * Name DB
 */
type Name = string

type ListDB = [OrbitDBAddressInstance, Name][]

export const useDBStorage = defineStore('DBStorage', () => {
  const list = ref<ListDB>([]);

  return {

    list,

    set: (address: OrbitDBAddressInstance, name: string) => {
      if (
        !list.value.find(([itemAddress]) => isEqual(address, itemAddress))
      ) {
        list.value.push([address, name]);
      }
    },
    clear: () => { list.value = []; },
    delete: (address: OrbitDBAddressInstance) => {
      const index = list.value.findIndex(([itemAddress]) => isEqual(address, itemAddress));
      if (index >= 0) {
        list.value.splice(index, 1);
      }
    },
  };
}, {
  persist: {
    paths: ['list'],
    serializer: {
      deserialize: (v) => {
        const obj = parse(v);
        if (obj?.list && obj.list instanceof Array) {
          obj.list = obj.list.reduce((prev:ListDB, item: any) => {
            if (item instanceof Array) {
              const objAddress = item[0];
              if (
                !!objAddress
                && typeof objAddress.root === 'string' && typeof objAddress.path === 'string'
              ) {
                prev.push([new OrbitDBAddress(objAddress.root, objAddress.path), item[1]]);
              }
            }
            return prev;
          }, []);
        }
        return obj;
      },
      serialize: stringify,
    },
  },
});
