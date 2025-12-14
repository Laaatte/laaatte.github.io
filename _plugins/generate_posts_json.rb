# generate_posts_json.rb
# this plugin generates posts.json after jekyll finishes writing the site
# used for client-side pagination without jekyll pagination plugins
require "json"

Jekyll::Hooks.register :site, :post_write do |site|
  posts = site.posts.docs.map do |post|
    {
      "title" => post.data["title"],
      "date"  => post.date.strftime("%Y-%m-%d"),
      "url"   => post.url
    }
  end

  output_path = File.join(site.dest, "posts.json")

  File.write(output_path, JSON.pretty_generate(posts))

  puts "posts.json generated → #{output_path}"
end