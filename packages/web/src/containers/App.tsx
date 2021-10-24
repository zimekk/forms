import React, { Suspense, lazy, useEffect, useState } from "react";
import { GraphQLClient, ClientContext } from "graphql-hooks";
import { hot } from "react-hot-loader/root";
import history from "history/browser";
import styles from "./App.module.scss";

const Spinner = () => <span>Loading...</span>;

const PAGES = {
  forms: lazy(() => import("./Forms")),
};

const getPage = (location: { hash: string }) => {
  const [, hash = Object.keys(PAGES)[0]] =
    decodeURI(location.hash).match(/^#(.+)/) || [];
  return hash;
};

const client = new GraphQLClient({
  url: "/graphql",
});

function App() {
  const [page, setPage] = useState(getPage(history.location));

  useEffect(() =>
    // location is an object like window.location
    history.listen(({ location }) => setPage(getPage(location)))
  );

  const Page = PAGES[page] || null;

  return (
    <ClientContext.Provider value={client}>
      <section className={styles.App}>
        <h1 className={styles.Nav}>
          Forms
          {Object.keys(PAGES).map((page) => (
            <a key={page} href={`#${page}`}>
              {page}
            </a>
          ))}
          [{page}]
        </h1>
        <Suspense fallback={<Spinner />}>
          <Page />
        </Suspense>
      </section>
    </ClientContext.Provider>
  );
}

export default hot(App);
