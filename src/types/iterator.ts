export type IteratorOptions = {
  /**
   * Greater than, takes an item's hash
   */
  gt?: string
  /**
   * Greater than or equal to, takes an item's hash
   */
  gte?: string
  /**
   * Less than, takes an item's hash
   */
  lt?: string
  /**
   * Less than or equal to, takes an item's hash value.
   */
  lte?: string
  /**
   * Limiting the entries of result, defaults to 1, and -1 means all items (no limit).
   */
  limit?: number
  /**
   * If set to true will result in reversing the result.
   */
  reverse?: boolean
}

export type IteratorFunction = (options?:IteratorOptions) => { collect():object[] }
