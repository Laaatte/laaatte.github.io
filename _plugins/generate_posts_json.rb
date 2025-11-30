# generate_posts_json.rb
# simple jekyll plugin to generate posts.json after build

require 'json'
require 'fileutils'

module Jekyll
  class GeneratePostsJson < Generator
    priority :low   # run AFTER site is built
    safe true

    def generate(site)
      posts = site.posts.docs.map do |p|
        {
          "title" => p.data["title"],
          "url"   => p.url,
          "date"  => p.date.strftime("%Y-%m-%d"),
          "excerpt" => extract_excerpt(p)
        }
      end

      json_path = File.join(site.dest, "posts.json")

      # ensure destination directory exists
      FileUtils.mkdir_p(site.dest)

      File.open(json_path, "w") do |f|
        f.write(JSON.pretty_generate(posts))
      end

      Jekyll.logger.info "posts.json:", "generated at #{json_path}"
    end

    private

    def extract_excerpt(post)
      if post.data["excerpt"]
        post.data["excerpt"]
      elsif post.respond_to?(:excerpt) && post.excerpt
        post.excerpt.to_s.gsub(/<[^>]*>/, "")[0..150]
      else
        ""
      end
    end
  end
end