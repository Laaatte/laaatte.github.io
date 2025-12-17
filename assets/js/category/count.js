// assets/js/category/count.js
document.addEventListener("DOMContentLoaded", async () => {
  // find category links on this page only
  const links = document.querySelectorAll(".category__link a[data-category]");
  if (!links.length) return;

  // resolve posts.json url from script data attribute
  const postsUrl =
    document.querySelector("script[data-posts-url]")?.dataset.postsUrl;

  if (!postsUrl || typeof window.loadPosts !== "function") {
    console.error("posts-store is not available");
    return;
  }

  let posts = [];

  // load posts.json via shared store
  try {
    posts = await window.loadPosts(postsUrl);
  } catch (e) {
    console.error("failed to load posts.json", e);
    return;
  }

  // build category count map
  const categoryCount = posts.reduce((map, post) => {
    const cat = post.category || "Uncategorized";
    map[cat] = (map[cat] || 0) + 1;
    return map;
  }, {});

  // inject counts into category links
  links.forEach(link => {
    const cat = (link.dataset.category || "").trim();

    // default to 0 when category does not exist in posts.json
    const count = categoryCount[cat] ?? 0;

    link.textContent = `${cat} - ${count}`;
  });

  // reveal js-dependent content after rendering
  document.querySelectorAll(".js-dependent").forEach(el => {
    el.style.visibility = "visible";
  });
});