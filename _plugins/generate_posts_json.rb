# _plugins/generate_posts_json.rb

require 'json'
require 'fileutils'

module Jekyll
  class PostsJsonGenerator < Generator
    safe true
    priority :low

    def generate(site)
      # ensure the destination directory exists
      FileUtils.mkdir_p(site.dest)

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

      # write json output to posts.json in _site directory
      output_path = File.join(site.dest, 'posts.json')
      File.open(output_path, 'w') { |f| f.write(posts_json) }
    end
  end
end