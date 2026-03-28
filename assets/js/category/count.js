// assets/js/category/count.js
document.addEventListener("DOMContentLoaded", async () => {
  // find category links on this page only
  const links = document.querySelectorAll(".category__link a[data-category]");

  // resolve posts.json url from script data attribute
  const postsUrl = document.querySelector("script[data-posts-url]")?.dataset.postsUrl;

  if (!links.length || !postsUrl || typeof window.loadPosts !== "function") {
    console.error("posts-store is not available");
    return;
  }

  // load posts.json via shared store
  let posts;
  try {
    posts = await window.loadPosts(postsUrl);
  } catch (error) {
    console.error("failed to load posts.json", error);
    return;
  }

  // build category count map
  const categoryCount = posts.reduce((map, post) => {
    const cat = post.category || "Misc";
    map[cat] = (map[cat] || 0) + 1;
    return map;
  }, {});

  // inject counts into category links
  links.forEach(link => {
    const cat = link.dataset.category?.trim() || "Misc";
    const count = categoryCount[cat] || 0;
    link.textContent = `${cat} - ${count}`;
  });

  // reveal js-dependent content after rendering
  document.querySelector(".category.js-dependent")?.style.setProperty("visibility", "visible");
});