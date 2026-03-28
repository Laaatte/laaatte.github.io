# generate_posts_json.rb
# generate posts.json at build time for client-side pagination and search
# validates category field with relaxed input and strict matching

require "json"
require "fileutils"

Jekyll::Hooks.register :site, :post_write do |site|
  # allow letters, numbers, spaces, underscore, hyphen
  allowed_category = /\A[a-zA-Z0-9 _-]+\z/

  # build category lookup map
  # key: normalized category (downcase + strip)
  # value: original category title
  category_map =
    site.collections["category"].docs
        .map { |c| c.data["title"].to_s.strip }
        .reject(&:empty?)
        .each_with_object({}) do |title, map|
          map[title.downcase] = title
        end

  posts = site.posts.docs.map do |post|
    raw_category = post.data["category"]

    normalized =
      raw_category
        .to_s
        .strip
        .downcase

    category =
      if raw_category.nil?
        "Misc"
      elsif normalized.empty?
        "Misc"
      elsif normalized.include?(",")
        "Misc"
      elsif !allowed_category.match?(normalized)
        "Misc"
      elsif !category_map.key?(normalized)
        "Misc"
      else
        category_map[normalized]
      end

    {
      "url"      => post.url,
      "category" => category,
      "title"    => post.data["title"],
      "desc"     => post.data["desc"] || "",
      "date"     => post.date.strftime("%Y-%m-%d")
    }
  end

  output_dir = File.join(site.dest, "assets", "data")
  FileUtils.mkdir_p(output_dir)

  output_path = File.join(output_dir, "posts.json")
  File.write(output_path, JSON.pretty_generate(posts))

  puts "posts.json generated -> #{output_path}"
end