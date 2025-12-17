# generate_posts_json.rb
# generate posts.json at build time for client-side pagination and search
# avoids jekyll pagination plugins and prevents stale post list issues

require "json"
require "fileutils"

Jekyll::Hooks.register :site, :post_write do |site|
  # collect current posts only (deleted posts are excluded automatically)
  posts = site.posts.docs.map do |post|
    {
      "title" => post.data["title"],
      "date"  => post.date.strftime("%Y-%m-%d"),
      "url"   => post.url
    }
  end

  # define output directory under assets for predictable caching
  output_dir = File.join(site.dest, "assets", "data")

  # ensure directory exists before writing file
  FileUtils.mkdir_p(output_dir)

  # final output path: _site/assets/data/posts.json
  output_path = File.join(output_dir, "posts.json")

  # write json file fresh on every build
  File.write(output_path, JSON.pretty_generate(posts))

  # log generated file path for build visibility
  puts "posts.json generated -> #{output_path}"
end