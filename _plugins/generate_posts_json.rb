# generate_posts_json.rb
# generate posts.json at build time for client-side pagination and search
# avoids jekyll pagination plugins and prevents stale post list issues

require "json"
require "fileutils"

Jekyll::Hooks.register :site, :post_write do |site|
  posts = site.posts.docs.map do |post|
    {
      "url"   => post.url,
      "category" => post.data["category"].to_s.strip.empty? ? "Uncategorized" : post.data["category"],
      "title" => post.data["title"],
      "desc"  => post.data["desc"] || "",
      "date"  => post.date.strftime("%Y-%m-%d")
    }
  end

  output_dir = File.join(site.dest, "assets", "data")
  FileUtils.mkdir_p(output_dir)

  output_path = File.join(output_dir, "posts.json")
  File.write(output_path, JSON.pretty_generate(posts))

  puts "posts.json generated -> #{output_path}"
end