#!/usr/bin/env bash
set -euo pipefail

bundle exec jekyll build

# core pages must be rendered
[[ -f "_site/index.html" ]]
[[ -f "_site/info/lattegacha/index.html" ]]

# gacha script should be present on lattegacha page
grep -q 'assets/js/latte-gacha.js' _site/info/lattegacha/index.html

echo "Smoke test passed"
