# Ruby gem configuration
# Ruby
source "https://rubygems.org"

# Jekyll
gem "jekyll", '~> 4.4', '>= 4.4.1'

# Jekyll plugins
group :jekyll_plugins do
  gem "jekyll-paginate", "~> 1.1.0"
end

# Library
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 2.0", ">= 2.0.6"
  gem "tzinfo-data", "~> 1.2024", ">= 1.2024.2"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.2.0", :platforms => [:mingw, :x64_mingw, :mswin]

# Gem added after ruby 3.0
gem "webrick", "~> 1.9"