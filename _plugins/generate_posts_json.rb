# _plugins/generate_posts_json.rb
require 'json'

module Jekyll
  class GeneratePostsJson < Generator
    safe true

    # this method generates posts.json file without front matter
    def generate(site)
      # get all posts
      posts = site.posts.docs.map do |post|
        {
          "title" => post.data["title"],          # post title
          "url" => post.url,                      # post URL
          "date" => post.date.strftime('%Y-%m-%d'), # post date
          "category" => post.data["categories"]    # post category
        }
      end

      # create posts.json in _site folder
      File.open(File.join(site.dest, "posts.json"), "w") do |f|
        f.write(JSON.pretty_generate(posts))   # save posts as JSON
      end
    end
  end
end