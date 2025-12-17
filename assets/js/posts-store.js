// assets/js/posts-store.js
(() => {
  // cached promise to ensure posts.json is fetched only once
  let postsPromise = null;

  // load posts.json and return a shared promise
  // this file is responsible only for data loading, not processing
  window.loadPosts = postsUrl => {
    // reuse existing promise to avoid duplicate network requests
    if (!postsPromise) {
      postsPromise = fetch(postsUrl)
        .then(res => {
          // fail fast if response is not ok
          if (!res.ok) {
            throw new Error(`failed to load posts.json (${res.status})`);
          }
          return res.json();
        });
    }

    // always return the same promise
    return postsPromise;
  };
})();