# generate_posts_json.rb
# -----------------------
# generate posts.json into site.dest before gh-pages copies files

require "json"
require "fileutils"

module Jekyll
  class PostsJsonGenerator < Generator
    safe true
    priority :high

    def generate(site)
      posts = site.posts.docs.map do |post|
        {
          "title"   => post.data["title"],
          "url"     => post.url,
          "date"    => post.date.strftime("%Y-%m-%d"),
          "excerpt" => extract_excerpt(post, site)
        }
      end

      json_output = JSON.pretty_generate(posts)

      # always output to site.dest root
      output_path = File.join(site.dest, "posts.json")

      FileUtils.mkdir_p(site.dest)
      File.write(output_path, json_output)

      puts "posts.json generated → #{output_path}"
    end

    private

    def extract_excerpt(post, site)
      if post.data["excerpt"]
        post.data["excerpt"].to_s
      elsif post.excerpt
        Jekyll::Renderer.new(site, post, site.site_payload).run(post.excerpt.to_liquid)
      else
        ""
      end
    end
  end
end