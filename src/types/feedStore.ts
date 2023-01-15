import { isStoreInstance, StoreInstance } from 'src/types/store';
import { IteratorFunction } from 'src/types/iterator';

export interface FeedStoreInstance extends StoreInstance {
  readonly type: 'feed'

  /**
   * Returns a Promise that resolves to the multihash of the entry as a String.
   * @param data
   */
  add(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data:any
  ): Promise<string>

  /**
   * Returns an Object with the contents of the entry.
   * @param hash
   */
  get(hash:string): unknown

  /**
   * Returns a Promise that resolves to the multihash of the entry as a String.
   * @param hash
   */
  remove(hash:string): Promise<string>

  iterator: IteratorFunction
}

export const isFeedStoreInstance = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  v:any,
): v is FeedStoreInstance => isStoreInstance(v)
  && v.type === 'feed';
