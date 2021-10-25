/// <reference lib="webworker" />
// https://github.com/jakearchibald/idb#using-npm
import { openDB, DBSchema } from "idb";
import { graphql } from "graphql";

// https://stackoverflow.com/questions/63116331/how-to-migrate-service-worker-from-js-to-ts
/* eslint-disable no-redeclare */
declare var self: ServiceWorkerGlobalScope;

export {};

// Register event listener for the 'push' event.
self.addEventListener("push", function (event) {
  event.waitUntil(
    self.registration.showNotification("ServiceWorker", {
      body: "notification",
    })
  );
});

// https://serviceworke.rs/message-relay_index_doc.html
self.addEventListener("message", function (event) {
  event.waitUntil(
    self.registration.showNotification("ServiceWorker", {
      body: event.data,
    })
  );
});

// https://github.com/jakearchibald/idb#typescript
interface MyDB extends DBSchema {
  "my-store": {
    key: string;
    value: number;
  };
  products: {
    value: {
      name: string;
      price: number;
      productCode: string;
    };
    key: string;
    indexes: { "by-price": number };
  };
}

async function createDB() {
  const name = "my-db";
  const version = undefined;
  const storeName = "my-store";
  console.log(["createDB"]);

  // https://github.com/jakearchibald/idb#opendb
  const db = await openDB<MyDB>(name, version, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // …
      console.log(["upgrade"], { oldVersion, newVersion, transaction });

      db.createObjectStore(storeName);

      const productStore = db.createObjectStore("products", {
        keyPath: "productCode",
      });
      productStore.createIndex("by-price", "price");
    },
    blocked() {
      // …
    },
    blocking() {
      // …
    },
    terminated() {
      // …
    },
  });

  const key = "key";

  // https://github.com/jakearchibald/idb#general-enhancements
  // const store = db.transaction(storeName).objectStore(storeName);
  // const value = await store.get(key);

  // https://github.com/jakearchibald/idb#shortcuts-to-getset-from-an-object-store
  // Get a value from a store:
  const value = await db.get(storeName, key);
  // Set a value in a store:
  await db.put(storeName, parseInt(value || 0) + 1, key);
}

self.addEventListener("activate", function (event) {
  console.log(["activate"], { event });
  event.waitUntil(createDB());
});

const CACHE_NAME = "cache-v1";
const OFFLINE_URL = "offline.html";

// async function cacheAssets() {
//   // return caches.open(CACHE_NAME).then((cache) => console.log({ cache }) || cache.add(new Request(OFFLINE_URL, { cache: "reload" })));
//   try {
//     const cache = await caches.open(CACHE_NAME);
//     console.log(["cacheAssets"], { cache });
//     await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
//     await cache.add(new Request("assets/manifest.json", { cache: "reload" }));
//     await cache.add(new Request("assets/favicon.ico", { cache: "reload" }));
//   } catch (error) {
//     console.error({ error });
//     if (error.name === "QuotaExceededError") {
//       // Fallback code goes here
//     }
//   }
// }

const CONTENTS = [OFFLINE_URL, "assets/manifest.json", "assets/favicon.ico"];

self.addEventListener("install", function (event) {
  console.log(["install"], { event });
  // event.waitUntil(cacheAssets());
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CONTENTS))
  );
  self.skipWaiting();
});

self.addEventListener("fetch", function (event) {
  console.log(["fetch"], { event });

  // https://github.com/stutrek/apollo-server-service-worker/blob/master/src/serviceWorkerApollo.ts
  const url = new URL(event.request.url);

  if (url.pathname == "/graphql") {
    event.respondWith(
      event.request.json().then(
        (data) =>
          new Promise((resolve) => {
            const { query, variables } = data;

            console.log({ query, variables });

            // https://github.com/graphql/graphql-js#using-graphqljs
            graphql(require("./schema").default, query, {}, {}, variables)
              .then((result) => {
                const response = new Response(JSON.stringify(result));
                response.headers.set(
                  "Content-Type",
                  "application/json; charset=utf-8"
                );
                resolve(response);
              })
              .catch(console.error);
          })
      )
    );
    return;
  }

  // event.respondWith(
  //   (async () => {
  //     try {
  //       const networkResponse = await fetch(event.request);
  //       return networkResponse;
  //     } catch (error) {
  //       const cache = await caches.open(CACHE_NAME);
  //       const cachedResponse = await cache.match(OFFLINE_URL);
  //       return cachedResponse;
  //     }
  //   })()
  // );

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.open(CACHE_NAME).then((cache) => cache.match(event.request))
    )
  );

  // event.respondWith(
  //   caches
  //     .match(event.request)
  //     .then(
  //       (response) =>
  //         console.log(["match"], { response }) ||
  //         response ||
  //         fetch(event.request)
  //     )
  // );
});
