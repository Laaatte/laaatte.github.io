# generate posts.json automatically during jekyll build
# this plugin collects all posts and exports a json file for javascript pagination

require 'json'
require 'fileutils'

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

      # ensure _site directory exists
      FileUtils.mkdir_p(site.dest)

      # write json file
      File.write(File.join(site.dest, "posts.json"), output)
    end

    private

    # simple excerpt generator (no markdown conversion)
    def extract_excerpt(post)
      raw = post.content.to_s
      cleaned = raw.gsub(/<\/?[^>]*>/, "") # remove html tags
      cleaned[0..160]  # return first 160 chars
    end
  end
end