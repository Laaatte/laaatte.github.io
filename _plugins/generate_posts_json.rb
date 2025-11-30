# _plugins/generate_posts_json.rb

require 'json'

module Jekyll
  class PostsJsonGenerator < Generator
    safe true
    priority :low

    # method to generate the posts.json file
    def generate(site)
      # extract all posts and include only the necessary data
      posts = site.posts.docs.map do |post|
        {
          "title" => post.data['title'],        # post title
          "url" => post.url,                    # post url
          "date" => post.date.strftime('%Y-%m-%d'), # post date
          "excerpt" => post.excerpt.to_s.strip   # post excerpt, convert to string and strip
        }
      end

      # convert the posts data to json format
      posts_json = JSON.pretty_generate(posts)

      # write the generated json to _site/posts.json
      File.open(File.join(site.dest, 'posts.json'), 'w') do |f|
        f.write(posts_json)
      end
    end
  end
end