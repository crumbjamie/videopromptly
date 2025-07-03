#!/bin/bash

cd /Users/jamie/Documents/GitHub/img-prompter/public/thumbnails

# Rename files with spaces to use hyphens
for file in *.png *.jpg *.webp; do
  if [[ "$file" == *" "* ]]; then
    new_name="${file// /-}"
    echo "Renaming: $file → $new_name"
    mv "$file" "$new_name"
  fi
done

echo "Done renaming files!"