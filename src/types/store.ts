import { IdentityInstance } from 'src/types/identity';
import { OrbitDBAddressInstance } from 'src/types/orbit-db';

export interface StoreEvents {
  off(name: string, callback: () => void): void
  on(name: string, callback: () => void): void

  /**
   * Emitted when the database has synced with another peer. This is usually a good place to re-query the database for updated results, eg. if a value of a key was changed or if there are new events in an event log.
   * @param name
   * @param callback
   */
  on(name: 'replicated', callback: (address: unknown) => void): void

  /**
   * Emitted before replicating a part of the database with a peer.
   * @param name
   * @param callback
   */
  on(name: 'replicate', callback: (address: unknown) => void): void

  /**
   * Emitted while replicating a database. address is id of the database that emitted the event. hash is the multihash of the entry that was just loaded. entry is the database operation entry. progress is the current progress. have is a map of database pieces we have.
   * @param name
   * @param callback
   */
  on(name: 'replicate.progress', callback: (address: unknown, hash: unknown, entry: unknown,
                                            progress: unknown, have:unknown) => void): void

  /**
   * Emitted before loading the database.
   * @param name
   * @param callback
   */
  on(name: 'load', callback: (dbname: string) => void): void

  /**
   * Emitted while loading the local database, once for each entry. dbname is the name of the database that emitted the event. hash is the multihash of the entry that was just loaded. entry is the database operation entry. progress is a sequential number starting from 0 upon calling load().
   * @param name
   * @param callback
   */
  on(name: 'load.progress', callback: (address: unknown, hash: unknown, entry: unknown,
                                       progress: unknown, total: unknown) => void): void

  /**
   * Emitted after fully loading the local database.
   * @param name
   * @param callback
   */
  on(name: 'ready', callback: (dbname: string, heads: unknown) => void): void

  /**
   * Emitted after an entry was added locally to the database. hash is the IPFS hash of the latest state of the database. entry is the added database op.
   * @param name
   * @param callback
   */
  on(name: 'write', callback: (address: unknown, entry: unknown, heads: unknown) => void): void

  /**
   * Emitted when a new peer connects via ipfs pubsub. peer is a string containing the id of the new peer
   * @param name
   * @param callback
   */
  on(name: 'peer', callback: (peer: unknown) => void): void

  /**
   * Emitted once the database has finished closing.
   * @param name
   * @param callback
   */
  on(name: 'closed', callback: (dbname: string) => void): void

  /**
   * Emitted after heads have been exchanged with a peer for a specific database. This will be emitted after every exchange, even if no heads are received from the peer, or if all received heads are already present. (This is in contrast with the replicated event, which will only fire when new heads have been received.) Note that heads here contains heads received as part of the exchange, not heads sent.
   * @param name
   * @param callback
   */
  on(name: 'peer.exchanged', callback: (peer: unknown, address: unknown,
                                        heads: unknown) => void): void
}

/**
 * Every database (store) has the following methods available in addition to their specific methods.
 */
export interface StoreInstance {
  /**
   * Load the locally persisted database state to memory
   * @param amount - Use the optional amount argument to limit the number of entries loaded into memory, starting from the head(s) (Default: -1 will load all entries)
   * @param opt
   */
  load(amount?:number, opt?: { fetchEntryTimeout: number }): Promise<void>
  /**
   * Close the database. Returns a Promise that resolves once complete
   */
  close(): Promise<void>
  /**
   * Remove the database locally. This does not delete any data from peers.
   */
  drop(): Promise<void>

  /**
   * Returns an instance of Identity. The identity is used to sign the database entries. See the GUIDE for more information on how OrbitDB uses identity.
   */
  readonly identity: IdentityInstance

  readonly type: string

  /**
   * Each database in orbit-db contains an events (EventEmitter) object that emits events that describe what's happening in the database. Events can be listened to with:
   */
  readonly events: StoreEvents

  readonly id: string

  readonly address: OrbitDBAddressInstance

  readonly dbname: string
}

export const isStoreInstance = (v:any): v is StoreInstance => v
  && typeof v === 'object'
  && 'load' in v && typeof v.load === 'function'
  && 'close' in v && typeof v.close === 'function'
  && 'drop' in v && typeof v.drop === 'function'
  && 'identity' in v && typeof v.identity === 'object'
  && 'type' in v && typeof v.type === 'string'
  && 'events' in v && typeof v.events === 'object'
  && 'id' in v && typeof v.id === 'string'
  && 'address' in v && typeof v.address === 'object'
  && 'dbname' in v && typeof v.dbname === 'string';
