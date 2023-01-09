declare module 'orbit-db' {
  import {
    OrbitDBAddressConstructor,
    InstanceOptions, OrbitDBInstance, DBType, OrbitDBAddressInstance,
  } from 'src/types/orbit-db';

  import { IPFS } from 'ipfs-core';
  import { ReadonlyDeep } from 'type-fest';

  /**
   * Returns a Promise that resolved to an instance of OrbitDB.
   */
  const createInstance:(ipfs: IPFS, options?: InstanceOptions) => OrbitDBInstance;

  /**
   * Returns supported database types (i.e. store types) as an Array of Strings
   */
  const databaseTypes: ReadonlyDeep<DBType[]>;

  /**
   * Returns true if the provided String is a supported database type
   */
  const isValidType: (type: string) => boolean;

  /**
   * Returns true if the provided String is a valid OrbitDB address
   */
  const isValidAddress: (address: string) => boolean;

  /**
   * Returns an instance of OrbitDBAddress if the provided String is a valid orbitdb address
   */
  const parseAddress: (address: string) => OrbitDBAddressInstance;

  const OrbitDBAddress: OrbitDBAddressConstructor;
}
