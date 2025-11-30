# generate posts.json automatically during jekyll build
# this plugin collects all posts and exports a json file for javascript pagination

require 'json'

module Jekyll
  class GeneratePostsJson < Generator
    safe true
    priority :low

    def generate(site)
      posts_data = site.posts.docs.map do |post|
        {
          "title" => post.data["title"] || "",
          "url" => post.url,
          "date" => post.date.strftime("%Y-%m-%d"),
          "categories" => post.data["categories"] || [],
          "excerpt" => extract_excerpt(post)
        }
      end

      output = JSON.pretty_generate(posts_data)
      File.write(File.join(site.dest, "posts.json"), output)
    end

    private

    # generate a clean excerpt without markdown parsing
    def extract_excerpt(post)
      raw = post.content.to_s
      cleaned = raw.gsub(/<\/?[^>]*>/, "") # remove html tags
      cleaned[0..160]  # first 160 chars fallback
    end
  end
end