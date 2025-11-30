# _plugins/generate_posts_json.rb
require 'json'
require 'fileutils'

module Jekyll
  class PostsJsonGenerator < Generator
    safe true
    priority :low

    def generate(site)
      # collect posts with required fields
      posts = site.posts.docs.map do |post|
        {
          "title"   => post.data['title'],
          "url"     => post.url,
          "date"    => post.date.strftime('%Y-%m-%d'),
          "excerpt" => post.excerpt.to_s.strip
        }
      end

      # convert ruby hash to json formatted string
      posts_json = JSON.pretty_generate(posts)

      # write json output to posts.json in the root directory
      output_path = File.join(site.source, 'posts.json')  # set path to root
      File.open(output_path, 'w') { |f| f.write(posts_json) }
    end
  end
end