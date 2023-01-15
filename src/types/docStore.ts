import { isStoreInstance, StoreInstance } from 'src/types/store';

type Mapper = (doc:object) => boolean

export interface DocStoreInstance extends StoreInstance {
  readonly type: 'docstore'

  /**
   * Returns a Promise that resolves to the multihash of the entry as a String.
   * @param doc
   */
  put(doc:object): Promise<string>

  /**
   * Returns an Array of all Objects that match the given key in their _id field or the field specified by indexBy. If no document with that key exists, this returns an empty array.
   * @param key
   */
  get(key:string): object[]

  /**
   * Returns an Array of Objects based on the mapper.
   * @param mapper
   */
  query(mapper: Mapper): object[]

  /**
   * Returns a Promise that resolves to the multihash of the entry as a String.
   */
  del(key: string): Promise<string>
}

export const isDocStoreInstance = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  v:any,
):v is DocStoreInstance => isStoreInstance(v)
  && v.type === 'docstore';
