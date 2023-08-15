import { IdentityInstance } from 'src/types/identity';
import { EventStoreInstance } from 'src/types/eventstore';
import { CounterStoreInstance } from 'src/types/counterStore';
import { StoreInstance } from 'src/types/store';
import { KeyvalueStoreInstance } from 'src/types/keyvalueStore';
import { DocStoreInstance } from 'src/types/docStore';
import { FeedStoreInstance } from 'src/types/feedStore';

type DatabaseInstance = EventStoreInstance
  | KeyvalueStoreInstance
  | CounterStoreInstance
  | StoreInstance
  | DocStoreInstance
  | FeedStoreInstance

export type DBType = DatabaseInstance['type']

interface DBCreateOptions {
  /**
   * An object, as shown in the example below, containing the key write whose value is an array of hex encoded public keys which are used to set write access to the database. ["*"] can be passed in to give write access to everyone. See the GETTING STARTED guide for more info. (Default: uses the OrbitDB identity id orbitdb.identity.id, which would give write access only to yourself)
   */
  accessController?: {
    write?: (string|'*')[]
  }
  /**
   * Overwrite an existing database (Default: false)
   */
  overwrite?: boolean
  /**
   * Replicate the database with peers, requires IPFS PubSub. (Default: true)
   */
  replicate?: boolean
  /**
   * An optional object in database manifest. Immutably stores any JSON-serializable value. Readable via db.options.meta. Default: undefined.
   */
  meta?: object
}

interface DBOpenOptions {
  /**
   * If set to true, will throw an error if the database can't be found locally. (Default: false)
   */
  localOnly?: boolean
  /**
   * Whether or not to create the database if a valid OrbitDB address is not provided. (Default: false)
   */
  create?: boolean
  /**
   * A supported database type (i.e. eventlog or an added custom type). Required if create is set to true. Otherwise it's used to validate the manifest.
   */
  type?: DBType
  /**
   * Overwrite an existing database (Default: false)
   */
  overwrite?: boolean
  /**
   * Replicate the database with peers, requires IPFS PubSub. (Default: true)
   */
  replicate?: boolean

  /**
   * Не задокументированный таймаут загрузки базы
   */
  timeout?: number
}

export type Hash = string

export interface OrbitDBInstance {

  /**
   * Creates and opens an OrbitDB database.
   * @param name - should be the database name, not an OrbitDB address
   * @param type- is a supported database type
   * @param options - is an object with any of the following properties
   */
  create(name: string, type: DBType, options?:DBCreateOptions): Promise<DatabaseInstance>

  /**
   * Returns the orbit-db address for given parameters
   * Returns a Promise that resolves to an orbit-db address. The parameters correspond exactly with the parameters of orbit-db.create. This is useful for determining a database address ahead of time, or deriving another peer's address from their public key and the database name and type. No database is actually created.
   * @param name - should be the database name, not an OrbitDB address
   * @param type- is a supported database type
   * @param options - is an object with any of the following properties
   */
  determineAddress(
    name: string,
    type: DBType,
    options?: DBCreateOptions
  ): Promise<DatabaseInstance>

  /**
   * Opens an OrbitDB database.
   * @param address - should be a valid OrbitDB address
   * @param options
   */
  open(address: string, options?: DBOpenOptions): Promise<DatabaseInstance>

  /**
   * Close databases, connections, pubsub and reset orbitdb state.
   */
  disconnect(): Promise<void>

  /**
   * Creates and opens a keyvalue database
   * Returns a Promise that resolves to a KeyValueStore instance.
   * @param nameOrAddress
   * @param options
   */
  keyvalue(nameOrAddress: string, options?: DBOpenOptions): Promise<KeyvalueStoreInstance>

  /**
   * Alias for keyvalue()
   * @param nameOrAddress
   * @param options
   */
  kvstore(nameOrAddress: string, options?: DBOpenOptions): Promise<KeyvalueStoreInstance>

  /**
   * Creates and opens an eventlog database
   * @param nameOrAddress
   * @param options
   */
  log(nameOrAddress: string, options?: DBOpenOptions): Promise<EventStoreInstance>

  /**
   * Alias for log()
   * @param nameOrAddress
   * @param options
   */
  eventlog(nameOrAddress: string, options?: DBOpenOptions): Promise<EventStoreInstance>

  readonly identity: IdentityInstance

}

type KeystoreInstance = unknown

type CacheInstance = unknown

export interface InstanceOptions {
  /**
   * path to be used for the database files. By default it uses './orbitdb'.
   */
  directory?: string
  /**
   * By default it uses the base58 string of the ipfs peer id.
   */
  peerId?: string
  /**
   * By default creates an instance of Keystore. A custom keystore instance can be used, see this for an example.
   */
  keystore?: KeystoreInstance
  /**
   * By default creates an instance of Cache. A custom cache instance can also be used.
   */
  cache?: CacheInstance
  /**
   * By default it creates an instance of Identity
   */
  identity?: IdentityInstance
  /**
   * Start the OrbitDB instance in offline mode. Databases are not be replicated when the instance is started in offline mode. If the OrbitDB instance was started offline mode and you want to start replicating databases, the OrbitDB instance needs to be re-created. Default: false.
   */
  offline?: boolean
}

export interface OrbitDBAddressInstance {
  root: string
  path: string

  /**
   * Строковое представление адреса
   */
  toString(): string
}

export interface OrbitDBAddressConstructor {
  new (root:string, path:string): OrbitDBAddressInstance

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isValid(address:any): boolean

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parse(address:any):any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  join(...paths:any[]): string
}
