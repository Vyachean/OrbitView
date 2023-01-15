import { isStoreInstance, StoreInstance } from 'src/types/store';

export interface CounterStoreInstance extends StoreInstance {
  readonly type: 'counter'

  /**
   * Returns a Number.
   */
  readonly value: number

  /**
   * Returns a Promise that resolves to the multihash of the entry as a String.
   * @param value
   */
  inc(value?:number): Promise<string>
}

export const isCounterStoreInstance = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  v:any,
): v is CounterStoreInstance => isStoreInstance(v)
  && v.type === 'counter';
