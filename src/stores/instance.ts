import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import OrbitDB from 'orbit-db';
import { OrbitDBInstance } from 'src/types/orbit-db';
import { once } from 'lodash-es';

export const useInstance = defineStore('instance', () => {
  const orbitdb = ref<OrbitDBInstance>();

  const instance = async () => {
    const ipfsNode = await (await import('ipfs-core')).create({
      start: true,
      preload: {
        enabled: false,
      },
      EXPERIMENTAL: {
        // pubsub: true,
        ipnsPubsub: true,
      },
      config: {
        Addresses: {
          Swarm: [
            // Use IPFS dev signal server
            // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
            // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
            // Use IPFS dev webrtc signal server
            '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
            '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
            '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
            // Use local signal server
            // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
          ],
        },
      },
    });
    const orbit = await OrbitDB.createInstance(ipfsNode);
    orbitdb.value = orbit;
    // eslint-disable-next-line no-console
    console.log({ ipfsNode, orbit });
  };

  const databaseTypes = computed(() => OrbitDB.databaseTypes);

  const identity = computed(() => orbitdb.value?.identity);

  const getOrbitDB = once(async (): Promise<OrbitDBInstance> => {
    if (orbitdb.value) {
      return orbitdb.value;
    }
    await instance();

    if (!orbitdb.value) {
      throw new Error('Не удалось создать экземпляр OrbitDB');
    }
    return orbitdb.value;
  });

  return {
    instance,
    databaseTypes,
    identity,
    getOrbitDB,
  };
});
