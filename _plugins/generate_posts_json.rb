# generate posts.json automatically during jekyll build
# this plugin collects all posts and exports a json file for javascript pagination

require 'json'

module Jekyll
  class GeneratePostsJson < Generator
    safe true    # safe mode compatibility
    priority :low

    def generate(site)
      posts_data = site.posts.docs.map do |post|
        {
          "title" => post.data["title"] || "",
          "url" => post.url,
          "date" => post.date.strftime("%Y-%m-%d"),
          "categories" => post.data["categories"] || [],
          "excerpt" => extract_excerpt(post),
        }
      end

      json_output = JSON.pretty_generate(posts_data)

      output_path = File.join(site.dest, "posts.json")

      File.open(output_path, "w") do |file|
        file.write(json_output)
      end
    end

    private

    # extract a clean excerpt for previews
    def extract_excerpt(post)
      if post.data["excerpt"]
        return post.data["excerpt"].to_s.strip
      end

      raw = post.content.to_s
      cleaned = raw.gsub(/<\/?[^>]*>/, "") # remove html tags
      cleaned[0..160]  # first 160 chars as fallback excerpt
    end
  end
end