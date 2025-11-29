---
title: Category
page_type: tab
order: 2
---
<ul class="category-card">

  {% for category in site.category %}
    {% if category.page_type contains "category" %}
      <li class="category-link">
        <a href="{{ category.url | relative_url }}">
          {{ category.title }} - {{ site.categories[category.title].size }}
        </a>
      </li>
    {% endif %}
  {% endfor %}

</ul>