---
title: LatteGacha
order: 2
---
{% include latte-gacha.html %}
<script id="latte-data" type="application/json">{{ site.data.latte-gacha-list | jsonify }}</script>
<script src="{{ '/assets/js/latte-gacha.js' | relative_url }}" defer></script>