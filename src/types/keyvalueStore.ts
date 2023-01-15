import { isStoreInstance, StoreInstance } from 'src/types/store';

export interface KeyvalueStoreInstance extends StoreInstance {
  readonly type: 'keyvalue'

  /**
   * Returns a Promise that resolves to a String that is the multihash of the entry.
   * @param key
   * @param value
   */
  put(key: string, value: object): Promise<string>

  /**
   * Alias for .put()
   * @param key
   * @param value
   */
  set(key: string, value: object): Promise<string>

  /**
   * Returns an Object with the contents of the entry.
   * @param key
   */
  get(key: string): object

  /**
   * Deletes the Object associated with key. Returns a Promise that resolves to a String that is the multihash of the deleted entry.
   * @param key
   */
  del(key: string): string

  /**
   * Returns an Object with the contents of all entries in the index.
   */
  all: object
}

export const isKeyvalueStoreInstance = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  v: any,
): v is KeyvalueStoreInstance => isStoreInstance(v) && v.type === 'keyvalue';
