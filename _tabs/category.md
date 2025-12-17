---
title: Category
page_type: tab
order: 1
---
<ul class="category">

  {%- comment -%}
  sort category pages by title
  {%- endcomment -%}
  {% assign sorted_category = site.category | sort: "title" %}

  {%- comment -%}
  total number of posts
  used to calculate uncategorized count
  {%- endcomment -%}
  {% assign total_posts = site.posts | size %}

  {%- comment -%}
  count posts that have at least one category
  note: site.categories only includes explicitly categorized posts
  {%- endcomment -%}
  {% assign categorized_count = 0 %}
  {% for cat in site.categories %}
    {% assign categorized_count = categorized_count | plus: cat[1].size %}
  {% endfor %}

  {%- comment -%}
  uncategorized posts are calculated as:
  total posts minus categorized posts
  {%- endcomment -%}
  {% assign uncategorized_count = total_posts | minus: categorized_count %}

  {% for cat_page in sorted_category %}
    {% if cat_page.page_type contains "category" %}

      {%- comment -%}
      normal category count
      {%- endcomment -%}
      {% assign cat_posts = site.categories[cat_page.title] %}
      {% assign cat_count = cat_posts | size | default: 0 %}

      <li class="category__link">
        <a href="{{ cat_page.url | relative_url }}">
          {% if cat_page.title == "Uncategorized" %}
            {{ cat_page.title }} - {{ uncategorized_count }}
          {% else %}
            {{ cat_page.title }} - {{ cat_count }}
          {% endif %}
        </a>
      </li>

    {% endif %}
  {% endfor %}

</ul>