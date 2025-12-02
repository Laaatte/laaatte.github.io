---
title: Category
page_type: tab
order: 2
---
<ul class="category">

  {% for cat_page in site.category %}
    {% if cat_page.page_type contains "category" %}
      <li class="category__link">
        <a href="{{ cat_page.url | relative_url }}">
          {{ cat_page.title }} - {{ site.categories[cat_page.title].size }}
        </a>
      </li>
    {% endif %}
  {% endfor %}

</ul>