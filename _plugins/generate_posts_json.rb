# generate_posts_json.rb
# -----------------------
# custom jekyll plugin to generate posts.json
# always writes posts.json into site root (_site/posts.json)

require "json"
require "fileutils"

module Jekyll
  class PostsJsonGenerator < Generator
    safe true
    priority :lowest

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

      # force output directory: always _site/posts.json
      output_dir  = File.join(site.source, "_site")
      output_path = File.join(output_dir, "posts.json")

      # ensure directory exists
      FileUtils.mkdir_p(output_dir)

      # write json file
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