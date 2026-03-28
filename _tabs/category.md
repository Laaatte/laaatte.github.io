---
title: Category
page_type: tab
order: 1
---
<ul class="category js-dependent">
  {% assign sorted_category = site.category | sort: "title" %}
  {% assign cat_misc = "Misc" %}
  {% for cat_page in sorted_category %}
    {% if cat_page.page_type contains "category" and cat_page.title != cat_misc %}
      <li class="category__link">
        <a href="{{ cat_page.url | relative_url }}" data-category="{{ cat_page.title }}">{{ cat_page.title }}</a>
      </li>
    {% endif %}
  {% endfor %}

  {% for cat_page in sorted_category %}
    {% if cat_page.page_type contains "category" and cat_page.title == cat_misc %}
      <li class="category__link">
        <a href="{{ cat_page.url | relative_url }}" data-category="{{ cat_page.title }}">{{ cat_page.title }}</a>
      </li>
    {% endif %}
  {% endfor %}
</ul>

<!-- inject post counts into category links using posts.json -->
<script src="{{ '/assets/js/category/count.js' | relative_url }}" defer></script>