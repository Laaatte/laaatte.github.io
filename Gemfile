# rubygems source
source "https://rubygems.org"

# jekyll
gem "jekyll", "~> 4.4", ">= 4.4.1"

# jekyll plugins
group :jekyll_plugins do
  gem "jekyll-sass-converter", "~> 3.1"  # keep if you're using sass for styling
  gem "sass-embedded", "~> 1.94"  # keep if you're using sass for styling
end

# windows-only timezone libraries
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 2.0"
  gem "tzinfo-data", "~> 1.2024"
end

# windows directory watcher performance booster
gem "wdm", "~> 0.2", platforms: [:mingw, :x64_mingw, :mswin]

# ruby 3.x http server compatibility
gem "webrick", "~> 1.9"