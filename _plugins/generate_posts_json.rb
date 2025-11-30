# _plugins/generate_posts_json.rb
require 'json'
require 'fileutils'

module Jekyll
  class PostsJsonGenerator < Generator
    safe true
    priority :low

    def generate(site)
      # ensure the destination directory exists
      FileUtils.mkdir_p(site.dest)  # create destination directory if it doesn't exist

      # collect posts with required fields
      posts = site.posts.docs.map do |post|
        {
          "title"   => post.data['title'],
          "url"     => post.url,
          "date"    => post.date.strftime('%Y-%m-%d'),
          "excerpt" => post.excerpt.to_s.strip  # ensure the excerpt is properly stripped of extra spaces
        }
      end

      # convert ruby hash to json formatted string
      posts_json = JSON.pretty_generate(posts)

      # write json output to posts.json in the _site directory
      output_path = File.join(site.dest, 'posts.json')  # output the file to _site directory
      File.open(output_path, 'w') { |f| f.write(posts_json) }
    end
  end
end