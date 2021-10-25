import React, { StrictMode } from "react";
import { render } from "react-dom";
import App from "./containers/App";

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.body.appendChild(document.createElement("div"))
);

if ("serviceWorker" in navigator) {
  // let deferredPrompt;
  // window.addEventListener("beforeinstallprompt", (event) => {
  //   console.log(["beforeinstallprompt"], event);
  //   // event.preventDefault();
  //   deferredPrompt = event;
  //   // deferredPrompt.prompt();
  //   // const { outcome } = await deferredPrompt.userChoice;
  //   // ...
  //   deferredPrompt = null;
  //   // if (outcome === "dismissed") {
  //   // ...
  //   // }
  //   console.log({ deferredPrompt });
  // });
  // window.addEventListener("appinstalled", (event) => {
  //   console.log(["appinstalled"], event);
  //   deferredPrompt = null;
  // });
  // window.addEventListener("online", (event) => {
  //   console.log(["online"], event);
  // });
  // window.addEventListener("offline", (event) => {
  //   console.log(["offline"], event);
  // });
  window.addEventListener("load", (event) => {
    console.log(["load"], event);
    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// const { connection, serviceWorker } = navigator;

// console.log({ connection, serviceWorker });

// let displayMode = "browser";
// if (window.matchMedia("(display-mode: standalone)").matches) {
//   displayMode = "standalone";
// }
// console.log({ displayMode });

// (async () => {
//   if (navigator.storage && navigator.storage.estimate) {
//     const quota = await navigator.storage.estimate();
//     // quota.usage -> Number of bytes used.
//     // quota.quota -> Maximum number of bytes available.
//     const percentageUsed = (quota.usage / quota.quota) * 100;
//     console.log(`You've used ${percentageUsed}% of the available storage.`);
//     const remaining = quota.quota - quota.usage;
//     console.log(`You can write up to ${remaining} more bytes.`);
//   }
// })();

// // Notification.requestPermission().then();
// console.log(["Notification"], { permission: Notification.permission });
