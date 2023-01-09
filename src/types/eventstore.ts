import { isStoreInstance, StoreInstance } from 'src/types/store';
import { IteratorFunction } from 'src/types/iterator';

export interface EventStoreInstance extends StoreInstance {
  readonly type: 'eventlog'

  /**
   * Returns a Promise that resolves to the multihash of the entry as a String.
   * @param event
   */
  add(event: object):Promise<string>

  /**
   * Returns an Object with the contents of the entry.
   * @param hash
   */
  get(hash: string):object
  iterator: IteratorFunction
}

export const isEventStoreInstance = (v:any):v is EventStoreInstance => isStoreInstance(v)
  && v.type === 'eventlog';
