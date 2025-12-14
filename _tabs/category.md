---
title: Category
page_type: tab
order: 1
---
<ul class="category">

  {% assign sorted_category = site.category | sort: "title" %}

  {% for cat_page in sorted_category %}
    {% if cat_page.page_type contains "category" %}
      {% assign cat_posts = site.categories[cat_page.title] %}
      {% assign cat_count = cat_posts | size | default: 0 %}
      <li class="category__link">
        <a href="{{ cat_page.url | relative_url }}">
          {{ cat_page.title }} - {{ cat_count }}
        </a>
      </li>
    {% endif %}
  {% endfor %}

</ul>